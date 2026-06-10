from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.post("/", response_model=schemas.QuestionRead, status_code=status.HTTP_201_CREATED)
async def create_question(
    q_data: schemas.QuestionCreate,
    admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    new_q = models.Question(
        question_text=q_data.question_text,
        option_a=q_data.option_a,
        option_b=q_data.option_b,
        option_c=q_data.option_c,
        option_d=q_data.option_d,
        correct_option=q_data.correct_option,
        difficulty=q_data.difficulty,
        category=q_data.category,
        team_id=q_data.team_id,
        country_id=q_data.country_id
    )
    db.add(new_q)
    await db.commit()
    await db.refresh(new_q)
    return new_q

@router.put("/{id}", response_model=schemas.QuestionRead)
async def update_question(
    id: int = Path(..., ge=1),
    q_data: schemas.QuestionUpdate,
    admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Question).where(models.Question.id == id)
    result = await db.execute(query)
    question = result.scalars().first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    for field, value in q_data.model_dump(exclude_unset=True).items():
        setattr(question, field, value)

    await db.commit()
    await db.refresh(question)
    return question

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(
    id: int = Path(..., ge=1),
    admin: models.User = Depends(auth.get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Question).where(models.Question.id == id)
    result = await db.execute(query)
    question = result.scalars().first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    await db.delete(question)
    await db.commit()
    return None
