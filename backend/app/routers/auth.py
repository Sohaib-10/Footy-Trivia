from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, func
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)
from datetime import datetime
from uuid import UUID, uuid4
from app.database import get_db
from app import models, schemas, auth
from app.config import settings
from app.email_service import send_verification_email, send_password_reset_email, EmailDeliveryError
from app.validation import parse_login_credentials
from app.cookie_auth import (
    clear_auth_cookies,
    generate_csrf_token,
    set_auth_cookies,
    set_csrf_cookie,
    REFRESH_TOKEN_COOKIE,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _verification_link(token: str) -> str:
    return f"{settings.FRONTEND_URL.rstrip('/')}/#verify_token={token}"


def _password_reset_link(token: str) -> str:
    return f"{settings.FRONTEND_URL.rstrip('/')}/#reset_token={token}"


async def _issue_verify_email(user: models.User, db: AsyncSession) -> None:
    nonce = str(uuid4())
    user.email_verify_nonce = nonce
    await db.flush()
    token = auth.create_action_token(
        str(user.id), "verify_email", settings.EMAIL_VERIFY_EXPIRE_HOURS, nonce
    )
    await send_verification_email(user.email, _verification_link(token))


async def _issue_password_reset_email(user: models.User, db: AsyncSession) -> None:
    nonce = str(uuid4())
    user.password_reset_nonce = nonce
    await db.flush()
    token = auth.create_action_token(
        str(user.id), "password_reset", settings.PASSWORD_RESET_EXPIRE_HOURS, nonce
    )
    await send_password_reset_email(user.email, _password_reset_link(token))


async def _start_user_session(user: models.User, db: AsyncSession) -> tuple[str, str, str]:
    session_token = auth.new_session_token()
    now = datetime.utcnow()
    user.session_token = session_token
    user.last_activity_at = now
    user.last_login = now
    await db.commit()

    token_data = {"sub": str(user.id), "role": user.role, "sid": session_token}
    access_token = auth.create_access_token(data=token_data)
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id), "sid": session_token})
    csrf_token = generate_csrf_token()
    return access_token, refresh_token, csrf_token


def _attach_auth_cookies(response: Response, access_token: str, refresh_token: str, csrf_token: str) -> None:
    set_auth_cookies(response, access_token, refresh_token, csrf_token)


