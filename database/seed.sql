-- ============================================================
-- Seed data for the FIFA World Cup 2026 Prediction Contest App
-- Run AFTER schema.sql:  psql -U <user> -d <database> -f seed.sql
-- ============================================================

-- ------------------------------------------------------------
-- TEAMS  (hosts + a broad set of strong national sides)
-- ------------------------------------------------------------
INSERT INTO teams (name, flag) VALUES
  ('Argentina',    '🇦🇷'),
  ('Brazil',       '🇧🇷'),
  ('France',       '🇫🇷'),
  ('England',      '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  ('Spain',        '🇪🇸'),
  ('Germany',      '🇩🇪'),
  ('Portugal',     '🇵🇹'),
  ('Netherlands',  '🇳🇱'),
  ('Italy',        '🇮🇹'),
  ('Belgium',      '🇧🇪'),
  ('Croatia',      '🇭🇷'),
  ('Uruguay',      '🇺🇾'),
  ('USA',          '🇺🇸'),
  ('Mexico',       '🇲🇽'),
  ('Canada',       '🇨🇦'),
  ('Japan',        '🇯🇵'),
  ('South Korea',  '🇰🇷'),
  ('Morocco',      '🇲🇦'),
  ('Senegal',      '🇸🇳'),
  ('Switzerland',  '🇨🇭'),
  ('Denmark',      '🇩🇰'),
  ('Colombia',     '🇨🇴')
ON CONFLICT (name) DO NOTHING;

-- A wider pool so the 48-team dropdown feels complete
INSERT INTO teams (name, flag) VALUES
  ('Australia',    '🇦🇺'),
  ('Poland',       '🇵🇱'),
  ('Serbia',       '🇷🇸'),
  ('Ecuador',      '🇪🇨'),
  ('Ghana',        '🇬🇭'),
  ('Nigeria',      '🇳🇬'),
  ('Cameroon',     '🇨🇲'),
  ('Tunisia',      '🇹🇳'),
  ('Egypt',        '🇪🇬'),
  ('Saudi Arabia', '🇸🇦'),
  ('Iran',         '🇮🇷'),
  ('Qatar',        '🇶🇦'),
  ('Costa Rica',   '🇨🇷'),
  ('Peru',         '🇵🇪'),
  ('Chile',        '🇨🇱'),
  ('Paraguay',     '🇵🇾'),
  ('Sweden',       '🇸🇪'),
  ('Norway',       '🇳🇴'),
  ('Austria',      '🇦🇹'),
  ('Wales',        '🏴󠁧󠁢󠁷󠁬󠁳󠁿'),
  ('Scotland',     '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
  ('Turkey',       '🇹🇷'),
  ('Ukraine',      '🇺🇦'),
  ('Greece',       '🇬🇷'),
  ('Algeria',      '🇩🇿')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------
-- SAMPLE USERS
-- ------------------------------------------------------------
INSERT INTO users (full_name, designation, section, whatsapp, team, status) VALUES
  ('Anjali Menon',      'Child Development Officer', 'Field Operations', '9847012301', 'Argentina',   'active'),
  ('Rahul Nair',        'Junior Superintendent',     'Administration',   '9847012302', 'Brazil',      'active'),
  ('Fathima Beevi',     'Project Officer',           'ICDS',             '9847012303', 'France',      'active'),
  ('Suresh Kumar',      'Clerk',                     'Accounts',         '9847012304', 'Argentina',   'active'),
  ('Deepa Pillai',      'Supervisor',                'Anganwadi',        '9847012305', 'Spain',       'active'),
  ('Vinod Raj',         'Data Entry Operator',       'IT Cell',          '9847012306', 'Brazil',      'active'),
  ('Lakshmi Devi',      'Programme Assistant',       'Field Operations', '9847012307', 'England',     'active'),
  ('Mohammed Ashraf',   'Section Officer',           'Establishment',    '9847012308', 'Portugal',    'active'),
  ('Geetha Krishnan',   'Counsellor',                'Women Protection', '9847012309', 'Germany',     'active'),
  ('Arun Prasad',       'Office Attendant',          'General',          '9847012310', 'Netherlands', 'active'),
  ('Sneha Thomas',      'Project Coordinator',       'ICDS',             '9847012311', 'France',      'active'),
  ('Biju Varghese',     'Accountant',                'Accounts',         '9847012312', 'Argentina',   'active'),
  ('Reshma Banu',       'Supervisor',                'Anganwadi',        '9847012313', 'Brazil',      'active'),
  ('Hari Govind',       'Junior Clerk',              'Administration',   '9847012314', 'Morocco',     'active'),
  ('Priya Soman',       'Programme Officer',         'Field Operations', '9847012315', 'Japan',       'active');
