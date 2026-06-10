import secrets
from typing import Callable, Set

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.cookie_auth import CSRF_TOKEN_COOKIE

SAFE_METHODS: Set[str] = {"GET", "HEAD", "OPTIONS"}

# Auth bootstrap endpoints — no CSRF cookie yet or token delivered out-of-band
CSRF_EXEMPT_PATHS: Set[str] = {
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/csrf",
    "/api/auth/refresh",
    "/api/auth/forgot-password",
    "/api/auth/resend-verification",
    "/api/auth/verify-email",
    "/api/auth/reset-password",
}


class CsrfMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.method in SAFE_METHODS:
            return await call_next(request)

        path = request.url.path.rstrip("/") or "/"
        if path in CSRF_EXEMPT_PATHS:
            return await call_next(request)

        cookie_token = request.cookies.get(CSRF_TOKEN_COOKIE)
        header_token = request.headers.get("X-CSRF-Token")
        if (
            not cookie_token
            or not header_token
            or not secrets.compare_digest(cookie_token, header_token)
        ):
            return JSONResponse(
                status_code=403,
                content={"detail": "CSRF validation failed"},
            )

        return await call_next(request)
