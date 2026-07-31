import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM languages ORDER BY sort_order ASC");
    return NextResponse.json({ languages: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, ...langData } = await req.json();
    if (!await isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, slug, extension, compiler_cmd, run_cmd, compile_cmd, piston_lang, piston_version, stdin_support, category, sort_order } = langData;

    await query(
      `INSERT INTO languages (name, slug, extension, compiler_cmd, run_cmd, compile_cmd, piston_lang, piston_version, stdin_support, category, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [name, slug, extension, compiler_cmd || null, run_cmd || null, compile_cmd || null, piston_lang || null, piston_version || null, stdin_support ? true : false, category || "general", sort_order || 0]
    );

    return NextResponse.json({ message: "Language added" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { email, id, ...langData } = await req.json();
    if (!await isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    for (const [key, val] of Object.entries(langData)) {
      if (key === "is_active" || key === "stdin_support") {
        fields.push(`${key} = $${paramIndex}`);
        values.push(val ? true : false);
      } else {
        fields.push(`${key} = $${paramIndex}`);
        values.push(val);
      }
      paramIndex++;
    }
    values.push(id);

    await query(`UPDATE languages SET ${fields.join(", ")} WHERE id = $${paramIndex}`, values);
    return NextResponse.json({ message: "Language updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email, id } = await req.json();
    if (!await isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await query("DELETE FROM languages WHERE id = $1", [id]);
    return NextResponse.json({ message: "Language deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
