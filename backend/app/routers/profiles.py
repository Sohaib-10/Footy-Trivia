from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.database import get_db
from app import models, auth, storage, schemas
from app.schemas.storage_schemas import UploadResponse

router = APIRouter(prefix="/api/profile", tags=["profile"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/svg+xml"}
MAX_AVATAR_SIZE = 2 * 1024 * 1024       # 2MB

async def validate_avatar(file: UploadFile):
    # MIME check
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # Size check
    size = getattr(file, "size", None)
    if size is None:
        file_bytes = await file.read()
        size = len(file_bytes)
        await file.seek(0)
        
    if size > MAX_AVATAR_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size allowed is 2MB ({MAX_AVATAR_SIZE} bytes)"
        )

@router.post("/avatar", response_model=UploadResponse)
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await validate_avatar(file)
    
    # Upload to Supabase Storage (automatic WebP resize in storage.py)
    public_url = await storage.upload_avatar(str(current_user.id), file)
    
    # Update profile in DB
    query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()
    
    if not profile:
        profile = models.Profile(user_id=current_user.id, avatar_url=public_url)
        db.add(profile)
    else:
        profile.avatar_url = public_url
        
    await db.commit()
    return UploadResponse(public_url=public_url)

@router.put("", response_model=schemas.ProfileRead)
async def update_profile(
    display_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    country_id: Optional[int] = Form(None),
    favourite_team_id: Optional[int] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch user profile
    query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # If avatar is uploaded in the same request, process and save it
    if avatar is not None:
        await validate_avatar(avatar)
        public_url = await storage.upload_avatar(str(current_user.id), avatar)
        profile.avatar_url = public_url

    # Update other fields
    if display_name is not None:
        profile.display_name = display_name
    if bio is not None:
        profile.bio = bio
    if country_id is not None:
        profile.country_id = country_id
    if favourite_team_id is not None:
        profile.favourite_team_id = favourite_team_id

    await db.commit()
    await db.refresh(profile)
    return profile
