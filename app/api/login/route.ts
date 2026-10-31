import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query } from '@/lib/db';
import { createSession } from '@/lib/session';

const INVALID = 'Invalid email or password.';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email address and password are required.' },
        { status: 400 }
      );
    }

    const result: any = await query(
      `select user_id, first_name, last_name, email, password_hash,
              role_code, approval_status, is_blocked
         from app_user
        where lower(email) = lower($1) and is_deleted = false`,
      [email]
    );
    const user = (result?.rows ?? result ?? [])[0];

    // Same message for "no such email" and "wrong password".
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: INVALID }, { status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: INVALID }, { status: 401 });
    }

    // Status is only revealed after the password is correct.
    if (user.is_blocked) {
      return NextResponse.json(
        { error: 'The account is blocked. You cannot sign in.' },
        { status: 403 }
      );
    }
    if (user.approval_status !== 'approved') {
      return NextResponse.json(
        { error: 'Your account is pending and has not yet been approved.' },
        { status: 403 }
      );
    }

    await createSession(user.user_id);

    return NextResponse.json({
      message: 'Login successful!',
      isFirstLogin: false,
      user: {
        id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role_code,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error?.message || error);
    return NextResponse.json(
      { error: 'A server problem occurred. Try again.' },
      { status: 500 }
    );
  }
}