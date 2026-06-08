from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, func
import logging

logger = logging.getLogger(__name__)
from datetime import datetime, timedelta
from uuid import UUID
from app.database import get_db
from app import models, schemas, auth
from app.email_service import send_verification_email, send_password_reset_email, EmailDeliveryError

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_data: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if username or email already exists
    email = user_data.email.lower()
    query = select(models.User).where(
        or_(
            func.lower(models.User.email) == email,
            models.User.username == user_data.username
        )
    )
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
        if existing_user.email.lower() == email:
            raise HTTPException(status_code=400, detail="Email already registered")
        else:
            raise HTTPException(status_code=400, detail="Username already taken")

    # Create new User
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        email=email,
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
    try:
        await send_verification_email(new_user.email, str(new_user.id))
    except EmailDeliveryError as exc:
        logger.exception("Failed to send verification email to %s", new_user.email)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Failed to send verification email to %s", new_user.email)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Account created but verification email could not be sent. Try resending from the login screen."
        ) from exc
    return new_user

@router.post("/verify-email")
async def verify_email(body: schemas.EmailTokenRequest, db: AsyncSession = Depends(get_db)):
    payload = auth.decode_action_token(body.token, "verify_email")
    try:
        user_id = UUID(payload["sub"])
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_verified:
        return {"detail": "Email already verified"}
    user.is_verified = True
    await db.commit()
    return {"detail": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(body: schemas.ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    email = body.email.lower()
    result = await db.execute(select(models.User).where(func.lower(models.User.email) == email))
    user = result.scalars().first()
    if user and not user.is_verified:
        try:
            await send_verification_email(user.email, str(user.id))
        except EmailDeliveryError as exc:
            logger.exception("Failed to send verification email to %s", email)
            raise HTTPException(status_code=500, detail=str(exc)) from exc
        except Exception as exc:
            logger.exception("Failed to send verification email to %s", email)
            raise HTTPException(status_code=500, detail="Could not send verification email. Try again later.") from exc
    return {"detail": "If that account exists and is unverified, a verification email has been sent."}

@router.post("/forgot-password")
async def forgot_password(body: schemas.ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    email = body.email.lower()
    result = await db.execute(select(models.User).where(func.lower(models.User.email) == email))
    user = result.scalars().first()
    if user and user.is_active:
        try:
            await send_password_reset_email(user.email, str(user.id))
        except EmailDeliveryError as exc:
            logger.exception("Failed to send password reset email to %s", email)
            raise HTTPException(status_code=500, detail=str(exc)) from exc
        except Exception as exc:
            logger.exception("Failed to send password reset email to %s", email)
            raise HTTPException(status_code=500, detail="Could not send password reset email. Try again later.") from exc
    return {"detail": "If that email is registered, a password reset link has been sent."}

@router.post("/reset-password")
async def reset_password(body: schemas.ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    payload = auth.decode_action_token(body.token, "password_reset")
    try:
        user_id = UUID(payload["sub"])
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.password_hash = auth.hash_password(body.new_password)
    await db.commit()
    return {"detail": "Password reset successfully"}

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Look up by email (username parameter in OAuth2Form is used for email/username)
    login_id = form_data.username.strip()
    query = select(models.User).where(
        or_(
            func.lower(models.User.email) == login_id.lower(),
            models.User.username == login_id
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
