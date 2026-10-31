require('dotenv').config();
const { Client } = require('pg');
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log('host:', new URL(url).host, ' user:', new URL(url).username);
const c = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 });
c.connect()
  .then(() => c.query('select count(*) from customer'))
  .then(r => { console.log('OK, customers:', r.rows[0].count); return c.end(); })
  .catch(e => console.error('ERROR:', e.code, e.message));