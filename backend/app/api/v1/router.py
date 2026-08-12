"""
API v1 router aggregation.

Every feature module (health, auth, users, aliases, ...) exposes its own
``APIRouter``. This module is the single place where those routers are
combined, so ``main.py`` only ever has to mount one router per version.
Versioning the API this way (``/api/v1``) lets us introduce a ``v2`` later
without breaking existing clients.
"""

from fastapi import APIRouter

from app.api.v1 import health, auth, users, aliases

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(aliases.router, prefix="/aliases", tags=["Aliases"])
