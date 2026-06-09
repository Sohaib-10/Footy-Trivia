import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, leaderboard, quiz, questions, teams, countries, achievements, storage_router, profiles, stats, battle, wc
from app.database import engine, Base
from app import models  # noqa: F401  (ensures all tables are registered on Base.metadata)
from app.config import settings
from app.middleware.csrf import CsrfMiddleware

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables exist (safe/idempotent — only creates missing tables).
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception:
        logger.exception("Failed to ensure database tables on startup")
    yield


app = FastAPI(
    title="Footy-Trivia API",
    description="Asynchronous Backend API for Footy-Trivia Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(CsrfMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Footy-Trivia API!",
        "documentation": "/docs"
    }
