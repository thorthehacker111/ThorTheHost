from datetime import datetime
from typing import Any, List

from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    Query,
    Response,
    status,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.database.session import get_db
from app.models.alias import Alias
from app.models.user import User
from app.schemas.alias import AliasResponse, AliasUpdate
from app.services.alias_generator import (
    AliasGenerationError,
    create_unique_alias,
)

router = APIRouter()

MAX_ALIASES_PER_USER = 500


# ---------------------------------------------------------------------------
# Create alias
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=AliasResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_alias(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Forge a new random alias.

    Enforces the maximum alias limit per user.
    Deleted aliases do not count toward the limit.
    """

    current_count = (
        db.query(Alias)
        .filter(
            Alias.user_id == current_user.id,
            Alias.status != "deleted",
        )
        .count()
    )

    if current_count >= MAX_ALIASES_PER_USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"You have reached the maximum limit of "
                f"{MAX_ALIASES_PER_USER} aliases."
            ),
        )

    try:
        new_alias = create_unique_alias(
            db,
            user_id=current_user.id,
        )

        return new_alias

    except AliasGenerationError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate a unique alias. Please try again.",
        )


# ---------------------------------------------------------------------------
# Get aliases
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=List[AliasResponse],
)
def get_aliases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(
        0,
        ge=0,
    ),
    limit: int = Query(
        50,
        ge=1,
        le=100,
    ),
    search: str | None = Query(
        None,
        description="Search by alias name",
    ),
    status_filter: str | None = Query(
        None,
        description="Filter by status (active, disabled)",
    ),
) -> Any:
    """
    Get all non-deleted aliases for the current user.

    Supports pagination, search, and status filtering.
    """

    query = (
        db.query(Alias)
        .filter(
            Alias.user_id == current_user.id,
            Alias.status != "deleted",
        )
    )

    if search:
        query = query.filter(
            Alias.alias.ilike(f"%{search}%")
        )

    if status_filter:
        query = query.filter(
            Alias.status == status_filter
        )

    aliases = (
        query
        .order_by(Alias.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return aliases


# ---------------------------------------------------------------------------
# Update alias
# ---------------------------------------------------------------------------

@router.patch(
    "/{alias_id}",
    response_model=AliasResponse,
)
def update_alias(
    alias_id: int,
    alias_in: AliasUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update alias status.

    Allowed statuses:
        - active
        - disabled
    """

    alias = (
        db.query(Alias)
        .filter(
            Alias.id == alias_id,
            Alias.user_id == current_user.id,
            Alias.status != "deleted",
        )
        .first()
    )

    if not alias:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alias not found",
        )

    if alias_in.status not in ["active", "disabled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status",
        )

    alias.status = alias_in.status

    db.add(alias)
    db.commit()
    db.refresh(alias)

    return alias


# ---------------------------------------------------------------------------
# Delete alias
# ---------------------------------------------------------------------------

@router.delete(
    "/{alias_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_alias(
    alias_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Soft-delete an alias.

    The alias remains in the database to prevent reuse.
    """

    alias = (
        db.query(Alias)
        .filter(
            Alias.id == alias_id,
            Alias.user_id == current_user.id,
            Alias.status != "deleted",
        )
        .first()
    )

    if not alias:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alias not found",
        )

    alias.status = "deleted"
    alias.deleted_at = datetime.utcnow()

    db.add(alias)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# ===========================================================================
# Cloudflare Email Worker alias resolution
# ===========================================================================

class AliasResolveResponse(BaseModel):
    forward_to: str


@router.get(
    "/resolve",
    response_model=AliasResolveResponse,
    include_in_schema=True,
)
def resolve_alias(
    email: str = Query(
        ...,
        description=(
            "Full alias address, for example "
            "cool_tiger@thorthehost.in"
        ),
    ),
    authorization: str | None = Header(
        default=None,
    ),
    db: Session = Depends(get_db),
) -> AliasResolveResponse:
    """
    Resolve a ThorTheHost alias to the owner's verified
    forwarding email.

    This endpoint is intended to be called by the
    Cloudflare Email Worker.

    Authentication:
        Authorization: Bearer <WORKER_SECRET_TOKEN>

    Security checks:
        1. Worker secret must be configured.
        2. Authorization header must contain the correct secret.
        3. Email must belong to thorthehost.in.
        4. Alias must exist.
        5. Alias must be active.
        6. Alias must not be logically deleted.
        7. Alias owner must exist.
        8. Alias owner must be active.
        9. Forwarding email must be verified.
        10. Forwarding email must exist.
    """

    # -----------------------------------------------------------------------
    # 1. Get Worker authentication secret from centralized configuration
    # -----------------------------------------------------------------------

    worker_secret = settings.worker_secret_token

    if not worker_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Worker authentication is not configured",
        )

    # -----------------------------------------------------------------------
    # 2. Verify Authorization header
    # -----------------------------------------------------------------------

    expected_authorization = f"Bearer {worker_secret}"

    if authorization != expected_authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

    # -----------------------------------------------------------------------
    # 3. Validate incoming email address
    # -----------------------------------------------------------------------

    email = email.strip().lower()

    if "@" not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address",
        )

    alias_local, domain = email.rsplit("@", 1)

    # Only accept aliases belonging to your domain.
    if domain != "thorthehost.in":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid alias domain",
        )

    if not alias_local:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid alias",
        )

    # -----------------------------------------------------------------------
    # 4. Find active alias
    # -----------------------------------------------------------------------

    alias_obj = (
        db.query(Alias)
        .filter(
            Alias.alias == alias_local,
            Alias.status == "active",
            Alias.deleted_at.is_(None),
        )
        .first()
    )

    if not alias_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alias not found or inactive",
        )

    # -----------------------------------------------------------------------
    # 5. Find alias owner
    # -----------------------------------------------------------------------

    user = alias_obj.user

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alias owner not found",
        )

    # -----------------------------------------------------------------------
    # 6. Make sure owner account is active
    # -----------------------------------------------------------------------

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alias owner is inactive",
        )

    # -----------------------------------------------------------------------
    # 7. Make sure forwarding address is verified
    # -----------------------------------------------------------------------

    if not user.is_forward_verified:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Forwarding address is not verified",
        )

    # -----------------------------------------------------------------------
    # 8. Make sure forwarding address exists
    # -----------------------------------------------------------------------

    if not user.forward_email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No forwarding address configured",
        )

    # -----------------------------------------------------------------------
    # 9. Return verified forwarding destination
    # -----------------------------------------------------------------------

    return AliasResolveResponse(
        forward_to=user.forward_email
    )