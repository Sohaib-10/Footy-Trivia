-- PostgreSQL 16 Schema for Footy-Trivia
-- Dependencies: uuid-ossp (optional, gen_random_uuid() is built-in for PG 16)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. COUNTRIES
-- ============================================================================
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code CHAR(3) UNIQUE NOT NULL, -- FIFA 3-letter code, e.g., ENG, ESP, BRA
    flag_url TEXT,
    confederation VARCHAR(10), -- UEFA, CONMEBOL, CAF, AFC, CONCACAF, OFC
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. TEAMS
-- ============================================================================
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    logo_url TEXT,
    country_id INT REFERENCES countries(id) ON DELETE SET NULL,
    type VARCHAR(10) CHECK (type IN ('club', 'national')),
    founded_year SMALLINT,
    stadium VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. USERS
-- ============================================================================
-- NOTE: password_hash stores bcrypt hashes.
-- Bcrypt hashes are 60 characters long. VARCHAR(255) or TEXT is ideal.
-- Plaintext passwords MUST NEVER be stored.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    session_token VARCHAR(36),
    last_activity_at TIMESTAMP
);

-- Create index on email for quick auth queries
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- 4. PROFILES
-- ============================================================================
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    country_id INT REFERENCES countries(id) ON DELETE SET NULL,
    favourite_team_id INT REFERENCES teams(id) ON DELETE SET NULL,
    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_quizzes_played INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. QUESTIONS
-- ============================================================================
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
    category VARCHAR(30) NOT NULL CHECK (category IN ('transfers','history','world_cup','clubs','players','general')),
    team_id INT REFERENCES teams(id) ON DELETE SET NULL,
    country_id INT REFERENCES countries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. QUIZ_SESSIONS
-- ============================================================================
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy','medium','hard','mixed')),
    category VARCHAR(30),
    total_questions INT NOT NULL,
    score INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_quiz_sessions_user_id ON quiz_sessions(user_id);

