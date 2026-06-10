from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app import models, auth, storage
from app.schemas.storage_schemas import UploadResponse
from app.dependencies import CountryCodePath
from app.validation import sanitize_upload_filename

router = APIRouter(prefix="/api", tags=["storage"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_AVATAR_SIZE = 2 * 1024 * 1024       # 2MB
MAX_LOGO_SIZE = 1 * 1024 * 1024         # 1MB
MAX_FLAG_SIZE = 500 * 1024              # 500KB
MAX_ACHIEVEMENT_SIZE = 500 * 1024       # 500KB

async def validate_file(file: UploadFile, max_size: int, allowed_types: set):
    file.filename = sanitize_upload_filename(file.filename)
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Size check
    size = getattr(file, "size", None)
    if size is None:
        file_bytes = await file.read()
        size = len(file_bytes)
        await file.seek(0)
        
    if size > max_size:
        max_mb = max_size / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size allowed is {max_mb:.1f}MB ({max_size} bytes)"
        )

# Admin/other asset uploads follow below

@router.post("/admin/teams/{id}/logo", response_model=UploadResponse)
async def upload_team_logo_logo(
    id: int = Path(..., ge=1),
    file: UploadFile = File(...),
    admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    await validate_file(file, MAX_LOGO_SIZE, ALLOWED_IMAGE_TYPES)
    
    # Fetch team to construct slug/path
    query = select(models.Team).where(models.Team.id == id)
    result = await db.execute(query)
    team = result.scalars().first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    # Slugify name
    slug = team.name.lower().replace(" ", "-").replace("'", "").replace(".", "")
    
    public_url = await storage.upload_team_logo(team.id, slug, file)
    
    # Update DB
    team.logo_url = public_url
    await db.commit()
    return UploadResponse(public_url=public_url)

@router.post("/admin/countries/{code}/flag", response_model=UploadResponse)
async def upload_country_flag_flag(
    code: CountryCodePath,
    file: UploadFile = File(...),
    admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Flags only allow SVG or PNG
    allowed_flag_types = {"image/png"}
    await validate_file(file, MAX_FLAG_SIZE, allowed_flag_types)
    
    # Fetch country
    query = select(models.Country).where(models.Country.code == code.upper())
    result = await db.execute(query)
    country = result.scalars().first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
        
    public_url = await storage.upload_flag(country.code, file)
    
    # Update DB
    country.flag_url = public_url
    await db.commit()
    return UploadResponse(public_url=public_url)

@router.post("/admin/achievements/{id}/icon", response_model=UploadResponse)
async def upload_achievement_badge_icon(
    id: int = Path(..., ge=1),
    file: UploadFile = File(...),
    admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    await validate_file(file, MAX_ACHIEVEMENT_SIZE, ALLOWED_IMAGE_TYPES)
    
    # Fetch achievement
    query = select(models.Achievement).where(models.Achievement.id == id)
    result = await db.execute(query)
    achievement = result.scalars().first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
        
    slug = achievement.name.lower().replace(" ", "-")
    public_url = await storage.upload_achievement_icon(achievement.id, slug, file)
    
    # Update DB
    achievement.icon_url = public_url
    await db.commit()
    return UploadResponse(public_url=public_url)
