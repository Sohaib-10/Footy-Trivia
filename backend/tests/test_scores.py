"""Unit tests for World Cup scores endpoint logic."""
from datetime import datetime, timezone

import pytest

from app.routers.scores import STATUS_PRIORITY, get_utc_today, MODE_LABELS


def test_get_utc_today_format():
    today = get_utc_today()
    assert len(today) == 10
    datetime.strptime(today, "%Y-%m-%d")


def test_status_priority_order():
    assert STATUS_PRIORITY["IN_PLAY"] < STATUS_PRIORITY["PAUSED"]
    assert STATUS_PRIORITY["PAUSED"] < STATUS_PRIORITY["FINISHED"]
    assert STATUS_PRIORITY["FINISHED"] < STATUS_PRIORITY["SCHEDULED"]
    assert STATUS_PRIORITY["SCHEDULED"] < STATUS_PRIORITY["TIMED"]


def test_mode_labels():
    assert MODE_LABELS["today"] == "Today's Matches"
    assert MODE_LABELS["off_season"] == "World Cup 2026 Coming Soon"


def test_display_mode_today_priority():
    matches = [
        {"status": "SCHEDULED", "utcDate": "2026-06-11T18:00:00Z"},
        {"status": "IN_PLAY", "utcDate": "2026-06-11T15:00:00Z"},
        {"status": "FINISHED", "utcDate": "2026-06-11T12:00:00Z"},
    ]
    sorted_matches = sorted(matches, key=lambda m: STATUS_PRIORITY.get(m["status"], 9))
    assert sorted_matches[0]["status"] == "IN_PLAY"
    assert sorted_matches[1]["status"] == "FINISHED"
    assert sorted_matches[2]["status"] == "SCHEDULED"