-- ============================================================================
-- 7. SESSION_ANSWERS
-- ============================================================================
CREATE TABLE session_answers (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    selected_option CHAR(1) CHECK (selected_option IN ('A','B','C','D')),
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds SMALLINT,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. USER_PROGRESS
-- ============================================================================
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_points INT DEFAULT 0 CHECK (total_points >= 0),
    total_correct INT DEFAULT 0,
    total_incorrect INT DEFAULT 0,
    total_questions_answered INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_played_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- ============================================================================
-- 9. LEADERBOARD
-- ============================================================================
CREATE TABLE leaderboard (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    rank INT,
    total_points INT DEFAULT 0,
    weekly_points INT DEFAULT 0,
    monthly_points INT DEFAULT 0,
    country_id INT REFERENCES countries(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);

-- ============================================================================
-- 10. ACHIEVEMENTS
-- ============================================================================
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., "First Quiz", "Hat-Trick Hero"
    description TEXT,
    icon_url TEXT,
    condition_type VARCHAR(30), -- quizzes_played, correct_streak, total_points
    condition_value INT, -- target threshold value
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. USER_ACHIEVEMENTS
-- ============================================================================
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- 12. BATTLE_ROOMS
-- ============================================================================
CREATE TABLE battle_rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code   CHAR(6) UNIQUE NOT NULL,      -- the 6-char code
  host_id     UUID REFERENCES users(id) ON DELETE SET NULL,    -- Player A
  guest_id    UUID REFERENCES users(id) ON DELETE SET NULL,    -- Player B (null until joined)
  status      VARCHAR(20) DEFAULT 'waiting' 
              CHECK (status IN ('waiting','in_progress','completed','abandoned')),
  current_question_index  INT DEFAULT 0,
  total_questions         INT DEFAULT 10,
  difficulty  VARCHAR(10) DEFAULT 'mixed',
  category    VARCHAR(30) DEFAULT 'general',
  host_score  INT DEFAULT 0,
  guest_score INT DEFAULT 0,
  winner_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  started_at  TIMESTAMPTZ,
  ended_at    TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 minutes'
);

-- ============================================================================
-- 13. BATTLE_ROOM_QUESTIONS
-- ============================================================================
CREATE TABLE battle_room_questions (
  id          SERIAL PRIMARY KEY,
  room_id     UUID REFERENCES battle_rooms(id) ON DELETE CASCADE,
  question_id INT  REFERENCES questions(id) ON DELETE CASCADE,
  order_index INT  NOT NULL,             -- question 1,2,3...10
  UNIQUE(room_id, order_index)
);

-- ============================================================================
-- 14. BATTLE_ANSWERS
-- ============================================================================
CREATE TABLE battle_answers (
  id              SERIAL PRIMARY KEY,
  room_id         UUID REFERENCES battle_rooms(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id     INT  REFERENCES questions(id) ON DELETE CASCADE,
  selected_option CHAR(1) CHECK (selected_option IN ('A','B','C','D')),
  is_correct      BOOLEAN NOT NULL,
  time_taken_ms   INT,                   -- milliseconds, for tiebreaking
  answered_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id, question_id) -- one answer per player per question
);

-- ============================================================================
-- SAMPLE SEED DATA
-- ============================================================================

-- 1. Seed Countries
INSERT INTO countries (name, code, flag_url, confederation) VALUES
('England', 'ENG', 'https://flagcdn.com/w320/gb-eng.png', 'UEFA'),
('Spain', 'ESP', 'https://flagcdn.com/w320/es.png', 'UEFA'),
('Germany', 'GER', 'https://flagcdn.com/w320/de.png', 'UEFA'),
('France', 'FRA', 'https://flagcdn.com/w320/fr.png', 'UEFA'),
('Brazil', 'BRA', 'https://flagcdn.com/w320/br.png', 'CONMEBOL'),
('Argentina', 'ARG', 'https://flagcdn.com/w320/ar.png', 'CONMEBOL'),
('Italy', 'ITA', 'https://flagcdn.com/w320/it.png', 'UEFA'),
('Pakistan', 'PAK', 'https://flagcdn.com/pk.svg', 'AFC');

-- 2. Seed Teams
INSERT INTO teams (name, logo_url, country_id, type, founded_year, stadium) VALUES
('Manchester United', 'https://crests.football-data.org/66.png', 1, 'club', 1878, 'Old Trafford'),
('Real Madrid CF', 'https://crests.football-data.org/86.png', 2, 'club', 1902, 'Santiago Bernabéu'),
('FC Barcelona', 'https://crests.football-data.org/81.png', 2, 'club', 1899, 'Spotify Camp Nou'),
('Atlético Madrid', 'https://crests.football-data.org/78.png', 2, 'club', 1903, 'Cívitas Metropolitano'),
('Manchester City', 'https://crests.football-data.org/65.png', 1, 'club', 1880, 'Etihad Stadium'),
('Chelsea FC', 'https://crests.football-data.org/61.png', 1, 'club', 1905, 'Stamford Bridge'),
('Arsenal FC', 'https://crests.football-data.org/57.png', 1, 'club', 1886, 'Emirates Stadium'),
('Liverpool FC', 'https://crests.football-data.org/64.png', 1, 'club', 1892, 'Anfield');

-- 3. Seed Achievements
INSERT INTO achievements (name, description, icon_url, condition_type, condition_value) VALUES
('First Kick', 'Complete your very first quiz session', 'https://img.icons8.com/color/96/football.png', 'quizzes_played', 1),
('Hat-Trick Hero', 'Get 3 correct answers in a row', 'https://img.icons8.com/color/96/fire-element.png', 'correct_streak', 3),
('Clean Sheet', 'Complete a quiz with 100% accuracy', 'https://img.icons8.com/color/96/shield.png', 'accuracy', 100),
('Trivia Master', 'Reach 1,000 total points', 'https://img.icons8.com/color/96/trophy.png', 'total_points', 1000),
('La Liga Scholar', 'Complete the La Liga category quiz', 'https://img.icons8.com/color/96/spain.png', 'category_completed_la-liga', 1);

-- 4. Seed Questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, category, team_id, country_id) VALUES
-- La Liga
('Which club has won the most La Liga titles?', 'FC Barcelona', 'Real Madrid', 'Atletico Madrid', 'Valencia', 'B', 'easy', 'clubs', 2, 2),
('Who is La Liga''s all-time top scorer?', 'Ronaldo Nazário', 'Lionel Messi', 'Karim Benzema', 'Raúl', 'B', 'medium', 'players', 3, 2),
('Which stadium hosts El Clasico at home for Real Madrid?', 'Camp Nou', 'Vicente Calderón', 'Metropolitano', 'Santiago Bernabéu', 'D', 'easy', 'clubs', 2, 2),
('What year did Barcelona complete the historic treble?', '2006', '2009', '2011', '2015', 'B', 'medium', 'history', 3, 2),
('What is the home stadium of Atletico Madrid?', 'San Mamés', 'Mestalla', 'Metropolitano', 'Ramón Sánchez Pizjuán', 'C', 'easy', 'clubs', 4, 2),
('Which player won the Pichichi Trophy (top scorer) most times?', 'Lionel Messi', 'Telmo Zarra', 'Alfredo Di Stéfano', 'Hugo Sánchez', 'A', 'medium', 'players', 3, 2),
-- Premier League
('Who is Manchester United''s all-time leading goalscorer?', 'Bobby Charlton', 'Wayne Rooney', 'Ryan Giggs', 'Denis Law', 'B', 'easy', 'players', 1, 1),
('In what year did Manchester United win their historic Treble?', '1998', '1999', '2001', '2008', 'B', 'easy', 'history', 1, 1),
('Who holds the record for the most appearances for Manchester United?', 'Bobby Charlton', 'Paul Scholes', 'Ryan Giggs', 'Gary Neville', 'C', 'medium', 'players', 1, 1),
('Who scored the famous 93:20 winning goal to win Man City the 2012 Premier League?', 'Mario Balotelli', 'Edin Džeko', 'Sergio Agüero', 'Yaya Touré', 'C', 'easy', 'players', 5, 1);

-- 5. Users, profiles, progress, and leaderboard are created via /api/auth/register.
