from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

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

# ============================================================================
# COUNTRY SCHEMAS
# ============================================================================
class CountryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    code: str = Field(..., min_length=3, max_length=3)
    flag_url: Optional[str] = None
    confederation: Optional[str] = Field(None, max_length=10)

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
    logo_url: Optional[str] = None
    country_id: Optional[int] = None
    type: Optional[str] = Field(None, pattern="^(club|national)$")
    founded_year: Optional[int] = None
    stadium: Optional[str] = Field(None, max_length=150)

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
    display_name: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    country_id: Optional[int] = None
    favourite_team_id: Optional[int] = None

class ProfileRead(BaseModel):
    id: int
    user_id: UUID
    display_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    country_id: Optional[int]
    favourite_team_id: Optional[int]
    total_quizzes_played: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# USER SCHEMAS
# ============================================================================
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    username: str = Field(..., min_length=3, max_length=50)

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
    password: str

class EmailTokenRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class PublicProfileRead(BaseModel):
    username: str
    profile: Optional[ProfileRead]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# QUESTION SCHEMAS
# ============================================================================
class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str = Field(..., pattern="^[A-D]$")
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")
    category: str = Field(..., pattern="^(transfers|history|world_cup|clubs|players|general)$")
    team_id: Optional[int] = None
    country_id: Optional[int] = None

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_option: Optional[str] = Field(None, pattern="^[A-D]$")
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
    category: Optional[str] = Field(None, pattern="^(transfers|history|world_cup|clubs|players|general)$")
    team_id: Optional[int] = None
    country_id: Optional[int] = None

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
    total_questions: int = Field(10, ge=1, le=50)

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
    question_id: int
    selected_option: str = Field(..., pattern="^[A-D]$")
    time_taken_seconds: Optional[int] = Field(None, ge=0)

class SessionAnswerRead(BaseModel):
    id: int
    session_id: UUID
    question_id: int
    selected_option: Optional[str]
    is_correct: bool
    time_taken_seconds: Optional[int]
    answered_at: datetime

    model_config = ConfigDict(from_attributes=True)

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
    points_earned: int = Field(0, ge=0)
    correct: int = Field(0, ge=0)
    incorrect: int = Field(0, ge=0)
    questions_answered: int = Field(0, ge=0)
    longest_streak: Optional[int] = Field(None, ge=0)
    current_streak: Optional[int] = Field(None, ge=0)
    quizzes_played: int = Field(0, ge=0)

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
class WcPredictionsSync(BaseModel):
    matches: Dict[str, Any] = Field(default_factory=dict)
    awards: Dict[str, Any] = Field(default_factory=dict)
    groups: Dict[str, Any] = Field(default_factory=dict)
    third_place: List[str] = Field(default_factory=list)
    bracket: List[Any] = Field(default_factory=list)
    champion: Optional[Any] = None


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
    result_key: str
    result_data: Dict[str, Any] = Field(default_factory=dict)


class WcResultsBulk(BaseModel):
    results: List[WcResultItem]


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
