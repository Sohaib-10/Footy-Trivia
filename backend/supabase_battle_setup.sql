-- ============================================================================
-- SUPABASE BATTLE TABLES SETUP & REALTIME CONFIGURATION
-- Run this in your Supabase SQL Editor to initialize the battle mode tables.
-- ============================================================================

-- 1. Stores active battle rooms
CREATE TABLE IF NOT EXISTS battle_rooms (
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

-- 2. Which questions are in this room's quiz (pre-selected on room creation)
CREATE TABLE IF NOT EXISTS battle_room_questions (
  id          SERIAL PRIMARY KEY,
  room_id     UUID REFERENCES battle_rooms(id) ON DELETE CASCADE,
  question_id INT  REFERENCES questions(id) ON DELETE CASCADE,
  order_index INT  NOT NULL,             -- question 1,2,3...10
  UNIQUE(room_id, order_index)
);

-- 3. Each player's answer per question per room
CREATE TABLE IF NOT EXISTS battle_answers (
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
-- ENABLE SUPABASE REALTIME
-- ============================================================================
-- Enables real-time capabilities on the battle_rooms table
alter publication supabase_realtime add table battle_rooms;
