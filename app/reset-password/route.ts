import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { withTransaction } from '@/lib/db';
import { hashToken, MIN_PASSWORD } from '@/lib/tokens';

const BAD_LINK = 'This reset link is invalid or has expired.';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 });
    }
    if (String(newPassword).length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD} characters.` },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(String(newPassword), 10);

    const ok = await withTransaction(async (client) => {
      const t = await client.query(
        `select token_id, user_id from password_reset_token
          where token_hash = $1 and purpose = 'reset'
            and is_used = false and expires_at > now()
          for update`,
        [hashToken(String(token))]
      );
      if (t.rows.length === 0) return false;

      const { token_id, user_id } = t.rows[0];
      await client.query(
        `update app_user set password_hash = $1, stamp = 'EDIT password reset'
          where user_id = $2 and is_deleted = false`,
        [hash, user_id]
      );
      // One use only.
      await client.query(
        'update password_reset_token set is_used = true, used_at = now() where token_id = $1',
        [token_id]
      );
      return true;
    });

    if (!ok) return NextResponse.json({ error: BAD_LINK }, { status: 400 });
    return NextResponse.json({ message: 'Successfully changed the password!' }, { status: 200 });
  } catch (error: any) {
    console.error('Reset password error:', error?.message || error);
    return NextResponse.json({ error: 'A server problem occurred.' }, { status: 500 });
  }
}