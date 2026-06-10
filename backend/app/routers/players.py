import httpx
from fastapi import APIRouter, HTTPException, Query, status

from app.config import settings
from app.validation import sanitize_wc_name, validation_error_to_http, InputValidationError

router = APIRouter(prefix="/api/players", tags=["players"])

SPORTSDB_SEARCH_URL = "https://www.thesportsdb.com/api/v1/json/{api_key}/searchplayers.php"


@router.get("/search")
async def search_player(name: str = Query(..., min_length=1, max_length=120)):
    try:
        safe_name = sanitize_wc_name(name)
    except InputValidationError as exc:
        raise validation_error_to_http(exc) from exc

    if not settings.SPORTSDB_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Player search is not configured on the server.",
        )

    url = SPORTSDB_SEARCH_URL.format(api_key=settings.SPORTSDB_API_KEY)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params={"p": safe_name})
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to fetch player data.",
        ) from exc
