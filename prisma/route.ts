import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ref, name, phone, email, date, time, service, notes } = await req.json();
    const rows = await sql`
      INSERT INTO bookings (ref, name, phone, email, date, time, service, notes)
      VALUES (${ref}, ${name}, ${phone}, ${email}, ${date}, ${time}, ${service}, ${notes})
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}