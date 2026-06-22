-- ============================================================
-- Seed data for the FIFA World Cup 2026 Prediction Contest App
-- Run AFTER schema.sql:  npm run init-db   (or psql -f seed.sql)
--
-- This is a FRESH-START seed: the official 48 qualified teams, ZERO participants.
-- (Sample participants are provided commented-out at the bottom if you
--  want test data while trying things out.)
-- ============================================================

-- ------------------------------------------------------------
-- TEAMS — the official 48 qualified for FIFA World Cup 2026
-- ------------------------------------------------------------
INSERT INTO teams (name, flag) VALUES
  -- Hosts
  ('Mexico','MX'),
  ('Canada','CA'),
  ('USA','US'),
  -- UEFA (Europe)
  ('Austria','AT'),
  ('Belgium','BE'),
  ('Bosnia and Herzegovina','BA'),
  ('Croatia','HR'),
  ('Czechia','CZ'),
  ('England','ENG'),
  ('France','FR'),
  ('Germany','DE'),
  ('Netherlands','NL'),
  ('Norway','NO'),
  ('Portugal','PT'),
  ('Scotland','SCO'),
  ('Spain','ES'),
  ('Sweden','SE'),
  ('Switzerland','CH'),
  ('Turkey','TR'),
  -- CAF (Africa)
  ('Algeria','DZ'),
  ('Cape Verde','CV'),
  ('DR Congo','CD'),
  ('Ivory Coast','CI'),
  ('Egypt','EG'),
  ('Ghana','GH'),
  ('Morocco','MA'),
  ('Senegal','SN'),
  ('South Africa','ZA'),
  ('Tunisia','TN'),
  -- AFC (Asia)
  ('Australia','AU'),
  ('Iraq','IQ'),
  ('Iran','IR'),
  ('Japan','JP'),
  ('Jordan','JO'),
  ('South Korea','KR'),
  ('Qatar','QA'),
  ('Saudi Arabia','SA'),
  ('Uzbekistan','UZ'),
  -- CONMEBOL (South America)
  ('Argentina','AR'),
  ('Brazil','BR'),
  ('Colombia','CO'),
  ('Ecuador','EC'),
  ('Paraguay','PY'),
  ('Uruguay','UY'),
  -- CONCACAF (non-host)
  ('Curaçao','CW'),
  ('Haiti','HT'),
  ('Panama','PA'),
  -- OFC (Oceania)
  ('New Zealand','NZ')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------
-- OPTIONAL sample participants (for testing only).
-- To load them, remove the /* and */ around this block, then re-run init-db.
-- ------------------------------------------------------------
/*
INSERT INTO users (full_name, designation, section, whatsapp, team, status) VALUES
  ('Anjali Menon',    'Child Development Officer', 'Field Operations', '9847012301', 'Argentina', 'active'),
  ('Rahul Nair',      'Junior Superintendent',     'Administration',   '9847012302', 'Brazil',    'active'),
  ('Fathima Beevi',   'Project Officer',           'ICDS',             '9847012303', 'France',    'active'),
  ('Suresh Kumar',    'Clerk',                     'Accounts',         '9847012304', 'Argentina', 'active'),
  ('Deepa Pillai',    'Supervisor',                'Anganwadi',        '9847012305', 'Spain',     'active');
*/
