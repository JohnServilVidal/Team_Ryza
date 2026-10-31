require('dotenv').config();
const { Client } = require('pg');
const { setAuditUser } = require('./audit');

let allPass = true;
function check(label, pass) {
  console.log(pass ? 'PASS' : 'FAIL', '-', label);
  if (!pass) allPass = false;
}

async function main() {
  const c = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });
  await c.connect();
  try {
    await c.query('BEGIN');

    // Test 1: with an app user
    await setAuditUser(c, 'Maria Test');
    await c.query("UPDATE customer SET address = address || '!' WHERE custno = 'C0001'");
    const log1 = (await c.query(
      "SELECT action, action_by FROM audit_log WHERE table_name = 'customer' AND record_key = 'C0001' ORDER BY audit_id DESC LIMIT 1"
    )).rows[0];
    check('audit_log.action_by is the app user', log1 && log1.action_by === 'Maria Test');
    check('audit_log.action is EDIT', log1 && log1.action === 'EDIT');
    const st = (await c.query("SELECT stamp FROM customer WHERE custno = 'C0001'")).rows[0];
    check('stamp starts with "EDIT Maria Test"', st && st.stamp.startsWith('EDIT Maria Test'));

    // Test 2: with no app user, it falls back to the database login (never empty)
    await setAuditUser(c, '');
   await c.query("UPDATE customer SET address = address || ' *' WHERE custno = 'C0001'");
    const log2 = (await c.query(
      "SELECT action_by FROM audit_log WHERE table_name = 'customer' AND record_key = 'C0001' ORDER BY audit_id DESC LIMIT 1"
    )).rows[0];
    check('fallback name is not empty and not Maria Test',
          log2 && log2.action_by && log2.action_by !== 'Maria Test');
  } catch (err) {
    allPass = false;
    console.error('ERROR:', err.message);
  } finally {
    await c.query('ROLLBACK');   // undo everything the test did
    await c.end();
  }
  console.log(allPass ? '\nALL TESTS PASSED' : '\nSOME TESTS FAILED');
  process.exit(allPass ? 0 : 1);
}
main();