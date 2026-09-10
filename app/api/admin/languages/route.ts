import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";
import { compilerLanguages } from "@/lib/compilerLanguages";

const languageIds: Record<string, number | null> = { c: 50, cpp: 54, java: 62, javascript: 63, python: 71, go: 60, ruby: 72, rust: 73, typescript: 74, haskell: 85, html: null, css: null };

export async function GET(req: Request) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const rows = await query("SELECT language, COUNT(*) AS execution_count, COUNT(*) FILTER (WHERE output IS NULL OR (output NOT ILIKE '%error%' AND output NOT ILIKE '%failed%' AND output NOT ILIKE '%exception%' AND output NOT ILIKE '%compilation%')) AS successful_count FROM run_history GROUP BY language");
    const usage = new Map(rows.map((row: any) => [row.language, row]));
    return NextResponse.json({ languages: compilerLanguages.map((language) => {
      const row: any = usage.get(language.editorKey);
      const executions = Number(row?.execution_count || 0);
      const successful = Number(row?.successful_count || 0);
      return { name: language.name, slug: language.editorKey, executionType: language.executionType, languageId: languageIds[language.editorKey], isActive: true, executionCount: executions, successRate: executions ? Number(((successful / executions) * 100).toFixed(1)) : null };
    }) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, ...langData } = await req.json();
    if (!await requireAdmin(req)) {
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
    if (!await requireAdmin(req)) {
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
    if (!await requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await query("DELETE FROM languages WHERE id = $1", [id]);
    return NextResponse.json({ message: "Language deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
