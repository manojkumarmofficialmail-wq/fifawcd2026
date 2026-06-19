-- ============================================================
-- Migration: add page-visibility controls to admin_settings
-- Safe to run on your existing Neon database — it does NOT delete data.
-- Run this in the Neon SQL Editor BEFORE deploying the new code.
-- ============================================================

ALTER TABLE admin_settings
  ADD COLUMN IF NOT EXISTS show_register BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE admin_settings
  ADD COLUMN IF NOT EXISTS show_live BOOLEAN NOT NULL DEFAULT TRUE;
