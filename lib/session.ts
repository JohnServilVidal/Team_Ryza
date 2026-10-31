import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

const COOKIE = 'hope_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET is missing or too short (min 32 characters) in .env');
  }
  return s;
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

// Put a signed, httpOnly cookie in the browser. JavaScript in the page cannot read or change it.
export async function createSession(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString('base64url');
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

// Who is logged in? Returns the user from the database, or null.
export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null; // cookie was tampered with

  let data: { uid: string; exp: number };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
  if (!data.uid || data.exp < Math.floor(Date.now() / 1000)) return null;

  const r: any = await query(
    `select user_id, first_name, last_name, email, role_code, approval_status, is_blocked
       from app_user where user_id = $1 and is_deleted = false`,
    [data.uid]
  );
  const u = (r?.rows ?? r ?? [])[0];
  // Checked on every request, so blocking a user takes effect immediately.
  if (!u || u.is_blocked || u.approval_status !== 'approved') return null;
  return u;
}