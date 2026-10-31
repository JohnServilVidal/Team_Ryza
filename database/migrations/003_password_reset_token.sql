-- 003_password_reset_token.sql  (S1-DBA-04)
-- One row = one emailed one-time link.
-- We store only a HASH of the token, so a leaked database cannot be used to reset passwords.

CREATE TABLE password_reset_token (
  token_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES app_user(user_id),
  token_hash  TEXT        NOT NULL UNIQUE,            -- hash of the token, never the token
  purpose     VARCHAR(20) NOT NULL DEFAULT 'reset'
              CHECK (purpose IN ('reset','set_password')),
  expires_at  TIMESTAMPTZ NOT NULL,                   -- link stops working after this time
  used_at     TIMESTAMPTZ,                            -- empty = not used yet
  is_used     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT used_consistent CHECK (
    (is_used = FALSE AND used_at IS NULL) OR (is_used = TRUE AND used_at IS NOT NULL)
  )
);

CREATE INDEX password_reset_token_user_idx ON password_reset_token (user_id);
CREATE INDEX password_reset_token_expiry_idx ON password_reset_token (expires_at);

-- Same security rule as the other user tables.
ALTER TABLE password_reset_token ENABLE ROW LEVEL SECURITY;