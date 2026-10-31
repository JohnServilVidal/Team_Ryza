   require('dotenv').config();
   const fs = require('fs');
   const path = require('path');
   const { Client } = require('pg');

   async function main() {
     const client = new Client({
       connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  console.log('connecting...');
  await client.connect();
  console.log('connected!');
     await client.query(
       'CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY, applied_at TIMESTAMPTZ DEFAULT now())'
     );
     const dir = path.join(__dirname, 'migrations');
     const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
     const done = (await client.query('SELECT filename FROM schema_migrations')).rows.map(r => r.filename);
     for (const f of files) {
       if (done.includes(f)) { console.log('skip   ', f); continue; }
       console.log('running', f);
       const sql = fs.readFileSync(path.join(dir, f), 'utf8');
       try {
         await client.query('BEGIN');
         await client.query(sql);
         await client.query('INSERT INTO schema_migrations(filename) VALUES ($1)', [f]);
         await client.query('COMMIT');
       } catch (e) {
         await client.query('ROLLBACK');
         console.error('FAILED', f, e.message);
         process.exit(1);
       }
     }
     await client.end();
     console.log('All migrations done.');
   }
   main();