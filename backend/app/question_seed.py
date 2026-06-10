import json
import logging
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models

logger = logging.getLogger(__name__)

_SEED_PATH = Path(__file__).resolve().parent.parent / "questions_seed.json"


async def ensure_question_bank(db: AsyncSession) -> None:
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
                if not existing.source_topic and topic_value:
                    existing.source_topic = topic_value
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
