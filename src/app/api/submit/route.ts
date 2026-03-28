import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS session1_responses (
      id SERIAL PRIMARY KEY,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
      response TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { rating, response } = await req.json();

    if (!rating || rating < 1 || rating > 10 || !response?.trim()) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await ensureTable();
    await sql`INSERT INTO session1_responses (rating, response) VALUES (${rating}, ${response.trim()})`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
