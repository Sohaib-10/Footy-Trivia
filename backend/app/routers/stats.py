from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Dict, List, Any
from app.database import get_db
from app import models

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/overview")
async def get_stats_overview(db: AsyncSession = Depends(get_db)):
    # 1. Total active registered players
    user_count_query = select(func.count(models.User.id)).where(models.User.is_active == True)
    user_count_result = await db.execute(user_count_query)
    user_count = user_count_result.scalar() or 0

    # 2. Total questions
    question_count_query = select(func.count(models.Question.id))
    question_count_result = await db.execute(question_count_query)
    question_count = question_count_result.scalar() or 0

    # 3. Unique categories
    category_count_query = select(func.count(func.distinct(models.Question.category)))
    category_count_result = await db.execute(category_count_query)
    category_count = category_count_result.scalar() or 0

    # 4. Top Countries from Profile registrations
    country_stats_query = (
        select(models.Country.name, models.Country.code, func.count(models.Profile.id))
        .join(models.Profile, models.Profile.country_id == models.Country.id)
        .group_by(models.Country.name, models.Country.code)
        .order_by(func.count(models.Profile.id).desc())
        .limit(5)
    )
    country_stats_result = await db.execute(country_stats_query)
    top_countries = []
    for row in country_stats_result.all():
        name, code, active_count = row
        top_countries.append({
            "name": name,
            "code": code.lower(),
            "active_count": active_count
        })

    league_counts = {
        "premier-league": user_count,
        "la-liga": user_count,
        "ucl": user_count,
        "world-cup": user_count,
    }

    return {
        "active_players": user_count,
        "total_questions": question_count,
        "total_categories": category_count,
        "total_game_modes": 4,
        "league_players": league_counts,
        "top_countries": top_countries
    }
