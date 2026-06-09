import secrets
from typing import Optional

from fastapi import Response

from app.config import settings

ACCESS_TOKEN_COOKIE = "ft_access"
REFRESH_TOKEN_COOKIE = "ft_refresh"
CSRF_TOKEN_COOKIE = "ft_csrf"


def generate_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def _cookie_secure() -> bool:
    return settings.cookie_secure


def _cookie_samesite() -> str:
    # Cross-origin SPA (Vercel) → API (Render) requires SameSite=None + Secure.
    return "none" if _cookie_secure() else "lax"


def set_csrf_cookie(response: Response, csrf_token: str) -> None:
    response.set_cookie(
        key=CSRF_TOKEN_COOKIE,
        value=csrf_token,
        httponly=False,
        secure=_cookie_secure(),
        samesite=_cookie_samesite(),
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/",
    )


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
    csrf_token: Optional[str] = None,
) -> None:
    csrf = csrf_token or generate_csrf_token()
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=access_token,
        httponly=True,
        secure=_cookie_secure(),
        samesite=_cookie_samesite(),
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        httponly=True,
        secure=_cookie_secure(),
        samesite=_cookie_samesite(),
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/auth",
    )
    set_csrf_cookie(response, csrf)


def clear_auth_cookies(response: Response) -> None:
    for name, path in (
        (ACCESS_TOKEN_COOKIE, "/"),
        (REFRESH_TOKEN_COOKIE, "/api/auth"),
        (CSRF_TOKEN_COOKIE, "/"),
    ):
        response.delete_cookie(key=name, path=path)
