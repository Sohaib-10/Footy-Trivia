from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app import models, schemas, auth
from app.routers.quiz import rebuild_leaderboard_ranks

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=schemas.ProfileRead)
async def get_me(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/me/progress", response_model=schemas.UserProgressRead)
async def get_me_progress(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    query = select(models.UserProgress).where(models.UserProgress.user_id == current_user.id)
    result = await db.execute(query)
    progress = result.scalars().first()
    if not progress:
        progress = models.UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    return progress

@router.post("/me/progress/sync", response_model=schemas.UserProgressRead)
async def sync_me_progress(
    payload: schemas.UserProgressSync,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(models.UserProgress).where(models.UserProgress.user_id == current_user.id)
    result = await db.execute(query)
    progress = result.scalars().first()
    if not progress:
        progress = models.UserProgress(user_id=current_user.id)
        db.add(progress)

    progress.total_points += payload.points_earned
    progress.total_correct += payload.correct
    progress.total_incorrect += payload.incorrect
    progress.total_questions_answered += payload.questions_answered
    if payload.current_streak is not None:
        progress.current_streak = payload.current_streak
    if payload.longest_streak is not None and payload.longest_streak > progress.longest_streak:
        progress.longest_streak = payload.longest_streak
    progress.last_played_at = datetime.utcnow()

    lb_query = select(models.Leaderboard).where(models.Leaderboard.user_id == current_user.id)
    lb_result = await db.execute(lb_query)
    leaderboard = lb_result.scalars().first()
    if not leaderboard:
        leaderboard = models.Leaderboard(user_id=current_user.id)
        db.add(leaderboard)
    leaderboard.total_points = progress.total_points
    leaderboard.weekly_points += payload.points_earned
    leaderboard.monthly_points += payload.points_earned

    if payload.quizzes_played > 0:
        prof_query = select(models.Profile).where(models.Profile.user_id == current_user.id)
        prof_result = await db.execute(prof_query)
        profile = prof_result.scalars().first()
        if profile:
            profile.total_quizzes_played += payload.quizzes_played

    await db.flush()
    await rebuild_leaderboard_ranks(db)
    await db.commit()
    await db.refresh(progress)
    return progress

@router.put("/me", response_model=schemas.ProfileRead)
async def update_profile(
    profile_data: schemas.ProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update profile fields if supplied
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile

@router.get("/{username}", response_model=schemas.PublicProfileRead)
async def get_public_profile(username: str, db: AsyncSession = Depends(get_db)):
    query = select(models.User).where(models.User.username == username).options(selectinload(models.User.profile))
    result = await db.execute(query)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
