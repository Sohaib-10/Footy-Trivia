"""World Cup prediction leaderboard — separate from quiz leaderboard.

Points are awarded only when official results exist and a user's prediction is correct.
"""
import re
import unicodedata
from typing import Any, Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import auth, models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/wc", tags=["world-cup"])

POINTS = {
    "match_exact": 10,
    "match_outcome": 5,
    "award": 50,
    "third_place": 10,
    "group_position": 5,
    "bracket_match": 15,
    "champion": 100,
}


def _norm(value: Any) -> str:
    if value is None:
        return ""
    s = unicodedata.normalize("NFKD", str(value))
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]", "", s.lower())


def _match_outcome(home: int, away: int) -> str:
    if home == away:
        return "draw"
    return "home" if home > away else "away"


def _grade_match(pred: dict, result: Optional[dict]) -> tuple[int, bool, bool]:
    if not result:
        return 0, False, False
    rh, ra = result.get("homeScore"), result.get("awayScore")
    if rh is None or ra is None:
        return 0, False, False
    ph, pa = pred.get("homeScore"), pred.get("awayScore")
    if ph is None or pa is None:
        return 0, False, False
    ph, pa, rh, ra = int(ph), int(pa), int(rh), int(ra)
    if ph == rh and pa == ra:
        return POINTS["match_exact"], True, True
    if _match_outcome(ph, pa) == _match_outcome(rh, ra):
        return POINTS["match_outcome"], True, False
    return 0, False, False


def _grade_award(pred_value: Any, result_value: Any) -> tuple[int, bool]:
    if not result_value or pred_value is None:
        return 0, False
    pred_name = pred_value.get("name") if isinstance(pred_value, dict) else pred_value
    result_name = result_value.get("name") if isinstance(result_value, dict) else result_value
    if _norm(pred_name) == _norm(result_name):
        return POINTS["award"], True
    return 0, False


def _grade_third_place(pred_groups: List[str], result_groups: List[str]) -> tuple[int, int, int]:
    if not result_groups:
        return 0, 0, 0
    result_set = {_norm(g) for g in result_groups}
    correct = sum(1 for g in pred_groups if _norm(g) in result_set)
    return correct * POINTS["third_place"], correct, len(result_groups)


def _grade_groups(pred_groups: dict, result_groups: dict) -> tuple[int, int, int]:
    if not result_groups:
        return 0, 0, 0
    points = 0
    correct = 0
    graded = 0
    for group_key, result_group in result_groups.items():
        pred_group = pred_groups.get(group_key)
        if not pred_group or not result_group:
            continue
        pred_teams = pred_group.get("teams") if isinstance(pred_group, dict) else None
        result_teams = result_group.get("teams") if isinstance(result_group, dict) else None
        if not pred_teams or not result_teams:
            continue
        for idx, result_team in enumerate(result_teams[:4]):
            if idx >= len(pred_teams):
                continue
            graded += 1
            pred_name = pred_teams[idx].get("name") if isinstance(pred_teams[idx], dict) else pred_teams[idx]
            result_name = result_team.get("name") if isinstance(result_team, dict) else result_team
            if _norm(pred_name) == _norm(result_name):
                points += POINTS["group_position"]
                correct += 1
    return points, correct, graded


def _grade_bracket(pred_bracket: List[dict], result_bracket: List[dict]) -> tuple[int, int, int]:
    if not result_bracket:
        return 0, 0, 0
    points = 0
    correct = 0
    graded = 0
    for idx, result_match in enumerate(result_bracket):
        if idx >= len(pred_bracket):
            break
        result_winner = result_match.get("winner")
        if not result_winner:
            continue
        pred_match = pred_bracket[idx] or {}
        pred_winner = pred_match.get("winner")
        if not pred_winner:
            continue
        graded += 1
        result_team = result_match.get(result_winner)
        pred_team = pred_match.get(pred_winner)
        if result_team and pred_team and _norm(result_team) == _norm(pred_team):
            points += POINTS["bracket_match"]
            correct += 1
    return points, correct, graded


def _grade_champion(pred_champion: Any, result_champion: Any) -> tuple[int, bool]:
    if not result_champion or not pred_champion:
        return 0, False
    pred_name = pred_champion.get("name") if isinstance(pred_champion, dict) else pred_champion
    result_name = result_champion.get("name") if isinstance(result_champion, dict) else result_champion
    if _norm(pred_name) == _norm(result_name):
        return POINTS["champion"], True
    return 0, False


def _results_as_dict(rows: List[models.WcResult]) -> dict:
    data: dict = {
        "matches": {},
        "awards": {},
        "groups": {},
        "third_place": [],
        "bracket": [],
        "champion": None,
    }
    for row in rows:
        payload = row.result_data or {}
        key = row.result_key
        if key.startswith("match:"):
            data["matches"][key.split(":", 1)[1]] = payload
        elif key.startswith("award:"):
            data["awards"][key.split(":", 1)[1]] = payload
        elif key.startswith("group:"):
            data["groups"][key.split(":", 1)[1]] = payload
        elif key == "third_place":
            data["third_place"] = payload.get("groups", payload if isinstance(payload, list) else [])
        elif key == "bracket":
            data["bracket"] = payload.get("matches", payload if isinstance(payload, list) else [])
        elif key == "champion":
            data["champion"] = payload.get("name", payload)
    return data


