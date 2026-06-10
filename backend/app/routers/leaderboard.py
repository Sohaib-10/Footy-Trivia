from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, or_
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from app.database import get_db
from app import models, schemas, auth
from app.dependencies import CountryCodePath, LeaderboardPeriodQuery
from app.cookie_auth import ACCESS_TOKEN_COOKIE

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

# Optional auth: identifies the caller via JWT when present, but still allows
# guests (no/invalid token) to view the top 10 without a 401.
_optional_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_optional_user(
    request: Request,
    token: Optional[str] = Depends(_optional_oauth2),
    db: AsyncSession = Depends(get_db),
) -> Optional[models.User]:
    access_token = token or request.cookies.get(ACCESS_TOKEN_COOKIE)
    if not access_token:
        return None
    try:
        payload = auth.decode_token(access_token, expected_type="access")
        user_id = UUID(payload.get("sub"))
    except Exception:
        return None
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if user is None or not user.is_active or not user.is_verified:
        return None
    try:
        await auth.validate_user_session(user, payload, db)
    except HTTPException:
        return None
    auth.touch_user_activity(user)
    return user


class RankedLeaderboardResponse(BaseModel):
    entries: List[schemas.LeaderboardRead]
    current_user: Optional[schemas.LeaderboardRead] = None


# Score column used to rank each period. There is no dedicated daily column, so
# "daily" falls back to weekly points (matching prior behavior).
_PERIOD_SCORE_COLUMNS = {
    "daily": models.Leaderboard.weekly_points,
    "weekly": models.Leaderboard.weekly_points,
    "monthly": models.Leaderboard.monthly_points,
    "all_time": models.Leaderboard.total_points,
}


def _accuracy(correct: Optional[int], total: Optional[int]) -> str:
    if total and total > 0:
        return f"{int(round((correct or 0) / total * 100))}%"
    return "0%"


@router.get("/ranked", response_model=RankedLeaderboardResponse)
async def get_ranked_leaderboard(
    period: LeaderboardPeriodQuery = "all_time",
    current_user: Optional[models.User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the top 10 ranked entries plus the calling user's own entry.

    Ranks are computed dynamically with ROW_NUMBER() OVER (ORDER BY score DESC)
    so they reflect the requested period (daily, weekly, monthly, all_time).
    A single query fetches the top 10 and the caller's row (even if outside it).
    """
    score_col = _PERIOD_SCORE_COLUMNS.get(period)
    if score_col is None:
        raise HTTPException(status_code=400, detail="Invalid period")

    computed_rank = func.row_number().over(order_by=score_col.desc()).label("computed_rank")
    ranked = (
        select(
            models.Leaderboard.id.label("id"),
            models.Leaderboard.user_id.label("user_id"),
            models.User.username.label("username"),
            models.Leaderboard.total_points.label("total_points"),
            models.Leaderboard.weekly_points.label("weekly_points"),
            models.Leaderboard.monthly_points.label("monthly_points"),
            models.Leaderboard.country_id.label("country_id"),
            models.Leaderboard.updated_at.label("updated_at"),
            models.UserProgress.total_correct.label("total_correct"),
            models.UserProgress.total_questions_answered.label("total_questions"),
            computed_rank,
        )
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .subquery()
    )

    conditions = [ranked.c.computed_rank <= 10]
    if current_user is not None:
        conditions.append(ranked.c.user_id == current_user.id)

    query = select(ranked).where(or_(*conditions)).order_by(ranked.c.computed_rank)
    result = await db.execute(query)
    rows = result.all()

    def _to_read(row) -> schemas.LeaderboardRead:
        return schemas.LeaderboardRead(
            id=row.id,
            user_id=row.user_id,
            username=row.username,
            rank=int(row.computed_rank),
            total_points=row.total_points,
            weekly_points=row.weekly_points,
            monthly_points=row.monthly_points,
            country_id=row.country_id,
            updated_at=row.updated_at,
            accuracy=_accuracy(row.total_correct, row.total_questions),
        )

    entries = [_to_read(r) for r in rows if int(r.computed_rank) <= 10]
    current = None
    if current_user is not None:
        for r in rows:
            if r.user_id == current_user.id:
                current = _to_read(r)
                break

    return RankedLeaderboardResponse(entries=entries, current_user=current)

@router.get("/global", response_model=List[schemas.LeaderboardRead])
async def get_global_leaderboard(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0, le=10_000),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .order_by(models.Leaderboard.rank.asc(), models.Leaderboard.total_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for row in result.all():
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/country/{code}", response_model=List[schemas.LeaderboardRead])
async def get_country_leaderboard(
    code: CountryCodePath,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0, le=10_000),
    db: AsyncSession = Depends(get_db),
):
    # Find country by code
    country_query = select(models.Country).where(models.Country.code == code.upper())
    country_result = await db.execute(country_query)
    country = country_result.scalars().first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")

    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .where(models.Leaderboard.country_id == country.id)
        .order_by(models.Leaderboard.total_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for idx, row in enumerate(result.all()):
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        # Locally rank country-specific results
        lb_read.rank = offset + idx + 1
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/weekly", response_model=List[schemas.LeaderboardRead])
async def get_weekly_leaderboard(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0, le=10_000),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .order_by(models.Leaderboard.weekly_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for idx, row in enumerate(result.all()):
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        lb_read.rank = offset + idx + 1
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/monthly", response_model=List[schemas.LeaderboardRead])
async def get_monthly_leaderboard(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0, le=10_000),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .order_by(models.Leaderboard.monthly_points.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    leaderboard_data = []
    for idx, row in enumerate(result.all()):
        lb, username, correct, total = row
        lb_read = schemas.LeaderboardRead.model_validate(lb)
        lb_read.username = username
        lb_read.rank = offset + idx + 1
        if total and total > 0:
            lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
        else:
            lb_read.accuracy = "0%"
        leaderboard_data.append(lb_read)
    return leaderboard_data

@router.get("/me/rank", response_model=schemas.LeaderboardRead)
async def get_my_rank(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    query = (
        select(models.Leaderboard, models.User.username, models.UserProgress.total_correct, models.UserProgress.total_questions_answered)
        .select_from(models.Leaderboard)
        .join(models.User, models.Leaderboard.user_id == models.User.id)
        .outerjoin(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .where(models.Leaderboard.user_id == current_user.id)
    )
    result = await db.execute(query)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Leaderboard details not found")
    lb, username, correct, total = row
    lb_read = schemas.LeaderboardRead.model_validate(lb)
    lb_read.username = username
    if total and total > 0:
        lb_read.accuracy = f"{int(round((correct / total) * 100))}%"
    else:
        lb_read.accuracy = "0%"
    return lb_read
