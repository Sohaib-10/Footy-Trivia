from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models


async def get_active_battle_room(
    room_code: str,
    db: AsyncSession,
) -> models.BattleRoom:
    from datetime import datetime

    result = await db.execute(
        select(models.BattleRoom).where(
            models.BattleRoom.room_code == room_code,
            models.BattleRoom.expires_at > datetime.utcnow(),
        )
    )
    room = result.scalars().first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found or expired")
    return room


def ensure_battle_participant(room: models.BattleRoom, user_id: UUID) -> None:
    if user_id not in {room.host_id, room.guest_id}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a player in this battle room",
        )
