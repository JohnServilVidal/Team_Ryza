import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validation ng input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email address and password are required.' }, 
        { status: 400 }
      );
    }

    // 2. Hanapin ang user gamit ang email
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const users = result?.rows || result || [];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Mali ang email o password.' }, 
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.status === 'blocked') {
      return NextResponse.json(
        { error: 'The account is blocked. You cannot sign in.' }, 
        { status: 403 }
      );
    }

    if (user.status === 'pending') {
      return NextResponse.json(
        { error: 'Your account is currently pending and has not yet been approved.' }, 
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful!',
        isFirstLogin: user.is_first_login || false,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Login Error Details:', error?.message || error);
    return NextResponse.json(
      { error: 'A server problem occurred. Try again.' }, 
      { status: 500 }
    );
  }
}