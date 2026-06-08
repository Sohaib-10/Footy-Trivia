from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

@router.get("/", response_model=List[schemas.AchievementRead])
async def list_achievements(db: AsyncSession = Depends(get_db)):
    query = select(models.Achievement).order_by(models.Achievement.name.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/me", response_model=List[schemas.UserAchievementRead])
async def list_my_achievements(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(models.UserAchievement)
        .where(models.UserAchievement.user_id == current_user.id)
        .options(selectinload(models.UserAchievement.achievement))
        .order_by(models.UserAchievement.earned_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()
