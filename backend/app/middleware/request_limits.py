from typing import Callable, Set

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.validation import MAX_REQUEST_BODY_BYTES, MAX_UPLOAD_BODY_BYTES

UPLOAD_PATHS: Set[str] = {
    "/api/profile",
    "/api/profile/avatar",
}


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.method not in {"POST", "PUT", "PATCH"}:
            return await call_next(request)

        path = request.url.path.rstrip("/") or "/"
        max_bytes = (
            MAX_UPLOAD_BODY_BYTES
            if path in UPLOAD_PATHS or path.startswith("/api/admin/")
            else MAX_REQUEST_BODY_BYTES
        )

        content_length = request.headers.get("content-length")
        if content_length:
            try:
                size = int(content_length)
            except ValueError:
                return JSONResponse(
                    status_code=400,
                    content={"detail": "Invalid Content-Length header"},
                )
            if size > max_bytes:
                return JSONResponse(
                    status_code=413,
                    content={"detail": "Request body too large"},
                )

        received = 0

        async def limited_receive():
            nonlocal received
            message = await request.receive()
            if message["type"] == "http.request":
                chunk = message.get("body", b"") or b""
                received += len(chunk)
                if received > max_bytes:
                    return {"type": "http.disconnect"}
            return message

        limited_request = Request(request.scope, limited_receive)
        response = await call_next(limited_request)
        if received > max_bytes:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request body too large"},
            )
        return response
