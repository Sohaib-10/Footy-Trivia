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


def test_mock_matches_goal_stability():
    from unittest.mock import patch
    import datetime as dt
    from app.routers.scores import _get_mock_matches_response
    
    # 2026-06-18 is a Thursday, the scheduled date for England vs USA in the mock matches
    fixed_now_1 = dt.datetime(2026, 6, 18, 22, 30, 0, tzinfo=dt.timezone.utc)
    
    with patch("app.routers.scores.datetime") as mock_dt:
        mock_dt.now.return_value = fixed_now_1
        mock_dt.fromisoformat = dt.datetime.fromisoformat
        
        response_1 = _get_mock_matches_response()
        
    # Find England vs USA match (id: 3)
    eng_match_1 = next(m for m in response_1["matches"] if m["id"] == 3)
    assert eng_match_1["status"] == "IN_PLAY"
    assert eng_match_1["minute"] == 30
    goals_1 = eng_match_1["goals"]
    
    # Second time: 40 minutes elapsed (minute 40)
    fixed_now_2 = dt.datetime(2026, 6, 18, 22, 40, 0, tzinfo=dt.timezone.utc)
    with patch("app.routers.scores.datetime") as mock_dt:
        mock_dt.now.return_value = fixed_now_2
        mock_dt.fromisoformat = dt.datetime.fromisoformat
        
        response_2 = _get_mock_matches_response()
        
    eng_match_2 = next(m for m in response_2["matches"] if m["id"] == 3)
    assert eng_match_2["status"] == "IN_PLAY"
    assert eng_match_2["minute"] == 40
    goals_2 = eng_match_2["goals"]
    
    # Verify goals in goals_1 remain completely identical in goals_2
    for g1 in goals_1:
        # find matching goal in goals_2 by team and scorer
        g2 = next((g for g in goals_2 if g["scorer"] == g1["scorer"] and g["team"] == g1["team"]), None)
        assert g2 is not None, f"Scorer {g1['scorer']} disappeared in subsequent poll!"
        assert g2["minute"] == g1["minute"], f"Goal minute changed from {g1['minute']} to {g2['minute']} for {g1['scorer']}!"

