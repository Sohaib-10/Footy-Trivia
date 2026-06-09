import asyncio
from app.database import async_session
from app import models
from sqlalchemy.future import select
from sqlalchemy import func

async def check():
    async with async_session() as session:
        # Total users
        user_count_result = await session.execute(select(func.count(models.User.id)))
        user_count = user_count_result.scalar() or 0

        # Total questions
        question_count_result = await session.execute(select(func.count(models.Question.id)))
        question_count = question_count_result.scalar() or 0

        # Total categories
        category_count_result = await session.execute(select(func.count(func.distinct(models.Question.category))))
        category_count = category_count_result.scalar() or 0

        # Total countries
        country_count_result = await session.execute(select(func.count(models.Country.id)))
        country_count = country_count_result.scalar() or 0

        # Total teams
        team_count_result = await session.execute(select(func.count(models.Team.id)))
        team_count = team_count_result.scalar() or 0

        print(f"Users: {user_count}")
        print(f"Questions: {question_count}")
        print(f"Categories: {category_count}")
        print(f"Countries: {country_count}")
        print(f"Teams: {team_count}")

if __name__ == "__main__":
    asyncio.run(check())
