-- ============================================================
-- OMAR'S GYM TRACKER — Supabase Database Setup
-- ============================================================
-- Go to: supabase.com → Your Project → SQL Editor → New Query
-- Paste this entire file and click RUN
-- ============================================================

-- Calorie logs (one per day)
CREATE TABLE IF NOT EXISTS calorie_logs (
  id BIGSERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  calories_consumed INTEGER NOT NULL CHECK (calories_consumed > 0),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout sessions (one per day)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id BIGSERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('upper_a', 'lower_a', 'upper_b', 'lower_b')),
  sequence_index INTEGER NOT NULL DEFAULT 0 CHECK (sequence_index BETWEEN 0 AND 3),
  completed BOOLEAN DEFAULT FALSE,
  exercises_data JSONB DEFAULT '[]'::jsonb,
  calories_burned INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly weight logs
CREATE TABLE IF NOT EXISTS weight_logs (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App state key-value store
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial app state
INSERT INTO app_state (key, value) VALUES
  ('next_sequence_index', '0'),
  ('start_weight', '75'),
  ('start_date', CURRENT_DATE::TEXT)
ON CONFLICT (key) DO NOTHING;

-- Disable Row Level Security (personal use — single user)
ALTER TABLE calorie_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_state DISABLE ROW LEVEL SECURITY;

SELECT '✓ Setup complete! All tables created.' AS status;
