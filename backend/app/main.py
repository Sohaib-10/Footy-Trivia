import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.routers import auth, users, leaderboard, quiz, questions, teams, countries, achievements, storage_router, profiles, stats, battle, wc, players
from app.database import engine, Base
from app import models  # noqa: F401  (ensures all tables are registered on Base.metadata)
from app.config import settings
from app.middleware.csrf import CsrfMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_limits import RequestSizeLimitMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables exist (safe/idempotent — only creates missing tables).
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token VARCHAR(36)"
            ))
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP"
            ))
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_nonce VARCHAR(36)"
            ))
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_nonce VARCHAR(36)"
            ))
            await conn.execute(text(
                "CREATE UNIQUE INDEX IF NOT EXISTS uq_session_answer_question "
                "ON session_answers (session_id, question_id)"
            ))
            await conn.execute(text(
                "ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS challenge_type VARCHAR(20)"
            ))
    except Exception:
        logger.exception("Failed to ensure database tables on startup")
    yield


_docs_url = None if settings.ENVIRONMENT == "production" else "/docs"
_redoc_url = None if settings.ENVIRONMENT == "production" else "/redoc"

app = FastAPI(
    title="Footy-Trivia API",
    description="Asynchronous Backend API for Footy-Trivia Platform",
    version="1.0.0",
    docs_url=_docs_url,
    redoc_url=_redoc_url,
    lifespan=lifespan
)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(CsrfMiddleware)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    errors = exc.errors()
    detail = errors[0].get("msg", "Invalid request") if errors else "Invalid request"
    if errors and errors[0].get("loc"):
        field = errors[0]["loc"][-1]
        if field not in {"body", "query", "path"}:
            detail = f"{field}: {detail}"
    return JSONResponse(status_code=422, content={"detail": detail})

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token", "Accept"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(leaderboard.router)
app.include_router(quiz.router)
app.include_router(questions.router)
app.include_router(teams.router)
app.include_router(countries.router)
app.include_router(achievements.router)
app.include_router(storage_router.router)
app.include_router(profiles.router)
app.include_router(stats.router)
app.include_router(battle.router)
app.include_router(wc.router)
app.include_router(players.router)

@app.get("/")
async def root():
    payload = {"message": "Welcome to the Footy-Trivia API!"}
    if settings.ENVIRONMENT != "production":
        payload["documentation"] = "/docs"
    return payload
