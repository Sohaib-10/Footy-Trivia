-- Run once on PostgreSQL/Supabase to enforce single-device login and inactivity logout.
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token VARCHAR(36);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP;
