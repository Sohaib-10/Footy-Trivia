"""World Cup 2026 live scores — football-data.org with Supabase cache."""
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple

import httpx
from fastapi import APIRouter, HTTPException

from app.config import settings
from app.storage import supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/wc", tags=["world-cup-scores"])

FOOTBALL_DATA_BASE = "https://api.football-data.org/v4/competitions/WC/matches"
STATUS_PRIORITY = {"IN_PLAY": 0, "PAUSED": 1, "FINISHED": 2, "SCHEDULED": 3, "TIMED": 4}
MODE_LABELS = {
    "today": "Today's Matches",
    "upcoming": "Upcoming Fixtures",
    "recent": "Recent Results",
    "off_season": "World Cup 2026 Coming Soon",
}


def get_utc_today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _off_season_response(error: Optional[str] = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "mode": "off_season",
        "label": MODE_LABELS["off_season"],
        "matches": [],
        "generated_at": _utc_now_iso(),
        "stale": False,
    }
    if error:
        payload["error"] = error
    return payload


def _read_cache(cache_key: str, *, allow_expired: bool = False) -> Optional[Dict[str, Any]]:
    if not supabase_client:
        return None
    try:
        query = supabase_client.table("score_cache").select("payload, expires_at").eq("cache_key", cache_key)
        if not allow_expired:
            query = query.gt("expires_at", _utc_now_iso())
        result = query.order("fetched_at", desc=True).limit(1).execute()
        rows = result.data or []
        if rows:
            return rows[0]["payload"]
    except Exception:
        logger.exception("Failed to read score cache for key %s", cache_key)
    return None


def _write_cache(cache_key: str, payload: Dict[str, Any], ttl_seconds: int) -> None:
    if not supabase_client:
        return
    now = datetime.now(timezone.utc)
    try:
        supabase_client.table("score_cache").upsert(
            {
                "cache_key": cache_key,
                "payload": payload,
                "fetched_at": now.isoformat(),
                "expires_at": (now + timedelta(seconds=ttl_seconds)).isoformat(),
            }
        ).execute()
    except Exception:
        logger.exception("Failed to write score cache for key %s", cache_key)


async def fetch_with_cache(
    cache_key: str,
    params: Dict[str, str],
    ttl_seconds: int = 55,
) -> Tuple[Dict[str, Any], bool]:
    """Return (payload, stale)."""
    cached = _read_cache(cache_key)
    if cached is not None:
        return cached, False

    api_key = settings.FOOTBALL_DATA_API_KEY.strip()
    if not api_key:
        return {"matches": []}, False

    headers = {"X-Auth-Token": api_key}
    async with httpx.AsyncClient(timeout=15.0) as client:
        res = await client.get(FOOTBALL_DATA_BASE, params=params, headers=headers)

    if res.status_code == 200:
        payload = res.json()
        _write_cache(cache_key, payload, ttl_seconds)
        return payload, False

    if res.status_code == 429:
        stale_payload = _read_cache(cache_key, allow_expired=True)
        if stale_payload is not None:
            return stale_payload, True
        raise HTTPException(status_code=429, detail="Rate limited and no cached data available")

    raise HTTPException(status_code=res.status_code, detail=res.text)


@router.get("/matches")
async def get_wc_matches():
    if not settings.FOOTBALL_DATA_API_KEY.strip():
        return _off_season_response("Scores unavailable")

    today = get_utc_today()
    now = datetime.now(timezone.utc)
    stale = False

    try:
        today_data, today_stale = await fetch_with_cache(
            f"wc_today_{today}",
            {
                "status": "SCHEDULED,IN_PLAY,PAUSED,FINISHED",
                "dateFrom": today,
                "dateTo": today,
            },
        )
        stale = stale or today_stale

        date_from_up = (now + timedelta(days=1)).strftime("%Y-%m-%d")
        date_to_up = (now + timedelta(days=3)).strftime("%Y-%m-%d")
        upcoming_data, upcoming_stale = await fetch_with_cache(
            f"wc_upcoming_{date_from_up}_{date_to_up}",
            {
                "status": "SCHEDULED,TIMED",
                "dateFrom": date_from_up,
                "dateTo": date_to_up,
            },
        )
        stale = stale or upcoming_stale

        date_from_rec = (now - timedelta(days=3)).strftime("%Y-%m-%d")
        date_to_rec = (now - timedelta(days=1)).strftime("%Y-%m-%d")
        recent_data, recent_stale = await fetch_with_cache(
            f"wc_recent_{date_from_rec}_{date_to_rec}",
            {
                "status": "FINISHED",
                "dateFrom": date_from_rec,
                "dateTo": date_to_rec,
            },
        )
        stale = stale or recent_stale
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to fetch World Cup matches")
        return _off_season_response("Scores unavailable")

    today_matches = sorted(
        today_data.get("matches") or [],
        key=lambda m: STATUS_PRIORITY.get(m.get("status"), 9),
    )

    if today_matches:
        display_matches = today_matches[:5]
        display_mode = "today"
    elif (upcoming_data.get("matches") or []):
        display_matches = (upcoming_data.get("matches") or [])[:5]
        display_mode = "upcoming"
    elif (recent_data.get("matches") or []):
        display_matches = sorted(
            recent_data.get("matches") or [],
            key=lambda m: m.get("utcDate") or "",
            reverse=True,
        )[:5]
        display_mode = "recent"
    else:
        display_matches = []
        display_mode = "off_season"

    return {
        "mode": display_mode,
        "label": MODE_LABELS[display_mode],
        "matches": display_matches,
        "generated_at": _utc_now_iso(),
        "stale": stale,
    }
