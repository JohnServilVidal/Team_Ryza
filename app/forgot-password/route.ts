import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { newToken, hashToken } from '@/lib/tokens';

// Same answer whether or not the email exists, so nobody can probe for accounts.
const GENERIC = 'If the email is registered, you will receive password reset instructions.';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();

    const r = await query(
      'select user_id from app_user where lower(email) = $1 and is_deleted = false',
      [cleanEmail]
    );
    const user = r.rows[0];

    if (user) {
      const token = newToken();
      await withTransaction(async (client) => {
        // Older unused reset links stop working.
        await client.query(
          `update password_reset_token set is_used = true, used_at = now()
            where user_id = $1 and purpose = 'reset' and is_used = false`,
          [user.user_id]
        );
        await client.query(
          `insert into password_reset_token (user_id, token_hash, purpose, expires_at)
           values ($1, $2, 'reset', now() + interval '1 hour')`,
          [user.user_id, hashToken(token)]
        );
      });

      // No email service yet: the link is printed in THIS server terminal only.
      // It is never sent back to the browser. Replace this with a real email later.
      const base = process.env.APP_URL || 'http://localhost:3000';
      console.log('PASSWORD RESET LINK (dev only):', `${base}/reset-password?token=${token}`);
    }

    return NextResponse.json({ message: GENERIC }, { status: 200 });
  } catch (error: any) {
    console.error('Forgot password error:', error?.message || error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}