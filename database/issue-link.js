require('dotenv').config();
const crypto = require('crypto');
const { Client } = require('pg');

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  if (!email) {
    console.error('Usage: npm run issue-link -- someone@example.com');
    process.exit(1);
  }
  const c = new Client({
    connectionString: (process.env.DIRECT_URL || process.env.DATABASE_URL).split('?')[0],
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });
  await c.connect();
  try {
    const u = await c.query(
      'select user_id from app_user where lower(email) = $1 and is_deleted = false', [email]);
    if (!u.rows.length) { console.error('No user with that email.'); process.exit(1); }

    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const id = u.rows[0].user_id;

    await c.query(
      `update password_reset_token set is_used = true, used_at = now()
        where user_id = $1 and purpose = 'set_password' and is_used = false`, [id]);
    await c.query(
      `insert into password_reset_token (user_id, token_hash, purpose, expires_at)
       values ($1, $2, 'set_password', now() + interval '24 hours')`, [id, hash]);

    console.log('One-time link (valid 24 hours):');
    console.log((process.env.APP_URL || 'http://localhost:3000') + '/set-password?token=' + token);
  } finally {
    await c.end();
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });