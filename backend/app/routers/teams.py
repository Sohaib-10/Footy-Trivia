from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/teams", tags=["teams"])

@router.get("/", response_model=List[schemas.TeamRead])
async def list_teams(db: AsyncSession = Depends(get_db)):
    query = select(models.Team).order_by(models.Team.name.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=schemas.TeamRead)
async def get_team(id: int, db: AsyncSession = Depends(get_db)):
    query = select(models.Team).where(models.Team.id == id)
    result = await db.execute(query)
    team = result.scalars().first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team
