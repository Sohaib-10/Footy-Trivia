import io
from PIL import Image
from fastapi import UploadFile, HTTPException
from supabase import create_client, Client
from app.config import settings

# Initialize Supabase client using Service Key to bypass RLS restrictions on admin actions
supabase_client = None
try:
    if "your-project-ref" not in settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY != "your-service-role-key":
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
except Exception as e:
    print(f"Warning: Could not initialize Supabase storage client: {e}")

def get_public_url(bucket: str, path: str) -> str:
    """
    Construct the CDN public URL for a file in Supabase Storage.
    Format: https://[PROJECT-REF].supabase.co/storage/v1/object/public/[bucket]/[path]
    """
    return f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{bucket}/{path}"

def resize_avatar(file_bytes: bytes, max_size=(400, 400)) -> bytes:
    """
    Resizes the avatar image to save space and converts it to WebP.
    """
    try:
        img = Image.open(io.BytesIO(file_bytes))
        # Handle transparency modes for WebP conversion
        if img.mode in ("RGBA", "P"):
            # WebP supports transparency, but if we convert to RGB it becomes smaller
            # We keep transparency for avatars by converting to RGBA if transparent
            if img.mode == "P":
                img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
            
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        # Save as WEBP
        img.save(buffer, format="WEBP", quality=85)
        return buffer.getvalue()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")

async def delete_avatar(user_id: str):
    """
    Delete any existing avatar profiles to avoid file accumulation.
    """
    bucket = settings.STORAGE_AVATAR_BUCKET
    # Search and delete profile.webp
    path = f"{user_id}/profile.webp"
    try:
        supabase_client.storage.from_(bucket).remove([path])
    except Exception:
        # Ignore errors if the file does not exist
        pass

async def upload_avatar(user_id: str, file: UploadFile) -> str:
    """
    Uploads user avatar after resizing and converting to WEBP.
    Returns the public CDN URL.
    """
    bucket = settings.STORAGE_AVATAR_BUCKET
    
    # Read bytes
    file_bytes = await file.read()
    
    # Process & Resize image
    processed_bytes = resize_avatar(file_bytes)
    
    # Define destination path: avatars/{user_id}/profile.webp
    path = f"{user_id}/profile.webp"
    
    # Clean up old avatar first
    await delete_avatar(user_id)
    
    # Upload to Supabase Storage
    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=processed_bytes,
            file_options={"content-type": "image/webp", "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase upload error: {str(e)}")

async def upload_team_logo(team_id: int, team_slug: str, file: UploadFile) -> str:
    """
    Uploads a team logo to the team-logos bucket.
    """
    bucket = settings.STORAGE_LOGOS_BUCKET
    file_bytes = await file.read()
    
    # Resolve file extension
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    path = f"{team_id}/{team_slug}.{ext}"
    
    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=file_bytes,
            file_options={"content-type": file.content_type, "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload team logo: {str(e)}")

async def upload_flag(country_code: str, file: UploadFile) -> str:
    """
    Uploads a country flag to the country-flags bucket.
    """
    bucket = settings.STORAGE_FLAGS_BUCKET
    file_bytes = await file.read()
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "svg"
    path = f"{country_code.upper()}.{ext}"
    
    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=file_bytes,
            file_options={"content-type": file.content_type, "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload flag: {str(e)}")

async def upload_achievement_icon(achievement_id: int, slug: str, file: UploadFile) -> str:
    """
    Uploads a badge icon to the achievements bucket.
    """
    bucket = settings.STORAGE_ACHIEVEMENTS_BUCKET
    file_bytes = await file.read()
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    path = f"{achievement_id}/{slug}.{ext}"
    
    try:
        supabase_client.storage.from_(bucket).upload(
            path=path,
            file=file_bytes,
            file_options={"content-type": file.content_type, "upsert": "true"}
        )
        return get_public_url(bucket, path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload achievement icon: {str(e)}")
