"""Input sanitization and size limits for all user-supplied data."""
from __future__ import annotations

import re
from typing import Any, Optional

from fastapi import HTTPException, status

# ── Size limits ───────────────────────────────────────────────────────────────
MAX_REQUEST_BODY_BYTES = 512 * 1024
MAX_UPLOAD_BODY_BYTES = 3 * 1024 * 1024

MAX_PASSWORD_LEN = 128
MIN_PASSWORD_LEN = 8
MAX_TOKEN_LEN = 2048
MAX_LOGIN_ID_LEN = 254
MAX_USERNAME_LEN = 50
MIN_USERNAME_LEN = 3
MAX_EMAIL_LEN = 254
MAX_DISPLAY_NAME_LEN = 100
MAX_BIO_LEN = 500
MAX_URL_LEN = 2048
MAX_QUESTION_TEXT_LEN = 1000
MAX_OPTION_LEN = 300
MAX_PLAYER_NAME_LEN = 120
MAX_WC_NAME_LEN = 100
MAX_WC_GROUP_KEY_LEN = 4
MAX_WC_BRACKET_ENTRY_KEYS = 6
MAX_WC_AWARD_KEY_LEN = 50
MAX_PREFERENCES_KEYS = 20
MAX_PREFERENCE_VALUE_LEN = 200

CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
USERNAME_RE = re.compile(r"^[a-zA-Z0-9_]+$")
ROOM_CODE_RE = re.compile(r"^[A-Z0-9]{6}$")
COUNTRY_CODE_RE = re.compile(r"^[A-Z]{3}$")
TOKEN_RE = re.compile(r"^[A-Za-z0-9._-]+$")
SAFE_URL_RE = re.compile(r"^https?://[^\s<>'\"]+$", re.IGNORECASE)
WC_FIXTURE_KEY_RE = re.compile(r"^\d{1,4}$")
WC_AWARD_KEY_RE = re.compile(r"^[a-z0-9-]{1,50}$")


class InputValidationError(ValueError):
    """Raised when user input fails sanitization."""


def _reject_control_chars(value: str, field_name: str) -> None:
    if "\x00" in value or CONTROL_CHAR_RE.search(value):
        raise InputValidationError(f"{field_name} contains invalid characters")


def sanitize_text(
    value: Any,
    *,
    max_length: int,
    min_length: int = 0,
    pattern: re.Pattern[str] | None = None,
    field_name: str = "value",
    strip: bool = True,
) -> str:
    if value is None:
        raise InputValidationError(f"{field_name} is required")
    if not isinstance(value, str):
        raise InputValidationError(f"{field_name} must be a string")
    _reject_control_chars(value, field_name)
    text = value.strip() if strip else value
    if len(text) < min_length:
        raise InputValidationError(f"{field_name} is too short")
    if len(text) > max_length:
        raise InputValidationError(f"{field_name} is too long (max {max_length} characters)")
    if pattern and not pattern.fullmatch(text):
        raise InputValidationError(f"{field_name} has an invalid format")
    return text


def sanitize_optional_text(
    value: Any,
    *,
    max_length: int,
    min_length: int = 0,
    pattern: re.Pattern[str] | None = None,
    field_name: str = "value",
) -> Optional[str]:
    if value is None:
        return None
    return sanitize_text(
        value,
        max_length=max_length,
        min_length=min_length,
        pattern=pattern,
        field_name=field_name,
    )


def sanitize_username(value: Any) -> str:
    return sanitize_text(
        value,
        max_length=MAX_USERNAME_LEN,
        min_length=MIN_USERNAME_LEN,
        pattern=USERNAME_RE,
        field_name="username",
    )


def sanitize_login_id(value: Any) -> str:
    return sanitize_text(
        value,
        max_length=MAX_LOGIN_ID_LEN,
        min_length=1,
        field_name="username or email",
    )


def sanitize_password(value: Any, *, field_name: str = "password") -> str:
    if value is None or not isinstance(value, str):
        raise InputValidationError(f"{field_name} is required")
    _reject_control_chars(value, field_name)
    if len(value) < MIN_PASSWORD_LEN:
        raise InputValidationError(f"{field_name} must be at least {MIN_PASSWORD_LEN} characters")
    if len(value) > MAX_PASSWORD_LEN:
        raise InputValidationError(f"{field_name} is too long (max {MAX_PASSWORD_LEN} characters)")
    return value


def sanitize_token(value: Any, *, field_name: str = "token") -> str:
    return sanitize_text(
        value,
        max_length=MAX_TOKEN_LEN,
        min_length=10,
        pattern=TOKEN_RE,
        field_name=field_name,
        strip=True,
    )


def sanitize_room_code(value: Any) -> str:
    code = sanitize_text(
        value,
        max_length=6,
        min_length=6,
        field_name="room code",
    ).upper()
    if not ROOM_CODE_RE.fullmatch(code):
        raise InputValidationError("room code must be 6 alphanumeric characters")
    return code


def sanitize_country_code(value: Any) -> str:
    code = sanitize_text(
        value,
        max_length=3,
        min_length=3,
        field_name="country code",
    ).upper()
    if not COUNTRY_CODE_RE.fullmatch(code):
        raise InputValidationError("country code must be 3 letters")
    return code


def sanitize_url(value: Any, *, field_name: str = "url", required: bool = True) -> Optional[str]:
    if value is None:
        if required:
            raise InputValidationError(f"{field_name} is required")
        return None
    url = sanitize_text(value, max_length=MAX_URL_LEN, min_length=8, field_name=field_name)
    if not SAFE_URL_RE.fullmatch(url):
        raise InputValidationError(f"{field_name} must be a valid http(s) URL")
    return url


def sanitize_wc_name(value: Any, *, field_name: str = "name") -> str:
    return sanitize_text(value, max_length=MAX_WC_NAME_LEN, min_length=1, field_name=field_name)


def sanitize_preferences(value: Any) -> dict[str, Any]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise InputValidationError("preferences must be an object")
    if len(value) > MAX_PREFERENCES_KEYS:
        raise InputValidationError(f"preferences may contain at most {MAX_PREFERENCES_KEYS} keys")
    cleaned: dict[str, Any] = {}
    for key, raw in value.items():
        safe_key = sanitize_text(str(key), max_length=50, min_length=1, field_name="preference key")
        if isinstance(raw, dict):
            nested: dict[str, str] = {}
            if len(raw) > 10:
                raise InputValidationError("preference entries are too large")
            for nested_key, nested_val in raw.items():
                nk = sanitize_text(str(nested_key), max_length=50, min_length=1, field_name="preference key")
                if nested_val is None:
                    continue
                nested[nk] = sanitize_text(
                    str(nested_val),
                    max_length=MAX_PREFERENCE_VALUE_LEN,
                    min_length=0,
                    field_name="preference value",
                )
            cleaned[safe_key] = nested
        elif raw is None:
            continue
        else:
            cleaned[safe_key] = sanitize_text(
                str(raw),
                max_length=MAX_PREFERENCE_VALUE_LEN,
                min_length=0,
                field_name="preference value",
            )
    return cleaned


def parse_login_credentials(username: str, password: str) -> tuple[str, str]:
    try:
        return sanitize_login_id(username), sanitize_password(password)
    except InputValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


def validation_error_to_http(exc: InputValidationError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


def sanitize_upload_filename(filename: Optional[str]) -> str:
    if not filename:
        return "upload"
    name = filename.replace("\\", "/").split("/")[-1]
    _reject_control_chars(name, "filename")
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name).strip("._")
    if not name:
        return "upload"
    return name[:120]
