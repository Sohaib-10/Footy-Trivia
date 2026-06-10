import re
import time
from collections import defaultdict
from typing import Callable, Dict, List, Set, Tuple

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.config import settings

AUTH_RATE_LIMITED_PATHS: Set[str] = {
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/resend-verification",
    "/api/auth/verify-email",
    "/api/auth/reset-password",
    "/api/auth/refresh",
}

BATTLE_POST_PREFIX = "/api/battle/"
QUIZ_POST_PREFIX = "/api/quiz/"
WC_SYNC_PATH = "/api/wc/predictions/sync"
GET_RATE_LIMITED_PATHS: Set[str] = {"/api/players/search"}


class _SlidingWindowLimiter:
    def __init__(self, max_attempts: int, window_seconds: int) -> None:
        self._max_attempts = max_attempts
        self._window_seconds = window_seconds
        self._hits: Dict[str, List[float]] = defaultdict(list)

    def check(self, key: str) -> Tuple[bool, int]:
        now = time.monotonic()
        window_start = now - self._window_seconds
        hits = [t for t in self._hits[key] if t > window_start]

        if len(hits) >= self._max_attempts:
            retry_after = max(1, int(hits[0] + self._window_seconds - now) + 1)
            self._hits[key] = hits
            return False, retry_after

        hits.append(now)
        self._hits[key] = hits
        return True, 0


_auth_limiter = _SlidingWindowLimiter(
    max_attempts=settings.AUTH_RATE_LIMIT_MAX_ATTEMPTS,
    window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_MINUTES * 60,
)
_battle_limiter = _SlidingWindowLimiter(max_attempts=60, window_seconds=15 * 60)
_search_limiter = _SlidingWindowLimiter(max_attempts=30, window_seconds=15 * 60)
_quiz_limiter = _SlidingWindowLimiter(max_attempts=120, window_seconds=15 * 60)
_wc_limiter = _SlidingWindowLimiter(max_attempts=30, window_seconds=15 * 60)


def _client_ip(request: Request) -> str:
    if settings.TRUST_PROXY_HEADERS:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def _rate_limit_response(retry_after: int) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many attempts. Please try again later."},
        headers={"Retry-After": str(retry_after)},
    )


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        path = request.url.path.rstrip("/") or "/"
        client_ip = _client_ip(request)

        if request.method == "POST":
            if path in AUTH_RATE_LIMITED_PATHS:
                allowed, retry_after = _auth_limiter.check(f"{client_ip}:{path}")
                if not allowed:
                    return _rate_limit_response(retry_after)
            elif path.startswith(BATTLE_POST_PREFIX):
                allowed, retry_after = _battle_limiter.check(f"{client_ip}:battle")
                if not allowed:
                    return _rate_limit_response(retry_after)
            elif path.startswith(QUIZ_POST_PREFIX):
                allowed, retry_after = _quiz_limiter.check(f"{client_ip}:quiz")
                if not allowed:
                    return _rate_limit_response(retry_after)
            elif path == WC_SYNC_PATH:
                allowed, retry_after = _wc_limiter.check(f"{client_ip}:wc")
                if not allowed:
                    return _rate_limit_response(retry_after)

        if request.method == "GET" and path in GET_RATE_LIMITED_PATHS:
            allowed, retry_after = _search_limiter.check(f"{client_ip}:{path}")
            if not allowed:
                return _rate_limit_response(retry_after)

        return await call_next(request)
