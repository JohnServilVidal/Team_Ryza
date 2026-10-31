import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 });
    }

    const result = await query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [token]
    );
    const users = result?.rows || result || [];

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      `UPDATE users 
       SET password = $1, reset_token = NULL, reset_token_expiry = NULL 
       WHERE reset_token = $2`,
      [hashedPassword, token]
    );

    return NextResponse.json({ message: 'Successfully changed the password!' }, { status: 200 });

  } catch (error: any) {
    console.error('Reset Password Action Error:', error?.message || error);
    return NextResponse.json({ error: 'A server problem occurred.' }, { status: 500 });
  }
}