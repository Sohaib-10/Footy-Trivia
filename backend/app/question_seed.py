import json
import logging
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models

logger = logging.getLogger(__name__)

_SEED_PATH = Path(__file__).resolve().parent.parent / "questions_seed.json"

# Fix known bad rows already stored in production (matched by old question_text).
_QUESTION_CORRECTIONS = [
    {
        "match": "Who scored a famous overhead kick for Real Madrid in the 2014 Champions League final?",
        "question_text": "Who scored a famous overhead kick for Real Madrid in the 2018 Champions League final?",
        "correct_option": "B",
    },
    {
        "match": "Which player scored a hat-trick against Liverpool in the 2018 final?",
        "question_text": "Which player scored twice as a substitute for Real Madrid in the 2018 Champions League final?",
        "correct_option": "B",
    },
    {
        "match": "Who is the only player to score in three Champions League finals for the same club?",
        "question_text": "Who scored in the 2014, 2018, and 2022 Champions League finals for Real Madrid?",
        "correct_option": "B",
    },
    {
        "match": "Who is the youngest Champions League goalscorer?",
        "correct_option": "D",
    },
]


async def _apply_question_corrections(db: AsyncSession) -> int:
    fixed = 0
    for patch in _QUESTION_CORRECTIONS:
        match_text = patch.get("match")
        if not match_text:
            continue
        existing = (
            await db.execute(
                select(models.Question).where(models.Question.question_text == match_text)
            )
        ).scalars().first()
        if not existing:
            continue
        if patch.get("question_text"):
            existing.question_text = patch["question_text"]
        if patch.get("correct_option"):
            existing.correct_option = str(patch["correct_option"]).upper()[:1]
        fixed += 1
    if fixed:
        await db.flush()
    return fixed


async def ensure_question_bank(db: AsyncSession) -> None:
    corrected = await _apply_question_corrections(db)
    if corrected:
        logger.info("Quiz question bank: corrected %s known bad questions", corrected)

    if not _SEED_PATH.exists():
        logger.warning("questions_seed.json not found; skipping question bank seed")
        return

    try:
        payload = json.loads(_SEED_PATH.read_text(encoding="utf-8"))
    except Exception:
        logger.exception("Failed to read questions_seed.json")
        return

    if not isinstance(payload, dict):
        return

    inserted = 0
    updated = 0

    for topic, items in payload.items():
        if not isinstance(items, list):
            continue
        for item in items:
            text = (item.get("question_text") or "").strip()
            if not text:
                continue
            existing = (
                await db.execute(
                    select(models.Question).where(models.Question.question_text == text)
                )
            ).scalars().first()
            topic_value = item.get("source_topic") or topic
            if existing:
                changed = False
                if not existing.source_topic and topic_value:
                    existing.source_topic = topic_value
                    changed = True
                seed_correct = str(item.get("correct_option", existing.correct_option)).upper()[:1]
                if seed_correct and existing.correct_option != seed_correct:
                    existing.correct_option = seed_correct
                    changed = True
                if changed:
                    updated += 1
                continue
            db.add(models.Question(
                question_text=text,
                option_a=item.get("option_a", ""),
                option_b=item.get("option_b", ""),
                option_c=item.get("option_c", ""),
                option_d=item.get("option_d", ""),
                correct_option=str(item.get("correct_option", "A")).upper()[:1],
                difficulty=item.get("difficulty", "medium"),
                category=item.get("category", "general"),
                source_topic=topic_value,
            ))
            inserted += 1

    if inserted or updated:
        await db.flush()
        logger.info("Quiz question bank: inserted %s, updated %s", inserted, updated)
