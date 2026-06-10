from __future__ import annotations

import math
from typing import Optional

MODE_TIMER = {
    "solo": 15,
    "blitz": 8,
    "hardcore": 10,
    "ranked": 12,
    "daily": 15,
}

MODE_MULTIPLIER = {
    "solo": 1.0,
    "blitz": 2.0,
    "hardcore": 1.0,
    "ranked": 1.5,
    "daily": 1.25,
}

DIFFICULTY_BASE = {
    "easy": 80,
    "medium": 120,
    "hard": 160,
    "legendary": 200,
    "mixed": 100,
}

MIN_CORRECT_POINTS = 30
SPEED_BONUS_PER_SECOND = 8


def timer_for_mode(mode: Optional[str]) -> int:
    return MODE_TIMER.get((mode or "solo").lower(), 15)


def calc_quiz_points(
    *,
    difficulty: str,
    time_taken_seconds: Optional[int],
    mode: Optional[str],
    streak: int = 1,
    hint_penalty: float = 1.0,
    timed_out: bool = False,
    is_correct: bool = True,
) -> int:
    if timed_out or not is_correct:
        return 0

    play_mode = (mode or "solo").lower()
    timer_max = timer_for_mode(play_mode)
    taken = timer_max if time_taken_seconds is None else max(0, min(timer_max, time_taken_seconds))
    time_left = max(0, timer_max - taken)

    base = DIFFICULTY_BASE.get((difficulty or "mixed").lower(), DIFFICULTY_BASE["mixed"])
    speed_bonus = time_left * SPEED_BONUS_PER_SECOND
    points = math.floor((base + speed_bonus) * max(0.1, hint_penalty))

    if streak >= 3:
        points = math.floor(points * 1.2)

    points = math.floor(points * MODE_MULTIPLIER.get(play_mode, 1.0))
    return max(MIN_CORRECT_POINTS, points)
