"""
Health check endpoints.

Used by uptime monitors, load balancers, and local developers to confirm
the API process is alive and (optionally) that its dependencies -
PostgreSQL and Redis - are reachable.
"""

from typing import Literal

import redis
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import get_logger
from app.database.session import get_db

logger = get_logger(__name__)

router = APIRouter(tags=["Health"])


class ComponentStatus(BaseModel):
    """Status of a single infrastructure dependency."""

    name: str
    status: Literal["ok", "error"]
    detail: str | None = None


class HealthResponse(BaseModel):
    """Overall health payload returned by ``GET /api/v1/health``."""

    status: Literal["ok", "degraded"]
    app_name: str
    environment: str
    components: list[ComponentStatus]


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description=(
        "Reports whether the API process is running and whether its "
        "PostgreSQL and Redis dependencies are reachable. Returns HTTP 200 "
        "even when a dependency is down; check the `status` field."
    ),
)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    """Return the current health of the API and its dependencies."""
    components: list[ComponentStatus] = []

    # --- PostgreSQL ---
    try:
        db.execute(text("SELECT 1"))
        components.append(ComponentStatus(name="postgresql", status="ok"))
    except Exception as exc:  # noqa: BLE001 - we want to report *any* failure
        logger.exception("Health check: PostgreSQL is unreachable")
        components.append(ComponentStatus(name="postgresql", status="error", detail=str(exc)))

    # --- Redis ---
    try:
        redis_client = redis.Redis.from_url(settings.redis_url, socket_connect_timeout=2)
        redis_client.ping()
        components.append(ComponentStatus(name="redis", status="ok"))
    except Exception as exc:  # noqa: BLE001
        logger.exception("Health check: Redis is unreachable")
        components.append(ComponentStatus(name="redis", status="error", detail=str(exc)))

    overall_status = "ok" if all(c.status == "ok" for c in components) else "degraded"

    return HealthResponse(
        status=overall_status,
        app_name=settings.app_name,
        environment=settings.app_env,
        components=components,
    )
