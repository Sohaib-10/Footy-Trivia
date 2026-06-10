import asyncio
import json
import logging
import random
import string
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app import auth, models, schemas
from app.battle_auth import ensure_battle_participant, get_active_battle_room
from app.dependencies import RoomCodePath

logger = logging.getLogger(__name__)
from ably import AblyRest
from app.config import settings
from app.database import async_session, get_db


router = APIRouter(prefix="/api/battle", tags=["battle"])

# Initialize Ably Client
ably = None
if settings.ABLY_API_KEY:
    try:
        ably = AblyRest(settings.ABLY_API_KEY)
    except Exception as e:
        print(f"Error initializing Ably: {e}")

async def publish_to_room(room_code: str, event_data: dict):
    if ably:
        try:
            channel = ably.channels.get(f"room:{room_code}")
            await channel.publish("message", event_data)
        except Exception as e:
            print(f"Error publishing to Ably: {e}")
    else:
        print(f"Ably not initialized. Data {event_data} was not published.")


# Pydantic schemas for battle room requests
class BattleCreateRequest(schemas.QuizSessionStart):
    pass

@router.post("/create")
async def create_battle_room(
    setup: BattleCreateRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Cleanup expired rooms to keep DB clean
    await db.execute(
        delete(models.BattleRoom).where(models.BattleRoom.expires_at < datetime.utcnow())
    )
    
    # Generate unique 6-character code
    room_code = ""
    for _ in range(10):  # Try 10 times to find a unique code
        code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        code_check = await db.execute(
            select(models.BattleRoom).where(models.BattleRoom.room_code == code)
        )
        if not code_check.scalars().first():
            room_code = code
            break
            
    if not room_code:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate a unique room code. Please try again."
        )

    # Fetch random questions matching criteria
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

    # Create the battle room
    room = models.BattleRoom(
        room_code=room_code,
        host_id=current_user.id,
        status="waiting",
        total_questions=len(questions),
        difficulty=setup.difficulty,
        category=setup.category or "general",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(room)
    await db.flush() # Get room.id

    # Associate questions with room
    for idx, q in enumerate(questions):
        room_q = models.BattleRoomQuestion(
            room_id=room.id,
            question_id=q.id,
            order_index=idx
        )
        db.add(room_q)

    await db.commit()
    await db.refresh(room)

    return {
        "room_code": room_code,
        "room_id": str(room.id),
        "total_questions": room.total_questions,
        "difficulty": room.difficulty,
        "category": room.category
    }

@router.post("/join/{room_code}")
async def join_battle_room(
    room_code: RoomCodePath,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.BattleRoom).where(
        models.BattleRoom.room_code == room_code,
        models.BattleRoom.expires_at > datetime.utcnow()
    )
    result = await db.execute(query)
    room = result.scalars().first()

    if not room:
        raise HTTPException(status_code=404, detail="Battle room not found or expired")
    
    if room.status != "waiting":
        raise HTTPException(status_code=400, detail="Battle has already started or finished")

    if room.host_id == current_user.id:
        # Host re-joining
        return {
            "room_code": room_code,
            "room_id": str(room.id),
            "role": "host",
            "host_id": str(room.host_id),
            "guest_id": str(room.guest_id) if room.guest_id else None
        }

    if room.guest_id is not None and room.guest_id != current_user.id:
        raise HTTPException(status_code=400, detail="Battle room is full")

    if room.guest_id is None:
        room.guest_id = current_user.id
        # Reset expiry while players are active
        room.expires_at = datetime.utcnow() + timedelta(minutes=30)
        await db.commit()
        await db.refresh(room)
        
        # Publish PLAYER_JOINED and LOBBY_STATE to Ably channel
        host_user = (await db.execute(select(models.User).where(models.User.id == room.host_id))).scalar()
        await publish_to_room(room_code, {
            "event": "PLAYER_JOINED",
            "username": current_user.username,
            "user_id": str(current_user.id),
            "role": "guest"
        })
        await publish_to_room(room_code, {
            "event": "LOBBY_STATE",
            "host": {"username": host_user.username, "user_id": str(room.host_id), "ready": room.host_ready},
            "guest": {"username": current_user.username, "user_id": str(room.guest_id), "ready": room.guest_ready}
        })

    return {
        "room_code": room_code,
        "room_id": str(room.id),
        "role": "guest",
        "host_id": str(room.host_id),
        "guest_id": str(room.guest_id)
    }


async def _lock_battle_room(room_id: UUID, db: AsyncSession) -> Optional[models.BattleRoom]:
    result = await db.execute(
        select(models.BattleRoom).where(models.BattleRoom.id == room_id).with_for_update()
    )
    return result.scalars().first()


# Resolve the round (idempotent; safe under concurrent calls)
async def resolve_round(room_id: UUID, db: AsyncSession):
    room = await _lock_battle_room(room_id, db)
    if not room or room.status != "in_progress":
        return

    if room.question_deadline is None:
        return

    q_query = select(models.BattleRoomQuestion).where(
        models.BattleRoomQuestion.room_id == room.id,
        models.BattleRoomQuestion.order_index == room.current_question_index
    ).options(selectinload(models.BattleRoomQuestion.question))
    room_q = (await db.execute(q_query)).scalars().first()
    if not room_q:
        return

    question = room_q.question

    ans_query = select(models.BattleAnswer).where(
        models.BattleAnswer.room_id == room.id,
        models.BattleAnswer.question_id == question.id
    )
    answers = (await db.execute(ans_query)).scalars().all()
    answers_map = {ans.user_id: ans for ans in answers}

    host_ans = answers_map.get(room.host_id)
    guest_ans = answers_map.get(room.guest_id)

    if (not host_ans or not guest_ans) and room.question_deadline and datetime.utcnow() <= room.question_deadline:
        return

    if not host_ans:
        host_ans = models.BattleAnswer(
            room_id=room.id,
            user_id=room.host_id,
            question_id=question.id,
            selected_option=None,
            is_correct=False,
            time_taken_ms=30000
        )
        db.add(host_ans)
    if not guest_ans and room.guest_id:
        guest_ans = models.BattleAnswer(
            room_id=room.id,
            user_id=room.guest_id,
            question_id=question.id,
            selected_option=None,
            is_correct=False,
            time_taken_ms=30000
        )
        db.add(guest_ans)

    resolved_index = room.current_question_index
    room.question_deadline = None
    await db.flush()
    await db.refresh(host_ans)
    if guest_ans:
        await db.refresh(guest_ans)

    host_score = room.host_score
    guest_score = room.guest_score
    room_code = room.room_code
    host_id = room.host_id
    guest_id = room.guest_id
    total_questions = room.total_questions

    await db.commit()

    round_result = {
        "event": "ROUND_RESULT",
        "correct_option": question.correct_option,
        "host_score": host_score,
        "guest_score": guest_score,
        "host_answer": {
            "option": host_ans.selected_option,
            "is_correct": host_ans.is_correct,
            "time_taken_ms": host_ans.time_taken_ms
        },
        "guest_answer": {
            "option": guest_ans.selected_option if guest_ans else None,
            "is_correct": guest_ans.is_correct if guest_ans else False,
            "time_taken_ms": guest_ans.time_taken_ms if guest_ans else 30000
        },
        "next_question_delay_sec": 5
    }
    await publish_to_room(room_code, round_result)

    await asyncio.sleep(5)

    room = await _lock_battle_room(room_id, db)
    if not room or room.status == "completed":
        return
    if room.current_question_index != resolved_index:
        return

    room.current_question_index += 1
    if room.current_question_index < total_questions:
        # Move to next question
        next_q_query = select(models.BattleRoomQuestion).where(
            models.BattleRoomQuestion.room_id == room.id,
            models.BattleRoomQuestion.order_index == room.current_question_index
        ).options(selectinload(models.BattleRoomQuestion.question))
        next_q_res = await db.execute(next_q_query)
        next_room_q = next_q_res.scalars().first()
        
        if next_room_q:
            next_q = next_room_q.question
            deadline = datetime.utcnow() + timedelta(seconds=30)
            room.question_deadline = deadline

            next_question_payload = {
                "event": "NEXT_QUESTION",
                "question": {
                    "id": next_q.id,
                    "question_text": next_q.question_text,
                    "option_a": next_q.option_a,
                    "option_b": next_q.option_b,
                    "option_c": next_q.option_c,
                    "option_d": next_q.option_d,
                    "difficulty": next_q.difficulty,
                    "category": next_q.category
                },
                "question_no": room.current_question_index + 1,
                "server_time": int(datetime.utcnow().timestamp() * 1000),
                "answer_deadline": int(deadline.timestamp() * 1000)
            }
            await publish_to_room(room_code, next_question_payload)
            await db.commit()
    else:
        if room.status == "completed":
            return

        room.status = "completed"
        room.ended_at = datetime.utcnow()

        winner_id = None
        if room.host_score > room.guest_score:
            winner_id = host_id
        elif room.guest_score > room.host_score:
            winner_id = guest_id
        else:
            # Tiebreaker: Check who answered faster across correct answers
            host_correct_times = select(func.sum(models.BattleAnswer.time_taken_ms)).where(
                models.BattleAnswer.room_id == room.id,
                models.BattleAnswer.user_id == host_id,
                models.BattleAnswer.is_correct == True
            )
            guest_correct_times = select(func.sum(models.BattleAnswer.time_taken_ms)).where(
                models.BattleAnswer.room_id == room.id,
                models.BattleAnswer.user_id == guest_id,
                models.BattleAnswer.is_correct == True
            )

            host_sum = (await db.execute(host_correct_times)).scalar() or 999999
            guest_sum = (await db.execute(guest_correct_times)).scalar() or 999999

            if host_sum < guest_sum:
                winner_id = host_id
            elif guest_sum < host_sum:
                winner_id = guest_id

        room.winner_id = winner_id
        await db.flush()

        for player_id, score in [(host_id, room.host_score), (guest_id, room.guest_score)]:
            if not player_id:
                continue
            prog_query = select(models.UserProgress).where(models.UserProgress.user_id == player_id)
            prog_result = await db.execute(prog_query)
            progress = prog_result.scalars().first()
            if not progress:
                progress = models.UserProgress(user_id=player_id)
                db.add(progress)

            # Fetch correct answers count in this room for this player
            ans_count_query = select(func.count(models.BattleAnswer.id)).where(
                models.BattleAnswer.room_id == room.id,
                models.BattleAnswer.user_id == player_id,
                models.BattleAnswer.is_correct == True
            )
            correct_count = (await db.execute(ans_count_query)).scalar() or 0
            incorrect_count = room.total_questions - correct_count

            progress.total_questions_answered += room.total_questions
            progress.total_correct += correct_count
            progress.total_incorrect += incorrect_count
            
            # Winner gets +50 bonus points, loser gets +10 points
            battle_bonus = 50 if player_id == winner_id else (10 if winner_id is not None else 25) # 25 for tie
            total_earned = score + battle_bonus
            progress.total_points += total_earned
            progress.last_played_at = datetime.utcnow()

            # Update leaderboard
            lb_query = select(models.Leaderboard).where(models.Leaderboard.user_id == player_id)
            lb_res = await db.execute(lb_query)
            leaderboard = lb_res.scalars().first()
            if not leaderboard:
                leaderboard = models.Leaderboard(user_id=player_id)
                db.add(leaderboard)
            leaderboard.total_points = progress.total_points
            leaderboard.weekly_points += total_earned
            leaderboard.monthly_points += total_earned

            # Increment profile quizzes played
            prof_query = select(models.Profile).where(models.Profile.user_id == player_id)
            prof_res = await db.execute(prof_query)
            profile = prof_res.scalars().first()
            if profile:
                profile.total_quizzes_played += 1

        await db.commit()

        # Fetch usernames
        host_user = (await db.execute(select(models.User).where(models.User.id == host_id))).scalar()
        guest_user = (await db.execute(select(models.User).where(models.User.id == guest_id))).scalar() if guest_id else None

        winner_username = None
        if winner_id == host_id:
            winner_username = host_user.username if host_user else None
        elif winner_id == guest_id and guest_user:
            winner_username = guest_user.username

        game_over_payload = {
            "event": "GAME_OVER",
            "winner_id": str(winner_id) if winner_id else None,
            "winner_username": winner_username,
            "host_score": room.host_score,
            "guest_score": room.guest_score,
            "host_username": host_user.username if host_user else "Host",
            "guest_username": guest_user.username if guest_user else "Guest"
        }
        await publish_to_room(room_code, game_over_payload)


# Ably Token Authentication endpoint
@router.get("/token")
async def get_ably_token(
    room_code: RoomCodePath,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not ably:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ably is not configured on the backend.")
    room = await get_active_battle_room(room_code, db)
    ensure_battle_participant(room, current_user.id)
    try:
        token_params = {
            "clientId": str(current_user.id),
            "capability": {
                f"room:{room_code}": ["subscribe", "presence"]
            }
        }
        token_request = await ably.auth.create_token_request(token_params)
        return token_request
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to create Ably token for room %s", room_code)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create realtime token")


# Get room state endpoint
@router.get("/room/{room_code}/state")
async def get_room_state(
    room_code: RoomCodePath,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.BattleRoom).where(
        models.BattleRoom.room_code == room_code,
        models.BattleRoom.expires_at > datetime.utcnow()
    )
    result = await db.execute(query)
    room = result.scalars().first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or expired")
    ensure_battle_participant(room, current_user.id)

    # Load users
    host_user = (await db.execute(select(models.User).where(models.User.id == room.host_id))).scalar()
    guest_user = None
    if room.guest_id:
        guest_user = (await db.execute(select(models.User).where(models.User.id == room.guest_id))).scalar()
    
    # Check if in progress
    if room.status == "in_progress":
        # Fetch current question
        q_query = select(models.BattleRoomQuestion).where(
            models.BattleRoomQuestion.room_id == room.id,
            models.BattleRoomQuestion.order_index == room.current_question_index
        ).options(selectinload(models.BattleRoomQuestion.question))
        room_q = (await db.execute(q_query)).scalars().first()
        if room_q:
            q = room_q.question
            server_time = int(datetime.utcnow().timestamp() * 1000)
            deadline_ms = int(room.question_deadline.timestamp() * 1000) if room.question_deadline else 0
            
            return {
                "status": room.status,
                "question": {
                    "id": q.id,
                    "question_text": q.question_text,
                    "option_a": q.option_a,
                    "option_b": q.option_b,
                    "option_c": q.option_c,
                    "option_d": q.option_d,
                    "difficulty": q.difficulty,
                    "category": q.category
                },
                "question_no": room.current_question_index + 1,
                "total_questions": room.total_questions,
                "host_score": room.host_score,
                "guest_score": room.guest_score,
                "server_time": server_time,
                "answer_deadline": deadline_ms
            }
            
    return {
        "status": room.status,
        "host": {
            "username": host_user.username,
            "user_id": str(room.host_id),
            "ready": room.host_ready
        },
        "guest": {
            "username": guest_user.username if guest_user else None,
            "user_id": str(room.guest_id) if room.guest_id else None,
            "ready": room.guest_ready
        }
    }


# Toggle player ready status endpoint
@router.post("/room/{room_code}/ready")
async def toggle_ready(
    room_code: RoomCodePath,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.BattleRoom).where(
        models.BattleRoom.room_code == room_code,
        models.BattleRoom.expires_at > datetime.utcnow()
    )
    result = await db.execute(query)
    room = result.scalars().first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or expired")
    
    if current_user.id == room.host_id:
        room.host_ready = not room.host_ready
        new_ready = room.host_ready
    elif current_user.id == room.guest_id:
        room.guest_ready = not room.guest_ready
        new_ready = room.guest_ready
    else:
        raise HTTPException(status_code=403, detail="Not a player in this room")
    
    await db.commit()
    
    # Publish PLAYER_READY to Ably channel
    await publish_to_room(room_code, {
        "event": "PLAYER_READY",
        "user_id": str(current_user.id),
        "username": current_user.username,
        "ready": new_ready
    })
    
    # Also publish LOBBY_STATE to Ably channel
    host_user = (await db.execute(select(models.User).where(models.User.id == room.host_id))).scalar()
    guest_user = None
    if room.guest_id:
        guest_user = (await db.execute(select(models.User).where(models.User.id == room.guest_id))).scalar()
        
    await publish_to_room(room_code, {
        "event": "LOBBY_STATE",
        "host": {"username": host_user.username, "user_id": str(room.host_id), "ready": room.host_ready},
        "guest": {"username": guest_user.username if guest_user else None, "user_id": str(room.guest_id) if room.guest_id else None, "ready": room.guest_ready}
    })
    
    return {"status": "ok", "ready": new_ready}


# Start battle endpoint
@router.post("/room/{room_code}/start")
async def start_battle(
    room_code: RoomCodePath,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.BattleRoom).where(
        models.BattleRoom.room_code == room_code,
        models.BattleRoom.expires_at > datetime.utcnow()
    )
    result = await db.execute(query)
    room = result.scalars().first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or expired")
    
    if current_user.id != room.host_id:
        raise HTTPException(status_code=403, detail="Only host can start the battle")
    
    if room.status != "waiting":
        raise HTTPException(status_code=400, detail="Battle has already started")
    
    if not room.guest_id:
        raise HTTPException(status_code=400, detail="Waiting for guest to join")
    
    if not room.host_ready or not room.guest_ready:
        raise HTTPException(status_code=400, detail="Both players must be ready")
    
    room.status = "in_progress"
    room.started_at = datetime.utcnow()
    
    # Fetch first question
    q_query = select(models.BattleRoomQuestion).where(
        models.BattleRoomQuestion.room_id == room.id,
        models.BattleRoomQuestion.order_index == 0
    ).options(selectinload(models.BattleRoomQuestion.question))
    room_q = (await db.execute(q_query)).scalars().first()
    
    if not room_q:
        raise HTTPException(status_code=500, detail="No questions associated with this room")
    
    q = room_q.question
    deadline = datetime.utcnow() + timedelta(seconds=30)
    room.question_deadline = deadline
    
    await db.commit()
    
    # Publish GAME_START to Ably channel
    await publish_to_room(room_code, {
        "event": "GAME_START",
        "question": {
            "id": q.id,
            "question_text": q.question_text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "difficulty": q.difficulty,
            "category": q.category
        },
        "question_no": 1,
        "total_questions": room.total_questions,
        "server_time": int(datetime.utcnow().timestamp() * 1000),
        "answer_deadline": int(deadline.timestamp() * 1000)
    })
    
    return {"status": "ok"}


# Submit Answer endpoint
@router.post("/room/{room_code}/answer")
async def submit_answer(
    room_code: RoomCodePath,
    payload: schemas.BattleAnswerPayload,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.BattleRoom).where(
        models.BattleRoom.room_code == room_code,
        models.BattleRoom.expires_at > datetime.utcnow()
    )
    result = await db.execute(query)
    room = result.scalars().first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or expired")
    
    if room.status != "in_progress":
        raise HTTPException(status_code=400, detail="Battle is not currently in progress")
    
    if current_user.id != room.host_id and current_user.id != room.guest_id:
        raise HTTPException(status_code=403, detail="Not a player in this room")
    
    # Fetch current question
    q_query = select(models.BattleRoomQuestion).where(
        models.BattleRoomQuestion.room_id == room.id,
        models.BattleRoomQuestion.order_index == room.current_question_index
    ).options(selectinload(models.BattleRoomQuestion.question))
    room_q = (await db.execute(q_query)).scalars().first()
    if not room_q:
        raise HTTPException(status_code=500, detail="Current question not found")
    
    question = room_q.question
    
    # Check if answer already exists
    ans_check = (await db.execute(
        select(models.BattleAnswer).where(
            models.BattleAnswer.room_id == room.id,
            models.BattleAnswer.user_id == current_user.id,
            models.BattleAnswer.question_id == question.id
        )
    )).scalars().first()
    
    if ans_check:
        return {"status": "already_submitted"}
    
    option = payload.option
    time_taken_ms = payload.time_taken_ms
    if room.question_deadline:
        question_started = room.question_deadline - timedelta(seconds=30)
        server_elapsed_ms = max(0, int((datetime.utcnow() - question_started).total_seconds() * 1000))
        time_taken_ms = min(time_taken_ms, server_elapsed_ms, 30_000)
        if datetime.utcnow() > room.question_deadline:
            time_taken_ms = 30_000

    is_correct = (option == question.correct_option)
    pts = 0
    if is_correct:
        pts = 10
        if time_taken_ms < 5000:
            pts += 5
        elif time_taken_ms < 10000:
            pts += 3
        elif time_taken_ms < 20000:
            pts += 1
            
    if current_user.id == room.host_id:
        room.host_score += pts
    else:
        room.guest_score += pts
        
    answer = models.BattleAnswer(
        room_id=room.id,
        user_id=current_user.id,
        question_id=question.id,
        selected_option=option,
        is_correct=is_correct,
        time_taken_ms=time_taken_ms
    )
    db.add(answer)
    await db.commit()
    
    # Tell the opponent that player has locked in
    opponent_id = room.guest_id if current_user.id == room.host_id else room.host_id
    if opponent_id:
        await publish_to_room(room_code, {
            "event": "OPPONENT_ANSWERED"
        })
    
    # Check if both have answered now
    all_answers_query = select(models.BattleAnswer).where(
        models.BattleAnswer.room_id == room.id,
        models.BattleAnswer.question_id == question.id
    )
    all_answers = (await db.execute(all_answers_query)).scalars().all()
    
    # If both players have answered, resolve the round
    if len(all_answers) >= 2:
        await resolve_round(room.id, db)
    elif room.question_deadline and datetime.utcnow() > room.question_deadline:
        await resolve_round(room.id, db)
        
    return {"status": "ok"}

