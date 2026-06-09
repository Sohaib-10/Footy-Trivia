"""Reduce all player points by 90%, round to nearest 5; set Sohaib10 to 2000."""
import asyncio
from sqlalchemy.future import select

from app.database import async_session
from app import models
from app.routers.quiz import rebuild_leaderboard_ranks

KEEP_RATIO = 0.10  # 90% deducted → 10% remains
SOHAIB10_USERNAME = "Sohaib10"
SOHAIB10_POINTS = 2000


def round_to_5(value: int) -> int:
    return int(round(value / 5) * 5)


def reduce_points(value: int) -> int:
    return round_to_5(max(0, int(round(value * KEEP_RATIO))))


async def main():
    async with async_session() as session:
        lb_result = await session.execute(
            select(models.Leaderboard, models.User.username)
            .join(models.User, models.Leaderboard.user_id == models.User.id)
        )
        rows = lb_result.all()

        prog_result = await session.execute(select(models.UserProgress))
        progress_by_user = {p.user_id: p for p in prog_result.scalars().all()}

        print("All players: 90% deduction, rounded to nearest 5.")
        print(f"{SOHAIB10_USERNAME} will be set to {SOHAIB10_POINTS}.\n")

        for entry, username in rows:
            old = (entry.total_points, entry.weekly_points, entry.monthly_points)
            is_sohaib = username == SOHAIB10_USERNAME

            if is_sohaib:
                entry.total_points = SOHAIB10_POINTS
                entry.weekly_points = SOHAIB10_POINTS
                entry.monthly_points = SOHAIB10_POINTS
                tag = f" (set to {SOHAIB10_POINTS})"
            else:
                entry.total_points = reduce_points(entry.total_points)
                entry.weekly_points = reduce_points(entry.weekly_points)
                entry.monthly_points = reduce_points(entry.monthly_points)
                tag = " (-90%)"

            print(
                f"  {username}{tag}: total {old[0]} -> {entry.total_points}, "
                f"weekly {old[1]} -> {entry.weekly_points}, monthly {old[2]} -> {entry.monthly_points}"
            )

            prog = progress_by_user.get(entry.user_id)
            if prog:
                old_prog = prog.total_points
                prog.total_points = SOHAIB10_POINTS if is_sohaib else reduce_points(prog.total_points)
                if old_prog != prog.total_points:
                    print(f"    progress: {old_prog} -> {prog.total_points}")

        await rebuild_leaderboard_ranks(session)
        await session.commit()
        print("\nDone. Leaderboard ranks recalculated.")


if __name__ == "__main__":
    asyncio.run(main())
