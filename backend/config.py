from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables / .env file.
    All secrets live here — never hard-code them in source files.
    """

    # ── Supabase ──────────────────────────────────────────────────────────────
    supabase_url: str
    supabase_key: str          # use the *service_role* key server-side

    # ── App ───────────────────────────────────────────────────────────────────
    app_env: str = "development"       # "development" | "production"
    log_level: str = "INFO"

    # ── CORS Origins (comma-separated) ────────────────────────────────────────
    # Override in production via CORS_ORIGINS env var
    cors_origins: str = (
        "http://localhost:3000,"
        "https://tasks-manager-xi.vercel.app"
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached settings singleton — safe to call repeatedly."""
    return Settings()  # type: ignore[call-arg]
