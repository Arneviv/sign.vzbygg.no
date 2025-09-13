-- Kjør denne i Postgres (Vercel Postgres)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip TEXT,
  user_agent TEXT,
  meta JSONB,
  spam_score INTEGER NOT NULL DEFAULT 0
);
