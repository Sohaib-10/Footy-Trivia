"""Adjust player points: extra ~70% deduction if total > 500, then round to nearest 5."""
import asyncio
from sqlalchemy.future import select

from app.database import async_session
from app import models
from app.routers.quiz import rebuild_leaderboard_ranks

THRESHOLD = 500
KEEP_RATIO = 0.30  # ~70% deducted → ~30% remains


def round_to_5(value: int) -> int:
    return int(round(value / 5) * 5)


def adjust_points(value: int, apply_extra_deduction: bool) -> int:
    if apply_extra_deduction:
        value = int(round(value * KEEP_RATIO))
    return round_to_5(value)


async def main():
    async with async_session() as session:
        lb_result = await session.execute(
            select(models.Leaderboard, models.User.username)
            .join(models.User, models.Leaderboard.user_id == models.User.id)
        )
        rows = lb_result.all()

        prog_result = await session.execute(select(models.UserProgress))
        progress_rows = prog_result.scalars().all()
        progress_by_user = {p.user_id: p for p in progress_rows}

        print(
            f"Players with total > {THRESHOLD}: extra ~70% deduction, then all points rounded to nearest 5.\n"
        )

        for entry, username in rows:
            apply_extra = entry.total_points > THRESHOLD
            old = (entry.total_points, entry.weekly_points, entry.monthly_points)

            entry.total_points = adjust_points(entry.total_points, apply_extra)
            entry.weekly_points = adjust_points(entry.weekly_points, apply_extra)
            entry.monthly_points = adjust_points(entry.monthly_points, apply_extra)

            tag = " (-70%)" if apply_extra else ""
            print(
                f"  {username}{tag}: total {old[0]} -> {entry.total_points}, "
                f"weekly {old[1]} -> {entry.weekly_points}, monthly {old[2]} -> {entry.monthly_points}"
            )

            prog = progress_by_user.get(entry.user_id)
            if prog:
                old_prog = prog.total_points
                prog.total_points = adjust_points(prog.total_points, apply_extra)
                if old_prog != prog.total_points:
                    print(f"    progress: {old_prog} -> {prog.total_points}")

        await rebuild_leaderboard_ranks(session)
        await session.commit()
        print("\nDone. Leaderboard ranks recalculated.")


if __name__ == "__main__":
    asyncio.run(main())
