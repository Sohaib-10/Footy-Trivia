from typing import Annotated

from fastapi import Depends, Path, Query

from app.validation import (
    sanitize_country_code,
    sanitize_login_id,
    sanitize_room_code,
    sanitize_username,
)


def valid_room_code(room_code: str = Path(...)) -> str:
    return sanitize_room_code(room_code)


def valid_username(username: str = Path(...)) -> str:
    return sanitize_username(username)


def valid_country_code(code: str = Path(...)) -> str:
    return sanitize_country_code(code)


def bounded_limit(
    limit: int = Query(10, ge=1, le=100),
) -> int:
    return limit


def bounded_offset(
    offset: int = Query(0, ge=0, le=10_000),
) -> int:
    return offset


def valid_leaderboard_period(
    period: str = Query("all_time", pattern=r"^(daily|weekly|monthly|all_time)$"),
) -> str:
    return period


RoomCodePath = Annotated[str, Depends(valid_room_code)]
UsernamePath = Annotated[str, Depends(valid_username)]
CountryCodePath = Annotated[str, Depends(valid_country_code)]
LimitQuery = Annotated[int, Depends(bounded_limit)]
OffsetQuery = Annotated[int, Depends(bounded_offset)]
LeaderboardPeriodQuery = Annotated[str, Depends(valid_leaderboard_period)]
