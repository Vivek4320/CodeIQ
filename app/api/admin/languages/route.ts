import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";
import { getLanguageRegistry } from "@/lib/languageRegistry";

const ALLOWED_FIELDS = new Set([
  "name", "slug", "extension", "is_active", "compiler_cmd", "run_cmd", "compile_cmd",
  "piston_lang", "piston_version", "stdin_support", "category", "sort_order",
  "execution_type", "language_id", "editor_key", "title", "description", "h1", "version",
  "sample_code", "use_cases", "faq_items", "related_slugs",
]);

function jsonField(value: unknown) {
  if (Array.isArray(value)) return JSON.stringify(value);
  return value ?? null;
}

export async function GET(req: Request) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const [languages, usage] = await Promise.all([
      getLanguageRegistry(),
      query("SELECT language, COUNT(*) AS execution_count, COUNT(*) FILTER (WHERE output IS NULL OR (output NOT ILIKE '%error%' AND output NOT ILIKE '%failed%' AND output NOT ILIKE '%exception%' AND output NOT ILIKE '%compilation%')) AS successful_count FROM run_history GROUP BY language"),
    ]);
    const usageMap = new Map(usage.map((row: any) => [row.language, row]));
    return NextResponse.json({ languages: languages.map((language) => {
      const row: any = usageMap.get(language.editorKey);
      const executions = Number(row?.execution_count || 0);
      const successful = Number(row?.successful_count || 0);
      return {
        ...language,
        executionCount: executions,
        successRate: executions ? Number(((successful / executions) * 100).toFixed(1)) : null,
      };
    }) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const body = await req.json();
    const required = ["name", "slug", "extension", "editor_key", "execution_type", "version", "sample_code"];
    for (const field of required) if (!String(body[field] ?? "").trim()) return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) return NextResponse.json({ error: "Slug may contain lowercase letters, numbers and hyphens only" }, { status: 400 });
    if (!["judge0", "live-vm", "live-preview"].includes(body.execution_type)) return NextResponse.json({ error: "Invalid execution type" }, { status: 400 });
    if (body.execution_type === "judge0" && !Number.isInteger(Number(body.language_id))) return NextResponse.json({ error: "Judge0 languages require a numeric Language ID" }, { status: 400 });

    const values: any[] = [body.name.trim(), body.slug.trim(), body.extension.replace(/^\./, "").trim(), body.editor_key.trim(), body.execution_type, body.language_id == null || body.language_id === "" ? null : Number(body.language_id), body.title || `Online ${body.name} Compiler – Run ${body.name} Code Online | CodeIQ`, body.description || `Write and run ${body.name} code online with CodeIQ.`, body.h1 || `Online ${body.name} Compiler`, body.version.trim(), body.sample_code, JSON.stringify(body.use_cases || []), JSON.stringify(body.faq_items || []), JSON.stringify(body.related_slugs || []), body.stdin_support === true, body.category || "general", Number(body.sort_order || 0), true];
    await query(`INSERT INTO languages (name, slug, extension, editor_key, execution_type, language_id, title, description, h1, version, sample_code, use_cases, faq_items, related_slugs, stdin_support, category, sort_order, is_active)
      VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})`, values);
    return NextResponse.json({ message: "Language added" }, { status: 201 });
  } catch (error: any) {
    const message = error?.code === "23505" ? "A language with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: "Language id is required" }, { status: 400 });
    const fields: string[] = [];
    const values: any[] = [];
    for (const [key, raw] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.has(key)) continue;
      fields.push(`${key} = $${values.length + 1}`);
      values.push(["use_cases", "faq_items", "related_slugs"].includes(key) ? jsonField(raw) : raw);
    }
    if (!fields.length) return NextResponse.json({ error: "No valid fields supplied" }, { status: 400 });
    values.push(id);
    await query(`UPDATE languages SET ${fields.join(", ")} WHERE id = $${values.length}`, values);
    return NextResponse.json({ message: "Language updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Language id is required" }, { status: 400 });
    await query("DELETE FROM languages WHERE id = $1", [id]);
    return NextResponse.json({ message: "Language deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
