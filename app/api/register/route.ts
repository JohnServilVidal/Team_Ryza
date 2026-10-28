import { NextResponse } from 'next/server'; //[cite: 18]
import { query } from '@/lib/db'; //[cite: 18]

export async function POST(request: Request) { //[cite: 18]
  try {
    const body = await request.json(); //[cite: 18]
    const { name, email, password, role } = body; //[cite: 18]

    if (!name || !email || !password) { //[cite: 18]
      return NextResponse.json( //[cite: 18]
        { error: 'Kailangan ang pangalan, email, at password.' }, //[cite: 18]
        { status: 400 } //[cite: 18]
      );
    }

    // 1. Suriin ang umiiral na user
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]); //[cite: 18]
    
    // Inaayos ang pagbasa ng rows kung 'existingUser.rows' man ito o direktang array 'existingUser'
    const rows = existingUser?.rows || existingUser || [];
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json( //[cite: 18]
        { error: 'Ang email na ito ay nakarehistro na.' }, //[cite: 18]
        { status: 400 } //[cite: 18]
      );
    }

    const userRole = role || 'User'; //[cite: 18]
    
    // 2. I-insert ang bagong user
    const result = await query(
      `INSERT INTO users (name, email, password, role, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING id, name, email, role, status`, //[cite: 18]
      [name, email, password, userRole] //[cite: 18]
    );

    const insertedRows = result?.rows || result || [];
    const newUser = Array.isArray(insertedRows) ? insertedRows[0] : null;

    return NextResponse.json( //[cite: 18]
      {
        message: 'Registration successful! Your account is currently pending.', //[cite: 18]
        user: newUser,
      },
      { status: 201 } //[cite: 18]
    );
  } catch (error: any) {
    // Ipapakita ang kumpletong detalye ng error sa terminal
    console.error('Registration Error Details:', error?.message || error); //[cite: 18]
    return NextResponse.json( //[cite: 18]
      { error: error?.message || 'There was a server problem. Try again.' }, //[cite: 18]
      { status: 500 } //[cite: 18]
    );
  }
}