-- ============================================================
-- FIFA World Cup 2026 Prediction Contest App
-- Women and Child Welfare Committee
-- Directorate of Women and Child Development Department
-- PostgreSQL schema
-- ============================================================

-- Run with:  psql -U <user> -d <database> -f schema.sql

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;

-- ------------------------------------------------------------
-- TEAMS
-- ------------------------------------------------------------
CREATE TABLE teams (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(80) UNIQUE NOT NULL,
    flag          VARCHAR(8)  DEFAULT '',          -- emoji flag for the UI
    is_eliminated BOOLEAN     NOT NULL DEFAULT FALSE,
    eliminated_at TIMESTAMPTZ                       -- when the team went out (for "today" reports)
);

-- ------------------------------------------------------------
-- USERS (staff predictions)
-- ------------------------------------------------------------
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    full_name   VARCHAR(120) NOT NULL,
    designation VARCHAR(120) NOT NULL,
    section     VARCHAR(120) NOT NULL,
    whatsapp    VARCHAR(20)  UNIQUE NOT NULL,       -- duplicate guard
    team        VARCHAR(80)  NOT NULL REFERENCES teams(name) ON UPDATE CASCADE,
    status      VARCHAR(12)  NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'eliminated')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_team   ON users(team);
CREATE INDEX idx_users_status ON users(status);

-- ------------------------------------------------------------
-- ADMIN_SETTINGS (single row holding the prediction window)
-- ------------------------------------------------------------
CREATE TABLE admin_settings (
    id            INTEGER PRIMARY KEY DEFAULT 1,
    start_time    TIMESTAMPTZ,
    end_time      TIMESTAMPTZ,
    show_register BOOLEAN NOT NULL DEFAULT TRUE,
    show_live     BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Seed the single settings row (window open from now for 14 days by default)
INSERT INTO admin_settings (id, start_time, end_time, show_register, show_live)
VALUES (1, NOW(), NOW() + INTERVAL '14 days', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
