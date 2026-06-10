import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, SmallInteger, Boolean, Text, ForeignKey, CHAR, CheckConstraint, UniqueConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base

class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(3), unique=True, nullable=False) # CHAR(3)
    flag_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confederation: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())

    # Relationships
    teams: Mapped[List["Team"]] = relationship(back_populates="country", cascade="all, delete-orphan")
    profiles: Mapped[List["Profile"]] = relationship(back_populates="country")
    questions: Mapped[List["Question"]] = relationship(back_populates="country")
    leaderboards: Mapped[List["Leaderboard"]] = relationship(back_populates="country")

class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    logo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country_id: Mapped[Optional[int]] = mapped_column(ForeignKey("countries.id", ondelete="SET NULL"), nullable=True)
    type: Mapped[str] = mapped_column(String(10), nullable=True)
    founded_year: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    stadium: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())

    __table_args__ = (
        CheckConstraint("type IN ('club', 'national')", name="check_team_type"),
    )

    # Relationships
    country: Mapped[Optional[Country]] = relationship(back_populates="teams")
    profiles: Mapped[List["Profile"]] = relationship(back_populates="favourite_team")
    questions: Mapped[List["Question"]] = relationship(back_populates="team")

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    role: Mapped[str] = mapped_column(String(10), default="user", nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    last_login: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    session_token: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    last_activity_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    password_reset_nonce: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    email_verify_nonce: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="check_user_role"),
    )

    # Relationships
    profile: Mapped["Profile"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    progress: Mapped["UserProgress"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    leaderboard: Mapped["Leaderboard"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    wc_leaderboard: Mapped["WcLeaderboard"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    wc_predictions: Mapped["WcUserPredictions"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    quiz_sessions: Mapped[List["QuizSession"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    achievements: Mapped[List["UserAchievement"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    display_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country_id: Mapped[Optional[int]] = mapped_column(ForeignKey("countries.id", ondelete="SET NULL"), nullable=True)
    favourite_team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    preferences: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    total_quizzes_played: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())

    # Relationships
    user: Mapped[User] = relationship(back_populates="profile")
    country: Mapped[Optional[Country]] = relationship(back_populates="profiles")
    favourite_team: Mapped[Optional[Team]] = relationship(back_populates="profiles")

class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    option_a: Mapped[str] = mapped_column(Text, nullable=False)
    option_b: Mapped[str] = mapped_column(Text, nullable=False)
    option_c: Mapped[str] = mapped_column(Text, nullable=False)
    option_d: Mapped[str] = mapped_column(Text, nullable=False)
    correct_option: Mapped[str] = mapped_column(CHAR(1), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(10), nullable=False)
    category: Mapped[str] = mapped_column(String(30), nullable=False)
    source_topic: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    country_id: Mapped[Optional[int]] = mapped_column(ForeignKey("countries.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())

    __table_args__ = (
        CheckConstraint("correct_option IN ('A', 'B', 'C', 'D')", name="check_correct_option"),
        CheckConstraint("difficulty IN ('easy', 'medium', 'hard')", name="check_question_difficulty"),
        CheckConstraint("category IN ('transfers', 'history', 'world_cup', 'clubs', 'players', 'general')", name="check_question_category"),
    )

    # Relationships
    team: Mapped[Optional[Team]] = relationship(back_populates="questions")
    country: Mapped[Optional[Country]] = relationship(back_populates="questions")
    session_answers: Mapped[List["SessionAnswer"]] = relationship(back_populates="question", cascade="all, delete-orphan")

class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    difficulty: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    topic: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    verify_key: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    challenge_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    started_at: Mapped[datetime] = mapped_column(default=func.now())
    ended_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    __table_args__ = (
        CheckConstraint("difficulty IN ('easy', 'medium', 'hard', 'mixed')", name="check_session_difficulty"),
    )

    # Relationships
    user: Mapped[User] = relationship(back_populates="quiz_sessions")
    answers: Mapped[List["SessionAnswer"]] = relationship(back_populates="session", cascade="all, delete-orphan")
    session_questions: Mapped[List["QuizSessionQuestion"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", order_by="QuizSessionQuestion.order_index"
    )


class QuizSessionQuestion(Base):
    __tablename__ = "quiz_session_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("quiz_sessions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("session_id", "question_id", name="uq_quiz_session_question"),
        UniqueConstraint("session_id", "order_index", name="uq_quiz_session_order"),
    )

    session: Mapped["QuizSession"] = relationship(back_populates="session_questions")
    question: Mapped["Question"] = relationship()


class SessionAnswer(Base):
    __tablename__ = "session_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("quiz_sessions.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_option: Mapped[Optional[str]] = mapped_column(CHAR(1), nullable=True)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    time_taken_seconds: Mapped[Optional[int]] = mapped_column(SmallInteger, nullable=True)
    answered_at: Mapped[datetime] = mapped_column(default=func.now())

    __table_args__ = (
        CheckConstraint("selected_option IN ('A', 'B', 'C', 'D')", name="check_selected_option"),
        UniqueConstraint("session_id", "question_id", name="uq_session_answer_question"),
    )

    # Relationships
    session: Mapped[QuizSession] = relationship(back_populates="answers")
    question: Mapped[Question] = relationship(back_populates="session_answers")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    total_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_correct: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_incorrect: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_questions_answered: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_played_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("total_points >= 0", name="check_user_progress_total_points"),
    )

    # Relationships
    user: Mapped[User] = relationship(back_populates="progress")

class Leaderboard(Base):
    __tablename__ = "leaderboard"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    total_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    weekly_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    monthly_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    country_id: Mapped[Optional[int]] = mapped_column(ForeignKey("countries.id", ondelete="SET NULL"), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())

    # Relationships
    user: Mapped[User] = relationship(back_populates="leaderboard")
    country: Mapped[Optional[Country]] = relationship(back_populates="leaderboards")


class WcUserPredictions(Base):
    __tablename__ = "wc_user_predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    data: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())

    user: Mapped[User] = relationship(back_populates="wc_predictions")


class WcLeaderboard(Base):
    __tablename__ = "wc_leaderboard"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    total_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    correct_predictions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_graded: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("total_points >= 0", name="check_wc_leaderboard_total_points"),
    )

    user: Mapped[User] = relationship(back_populates="wc_leaderboard")


class WcResult(Base):
    __tablename__ = "wc_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    result_key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    result_data: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    condition_type: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    condition_value: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())

    # Relationships
    user_achievements: Mapped[List["UserAchievement"]] = relationship(back_populates="achievement", cascade="all, delete-orphan")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )

    # Relationships
    user: Mapped[User] = relationship(back_populates="achievements")
    achievement: Mapped[Achievement] = relationship(back_populates="user_achievements")

class BattleRoom(Base):
    __tablename__ = "battle_rooms"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    room_code: Mapped[str] = mapped_column(String(6), unique=True, nullable=False)
    host_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    guest_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="waiting", nullable=False)
    current_question_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(10), default="mixed", nullable=False)
    category: Mapped[str] = mapped_column(String(30), default="general", nullable=False)
    host_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    guest_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    host_ready: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    guest_ready: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    question_deadline: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    winner_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    expires_at: Mapped[datetime] = mapped_column(nullable=False)

    __table_args__ = (
        CheckConstraint("status IN ('waiting', 'in_progress', 'completed', 'abandoned')", name="check_battle_room_status"),
    )

    # Relationships
    host: Mapped[Optional[User]] = relationship("User", foreign_keys=[host_id])
    guest: Mapped[Optional[User]] = relationship("User", foreign_keys=[guest_id])
    winner: Mapped[Optional[User]] = relationship("User", foreign_keys=[winner_id])
    questions: Mapped[List["BattleRoomQuestion"]] = relationship("BattleRoomQuestion", back_populates="room", cascade="all, delete-orphan")
    answers: Mapped[List["BattleAnswer"]] = relationship("BattleAnswer", back_populates="room", cascade="all, delete-orphan")

class BattleRoomQuestion(Base):
    __tablename__ = "battle_room_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("battle_rooms.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("room_id", "order_index", name="uq_battle_room_question_order"),
    )

    # Relationships
    room: Mapped[BattleRoom] = relationship("BattleRoom", back_populates="questions")
    question: Mapped[Question] = relationship("Question")

class BattleAnswer(Base):
    __tablename__ = "battle_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("battle_rooms.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_option: Mapped[Optional[str]] = mapped_column(CHAR(1), nullable=True)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    time_taken_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    answered_at: Mapped[datetime] = mapped_column(default=func.now())

    __table_args__ = (
        CheckConstraint("selected_option IN ('A', 'B', 'C', 'D')", name="check_battle_answer_option"),
        UniqueConstraint("room_id", "user_id", "question_id", name="uq_battle_answer_user_question"),
    )

    # Relationships
    room: Mapped[BattleRoom] = relationship("BattleRoom", back_populates="answers")
    user: Mapped[User] = relationship("User")
    question: Mapped[Question] = relationship("Question")
