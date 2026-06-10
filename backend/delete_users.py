"""Delete users by email from the database."""
import asyncio
import os
import sys

from sqlalchemy.future import select

from app.database import async_session
from app import models


def _emails_from_env() -> list[str]:
    raw = os.environ.get("DELETE_USER_EMAILS", "").strip()
    if not raw:
        print("ERROR: set DELETE_USER_EMAILS to a comma-separated list of emails.")
        sys.exit(1)
    return [email.strip().lower() for email in raw.split(",") if email.strip()]


async def main():
    emails = _emails_from_env()
    async with async_session() as session:
        for email in emails:
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
