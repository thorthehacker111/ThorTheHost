from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import get_password_hash
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.patch("/me", response_model=UserResponse)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update own user profile (forwarding email, password).
    """
    if user_in.forward_email:
        current_user.forward_email = user_in.forward_email
        # When forwarding email changes, it needs re-verification (Phase 2/3 logic)
        current_user.is_forward_verified = False

    if user_in.password:
        current_user.password_hash = get_password_hash(user_in.password)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

from app.models.alias import Alias
from app.models.log import EmailLog

@router.get("/stats", response_model=dict)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get basic statistics for the user dashboard.
    """
    total_aliases = db.query(Alias).filter(Alias.user_id == current_user.id, Alias.status != "deleted").count()
    active_aliases = db.query(Alias).filter(Alias.user_id == current_user.id, Alias.status == "active").count()
    
    # Query EmailLogs for the user's aliases
    emails_forwarded = db.query(EmailLog).join(Alias).filter(
        Alias.user_id == current_user.id, 
        EmailLog.status == "forwarded"
    ).count()
    
    emails_blocked = db.query(EmailLog).join(Alias).filter(
        Alias.user_id == current_user.id, 
        EmailLog.status.in_(["blocked", "bounced"])
    ).count()
    
    return {
        "total_aliases": total_aliases,
        "active_aliases": active_aliases,
        "emails_forwarded": emails_forwarded,
        "emails_blocked": emails_blocked,
    }
