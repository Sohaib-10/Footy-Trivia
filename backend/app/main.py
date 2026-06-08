from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, leaderboard, quiz, questions, teams, countries, achievements, storage_router, profiles, stats, battle

app = FastAPI(
    title="Footy-Trivia API",
    description="Asynchronous Backend API for Footy-Trivia Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration to allow local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set this to the specific frontend origin, e.g. ["http://localhost:5500", "http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Footy-Trivia API!",
        "documentation": "/docs"
    }
