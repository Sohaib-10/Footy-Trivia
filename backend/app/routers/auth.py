from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from datetime import datetime, timedelta
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_data: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if username or email already exists
    query = select(models.User).where(
        or_(
            models.User.email == user_data.email,
            models.User.username == user_data.username
        )
    )
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        else:
            raise HTTPException(status_code=400, detail="Username already taken")

    # Create new User
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_pwd,
        is_verified=False
    )
    db.add(new_user)
    await db.flush() # Flush to populate user.id

    # Create empty Profile
    new_profile = models.Profile(
        user_id=new_user.id,
        display_name=new_user.username
    )
    db.add(new_profile)

    # Create User Progress
    new_progress = models.UserProgress(
        user_id=new_user.id
    )
    db.add(new_progress)

    # Create Leaderboard entry
    new_leaderboard = models.Leaderboard(
        user_id=new_user.id
    )
    db.add(new_leaderboard)

    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Look up by email (username parameter in OAuth2Form is used for email/username)
    query = select(models.User).where(
        or_(
            models.User.email == form_data.username,
            models.User.username == form_data.username
        )
    )
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user account")

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before logging in."
        )

    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()

    # Generate tokens
    access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh(refresh_token: str, db: AsyncSession = Depends(get_db)):
    payload = auth.decode_token(refresh_token, expected_type="refresh")
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    query = select(models.User).where(models.User.id == user_id_str)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is inactive or not found")

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before refreshing your session."
        )

    new_access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    new_refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout():
    # Stateless JWT logout is handled client-side by deleting tokens.
    # We return success message.
    return {"detail": "Successfully logged out"}
