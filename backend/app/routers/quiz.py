from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc
from datetime import datetime
from typing import List
from uuid import UUID
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

@router.post("/start", response_model=schemas.QuizSessionStartResponse)
async def start_quiz(
    setup: schemas.QuizSessionStart,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Select random questions matching criteria
    query = select(models.Question)
    
    if setup.difficulty != "mixed":
        query = query.where(models.Question.difficulty == setup.difficulty)
    if setup.category:
        query = query.where(models.Question.category == setup.category)
        
    query = query.order_by(func.random()).limit(setup.total_questions)
    
    result = await db.execute(query)
    questions = result.scalars().all()
    
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found matching the selected criteria"
        )
        
    # Create quiz session
    session = models.QuizSession(
        user_id=current_user.id,
        difficulty=setup.difficulty,
        category=setup.category,
        total_questions=len(questions),
        score=0,
        is_completed=False
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    return {
        "session": session,
        "questions": questions
    }

@router.post("/answer", response_model=schemas.SessionAnswerRead)
async def submit_answer(
    ans_data: schemas.SessionAnswerCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch quiz session
    session_query = select(models.QuizSession).where(
        models.QuizSession.id == ans_data.session_id,
        models.QuizSession.user_id == current_user.id
    )
    session_result = await db.execute(session_query)
    session = session_result.scalars().first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    if session.is_completed:
        raise HTTPException(status_code=400, detail="Quiz session already completed")
        
    # Fetch question to check correct option
    q_query = select(models.Question).where(models.Question.id == ans_data.question_id)
    q_result = await db.execute(q_query)
    question = q_result.scalars().first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    # Check if answer already submitted for this question in this session
    ans_check_query = select(models.SessionAnswer).where(
        models.SessionAnswer.session_id == session.id,
        models.SessionAnswer.question_id == question.id
    )
    ans_check_res = await db.execute(ans_check_query)
    if ans_check_res.scalars().first():
        raise HTTPException(status_code=400, detail="Answer already submitted for this question")

    # Grade answer
    is_correct = (ans_data.selected_option.upper() == question.correct_option.upper())
    
    # Calculate points
    points = 0
    if is_correct:
        difficulty_multipliers = {"easy": 10, "medium": 20, "hard": 30}
        points = difficulty_multipliers.get(question.difficulty.lower(), 10)
        session.score += points

    # Save SessionAnswer
    new_answer = models.SessionAnswer(
        session_id=session.id,
        question_id=question.id,
        selected_option=ans_data.selected_option,
        is_correct=is_correct,
        time_taken_seconds=ans_data.time_taken_seconds
    )
    db.add(new_answer)

    # Update User Progress
    prog_query = select(models.UserProgress).where(models.UserProgress.user_id == current_user.id)
    prog_result = await db.execute(prog_query)
    progress = prog_result.scalars().first()
    if not progress:
        progress = models.UserProgress(user_id=current_user.id)
        db.add(progress)

    progress.total_questions_answered += 1
    if is_correct:
        progress.total_correct += 1
        progress.current_streak += 1
        if progress.current_streak > progress.longest_streak:
            progress.longest_streak = progress.current_streak
        progress.total_points += points
    else:
        progress.total_incorrect += 1
        progress.current_streak = 0
        
    progress.last_played_at = datetime.utcnow()

    # Update Leaderboard points
    lb_query = select(models.Leaderboard).where(models.Leaderboard.user_id == current_user.id)
    lb_result = await db.execute(lb_query)
    leaderboard = lb_result.scalars().first()
    if not leaderboard:
        leaderboard = models.Leaderboard(user_id=current_user.id)
        db.add(leaderboard)
        
    leaderboard.total_points = progress.total_points
    leaderboard.weekly_points += points
    leaderboard.monthly_points += points

    # Link country to leaderboard if user profile has a country set
    profile_query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    profile_result = await db.execute(profile_query)
    profile = profile_result.scalars().first()
    if profile and profile.country_id:
        leaderboard.country_id = profile.country_id

    await db.commit()
    await db.refresh(new_answer)
    return new_answer

@router.post("/complete/{session_id}", response_model=schemas.QuizSessionRead)
async def complete_quiz(
    session_id: UUID,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch quiz session
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

    # Mark completed
    session.is_completed = True
    session.ended_at = datetime.utcnow()

    # Update total quizzes in profile
    prof_query = select(models.Profile).where(models.Profile.user_id == current_user.id)
    prof_res = await db.execute(prof_query)
    profile = prof_res.scalars().first()
    if profile:
        profile.total_quizzes_played += 1

    await db.flush()

    # Trigger Global Leaderboard Rank Recalculation
    await rebuild_leaderboard_ranks(db)

    # Trigger Achievement Check
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
    # Get all entries ordered by points desc
    query = select(models.Leaderboard).order_by(desc(models.Leaderboard.total_points))
    result = await db.execute(query)
    entries = result.scalars().all()
    for idx, entry in enumerate(entries):
        entry.rank = idx + 1

async def check_user_achievements(user_id: UUID, db: AsyncSession):
    # Fetch user progress
    prog_query = select(models.UserProgress).where(models.UserProgress.user_id == user_id)
    prog_res = await db.execute(prog_query)
    progress = prog_res.scalars().first()
    if not progress:
        return

    # Fetch user profiles
    prof_query = select(models.Profile).where(models.Profile.user_id == user_id)
    prof_res = await db.execute(prof_query)
    profile = prof_res.scalars().first()
    total_quizzes = profile.total_quizzes_played if profile else 0

    # Fetch already earned achievement IDs
    earned_query = select(models.UserAchievement.achievement_id).where(models.UserAchievement.user_id == user_id)
    earned_res = await db.execute(earned_query)
    earned_ids = set(earned_res.scalars().all())

    # Fetch all achievements
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
            # Find last completed session accuracy
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
            # Check if user has completed a session in this category
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
