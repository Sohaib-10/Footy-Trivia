import asyncio
from app.database import async_session
from app import models
from sqlalchemy.future import select

async def verify_all():
    async with async_session() as session:
        result = await session.execute(select(models.User))
        users = result.scalars().all()
        for u in users:
            if not u.is_verified:
                print(f"Verifying user: {u.username} ({u.email})")
                u.is_verified = True
        await session.commit()
        print("All users updated in DB.")

if __name__ == "__main__":
    asyncio.run(verify_all())
