"""
ThorTheHost API - application entrypoint.

Run locally with:
    uvicorn main:app --reload --host 127.0.0.1 --port 8000

This module is intentionally thin: it wires together configuration,
logging, middleware, and routers. Business logic lives in the service
layer; database access lives in the repository layer. Nothing here should
ever contain a SQL query or a password check.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown hooks.

    Startup: validate configuration so the process fails fast instead of
    booting in a silently insecure or broken state.
    Shutdown: placeholder for closing pooled resources in later phases
    (e.g. an aioredis pool or SMTP worker).
    """
    settings.validate_production_safety()
    logger.info("Starting %s (env=%s)", settings.app_name, settings.app_env)
    yield
    logger.info("Shutting down %s", settings.app_name)


def create_app() -> FastAPI:
    """Application factory.

    Using a factory (rather than a bare module-level ``app = FastAPI()``
    with everything inline) keeps ``main.py`` readable and makes the app
    easy to instantiate in tests with different settings/overrides.
    """
    app = FastAPI(
        title=settings.app_name,
        description="Privacy-first email alias forwarding platform.",
        version="0.1.0",
        docs_url="/api/docs" if not settings.is_production else None,
        redoc_url="/api/redoc" if not settings.is_production else None,
        openapi_url="/api/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # --- CORS ---
    # Only the configured frontend origin(s) may call the API with
    # credentials (cookies). This is deliberately explicit -- never "*"
    # once credentials are allowed, per the CORS spec and OWASP guidance.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],
    )

    # --- Security headers (Helmet-equivalent) ---
    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains; preload"
            )
        return response

    # --- Routers ---
    app.include_router(api_router)

    # --- Fallback error handler ---
    # Ensures unhandled exceptions never leak stack traces / internals to
    # clients, especially important once app_debug=False in production.
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "An unexpected error occurred. Please try again later."},
        )

    return app


app = create_app()
