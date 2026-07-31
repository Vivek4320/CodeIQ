import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query(
      "SELECT id, name, slug, extension, stdin_support, category FROM languages WHERE is_active = $1 ORDER BY sort_order ASC",
      [true]
    );
    return NextResponse.json({ languages: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
