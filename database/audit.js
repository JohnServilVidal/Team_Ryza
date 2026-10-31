// Tells the database WHO is acting, so audit_log and stamp show the real user.
// IMPORTANT: it only lasts for the current transaction (BEGIN ... COMMIT).
// That is on purpose: with the Supabase pooler, connections are shared,
// and a name must never leak from one person's request to another's.

async function setAuditUser(client, name) {
  // stamp column is 60 characters, so keep the name short (30 max)
  const clean = String(name || '').trim().slice(0, 30);
  await client.query("SELECT set_config('app.username', $1, true)", [clean]);
}

// Use this in the app: all database work for one request goes inside it.
async function withAuditUser(pool, name, work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await setAuditUser(client, name);
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { setAuditUser, withAuditUser };