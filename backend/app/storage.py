import io
from typing import Optional
from PIL import Image
from fastapi import UploadFile, HTTPException
from supabase import create_client, Client
from app.config import settings

MAX_IMAGE_PIXELS = 8_000_000
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

supabase_client = None  # type: Optional[Client]
try:
    if settings.supabase_configured:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
except Exception as e:
    print(f"Warning: Could not initialize Supabase storage client: {e}")


def _ensure_storage() -> None:
    if not supabase_client:
        raise HTTPException(status_code=503, detail="File storage is not configured")


def get_public_url(bucket: str, path: str) -> str:
    return f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{bucket}/{path}"


def _process_image(file_bytes: bytes, max_size=(800, 800), output_format: str = "WEBP") -> bytes:
    Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.load()
        if img.width * img.height > MAX_IMAGE_PIXELS:
            raise HTTPException(status_code=400, detail="Image dimensions too large")
        if img.mode in ("RGBA", "P"):
            if img.mode == "P":
                img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        img.save(buffer, format=output_format, quality=85)
        return buffer.getvalue()
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to process image")


def resize_avatar(file_bytes: bytes, max_size=(400, 400)) -> bytes:
    return _process_image(file_bytes, max_size=max_size, output_format="WEBP")


async def delete_avatar(user_id: str):
    _ensure_storage()
    bucket = settings.STORAGE_AVATAR_BUCKET
    path = f"{user_id}/profile.webp"
    try:
        supabase_client.storage.from_(bucket).remove([path])
    except Exception:
        pass


async def upload_avatar(user_id: str, file: UploadFile) -> str:
    _ensure_storage()
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    bucket = settings.STORAGE_AVATAR_BUCKET
    file_bytes = await file.read()
    processed_bytes = resize_avatar(file_bytes)
    path = f"{user_id}/profile.webp"

    await delete_avatar(user_id)

    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=processed_bytes,
            file_options={"content-type": "image/webp", "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload avatar")


async def upload_team_logo(team_id: int, team_slug: str, file: UploadFile) -> str:
    _ensure_storage()
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    bucket = settings.STORAGE_LOGOS_BUCKET
    file_bytes = await file.read()
    processed_bytes = _process_image(file_bytes, max_size=(512, 512), output_format="WEBP")
    path = f"{team_id}/{team_slug}.webp"

    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=processed_bytes,
            file_options={"content-type": "image/webp", "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload team logo")


async def upload_flag(country_code: str, file: UploadFile) -> str:
    _ensure_storage()
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    bucket = settings.STORAGE_FLAGS_BUCKET
    file_bytes = await file.read()
    processed_bytes = _process_image(file_bytes, max_size=(256, 256), output_format="WEBP")
    path = f"{country_code.upper()}.webp"

    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=processed_bytes,
            file_options={"content-type": "image/webp", "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload flag")


async def upload_achievement_icon(achievement_id: int, slug: str, file: UploadFile) -> str:
    _ensure_storage()
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    bucket = settings.STORAGE_ACHIEVEMENTS_BUCKET
    file_bytes = await file.read()
    processed_bytes = _process_image(file_bytes, max_size=(256, 256), output_format="WEBP")
    path = f"{achievement_id}/{slug}.webp"

    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=processed_bytes,
            file_options={"content-type": "image/webp", "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload achievement icon")
