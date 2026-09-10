import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";

export async function GET(req: Request) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const range = new URL(req.url).searchParams.get("range") || "30d";
    const since = range === "7d" ? "NOW() - INTERVAL '7 days'" : range === "30d" ? "NOW() - INTERVAL '30 days'" : null;
    const filter = since ? `WHERE created_at >= ${since}` : "";
    const [timeline, languages, recent] = await Promise.all([
      query(`SELECT DATE(created_at) AS date, COUNT(*) AS total, COUNT(*) FILTER (WHERE output IS NULL OR (output NOT ILIKE '%error%' AND output NOT ILIKE '%failed%' AND output NOT ILIKE '%exception%' AND output NOT ILIKE '%compilation%')) AS successful FROM run_history ${filter} GROUP BY DATE(created_at) ORDER BY date`),
      query(`SELECT language, COUNT(*) AS count FROM run_history ${filter} GROUP BY language ORDER BY count DESC`),
      query(`SELECT r.language, r.project_name, r.created_at, CASE WHEN u.name IS NULL OR u.name = '' THEN split_part(u.email, '@', 1) ELSE u.name END AS user_name, CASE WHEN r.output ILIKE '%error%' OR r.output ILIKE '%failed%' OR r.output ILIKE '%exception%' OR r.output ILIKE '%compilation%' THEN false ELSE true END AS successful FROM run_history r LEFT JOIN users u ON r.user_id = u.id ${since ? `WHERE r.created_at >= ${since.replaceAll("created_at", "r.created_at")}` : ""} ORDER BY r.created_at DESC LIMIT 20`),
    ]);
    return NextResponse.json({ timeline, languages, recent, range });
  } catch (error: any) {
    console.error("Admin analytics error:", error.message);
    return NextResponse.json({ error: "Unable to load analytics" }, { status: 500 });
  }
}