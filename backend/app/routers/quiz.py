from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, func, desc
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from typing import List
from uuid import UUID
from app.database import get_db
from app import models, schemas, auth
from app.quiz_verify import make_answer_hash, new_verify_key

DIFFICULTY_POINTS = {"easy": 10, "medium": 20, "hard": 30}

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


def _utc_midnight() -> datetime:
    now = datetime.utcnow()
    return now.replace(hour=0, minute=0, second=0, microsecond=0)


@router.post("/start", response_model=schemas.QuizSessionStartResponse)
async def start_quiz(
    setup: schemas.QuizSessionStart,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if setup.challenge_type == "daily":
        today_start = _utc_midnight()
        existing_daily = await db.execute(
            select(models.QuizSession.id).where(
                models.QuizSession.user_id == current_user.id,
                models.QuizSession.challenge_type == "daily",
                models.QuizSession.started_at >= today_start,
            ).limit(1)
        )
        if existing_daily.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="You have already played today's Daily Challenge. Come back tomorrow!",
            )

    query = select(models.Question)

    if setup.topic:
        query = query.where(models.Question.source_topic == setup.topic)
    elif setup.category:
        query = query.where(models.Question.category == setup.category)

    if setup.difficulty != "mixed":
        query = query.where(models.Question.difficulty == setup.difficulty)

    query = query.order_by(func.random()).limit(setup.total_questions)

    result = await db.execute(query)
    questions = result.scalars().all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found matching the selected criteria"
        )

    verify_key = new_verify_key()
    session = models.QuizSession(
        user_id=current_user.id,
        difficulty=setup.difficulty,
        category=setup.category,
        topic=setup.topic,
        verify_key=verify_key,
        challenge_type=setup.challenge_type,
        total_questions=len(questions),
        score=0,
        is_completed=False
    )
    db.add(session)
    await db.flush()

    for idx, question in enumerate(questions):
        db.add(models.QuizSessionQuestion(
            session_id=session.id,
            question_id=question.id,
            order_index=idx,
        ))

    await db.commit()
    await db.refresh(session)

    quiz_questions = []
    for question in questions:
        base = schemas.QuestionPublicRead.model_validate(question)
        quiz_questions.append(schemas.QuestionQuizStartRead(
            **base.model_dump(),
            answer_hash=make_answer_hash(verify_key, question.id, question.correct_option),
        ))

    return schemas.QuizSessionStartResponse(
        session=session,
        verify_key=verify_key,
        questions=quiz_questions,
    )

@router.post("/answer", response_model=schemas.QuizAnswerResponse)
async def submit_answer(
    ans_data: schemas.SessionAnswerCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    answer_count_subq = (
        select(func.count(models.SessionAnswer.id))
        .where(models.SessionAnswer.session_id == ans_data.session_id)
        .scalar_subquery()
    )
    session_row = (
        await db.execute(
            select(models.QuizSession, models.Question, answer_count_subq)
            .join(
                models.QuizSessionQuestion,
                and_(
                    models.QuizSessionQuestion.session_id == models.QuizSession.id,
                    models.QuizSessionQuestion.question_id == ans_data.question_id,
                ),
            )
            .join(models.Question, models.Question.id == models.QuizSessionQuestion.question_id)
            .where(
                models.QuizSession.id == ans_data.session_id,
                models.QuizSession.user_id == current_user.id,
            )
        )
    ).first()

    if not session_row:
        raise HTTPException(status_code=404, detail="Quiz session or question not found")

    session, question, answer_count = session_row
    answer_count = answer_count or 0

    if session.is_completed:
        raise HTTPException(status_code=400, detail="Quiz session already completed")
    if answer_count >= session.total_questions:
        raise HTTPException(status_code=400, detail="All questions for this session have been answered")

    if ans_data.timed_out:
        is_correct = False
        selected_option = None
    else:
        selected_option = ans_data.selected_option.upper()
        is_correct = selected_option == question.correct_option.upper()

    points = DIFFICULTY_POINTS.get(question.difficulty.lower(), 10) if is_correct else 0
    if is_correct:
        session.score += points

    answered_at = datetime.utcnow()
    new_answer = models.SessionAnswer(
        session_id=session.id,
        question_id=question.id,
        selected_option=selected_option,
        is_correct=is_correct,
        time_taken_seconds=ans_data.time_taken_seconds,
        answered_at=answered_at,
    )
    db.add(new_answer)

    try:
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Answer already submitted for this question")

    answer_id = new_answer.id
    session_score = session.score

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Answer already submitted for this question")

    return schemas.QuizAnswerResponse(
        answer=schemas.SessionAnswerRead(
            id=answer_id,
            session_id=session.id,
            question_id=question.id,
            selected_option=selected_option,
            is_correct=is_correct,
            time_taken_seconds=ans_data.time_taken_seconds,
            answered_at=answered_at,
        ),
        correct_option=question.correct_option.upper(),
        points_earned=points,
        session_score=session_score,
    )

async def apply_session_progress(session: models.QuizSession, db: AsyncSession) -> int:
    rows = (
        await db.execute(
            select(models.SessionAnswer, models.Question)
            .join(models.Question, models.Question.id == models.SessionAnswer.question_id)
            .where(models.SessionAnswer.session_id == session.id)
            .order_by(models.SessionAnswer.answered_at)
        )
    ).all()

    progress = (
        await db.execute(
            select(models.UserProgress).where(models.UserProgress.user_id == session.user_id)
        )
    ).scalars().first()
    if not progress:
        progress = models.UserProgress(user_id=session.user_id)
        db.add(progress)

    leaderboard = (
        await db.execute(
            select(models.Leaderboard).where(models.Leaderboard.user_id == session.user_id)
        )
    ).scalars().first()
    if not leaderboard:
        leaderboard = models.Leaderboard(user_id=session.user_id)
        db.add(leaderboard)

    session_points = 0
    for answer, question in rows:
        progress.total_questions_answered += 1
        if answer.is_correct:
            pts = DIFFICULTY_POINTS.get(question.difficulty.lower(), 10)
            session_points += pts
            progress.total_correct += 1
            progress.current_streak += 1
            if progress.current_streak > progress.longest_streak:
                progress.longest_streak = progress.current_streak
        else:
            progress.total_incorrect += 1
            progress.current_streak = 0

    progress.total_points += session_points
    progress.last_played_at = datetime.utcnow()
    leaderboard.total_points = progress.total_points
    leaderboard.weekly_points += session_points
    leaderboard.monthly_points += session_points

    if not leaderboard.country_id:
        profile = (
            await db.execute(
                select(models.Profile).where(models.Profile.user_id == session.user_id)
            )
        ).scalars().first()
        if profile and profile.country_id:
            leaderboard.country_id = profile.country_id

    session.score = session_points
    return session_points


@router.post("/complete/{session_id}", response_model=schemas.QuizSessionRead)
async def complete_quiz(
    session_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.QuizSession).where(
        models.QuizSession.id == session_id,
        models.QuizSession.user_id == current_user.id
    )
    result = await db.execute(query)
    session = result.scalars().first()

    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    if session.is_completed:
        return session

    answer_count_query = select(func.count(models.SessionAnswer.id)).where(
        models.SessionAnswer.session_id == session.id
    )
    answer_count = (await db.execute(answer_count_query)).scalar() or 0
    if answer_count < session.total_questions:
        raise HTTPException(
            status_code=400,
            detail="Complete all questions before finishing the quiz",
        )

    await apply_session_progress(session, db)

    session.is_completed = True
    session.ended_at = datetime.utcnow()

    prof_query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    prof_res = await db.execute(prof_query)
    profile = prof_res.scalars().first()
    if profile:
        profile.total_quizzes_played += 1

    await db.flush()

    await rebuild_leaderboard_ranks(db)
    await check_user_achievements(current_user.id, db)

    await db.commit()
    await db.refresh(session)
    return session

@router.get("/history", response_model=List[schemas.QuizSessionRead])
async def get_quiz_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.QuizSession).where(models.QuizSession.user_id == current_user.id).order_by(desc(models.QuizSession.started_at))
    result = await db.execute(query)
    return result.scalars().all()

