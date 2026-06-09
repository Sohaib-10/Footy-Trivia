"""Delete users by email from the database."""
import asyncio
from sqlalchemy.future import select

from app.database import async_session
from app import models

EMAILS = [
    "sohaibtauseef141@gmail.com",
    "sohaibtausif141@gmail.com",
    "nafraad83@gmail.com",
]


async def main():
    async with async_session() as session:
        for email in EMAILS:
            result = await session.execute(
                select(models.User).where(models.User.email == email)
            )
            user = result.scalars().first()
            if not user:
                print(f"NOT FOUND: {email}")
                continue
            print(f"Deleting: {email} | id={user.id} | username={user.username}")
            await session.delete(user)

        await session.commit()
        print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
