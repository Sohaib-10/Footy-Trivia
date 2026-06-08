from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("/global", response_model=List[schemas.LeaderboardRead])
async def get_global_leaderboard(limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .order_by(models.Leaderboard.rank.asc(), models.Leaderboard.total_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for row in result.all():
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/country/{code}", response_model=List[schemas.LeaderboardRead])
async def get_country_leaderboard(code: str, limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)):
    # Find country by code
    country_query = select(models.Country).where(models.Country.code == code.upper())
    country_result = await db.execute(country_query)
    country = country_result.scalars().first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .where(models.Leaderboard.country_id == country.id)
        .order_by(models.Leaderboard.total_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for idx, row in enumerate(result.all()):
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        # Locally rank country-specific results
        lb_read.rank = offset + idx + 1
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/weekly", response_model=List[schemas.LeaderboardRead])
async def get_weekly_leaderboard(limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .order_by(models.Leaderboard.weekly_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for idx, row in enumerate(result.all()):
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        lb_read.rank = offset + idx + 1
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/monthly", response_model=List[schemas.LeaderboardRead])
async def get_monthly_leaderboard(limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .order_by(models.Leaderboard.monthly_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for idx, row in enumerate(result.all()):
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        lb_read.rank = offset + idx + 1
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/me/rank", response_model=schemas.LeaderboardRead)
async def get_my_rank(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .where(models.Leaderboard.user_id == current_user.id)
    )
    result = await db.execute(query)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Leaderboard details not found")
    lb, username, correct, total = row
    lb_read = schemas.LeaderboardRead.model_validate(lb)
    lb_read.username = username
    if total and total > 0:
        lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
    else:
        lb_read.accuracy = "0%"
    return lb_read
