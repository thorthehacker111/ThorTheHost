"""
Application configuration.

All configuration is loaded from environment variables (or a local ``.env``
file during development) via ``pydantic-settings``. This is the ONLY place
in the codebase that should call ``os.environ`` / read the ``.env`` file --
every other module must import ``settings`` from here.

Centralizing configuration this way means:
    * Secrets are never hardcoded in source code.
    * Configuration is validated at startup (fail fast on misconfiguration).
    * Swapping environments (dev / staging / prod) is a matter of swapping
      the ``.env`` file, not editing code.
"""

from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings.

    Every field has an explicit type and, where appropriate, a safe
    default. Secrets (JWT key, database credentials) intentionally have
    *no* usable default so the app refuses to start with insecure values
    in production (enforced in :meth:`validate_production_safety`).
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Application ---
    app_name: str = Field(default="ThorTheHost")
    app_env: str = Field(default="development")  # development | staging | production
    app_debug: bool = Field(default=True)
    app_host: str = Field(default="127.0.0.1")
    app_port: int = Field(default=8000)

    # --- CORS ---
    cors_origins: str = Field(default="http://localhost:5173")

    # --- Database ---
    database_url: str = Field(
        default="postgresql+psycopg://thorthehost_user:changeme@localhost:5432/thorthehost_db"
    )

    # --- Redis ---
    redis_url: str = Field(default="redis://localhost:6379/0")

    # --- JWT ---
    jwt_secret_key: str = Field(default="INSECURE-DEV-ONLY-CHANGE-ME")
    jwt_algorithm: str = Field(default="HS256")
    jwt_access_token_expire_minutes: int = Field(default=15)
    jwt_refresh_token_expire_days: int = Field(default=30)

    # --- Cookies ---
    cookie_secure: bool = Field(default=False)
    cookie_domain: str = Field(default="localhost")

    # --- Logging ---
    log_level: str = Field(default="INFO")

    @property
    def cors_origins_list(self) -> List[str]:
        """Return ``cors_origins`` as a clean list of origin strings."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @field_validator("app_env")
    @classmethod
    def _normalize_env(cls, value: str) -> str:
        allowed = {"development", "staging", "production"}
        normalized = value.lower()
        if normalized not in allowed:
            raise ValueError(f"app_env must be one of {allowed}, got '{value}'")
        return normalized

    # --- Outbound SMTP Relay ---
    smtp_host: str = "smtp.sendgrid.net"
    smtp_port: int = 587
    smtp_user: str = "apikey"
    smtp_password: str = ""
    smtp_from_email: str = "forwarder@thorthehost.in"

    # --- Cloudflare Email Routing ---
    cloudflare_api_token: str = Field(default="")
    cloudflare_account_id: str = Field(default="")
    cloudflare_zone_id: str = Field(default="")

    worker_secret_token: str = Field(default="")

    def validate_production_safety(self) -> None:
        """Guard against insecure defaults leaking into production.

        Called once at startup (see ``main.py``). Raises ``RuntimeError``
        rather than silently booting an insecure production server.
        """
        if not self.is_production:
            return

        if self.jwt_secret_key == "INSECURE-DEV-ONLY-CHANGE-ME":
            raise RuntimeError(
                "Refusing to start in production with the default JWT_SECRET_KEY. "
                "Set a strong, unique secret in the environment."
            )
        if self.app_debug:
            raise RuntimeError("Refusing to start in production with APP_DEBUG=true.")
        if not self.cookie_secure:
            raise RuntimeError("Refusing to start in production with COOKIE_SECURE=false.")


@lru_cache
def get_settings() -> Settings:
    """Return a cached, process-wide ``Settings`` instance.

    ``lru_cache`` ensures the environment is parsed only once and the same
    object is reused everywhere (including as a FastAPI dependency).
    """
    return Settings()


settings = get_settings()
