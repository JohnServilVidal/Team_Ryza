import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Kailangan ang email at bagong password.' }, { status: 400 });
    }

    // 1. I-hash ang bagong password gamit ang bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 2. I-update ang password sa database at gawing false ang is_first_login, tas active na ang status
    const result = await query(
      `UPDATE users 
       SET password = $1, is_first_login = FALSE, status = 'active' 
       WHERE email = $2 RETURNING id, name, email, role, status`,
      [hashedPassword, email]
    );

    const updatedRows = result?.rows || result || [];
    if (updatedRows.length === 0) {
      return NextResponse.json({ error: 'Hindi nahanap ang user.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Matagumpay na na-set ang iyong bagong password!',
      user: updatedRows[0]
    }, { status: 200 });

  } catch (error: any) {
    console.error('Set Password Error:', error?.message || error);
    return NextResponse.json({ error: 'May naganap na problema sa server.' }, { status: 500 });
  }
}