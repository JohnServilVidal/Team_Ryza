import { Pool, PoolClient } from 'pg';

const raw = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!raw) {
  throw new Error('No DATABASE_URL in .env. Copy .env.example to .env and fill it in.');
}

// Keep one pool alive while Next.js reloads code in development.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: raw.split('?')[0], // remove extra options like ?pgbouncer=true
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    max: 5,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;

export const query = (text: string, params?: any[]) => pool.query(text, params);

// Runs several queries as one unit: all succeed or none do.
export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
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