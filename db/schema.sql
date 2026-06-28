-- Verse / Poetry app — PostgreSQL schema
-- Target: Neon (or any standard Postgres). Run with:
--   psql "$DATABASE_URL" -f db/schema.sql

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gives us gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enum: moderation status for submitted poems
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE poem_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_mode AS ENUM ('write', 'file', 'seed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- poetry_forms: lookup table (Free Verse, Sonnet, Haiku, ...)
-- "count" is NOT stored as a static number — it's derived from poems via the
-- poetry_forms_with_counts view below, so it never drifts out of sync.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poetry_forms (
  name        TEXT PRIMARY KEY,
  icon        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- poems: every poem that exists or has ever been submitted.
-- Both the 8 originally-hardcoded poems and brand-new user submissions live
-- here, distinguished by `status` and `submission_mode`.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poems (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- core content
  title            TEXT NOT NULL,
  author           TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  form             TEXT NOT NULL REFERENCES poetry_forms(name) ON UPDATE CASCADE,
  language         TEXT NOT NULL DEFAULT 'English',
  description      TEXT NOT NULL,
  content          TEXT NOT NULL,

  -- cover gradient: stored as 3 explicit hex columns, matching the
  -- TypeScript tuple type `[string, string, string]` 1:1
  cover_color_1    TEXT NOT NULL DEFAULT '#8B4513',
  cover_color_2    TEXT NOT NULL DEFAULT '#C0702A',
  cover_color_3    TEXT NOT NULL DEFAULT '#6B3410',

  -- derived/display stats
  lines            INTEGER NOT NULL DEFAULT 0,
  readers          INTEGER NOT NULL DEFAULT 0,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,

  -- moderation / submission workflow
  status           poem_status NOT NULL DEFAULT 'pending',
  submission_mode  submission_mode NOT NULL DEFAULT 'write',
  source_filename  TEXT,                 -- original filename if uploaded as a file
  rejection_reason TEXT,
  reviewed_at      TIMESTAMPTZ,
  reviewed_by      TEXT,

  -- contact info captured at submission time (optional, not shown publicly)
  submitter_email  TEXT,

  uploaded_at      DATE NOT NULL DEFAULT CURRENT_DATE,  -- public-facing "published" date
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),  -- actual submission timestamp
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_poems_status        ON poems (status);
CREATE INDEX IF NOT EXISTS idx_poems_form           ON poems (form);
CREATE INDEX IF NOT EXISTS idx_poems_uploaded_at    ON poems (uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_poems_status_uploaded ON poems (status, uploaded_at DESC);

-- keep updated_at fresh automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_poems_updated_at ON poems;
CREATE TRIGGER trg_poems_updated_at
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- View: poetry_forms_with_counts
-- Mirrors the `PoetryForm` TS type ({ name, icon, count }), but count is
-- always live — counts only *approved* poems, same as what the site shows.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW poetry_forms_with_counts AS
SELECT
  pf.name,
  pf.icon,
  pf.sort_order,
  COUNT(p.id) FILTER (WHERE p.status = 'approved') AS count
FROM poetry_forms pf
LEFT JOIN poems p ON p.form = pf.name
GROUP BY pf.name, pf.icon, pf.sort_order
ORDER BY pf.sort_order;

-- ---------------------------------------------------------------------------
-- View: approved_poems
-- Convenience view matching exactly what the public site should ever query.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW approved_poems AS
SELECT
  id, title, author, slug, form, language, description, content,
  cover_color_1, cover_color_2, cover_color_3,
  lines, readers, featured, uploaded_at
FROM poems
WHERE status = 'approved'
ORDER BY uploaded_at DESC;
