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


async def _send_via_brevo(to: str, subject: str, body: str, html: str | None = None) -> None:
    sender_email = settings.BREVO_SENDER or settings.SMTP_USER
    if not sender_email:
        raise EmailDeliveryError("BREVO_SENDER (a verified Brevo sender email) is not set.")
    payload = {
        "sender": {"email": sender_email, "name": "Footy-Trivia"},
        "to": [{"email": to}],
        "replyTo": {"email": sender_email, "name": "Footy-Trivia"},
        "subject": subject,
        "textContent": body,
    }
    if html:
        payload["htmlContent"] = html
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": settings.BREVO_API_KEY,
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            json=payload,
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


async def send_email(to: str, subject: str, body: str, html: str | None = None) -> bool:
    # Prefer HTTP APIs (work on hosts that block outbound SMTP, e.g. Render).
    if settings.BREVO_API_KEY:
        await _send_via_brevo(to, subject, body, html)
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


def _html_email(heading: str, intro: str, link: str, button_label: str, footnote: str) -> str:
    return f"""\
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0f1115;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1115;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#181b22;border:1px solid #2a2e37;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:28px 32px 8px;">
            <div style="font-size:20px;font-weight:800;color:#ffffff;">⚽ Footy-Trivia</div>
          </td></tr>
          <tr><td style="padding:8px 32px 0;">
            <h1 style="font-size:18px;color:#ffffff;margin:0 0 12px;">{heading}</h1>
            <p style="font-size:14px;line-height:1.6;color:#c4c9d4;margin:0 0 24px;">{intro}</p>
            <a href="{link}" style="display:inline-block;background:#d4af37;color:#000000;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;">{button_label}</a>
            <p style="font-size:12px;line-height:1.6;color:#8b919e;margin:24px 0 0;">Or paste this link into your browser:<br><a href="{link}" style="color:#d4af37;word-break:break-all;">{link}</a></p>
          </td></tr>
          <tr><td style="padding:24px 32px 28px;">
            <p style="font-size:12px;color:#6b7280;margin:0;border-top:1px solid #2a2e37;padding-top:16px;">{footnote}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>"""


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
    html = _html_email(
        heading="Confirm your email",
        intro="Welcome to Footy-Trivia! Confirm your email address to activate your account and start playing.",
        link=link,
        button_label="Verify my account",
        footnote=(
            f"This link expires in {settings.EMAIL_VERIFY_EXPIRE_HOURS} hours. "
            "If you did not create an account, you can safely ignore this email."
        ),
    )
    return await send_email(email, "Verify your Footy-Trivia account", body, html)


async def send_password_reset_email(email: str, user_id: str) -> bool:
    link = _password_reset_link(user_id)
    body = (
        "You requested a password reset for your Footy-Trivia account.\n\n"
        "Reset your password using this link:\n"
        f"{link}\n\n"
        f"This link expires in {settings.PASSWORD_RESET_EXPIRE_HOURS} hour(s).\n\n"
        "If you did not request this, you can ignore this email."
    )
    html = _html_email(
        heading="Reset your password",
        intro="We received a request to reset the password for your Footy-Trivia account. Click below to choose a new password.",
        link=link,
        button_label="Reset my password",
        footnote=(
            f"This link expires in {settings.PASSWORD_RESET_EXPIRE_HOURS} hour(s). "
            "If you did not request this, you can safely ignore this email."
        ),
    )
    return await send_email(email, "Reset your Footy-Trivia password", body, html)