# Helper Functions
async def rebuild_leaderboard_ranks(db: AsyncSession):
    query = select(models.Leaderboard).order_by(desc(models.Leaderboard.total_points))
    result = await db.execute(query)
    entries = result.scalars().all()
    for idx, entry in enumerate(entries):
        entry.rank = idx + 1

async def check_user_achievements(user_id: UUID, db: AsyncSession):
    prog_query = select(models.UserProgress).where(models.UserProgress.user_id == user_id)
    prog_res = await db.execute(prog_query)
    progress = prog_res.scalars().first()
    if not progress:
        return

    prof_query = select(models.Profile).where(models.Profile.user_id == user_id)
    prof_res = await db.execute(prof_query)
    profile = prof_res.scalars().first()
    total_quizzes = profile.total_quizzes_played if profile else 0

    earned_query = select(models.UserAchievement.achievement_id).where(models.UserAchievement.user_id == user_id)
    earned_res = await db.execute(earned_query)
    earned_ids = set(earned_res.scalars().all())

    ach_query = select(models.Achievement)
    ach_res = await db.execute(ach_query)
    achievements = ach_res.scalars().all()

    for ach in achievements:
        if ach.id in earned_ids:
            continue

        unlocked = False
        if ach.condition_type == "quizzes_played":
            unlocked = total_quizzes >= ach.condition_value
        elif ach.condition_type == "correct_streak":
            unlocked = progress.longest_streak >= ach.condition_value
        elif ach.condition_type == "total_points":
            unlocked = progress.total_points >= ach.condition_value
        elif ach.condition_type == "accuracy":
            sess_query = select(models.QuizSession).where(
                models.QuizSession.user_id == user_id,
                models.QuizSession.is_completed == True
            ).order_by(desc(models.QuizSession.ended_at)).limit(1)
            sess_res = await db.execute(sess_query)
            last_session = sess_res.scalars().first()
            if last_session:
                ans_query = select(func.count(models.SessionAnswer.id)).where(
                    models.SessionAnswer.session_id == last_session.id,
                    models.SessionAnswer.is_correct == True
                )
                ans_res = await db.execute(ans_query)
                correct_count = ans_res.scalar() or 0
                if last_session.total_questions > 0:
                    accuracy = (correct_count / last_session.total_questions) * 100
                    unlocked = accuracy >= ach.condition_value
        elif ach.condition_type.startswith("category_completed_"):
            cat_name = ach.condition_type.replace("category_completed_", "")
            cat_query = select(models.QuizSession).where(
                models.QuizSession.user_id == user_id,
                models.QuizSession.category == cat_name,
                models.QuizSession.is_completed == True
            ).limit(1)
            cat_res = await db.execute(cat_query)
            unlocked = cat_res.scalars().first() is not None

        if unlocked:
            user_ach = models.UserAchievement(
                user_id=user_id,
                achievement_id=ach.id
            )
            db.add(user_ach)
