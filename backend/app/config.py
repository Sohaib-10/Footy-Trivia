from pathlib import Path
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent

_INSECURE_SECRET_VALUES = {
    "",
    "replace-with-a-long-random-secret",
    "changeme",
    "secret",
}


class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="")
    SECRET_KEY: str = Field(default="")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)
    SESSION_INACTIVITY_HOURS: int = Field(default=2)

    SUPABASE_URL: str = Field(default="")
    SUPABASE_ANON_KEY: str = Field(default="")
    SUPABASE_SERVICE_KEY: str = Field(default="")

    STORAGE_AVATAR_BUCKET: str = Field(default="avatars")
    STORAGE_LOGOS_BUCKET: str = Field(default="team-logos")
    STORAGE_FLAGS_BUCKET: str = Field(default="country-flags")
    STORAGE_ACHIEVEMENTS_BUCKET: str = Field(default="achievements")

    SPORTSDB_API_KEY: str = Field(default="")
    FOOTBALL_DATA_API_KEY: str = Field(default="")
    ABLY_API_KEY: str = Field(default="")

    FRONTEND_URL: str = Field(default="http://localhost:9999")
    COOKIE_SECURE: bool = Field(default=False)
    BREVO_API_KEY: str = Field(default="")
    BREVO_SENDER: str = Field(default="")
    RESEND_API_KEY: str = Field(default="")
    SMTP_HOST: str = Field(default="")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="")
    SMTP_PASSWORD: str = Field(default="")
    SMTP_FROM: str = Field(default="")
    SMTP_USE_TLS: bool = Field(default=True)
    SMTP_USE_SSL: bool = Field(default=False)
    EMAIL_VERIFY_EXPIRE_HOURS: int = Field(default=24)
    PASSWORD_RESET_EXPIRE_HOURS: int = Field(default=1)

    AUTH_RATE_LIMIT_MAX_ATTEMPTS: int = Field(default=5)
    AUTH_RATE_LIMIT_WINDOW_MINUTES: int = Field(default=15)

    ENVIRONMENT: str = Field(default="development")
    TRUST_PROXY_HEADERS: bool = Field(default=False)

    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def validate_required_secrets(self) -> "Settings":
        missing: list[str] = []
        if not self.DATABASE_URL.strip():
            missing.append("DATABASE_URL")
        if self.SECRET_KEY.strip().lower() in _INSECURE_SECRET_VALUES:
            missing.append("SECRET_KEY")
        if missing:
            raise ValueError(
                "Missing or insecure required environment variables: "
                + ", ".join(missing)
                + ". Copy backend/.env.example to backend/.env and set them."
            )
        return self

    @property
    def cookie_secure(self) -> bool:
        if self.COOKIE_SECURE:
            return True
        return self.FRONTEND_URL.startswith("https://")

    @property
    def cors_origins(self) -> list[str]:
        origins = {
            self.FRONTEND_URL.rstrip("/"),
            "https://footy--trivia.vercel.app",
            "https://footy-trivia.vercel.app",
        }
        if self.ENVIRONMENT != "production":
            origins.update({
                "http://localhost:9999",
                "http://127.0.0.1:8765",
                "http://localhost:8765",
            })
        return sorted(origins)

    @property
    def supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL.strip() and self.SUPABASE_SERVICE_KEY.strip())


def load_settings() -> Settings:
    return Settings()


settings = load_settings()
