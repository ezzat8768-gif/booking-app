import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const { oldPassword, newPassword } = await req.json();

    // جيب كلمة السر الحالية
    const rows = await sql`SELECT value FROM settings WHERE key = 'admin_password'`;
    
    const currentPassword = rows.length > 0 ? rows[0].value : "admin123";

    if (oldPassword !== currentPassword) {
      return NextResponse.json({ error: "كلمة السر القديمة غلط!" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "كلمة السر الجديدة لازم تكون 6 أحرف على الأقل!" }, { status: 400 });
    }

    // حفظ كلمة السر الجديدة
    await sql`
      INSERT INTO settings (key, value) VALUES ('admin_password', ${newPassword})
      ON CONFLICT (key) DO UPDATE SET value = ${newPassword}
    `;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "حصل خطأ!" }, { status: 500 });
  }
}