-- ============================================================
-- Seed data for the FIFA World Cup 2026 Prediction Contest App
-- Run AFTER schema.sql:  npm run init-db   (or psql -f seed.sql)
--
-- This is a FRESH-START seed: 48 teams, ZERO participants.
-- (Sample participants are provided commented-out at the bottom if you
--  want test data while trying things out.)
-- ============================================================

-- ------------------------------------------------------------
-- TEAMS — exactly 48 (hosts + a broad set of strong national sides)
-- ------------------------------------------------------------
INSERT INTO teams (name, flag) VALUES
  ('Argentina',    'AR'),
  ('Brazil',       'BR'),
  ('France',       'FR'),
  ('England',      'ENG'),
  ('Spain',        'ES'),
  ('Germany',      'DE'),
  ('Portugal',     'PT'),
  ('Netherlands',  'NL'),
  ('Italy',        'IT'),
  ('Belgium',      'BE'),
  ('Croatia',      'HR'),
  ('Uruguay',      'UY'),
  ('USA',          'US'),
  ('Mexico',       'MX'),
  ('Canada',       'CA'),
  ('Japan',        'JP'),
  ('South Korea',  'KR'),
  ('Morocco',      'MA'),
  ('Senegal',      'SN'),
  ('Switzerland',  'CH'),
  ('Denmark',      'DK'),
  ('Colombia',     'CO'),
  ('Australia',    'AU'),
  ('Poland',       'PL'),
  ('Serbia',       'RS'),
  ('Ecuador',      'EC'),
  ('Ghana',        'GH'),
  ('Nigeria',      'NG'),
  ('Cameroon',     'CM'),
  ('Tunisia',      'TN'),
  ('Egypt',        'EG'),
  ('Saudi Arabia', 'SA'),
  ('Iran',         'IR'),
  ('Qatar',        'QA'),
  ('Costa Rica',   'CR'),
  ('Peru',         'PE'),
  ('Chile',        'CL'),
  ('Paraguay',     'PY'),
  ('Sweden',       'SE'),
  ('Norway',       'NO'),
  ('Austria',      'AT'),
  ('Wales',        'WAL'),
  ('Scotland',     'SCO'),
  ('Turkey',       'TR'),
  ('Ukraine',      'UA'),
  ('Greece',       'GR'),
  ('Algeria',      'DZ'),
  ('Ivory Coast',  'CI')
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
