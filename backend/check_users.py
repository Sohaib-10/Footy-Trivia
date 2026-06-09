import asyncio
from app.database import async_session
from app import models
from sqlalchemy.future import select

async def check_users():
    async with async_session() as session:
        result = await session.execute(select(models.User))
        users = result.scalars().all()
        print(f"Total users: {len(users)}")
        for u in users:
            print(f"ID: {u.id}, Username: '{u.username}', Email: '{u.email}', Verified: {u.is_verified}, Active: {u.is_active}")

if __name__ == "__main__":
    asyncio.run(check_users())
