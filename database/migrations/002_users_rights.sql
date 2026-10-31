-- 002_users_rights.sql  (S1-DBA-03)
-- Tables only. The data (roles, modules, 36 rights) comes in the next task.

CREATE TABLE role (
  role_code VARCHAR(20) PRIMARY KEY,          -- superadmin, admin, user
  role_name VARCHAR(50) NOT NULL
);

CREATE TABLE module (
  module_code VARCHAR(20) PRIMARY KEY,        -- customer, product, hr, sales, reports
  module_name VARCHAR(50) NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE rights_catalog (                 -- one row per checkbox in the Rights dialog
  right_code  VARCHAR(40) PRIMARY KEY,        -- example: customer_add
  module_code VARCHAR(20) NOT NULL REFERENCES module(module_code),
  right_name  VARCHAR(80) NOT NULL,           -- example: Add Customer
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE app_user (
  user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name      VARCHAR(50)  NOT NULL,
  last_name       VARCHAR(50)  NOT NULL,
  email           VARCHAR(120) NOT NULL,
  password_hash   TEXT,                       -- empty until the first password is set
  role_code       VARCHAR(20)  NOT NULL DEFAULT 'user' REFERENCES role(role_code),
  approval_status VARCHAR(10)  NOT NULL DEFAULT 'pending'
                  CHECK (approval_status IN ('pending','approved')),
  is_blocked      BOOLEAN      NOT NULL DEFAULT FALSE,
  is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
  stamp           VARCHAR(60),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX app_user_email_uq ON app_user (lower(email));

CREATE TABLE user_permission (                -- one row = one ticked checkbox
  user_id    UUID        NOT NULL REFERENCES app_user(user_id),
  right_code VARCHAR(40) NOT NULL REFERENCES rights_catalog(right_code),
  is_deleted BOOLEAN     NOT NULL DEFAULT FALSE,   -- unticking = soft delete
  stamp      VARCHAR(60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, right_code)
);

-- Security: Supabase can expose tables to the internet. These tables hold
-- password hashes, so switch on Row Level Security with no policies.
-- Our own server connects directly and is not affected.
ALTER TABLE role            ENABLE ROW LEVEL SECURITY;
ALTER TABLE module          ENABLE ROW LEVEL SECURITY;
ALTER TABLE rights_catalog  ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_user        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permission ENABLE ROW LEVEL SECURITY;