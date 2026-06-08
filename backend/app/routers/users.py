from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app import models, schemas, auth

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
