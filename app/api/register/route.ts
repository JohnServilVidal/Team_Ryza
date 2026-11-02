import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query } from '@/lib/db';
import { MIN_PASSWORD } from '@/lib/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // A "role" sent by the browser is ignored on purpose. New users are always "user".
    const { name, email, password } = await request.json();

    const cleanName = String(name ?? '').trim();
    const cleanEmail = String(email ?? '').trim().toLowerCase();
    const pw = String(password ?? '');

    if (!cleanName || !cleanEmail || !pw) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 120) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (pw.length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD} characters.` },
        { status: 400 }
      );
    }

    const parts = cleanName.split(/\s+/);
    const firstName = (parts.shift() as string).slice(0, 50);
    const lastName = parts.join(' ').slice(0, 50);

    const hash = await bcrypt.hash(pw, 10);

    try {
      await query(
        `insert into app_user
           (first_name, last_name, email, password_hash, role_code, approval_status, stamp)
         values ($1, $2, $3, $4, 'user', 'pending', 'ADD self-registered')`,
        [firstName, lastName, cleanEmail, hash]
      );
    } catch (err: any) {
      if (err?.code === '23505') {
        return NextResponse.json(
          { error: 'The email you entered is already registered.' },
          { status: 400 }
        );
      }
      throw err;
    }

    return NextResponse.json(
      { message: 'Registration successful! Your account is currently pending approval.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error?.message || error);
    return NextResponse.json({ error: 'There was a server problem. Try again.' }, { status: 500 });
  }
}