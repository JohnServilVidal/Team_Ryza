import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    // 1. Hanapin kung rehistrado ang user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const users = result?.rows || result || [];

    if (users.length === 0) {
      return NextResponse.json({ 
        message: 'If the email is registered, you will receive password reset instructions.' 
      }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. I-save sa database
    await query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
      [resetToken, tokenExpiry, email]
    );

    // 4. (Para sa testing/dev) Ibinabalik natin ang link sa response para madali mong ma-test
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log('Password Reset Link:', resetLink);

    return NextResponse.json({
      message: 'Reset instructions have been successfully sent.',
      // Alisin ang resetToken dito kapag mayroon nang totoong email sender system
      debugResetLink: resetLink 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Forgot Password Error:', error?.message || error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}