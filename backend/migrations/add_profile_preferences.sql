-- Run once on Supabase/PostgreSQL to store profile preferences (country, teams).
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;
