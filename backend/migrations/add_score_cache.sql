-- Run once in Supabase SQL editor for World Cup score caching.
CREATE TABLE IF NOT EXISTS score_cache (
    cache_key   TEXT PRIMARY KEY,
    payload     JSONB NOT NULL,
    fetched_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ NOT NULL
);
