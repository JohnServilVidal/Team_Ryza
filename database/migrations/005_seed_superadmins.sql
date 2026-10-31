-- 005_seed_superadmins.sql  (S1-DBA-05, part 2)
-- One superadmin per team member. NO passwords here.
-- password_hash stays empty; each person sets a password through a
-- one-time set-password link (created by the app, see S1-DEV-03).

INSERT INTO app_user
  (first_name, last_name, email, role_code, approval_status, stamp)
VALUES
  ('John Servil', 'Vidal',   'REAL_EMAIL_1@example.com', 'superadmin', 'approved', 'ADD system'),
  ('Member2',     'Surname', 'REAL_EMAIL_2@example.com', 'superadmin', 'approved', 'ADD system'),
  ('Member3',     'Surname', 'REAL_EMAIL_3@example.com', 'superadmin', 'approved', 'ADD system'),
  ('Member4',     'Surname', 'REAL_EMAIL_4@example.com', 'superadmin', 'approved', 'ADD system'),
  ('Member5',     'Surname', 'REAL_EMAIL_5@example.com', 'superadmin', 'approved', 'ADD system')
ON CONFLICT DO NOTHING;