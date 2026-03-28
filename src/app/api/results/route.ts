import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const avgResult = await sql`
      SELECT
        ROUND(AVG(rating)::numeric, 1) as average,
        COUNT(*) as total
      FROM session1_responses
    `;

    const distResult = await sql`
      SELECT rating, COUNT(*) as count
      FROM session1_responses
      GROUP BY rating
      ORDER BY rating ASC
    `;

    const distribution = Array.from({ length: 10 }, (_, i) => {
      const score = i + 1;
      const found = distResult.rows.find((r) => Number(r.rating) === score);
      return { score, count: found ? Number(found.count) : 0 };
    });

    return NextResponse.json({
      average: Number(avgResult.rows[0]?.average ?? 0),
      total: Number(avgResult.rows[0]?.total ?? 0),
      distribution,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
