-- ============================================================
--  CleanPro — Supabase SQL Migration
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status   AS ENUM ('pending', 'in_progress', 'completed');

-- ── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tasks (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT            NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
    room            TEXT            NOT NULL CHECK (char_length(room)  BETWEEN 1 AND 100),
    priority        task_priority   NOT NULL DEFAULT 'medium',
    status          task_status     NOT NULL DEFAULT 'pending',
    last_cleaned    TIMESTAMPTZ,
    frequency_days  INTEGER         NOT NULL DEFAULT 7
                                    CHECK (frequency_days BETWEEN 1 AND 365),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Auto-update updated_at ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
-- The backend uses the service_role key, which bypasses RLS.
-- Enable RLS anyway so anon/authenticated keys can't directly access the table.

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow the service role full access (implicit — service_role bypasses RLS)
-- Deny everyone else by default (no policies = deny all)

-- ── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_room     ON tasks (room);

-- ── Seed data (optional — remove in production) ───────────────────────────────

INSERT INTO tasks (title, room, priority, status, frequency_days) VALUES
    ('Deep Clean Kitchen',       'Kitchen',     'high',   'pending',    14),
    ('Vacuum Living Room',        'Living Room', 'medium', 'pending',    7),
    ('Scrub Bathroom Tiles',     'Bathroom',    'high',   'in_progress', 10),
    ('Dust Bedroom Shelves',     'Bedroom',     'low',    'pending',    30),
    ('Mop Hallway Floor',        'Hallway',     'low',    'completed',  14),
    ('Clean Oven & Stovetop',    'Kitchen',     'medium', 'pending',    21);
