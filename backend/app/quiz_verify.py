import hashlib
import hmac
import secrets


def new_verify_key() -> str:
    return secrets.token_urlsafe(24)


def make_answer_hash(verify_key: str, question_id: int, option: str) -> str:
    message = f"{question_id}:{option.upper()}"
    return hmac.new(
        verify_key.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
