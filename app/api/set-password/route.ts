import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required.' }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await query(
      `UPDATE users 
       SET password = $1, is_first_login = FALSE, status = 'active' 
       WHERE email = $2 RETURNING id, name, email, role, status`,
      [hashedPassword, email]
    );

    const updatedRows = result?.rows || result || [];
    if (updatedRows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Successfully set your new password!',
      user: updatedRows[0]
    }, { status: 200 });

  } catch (error: any) {
    console.error('Set Password Error:', error?.message || error);
    return NextResponse.json({ error: 'A server problem occurred.' }, { status: 500 });
  }
}