from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.database import get_db
from app import models, auth, storage, schemas
from app.schemas.storage_schemas import UploadResponse
from app.validation import (
    InputValidationError,
    sanitize_optional_text,
    sanitize_upload_filename,
    validation_error_to_http,
    MAX_BIO_LEN,
    MAX_DISPLAY_NAME_LEN,
)

router = APIRouter(prefix="/api/profile", tags=["profile"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_AVATAR_SIZE = 2 * 1024 * 1024       # 2MB

async def validate_avatar(file: UploadFile):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )

    file.filename = sanitize_upload_filename(file.filename)

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

    public_url = await storage.upload_avatar(str(current_user.id), file)

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
    query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    try:
        if display_name is not None:
            profile.display_name = sanitize_optional_text(
                display_name,
                max_length=MAX_DISPLAY_NAME_LEN,
                min_length=1,
                field_name="display_name",
            )
        if bio is not None:
            profile.bio = sanitize_optional_text(bio, max_length=MAX_BIO_LEN, field_name="bio")
        if country_id is not None:
            if country_id < 1:
                raise InputValidationError("country_id must be a positive integer")
            profile.country_id = country_id
        if favourite_team_id is not None:
            if favourite_team_id < 1:
                raise InputValidationError("favourite_team_id must be a positive integer")
            profile.favourite_team_id = favourite_team_id
    except InputValidationError as exc:
        raise validation_error_to_http(exc) from exc

    if avatar is not None:
        await validate_avatar(avatar)
        public_url = await storage.upload_avatar(str(current_user.id), avatar)
        profile.avatar_url = public_url

    await db.commit()
    await db.refresh(profile)
    return profile
