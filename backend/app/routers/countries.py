from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/countries", tags=["countries"])

@router.get("/", response_model=List[schemas.CountryRead])
async def list_countries(db: AsyncSession = Depends(get_db)):
    query = select(models.Country).order_by(models.Country.name.asc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=schemas.CountryRead)
async def get_country(id: int, db: AsyncSession = Depends(get_db)):
    query = select(models.Country).where(models.Country.id == id)
    result = await db.execute(query)
    country = result.scalars().first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country