def _merge_predictions(existing: dict, incoming: dict, results: dict) -> dict:
    """Merge incoming predictions but refuse changes to categories with published results."""
    merged = dict(existing) if isinstance(existing, dict) else {}
    published_matches = set((results.get("matches") or {}).keys())
    published_awards = set((results.get("awards") or {}).keys())
    published_groups = set((results.get("groups") or {}).keys())

    existing_matches = dict(merged.get("matches") or {})
    for fixture_id, pred in (incoming.get("matches") or {}).items():
        if str(fixture_id) not in published_matches:
            existing_matches[str(fixture_id)] = pred
    merged["matches"] = existing_matches

    existing_awards = dict(merged.get("awards") or {})
    for award_key, pred in (incoming.get("awards") or {}).items():
        if award_key not in published_awards:
            existing_awards[award_key] = pred
    merged["awards"] = existing_awards

    existing_groups = dict(merged.get("groups") or {})
    for group_key, pred in (incoming.get("groups") or {}).items():
        if group_key not in published_groups:
            existing_groups[group_key] = pred
    merged["groups"] = existing_groups

    if not results.get("third_place"):
        merged["third_place"] = incoming.get("third_place", merged.get("third_place") or [])

    if not results.get("bracket"):
        merged["bracket"] = incoming.get("bracket", merged.get("bracket") or [])

    if not results.get("champion"):
        if "champion" in incoming:
            merged["champion"] = incoming.get("champion")

    if "bracket_submitted" in incoming:
        merged["bracket_submitted"] = bool(incoming.get("bracket_submitted"))
    if "group_rankings_submitted" in incoming:
        merged["group_rankings_submitted"] = bool(incoming.get("group_rankings_submitted"))

    return merged


def score_predictions(predictions: dict, results: dict) -> tuple[int, int, int]:
    total_points = 0
    correct = 0
    graded = 0

    for fixture_id, pred in (predictions.get("matches") or {}).items():
        pts, is_correct, counted = _grade_match(pred, (results.get("matches") or {}).get(str(fixture_id)))
        if counted:
            graded += 1
            if is_correct:
                correct += 1
            total_points += pts

    for award_key, pred in (predictions.get("awards") or {}).items():
        pts, is_correct = _grade_award(pred, (results.get("awards") or {}).get(award_key))
        if (results.get("awards") or {}).get(award_key):
            graded += 1
            if is_correct:
                correct += 1
            total_points += pts

    tp_pts, tp_correct, tp_graded = _grade_third_place(
        predictions.get("third_place") or [],
        results.get("third_place") or [],
    )
    total_points += tp_pts
    correct += tp_correct
    graded += tp_graded

    gp_pts, gp_correct, gp_graded = _grade_groups(
        predictions.get("groups") or {},
        results.get("groups") or {},
    )
    total_points += gp_pts
    correct += gp_correct
    graded += gp_graded

    bp_pts, bp_correct, bp_graded = _grade_bracket(
        predictions.get("bracket") or [],
        results.get("bracket") or [],
    )
    total_points += bp_pts
    correct += bp_correct
    graded += bp_graded

    ch_pts, ch_correct = _grade_champion(predictions.get("champion"), results.get("champion"))
    if results.get("champion"):
        graded += 1
        if ch_correct:
            correct += 1
        total_points += ch_pts

    return total_points, correct, graded


async def rebuild_wc_ranks(db: AsyncSession) -> None:
    ranked = (
        select(
            models.WcLeaderboard.id,
            func.row_number()
            .over(order_by=models.WcLeaderboard.total_points.desc())
            .label("new_rank"),
        )
        .where(models.WcLeaderboard.total_points > 0)
        .subquery()
    )
    rows = (await db.execute(select(ranked.c.id, ranked.c.new_rank))).all()
    for row in rows:
        lb = await db.get(models.WcLeaderboard, row.id)
        if lb:
            lb.rank = int(row.new_rank)


async def _upsert_wc_leaderboard(
    db: AsyncSession,
    user_id: UUID,
    total_points: int,
    correct: int,
    graded: int,
) -> models.WcLeaderboard:
    result = await db.execute(
        select(models.WcLeaderboard).where(models.WcLeaderboard.user_id == user_id)
    )
    lb = result.scalars().first()
    if not lb:
        lb = models.WcLeaderboard(user_id=user_id)
        db.add(lb)
    lb.total_points = total_points
    lb.correct_predictions = correct
    lb.total_graded = graded
    return lb


def _accuracy(correct: int, graded: int) -> str:
    if graded > 0:
        return f"{int(round(correct / graded * 100))}%"
    return "0%"


def _tier(points: int) -> str:
    if points >= 300:
        return "Elite"
    if points >= 150:
        return "Gold"
    if points > 0:
        return "Bronze"
    return "Unranked"


