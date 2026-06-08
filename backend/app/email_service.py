import asyncio
import logging
import smtplib
from email.message import EmailMessage

import httpx

from app import auth
from app.config import settings

logger = logging.getLogger(__name__)


class EmailDeliveryError(Exception):
    """Raised when an email could not be delivered."""


def _from_address() -> str:
    if settings.SMTP_FROM:
        return settings.SMTP_FROM.strip().strip('"').strip("'")
    if settings.SMTP_USER:
        return f"Footy-Trivia <{settings.SMTP_USER}>"
    return "onboarding@resend.dev"


async def _send_via_brevo(to: str, subject: str, body: str) -> None:
    sender_email = settings.BREVO_SENDER or settings.SMTP_USER
    if not sender_email:
        raise EmailDeliveryError("BREVO_SENDER (a verified Brevo sender email) is not set.")
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": settings.BREVO_API_KEY,
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            json={
                "sender": {"email": sender_email, "name": "Footy-Trivia"},
                "to": [{"email": to}],
                "subject": subject,
                "textContent": body,
            },
        )
    if response.status_code >= 400:
        try:
            detail = response.json().get("message", response.text)
        except Exception:
            detail = response.text
        raise EmailDeliveryError(f"Brevo error ({response.status_code}): {detail}")


async def _send_via_resend(to: str, subject: str, body: str) -> None:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": _from_address(),
                "to": [to],
                "subject": subject,
                "text": body,
            },
        )
    if response.status_code >= 400:
        try:
            detail = response.json().get("message", response.text)
        except Exception:
            detail = response.text
        # Resend test sender only delivers to the account owner until a domain is verified.
        if response.status_code == 403 and "testing emails" in detail.lower():
            logger.warning("Resend test mode: cannot deliver to %s - printing link to console", to)
            print(f"\n[Footy-Trivia Dev Email]\nTo: {to}\nSubject: {subject}\n\n{body}\n")
            return
        raise EmailDeliveryError(f"Resend error ({response.status_code}): {detail}")


def _send_via_smtp_sync(to: str, subject: str, body: str) -> None:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = _from_address()
    message["To"] = to
    message.set_content(body)

    port = settings.SMTP_PORT or (465 if settings.SMTP_USE_SSL else 587)

    try:
        if settings.SMTP_USE_SSL:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, port, timeout=20) as server:
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(message)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, port, timeout=20) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(message)
    except smtplib.SMTPException as exc:
        raise EmailDeliveryError(f"SMTP error: {exc}") from exc
    except OSError as exc:
        # Connection refused / timeout — common when the host blocks outbound SMTP ports.
        raise EmailDeliveryError(
            f"SMTP connection failed ({exc}). The host may block outbound SMTP; use an HTTP email API (Resend)."
        ) from exc


async def send_email(to: str, subject: str, body: str) -> bool:
    # Prefer HTTP APIs (work on hosts that block outbound SMTP, e.g. Render).
    if settings.BREVO_API_KEY:
        await _send_via_brevo(to, subject, body)
        logger.info("Email sent via Brevo to %s", to)
        return True

    if settings.RESEND_API_KEY:
        await _send_via_resend(to, subject, body)
        logger.info("Email sent via Resend to %s", to)
        return True

    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        await asyncio.to_thread(_send_via_smtp_sync, to, subject, body)
        logger.info("Email sent via SMTP to %s", to)
        return True

    raise EmailDeliveryError(
        "Email is not configured. Set BREVO_API_KEY (+ BREVO_SENDER), RESEND_API_KEY, or SMTP_* in backend/.env"
    )


def _verification_link(user_id: str) -> str:
    token = auth.create_action_token(user_id, "verify_email", settings.EMAIL_VERIFY_EXPIRE_HOURS)
    base = settings.FRONTEND_URL.rstrip("/")
    return f"{base}/?verify_token={token}"


def _password_reset_link(user_id: str) -> str:
    token = auth.create_action_token(user_id, "password_reset", settings.PASSWORD_RESET_EXPIRE_HOURS)
    base = settings.FRONTEND_URL.rstrip("/")
    return f"{base}/?reset_token={token}"


async def send_verification_email(email: str, user_id: str) -> bool:
    link = _verification_link(user_id)
    body = (
        "Welcome to Footy-Trivia!\n\n"
        "Please verify your email address by opening this link:\n"
        f"{link}\n\n"
        f"This link expires in {settings.EMAIL_VERIFY_EXPIRE_HOURS} hours.\n\n"
        "If you did not create an account, you can ignore this email."
    )
    return await send_email(email, "Verify your Footy-Trivia account", body)


async def send_password_reset_email(email: str, user_id: str) -> bool:
    link = _password_reset_link(user_id)
    body = (
        "You requested a password reset for your Footy-Trivia account.\n\n"
        "Reset your password using this link:\n"
        f"{link}\n\n"
        f"This link expires in {settings.PASSWORD_RESET_EXPIRE_HOURS} hour(s).\n\n"
        "If you did not request this, you can ignore this email."
    )
    return await send_email(email, "Reset your Footy-Trivia password", body)
