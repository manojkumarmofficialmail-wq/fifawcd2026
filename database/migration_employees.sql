-- ============================================================
-- Migration: add the employees allowlist table
-- Safe to run on your existing Neon database — it does NOT delete data.
-- Run this in the Neon SQL Editor BEFORE deploying the new code.
-- ============================================================

CREATE TABLE IF NOT EXISTS employees (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(120) NOT NULL,
    section VARCHAR(120) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employees_section ON employees(section);
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_unique ON employees (lower(name), lower(section));
