from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, model_validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from uuid import UUID

from app.validation import (
    MAX_BIO_LEN,
    MAX_DISPLAY_NAME_LEN,
    MAX_OPTION_LEN,
    MAX_QUESTION_TEXT_LEN,
    MAX_TOKEN_LEN,
    MAX_WC_AWARD_KEY_LEN,
    MAX_WC_GROUP_KEY_LEN,
    MAX_WC_BRACKET_ENTRY_KEYS,
    MAX_WC_NAME_LEN,
    WC_AWARD_KEY_RE,
    WC_FIXTURE_KEY_RE,
    sanitize_optional_text,
    sanitize_password,
    sanitize_preferences,
    sanitize_text,
    sanitize_token,
    sanitize_url,
    sanitize_username,
    sanitize_wc_name,
)

# ============================================================================
# TOKEN SCHEMAS
# ============================================================================
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[UUID] = None
    role: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = Field(None, max_length=MAX_TOKEN_LEN)

    @field_validator("refresh_token")
    @classmethod
    def validate_refresh_token(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        return sanitize_token(value, field_name="refresh_token")

class CsrfTokenResponse(BaseModel):
    csrf_token: str

class AuthSuccessResponse(BaseModel):
    detail: str = "ok"
    token_type: str = "bearer"

# ============================================================================
# COUNTRY SCHEMAS
# ============================================================================
class CountryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    code: str = Field(..., min_length=3, max_length=3)
    flag_url: Optional[str] = Field(None, max_length=2048)
    confederation: Optional[str] = Field(None, max_length=10)

    @field_validator("name", "code", "confederation")
    @classmethod
    def sanitize_country_fields(cls, value: Optional[str], info) -> Optional[str]:
        if value is None:
            return None
        max_len = 100 if info.field_name == "name" else (3 if info.field_name == "code" else 10)
        min_len = 3 if info.field_name == "code" else 1
        return sanitize_text(value, max_length=max_len, min_length=min_len, field_name=info.field_name)

    @field_validator("flag_url")
    @classmethod
    def validate_flag_url(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_url(value, field_name="flag_url", required=False)

class CountryRead(BaseModel):
    id: int
    name: str
    code: str
    flag_url: Optional[str]
    confederation: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# TEAM SCHEMAS
# ============================================================================
class TeamCreate(BaseModel):
    name: str = Field(..., max_length=150)
    logo_url: Optional[str] = Field(None, max_length=2048)
    country_id: Optional[int] = Field(None, ge=1)
    type: Optional[str] = Field(None, pattern="^(club|national)$")
    founded_year: Optional[int] = Field(None, ge=1800, le=2100)
    stadium: Optional[str] = Field(None, max_length=150)

    @field_validator("name", "stadium")
    @classmethod
    def sanitize_team_text(cls, value: Optional[str], info) -> Optional[str]:
        if value is None:
            return None
        max_len = 150
        return sanitize_text(value, max_length=max_len, min_length=1, field_name=info.field_name)

    @field_validator("logo_url")
    @classmethod
    def validate_logo_url(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_url(value, field_name="logo_url", required=False)

class TeamRead(BaseModel):
    id: int
    name: str
    logo_url: Optional[str]
    country_id: Optional[int]
    type: Optional[str]
    founded_year: Optional[int]
    stadium: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# PROFILE SCHEMAS
# ============================================================================
class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, max_length=MAX_DISPLAY_NAME_LEN)
    bio: Optional[str] = Field(None, max_length=MAX_BIO_LEN)
    country_id: Optional[int] = Field(None, ge=1)
    favourite_team_id: Optional[int] = Field(None, ge=1)
    preferences: Optional[Dict[str, Any]] = None

    @field_validator("display_name")
    @classmethod
    def validate_display_name(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_optional_text(
            value,
            max_length=MAX_DISPLAY_NAME_LEN,
            min_length=1,
            field_name="display_name",
        )

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_optional_text(value, max_length=MAX_BIO_LEN, field_name="bio")

    @field_validator("preferences")
    @classmethod
    def validate_preferences(cls, value: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if value is None:
            return None
        return sanitize_preferences(value)

class ProfileRead(BaseModel):
    id: int
    user_id: UUID
    display_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    country_id: Optional[int]
    favourite_team_id: Optional[int]
    preferences: Dict[str, Any] = Field(default_factory=dict)
    total_quizzes_played: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# USER SCHEMAS
# ============================================================================
class UserCreate(BaseModel):
    email: EmailStr = Field(..., max_length=254)
    password: str = Field(..., min_length=8, max_length=128)
    username: str = Field(..., min_length=3, max_length=50)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        return sanitize_username(value)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return sanitize_password(value)

class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    is_active: bool
    is_verified: bool
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return sanitize_password(value)

class EmailTokenRequest(BaseModel):
    token: str = Field(..., max_length=MAX_TOKEN_LEN)

    @field_validator("token")
    @classmethod
    def validate_token(cls, value: str) -> str:
        return sanitize_token(value)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., max_length=254)

class ResetPasswordRequest(BaseModel):
    token: str = Field(..., max_length=MAX_TOKEN_LEN)
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("token")
    @classmethod
    def validate_token(cls, value: str) -> str:
        return sanitize_token(value)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return sanitize_password(value, field_name="new_password")

class ResendVerificationRequest(BaseModel):
    email: EmailStr = Field(..., max_length=254)

class PublicProfileSummary(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    total_quizzes_played: int = 0

    model_config = ConfigDict(from_attributes=True)


class PublicProfileRead(BaseModel):
    username: str
    profile: Optional[PublicProfileSummary] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# QUESTION SCHEMAS
# ============================================================================
class QuestionCreate(BaseModel):
    question_text: str = Field(..., max_length=MAX_QUESTION_TEXT_LEN)
    option_a: str = Field(..., max_length=MAX_OPTION_LEN)
    option_b: str = Field(..., max_length=MAX_OPTION_LEN)
    option_c: str = Field(..., max_length=MAX_OPTION_LEN)
    option_d: str = Field(..., max_length=MAX_OPTION_LEN)
    correct_option: str = Field(..., pattern="^[A-D]$")
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")
    category: str = Field(..., pattern="^(transfers|history|world_cup|clubs|players|general)$")
    team_id: Optional[int] = Field(None, ge=1)
    country_id: Optional[int] = Field(None, ge=1)

    @field_validator("question_text", "option_a", "option_b", "option_c", "option_d")
    @classmethod
    def sanitize_question_text(cls, value: str, info) -> str:
        max_len = MAX_QUESTION_TEXT_LEN if info.field_name == "question_text" else MAX_OPTION_LEN
        return sanitize_text(value, max_length=max_len, min_length=1, field_name=info.field_name)

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = Field(None, max_length=MAX_QUESTION_TEXT_LEN)
    option_a: Optional[str] = Field(None, max_length=MAX_OPTION_LEN)
    option_b: Optional[str] = Field(None, max_length=MAX_OPTION_LEN)
    option_c: Optional[str] = Field(None, max_length=MAX_OPTION_LEN)
    option_d: Optional[str] = Field(None, max_length=MAX_OPTION_LEN)
    correct_option: Optional[str] = Field(None, pattern="^[A-D]$")
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
    category: Optional[str] = Field(None, pattern="^(transfers|history|world_cup|clubs|players|general)$")
    team_id: Optional[int] = Field(None, ge=1)
    country_id: Optional[int] = Field(None, ge=1)

    @field_validator("question_text", "option_a", "option_b", "option_c", "option_d")
    @classmethod
    def sanitize_question_text(cls, value: Optional[str], info) -> Optional[str]:
        if value is None:
            return None
        max_len = MAX_QUESTION_TEXT_LEN if info.field_name == "question_text" else MAX_OPTION_LEN
        return sanitize_text(value, max_length=max_len, min_length=1, field_name=info.field_name)

class QuestionRead(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty: str
    category: str
    team_id: Optional[int]
    country_id: Optional[int]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class QuestionPublicRead(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: str
    category: str
    team_id: Optional[int]
    country_id: Optional[int]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# QUIZ SESSION SCHEMAS
# ============================================================================
class QuizSessionStart(BaseModel):
    difficulty: str = Field("mixed", pattern="^(easy|medium|hard|mixed)$")
    category: Optional[str] = Field(None, pattern="^(transfers|history|world_cup|clubs|players|general)$")
    topic: Optional[str] = Field(None, max_length=50)
    total_questions: int = Field(10, ge=1, le=50)
    challenge_type: Optional[str] = Field(None, pattern="^daily$")

class QuizSessionRead(BaseModel):
    id: UUID
    user_id: UUID
    difficulty: Optional[str]
    category: Optional[str]
    total_questions: int
    score: int
    is_completed: bool
    started_at: datetime
    ended_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

class QuizSessionStartResponse(BaseModel):
    session: QuizSessionRead
    questions: List[QuestionPublicRead]

# ============================================================================
# SESSION ANSWER SCHEMAS
# ============================================================================
class SessionAnswerCreate(BaseModel):
    session_id: UUID
    question_id: int = Field(..., ge=1)
    selected_option: Optional[str] = Field(None, pattern="^[A-D]$")
    time_taken_seconds: Optional[int] = Field(None, ge=0, le=3600)
    timed_out: bool = False

    @model_validator(mode="after")
    def require_option_unless_timeout(self) -> "SessionAnswerCreate":
        if not self.timed_out and not self.selected_option:
            raise ValueError("selected_option is required unless timed_out is true")
        return self

class SessionAnswerRead(BaseModel):
    id: int
    session_id: UUID
    question_id: int
    selected_option: Optional[str]
    is_correct: bool
    time_taken_seconds: Optional[int]
    answered_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuizAnswerResponse(BaseModel):
    answer: SessionAnswerRead
    correct_option: str
    points_earned: int
    session_score: int

# ============================================================================
# USER PROGRESS & LEADERBOARD SCHEMAS
# ============================================================================
class UserProgressRead(BaseModel):
    id: int
    user_id: UUID
    total_points: int
    total_correct: int
    total_incorrect: int
    total_questions_answered: int
    current_streak: int
    longest_streak: int
    last_played_at: Optional[datetime]
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserProgressSync(BaseModel):
    points_earned: int = Field(0, ge=0, le=50_000)
    correct: int = Field(0, ge=0, le=500)
    incorrect: int = Field(0, ge=0, le=500)
    questions_answered: int = Field(0, ge=0, le=500)
    longest_streak: Optional[int] = Field(None, ge=0, le=10_000)
    current_streak: Optional[int] = Field(None, ge=0, le=10_000)
    quizzes_played: int = Field(0, ge=0, le=50)

class LeaderboardRead(BaseModel):
    id: int
    user_id: UUID
    username: Optional[str] = None
    rank: Optional[int]
    total_points: int
    weekly_points: int
    monthly_points: int
    country_id: Optional[int]
    updated_at: datetime
    accuracy: Optional[str] = "0%"

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# WORLD CUP PREDICTION & LEADERBOARD SCHEMAS
# ============================================================================
class WcMatchPrediction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    homeScore: Optional[int] = Field(None, ge=0, le=99)
    awayScore: Optional[int] = Field(None, ge=0, le=99)


class WcGroupTeam(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(..., max_length=MAX_WC_NAME_LEN)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return sanitize_wc_name(value)


class WcGroupPrediction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field("", max_length=MAX_WC_NAME_LEN)
    teams: List[WcGroupTeam] = Field(default_factory=list, max_length=4)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return sanitize_optional_text(value, max_length=MAX_WC_NAME_LEN, field_name="group name") or ""


class WcPredictionsSync(BaseModel):
    matches: Dict[str, WcMatchPrediction] = Field(default_factory=dict)
    awards: Dict[str, Union[str, Dict[str, str]]] = Field(default_factory=dict)
    groups: Dict[str, WcGroupPrediction] = Field(default_factory=dict)
    third_place: List[str] = Field(default_factory=list)
    bracket: List[Dict[str, Any]] = Field(default_factory=list)
    champion: Optional[str] = Field(None, max_length=MAX_WC_NAME_LEN)
    bracket_submitted: bool = False
    group_rankings_submitted: bool = False

    @field_validator("champion")
    @classmethod
    def validate_champion(cls, value: Optional[str]) -> Optional[str]:
        return sanitize_optional_text(value, max_length=MAX_WC_NAME_LEN, min_length=1, field_name="champion")

    @field_validator("bracket")
    @classmethod
    def validate_bracket(cls, value: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        cleaned: List[Dict[str, Any]] = []
        for item in value:
            if not isinstance(item, dict):
                raise ValueError("each bracket entry must be an object")
            if len(item) > MAX_WC_BRACKET_ENTRY_KEYS:
                raise ValueError("bracket entry has too many fields")
            cleaned_item: Dict[str, Any] = {}
            for key, raw in item.items():
                safe_key = sanitize_text(str(key), max_length=10, min_length=1, field_name="bracket key")
                if raw is None:
                    cleaned_item[safe_key] = None
                else:
                    cleaned_item[safe_key] = sanitize_optional_text(
                        str(raw),
                        max_length=MAX_WC_NAME_LEN,
                        min_length=1,
                        field_name="bracket value",
                    )
            cleaned.append(cleaned_item)
        return cleaned

    @field_validator("third_place")
    @classmethod
    def validate_third_place(cls, value: List[str]) -> List[str]:
        if len(value) > 12:
            raise ValueError("third_place may contain at most 12 entries")
        return [sanitize_wc_name(item) for item in value]

    @model_validator(mode="after")
    def validate_bounds(self) -> "WcPredictionsSync":
        if len(self.matches) > 64:
            raise ValueError("matches may contain at most 64 entries")
        if len(self.awards) > 20:
            raise ValueError("awards may contain at most 20 entries")
        if len(self.groups) > 16:
            raise ValueError("groups may contain at most 16 entries")
        if len(self.bracket) > 32:
            raise ValueError("bracket may contain at most 32 entries")

        for key in self.matches:
            if not WC_FIXTURE_KEY_RE.fullmatch(str(key)):
                raise ValueError("invalid match key format")

        cleaned_awards: Dict[str, Union[str, Dict[str, str]]] = {}
        for key, value in self.awards.items():
            safe_key = sanitize_text(str(key), max_length=MAX_WC_AWARD_KEY_LEN, min_length=1, field_name="award key")
            if not WC_AWARD_KEY_RE.fullmatch(safe_key):
                raise ValueError("invalid award key format")
            if isinstance(value, dict):
                cleaned_awards[safe_key] = {
                    "name": sanitize_wc_name(value.get("name", "")),
                }
            else:
                cleaned_awards[safe_key] = sanitize_wc_name(str(value))
        self.awards = cleaned_awards

        cleaned_groups: Dict[str, WcGroupPrediction] = {}
        for key, group in self.groups.items():
            safe_key = sanitize_text(str(key), max_length=MAX_WC_GROUP_KEY_LEN, min_length=1, field_name="group key")
            cleaned_groups[safe_key] = group
        self.groups = cleaned_groups
        return self


class WcLeaderboardRead(BaseModel):
    id: int
    user_id: UUID
    username: Optional[str] = None
    rank: Optional[int]
    total_points: int
    correct_predictions: int
    total_graded: int
    accuracy: str = "0%"
    tier: str = "Unranked"
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WcMeRead(BaseModel):
    user_id: UUID
    username: str
    total_points: int
    correct_predictions: int
    total_graded: int
    rank: Optional[int]
    accuracy: str = "0%"
    tier: str = "Unranked"


class WcResultItem(BaseModel):
    result_key: str = Field(..., max_length=MAX_WC_AWARD_KEY_LEN)
    result_data: Dict[str, Any] = Field(default_factory=dict)

    @field_validator("result_key")
    @classmethod
    def validate_result_key(cls, value: str) -> str:
        key = sanitize_text(value, max_length=MAX_WC_AWARD_KEY_LEN, min_length=1, field_name="result_key")
        if not WC_AWARD_KEY_RE.fullmatch(key):
            raise ValueError("invalid result_key format")
        return key

    @field_validator("result_data")
    @classmethod
    def validate_result_data(cls, value: Dict[str, Any]) -> Dict[str, Any]:
        if len(value) > 50:
            raise ValueError("result_data is too large")
        return value


class WcResultsBulk(BaseModel):
    results: List[WcResultItem] = Field(default_factory=list, max_length=100)

# ============================================================================
# BATTLE SCHEMAS
# ============================================================================
class BattleAnswerPayload(BaseModel):
    option: Optional[str] = Field(None, pattern="^[A-D]$")
    time_taken_ms: int = Field(..., ge=0, le=120_000)

# ============================================================================
# ACHIEVEMENT SCHEMAS
# ============================================================================
class AchievementRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon_url: Optional[str]
    condition_type: Optional[str]
    condition_value: Optional[int]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserAchievementRead(BaseModel):
    id: int
    user_id: UUID
    achievement: AchievementRead
    earned_at: datetime

    model_config = ConfigDict(from_attributes=True)