@router.get("/csrf", response_model=schemas.CsrfTokenResponse)
async def issue_csrf_token(response: Response):
    csrf_token = generate_csrf_token()
    set_csrf_cookie(response, csrf_token)
    return {"csrf_token": csrf_token}

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    email = user_data.email.lower()

    email_taken = (
        await db.execute(
            select(models.User.id).where(func.lower(models.User.email) == email).limit(1)
        )
    ).scalars().first()
    if email_taken:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email address is already registered. Try logging in instead.",
        )

    username_taken = (
        await db.execute(
            select(models.User.id).where(models.User.username == user_data.username).limit(1)
        )
    ).scalars().first()
    if username_taken:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken. Please choose another.",
        )

    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        email=email,
        username=user_data.username,
        password_hash=hashed_pwd,
        is_verified=True,
    )
    db.add(new_user)
    await db.flush()

    db.add(models.Profile(user_id=new_user.id, display_name=new_user.username))
    db.add(models.UserProgress(user_id=new_user.id))
    db.add(models.Leaderboard(user_id=new_user.id))

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        email_taken = (
            await db.execute(
                select(models.User.id).where(func.lower(models.User.email) == email).limit(1)
            )
        ).scalars().first()
        if email_taken:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email address is already registered. Try logging in instead.",
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken. Please choose another.",
        )
    await db.refresh(new_user)
    try:
        await _issue_verify_email(new_user, db)
        await db.commit()
    except Exception:
        logger.exception("Failed to send welcome verification email to %s", new_user.email)

    access_token, refresh_token, csrf_token = await _start_user_session(new_user, db)
    user_payload = schemas.UserRead.model_validate(new_user).model_dump(mode="json")
    response = JSONResponse(status_code=status.HTTP_201_CREATED, content=user_payload)
    _attach_auth_cookies(response, access_token, refresh_token, csrf_token)
    return response

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
    if payload.get("nonce") != user.email_verify_nonce:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    if user.is_verified:
        user.email_verify_nonce = None
        await db.commit()
        return {"detail": "Email already verified"}
    user.is_verified = True
    user.email_verify_nonce = None
    await db.commit()
    return {"detail": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(body: schemas.ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    email = body.email.lower()
    result = await db.execute(select(models.User).where(func.lower(models.User.email) == email))
    user = result.scalars().first()
    if user and not user.is_verified:
        try:
            await _issue_verify_email(user, db)
            await db.commit()
        except EmailDeliveryError as exc:
            logger.exception("Failed to send verification email to %s", email)
            raise HTTPException(status_code=500, detail="Could not send verification email. Try again later.") from exc
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
            await _issue_password_reset_email(user, db)
            await db.commit()
        except EmailDeliveryError as exc:
            logger.exception("Failed to send password reset email to %s", email)
            raise HTTPException(status_code=500, detail="Could not send password reset email. Try again later.") from exc
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
    if payload.get("nonce") != user.password_reset_nonce:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user.password_hash = auth.hash_password(body.new_password)
    user.is_verified = True
    user.password_reset_nonce = None
    user.session_token = None
    await db.commit()
    return {"detail": "Password reset successfully"}

@router.post("/login", response_model=schemas.AuthSuccessResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    login_id, password = parse_login_credentials(form_data.username, form_data.password)
    query = select(models.User).where(
        or_(
            func.lower(models.User.email) == login_id.lower(),
            models.User.username == login_id
        )
    )
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not auth.verify_password(password, user.password_hash):
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
            detail="Please verify your email address before logging in.",
        )

    access_token, refresh_token, csrf_token = await _start_user_session(user, db)
    response = JSONResponse(content={"detail": "Login successful", "token_type": "bearer"})
    _attach_auth_cookies(response, access_token, refresh_token, csrf_token)
    return response

@router.post("/refresh", response_model=schemas.AuthSuccessResponse)
async def refresh(
    request: Request,
    body: schemas.RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    refresh_token = body.refresh_token or request.cookies.get(REFRESH_TOKEN_COOKIE)
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

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

    await auth.validate_user_session(user, payload, db)

    user.session_token = auth.new_session_token()
    auth.touch_user_activity(user)
    await db.commit()

    token_data = {"sub": str(user.id), "role": user.role, "sid": user.session_token}
    new_access_token = auth.create_access_token(data=token_data)
    new_refresh_token = auth.create_refresh_token(data={"sub": str(user.id), "sid": user.session_token})
    csrf_token = generate_csrf_token()

    response = JSONResponse(content={"detail": "Session refreshed", "token_type": "bearer"})
    set_auth_cookies(response, new_access_token, new_refresh_token, csrf_token)
    return response

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    from app.cookie_auth import ACCESS_TOKEN_COOKIE

    user_id_str = None
    refresh_token = request.cookies.get(REFRESH_TOKEN_COOKIE)
    access_token = request.cookies.get(ACCESS_TOKEN_COOKIE)
    for token, expected_type in ((refresh_token, "refresh"), (access_token, "access")):
        if not token:
            continue
        try:
            payload = auth.decode_token(token, expected_type=expected_type)
            user_id_str = payload.get("sub")
            if user_id_str:
                break
        except HTTPException:
            continue

    if user_id_str:
        result = await db.execute(select(models.User).where(models.User.id == user_id_str))
        user = result.scalars().first()
        if user:
            user.session_token = None
            await db.commit()

    clear_auth_cookies(response)
    return {"detail": "Successfully logged out"}
