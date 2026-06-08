from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

_BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="postgresql+asyncpg://postgres:postgres@localhost:5432/footytrivia")
    SECRET_KEY: str = Field(default="replace-with-a-long-random-secret")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=720)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)

    # Supabase Settings
    SUPABASE_URL: str = Field(default="https://placeholder.supabase.co")
    SUPABASE_ANON_KEY: str = Field(default="anon-key-placeholder")
    SUPABASE_SERVICE_KEY: str = Field(default="service-key-placeholder")

    # Storage Buckets
    STORAGE_AVATAR_BUCKET: str = Field(default="avatars")
    STORAGE_LOGOS_BUCKET: str = Field(default="team-logos")
    STORAGE_FLAGS_BUCKET: str = Field(default="country-flags")
    STORAGE_ACHIEVEMENTS_BUCKET: str = Field(default="achievements")

    # RapidAPI Settings
    RAPIDAPI_KEY: str = Field(default="")

    # Ably Settings
    ABLY_API_KEY: str = Field(default="")

    # Email / auth links
    FRONTEND_URL: str = Field(default="http://localhost:9999")
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

    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