@router.get("/predictions", response_model=schemas.WcPredictionsSync)
async def get_predictions(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db),
):
    pred_result = await db.execute(
        select(models.WcUserPredictions).where(models.WcUserPredictions.user_id == current_user.id)
    )
    record = pred_result.scalars().first()
    if not record or not record.data:
        return schemas.WcPredictionsSync()
    data = record.data if isinstance(record.data, dict) else {}
    return schemas.WcPredictionsSync(
        matches=data.get("matches") or {},
        awards=data.get("awards") or {},
        groups=data.get("groups") or {},
        third_place=data.get("third_place") or [],
        bracket=data.get("bracket") or [],
        champion=data.get("champion"),
        bracket_submitted=bool(data.get("bracket_submitted")),
        group_rankings_submitted=bool(data.get("group_rankings_submitted")),
    )


@router.post("/predictions/sync", response_model=schemas.WcMeRead)
async def sync_predictions(
    payload: schemas.WcPredictionsSync,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db),
):
    pred_result = await db.execute(
        select(models.WcUserPredictions).where(models.WcUserPredictions.user_id == current_user.id)
    )
    record = pred_result.scalars().first()
    incoming = payload.model_dump()
    result_rows = (await db.execute(select(models.WcResult))).scalars().all()
    results = _results_as_dict(list(result_rows))
    existing_data = record.data if record and isinstance(record.data, dict) else {}
    data = _merge_predictions(existing_data, incoming, results)
    if record:
        record.data = data
    else:
        record = models.WcUserPredictions(user_id=current_user.id, data=data)
        db.add(record)

    points, correct, graded = score_predictions(data, results)
    lb = await _upsert_wc_leaderboard(db, current_user.id, points, correct, graded)
    await rebuild_wc_ranks(db)
    await db.commit()
    await db.refresh(lb)

    return schemas.WcMeRead(
        user_id=current_user.id,
        username=current_user.username,
        total_points=lb.total_points,
        correct_predictions=lb.correct_predictions,
        total_graded=lb.total_graded,
        rank=lb.rank,
        accuracy=_accuracy(lb.correct_predictions, lb.total_graded),
        tier=_tier(lb.total_points),
    )


@router.get("/leaderboard", response_model=List[schemas.WcLeaderboardRead])
async def get_wc_leaderboard(limit: int = Query(10, ge=1, le=100), db: AsyncSession = Depends(get_db)):
    query = (
        select(models.WcLeaderboard, models.User.username)
        .join(models.User, models.WcLeaderboard.user_id == models.User.id)
        .order_by(models.WcLeaderboard.total_points.desc(), models.WcLeaderboard.updated_at.asc())
        .limit(limit)
    )
    rows = (await db.execute(query)).all()
    out: List[schemas.WcLeaderboardRead] = []
    for idx, (lb, username) in enumerate(rows):
        out.append(
            schemas.WcLeaderboardRead(
                id=lb.id,
                user_id=lb.user_id,
                username=username,
                rank=lb.rank or (idx + 1),
                total_points=lb.total_points,
                correct_predictions=lb.correct_predictions,
                total_graded=lb.total_graded,
                accuracy=_accuracy(lb.correct_predictions, lb.total_graded),
                tier=_tier(lb.total_points),
                updated_at=lb.updated_at,
            )
        )
    return out


@router.get("/me", response_model=schemas.WcMeRead)
async def get_wc_me(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(models.WcLeaderboard).where(models.WcLeaderboard.user_id == current_user.id)
    )
    lb = result.scalars().first()
    if not lb:
        return schemas.WcMeRead(
            user_id=current_user.id,
            username=current_user.username,
            total_points=0,
            correct_predictions=0,
            total_graded=0,
            rank=None,
            accuracy="0%",
            tier="Unranked",
        )
    return schemas.WcMeRead(
        user_id=current_user.id,
        username=current_user.username,
        total_points=lb.total_points,
        correct_predictions=lb.correct_predictions,
        total_graded=lb.total_graded,
        rank=lb.rank,
        accuracy=_accuracy(lb.correct_predictions, lb.total_graded),
        tier=_tier(lb.total_points),
    )


@router.post("/results", response_model=dict)
async def upsert_results(
    payload: schemas.WcResultsBulk,
    _admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    for item in payload.results:
        existing = (
            await db.execute(
                select(models.WcResult).where(models.WcResult.result_key == item.result_key)
            )
        ).scalars().first()
        if existing:
            existing.result_data = item.result_data
        else:
            db.add(models.WcResult(result_key=item.result_key, result_data=item.result_data))
    await db.commit()

    result_rows = (await db.execute(select(models.WcResult))).scalars().all()
    results = _results_as_dict(list(result_rows))
    pred_rows = (await db.execute(select(models.WcUserPredictions))).scalars().all()
    for pred_row in pred_rows:
        points, correct, graded = score_predictions(pred_row.data or {}, results)
        await _upsert_wc_leaderboard(db, pred_row.user_id, points, correct, graded)
    await rebuild_wc_ranks(db)
    await db.commit()
    return {"status": "ok", "results_updated": len(payload.results), "users_regraded": len(pred_rows)}
