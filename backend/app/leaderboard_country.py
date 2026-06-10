"""Country helpers for leaderboard flags and one-time profile backfills."""
import logging
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models

logger = logging.getLogger(__name__)

# Extra nations users can pick in profile but may be missing from the seed set.
_EXTRA_COUNTRIES = (
    ("Pakistan", "PAK", "https://flagcdn.com/pk.svg", "AFC"),
    ("India", "IND", "https://flagcdn.com/in.svg", "AFC"),
    ("Bangladesh", "BGD", "https://flagcdn.com/bd.svg", "AFC"),
)

# 2-letter UI codes -> 3-letter DB codes used in countries.code
_CODE_ALIASES = {
    "pk": "PAK",
    "in": "IND",
    "bd": "BGD",
    "gb": "ENG",
    "uk": "ENG",
    "de": "GER",
    "es": "ESP",
    "fr": "FRA",
    "br": "BRA",
    "ar": "ARG",
    "it": "ITA",
    "pt": "POR",
    "nl": "NED",
    "us": "USA",
    "ae": "UAE",
}


async def ensure_extra_countries(db: AsyncSession) -> None:
    for name, code, flag_url, confederation in _EXTRA_COUNTRIES:
        existing = (
            await db.execute(select(models.Country).where(models.Country.code == code))
        ).scalars().first()
        if existing:
            continue
        db.add(
            models.Country(
                name=name,
                code=code,
                flag_url=flag_url,
                confederation=confederation,
            )
        )
    await db.flush()


async def find_country_id_by_code(db: AsyncSession, code: Optional[str]) -> Optional[int]:
    if not code:
        return None
    normalized = str(code).strip().upper()
    if len(normalized) == 2:
        normalized = _CODE_ALIASES.get(normalized.lower(), normalized)
    country = (
        await db.execute(select(models.Country).where(models.Country.code == normalized))
    ).scalars().first()
    return country.id if country else None


def country_code_from_preferences(preferences: Any) -> Optional[str]:
    if not isinstance(preferences, dict):
        return None
    country = preferences.get("country")
    if not isinstance(country, dict):
        return None
    code = country.get("code")
    return str(code).strip() if code else None


def resolve_leaderboard_country_code(
    db_code: Optional[str],
    preferences: Any,
) -> Optional[str]:
    if db_code:
        return db_code
    pref_code = country_code_from_preferences(preferences)
    if not pref_code:
        return None
    pref = pref_code.lower()
    if len(pref) == 2:
        return pref
    return _CODE_ALIASES.get(pref, pref)


async def sync_leaderboard_country_from_profile(
    db: AsyncSession,
    leaderboard: models.Leaderboard,
    profile: Optional[models.Profile],
) -> None:
    if not profile or leaderboard.country_id:
        return
    if profile.country_id:
        leaderboard.country_id = profile.country_id
        return
    pref_code = country_code_from_preferences(profile.preferences)
    country_id = await find_country_id_by_code(db, pref_code)
    if country_id:
        profile.country_id = country_id
        leaderboard.country_id = country_id


async def backfill_user_countries(db: AsyncSession) -> None:
    """Ensure known accounts have leaderboard/profile country set."""
    await ensure_extra_countries(db)

    pak_id = await find_country_id_by_code(db, "PAK")
    if not pak_id:
        return

    user = (
        await db.execute(
            select(models.User).where(models.User.username == "Sohaib10")
        )
    ).scalars().first()
    if not user:
        return

    profile = (
        await db.execute(select(models.Profile).where(models.Profile.user_id == user.id))
    ).scalars().first()
    leaderboard = (
        await db.execute(
            select(models.Leaderboard).where(models.Leaderboard.user_id == user.id)
        )
    ).scalars().first()

    if profile:
        prefs = profile.preferences if isinstance(profile.preferences, dict) else {}
        if not prefs.get("country"):
            prefs = {
                **prefs,
                "country": {
                    "name": "Pakistan",
                    "code": "pk",
                    "flag": "https://flagcdn.com/pk.svg",
                },
            }
            profile.preferences = prefs
        if not profile.country_id:
            profile.country_id = pak_id

    if leaderboard and not leaderboard.country_id:
        leaderboard.country_id = pak_id

    logger.info("Backfilled Pakistan country for Sohaib10 leaderboard/profile")
