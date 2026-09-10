import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";

export async function GET(req: Request) {
  try {
    if (!await requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const summary = await query(`SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') AS active_users,
      (SELECT COUNT(*) FROM run_history) AS total_runs,
      (SELECT COUNT(*) FROM run_history WHERE output IS NULL OR (output NOT ILIKE '%error%' AND output NOT ILIKE '%failed%' AND output NOT ILIKE '%exception%' AND output NOT ILIKE '%compilation%')) AS successful_runs,
      (SELECT COUNT(*) FROM run_history WHERE output ILIKE '%error%' OR output ILIKE '%failed%' OR output ILIKE '%exception%' OR output ILIKE '%compilation%') AS failed_runs,
      (SELECT COUNT(*) FROM feedback) AS total_feedback,
      (SELECT AVG(rating) FROM feedback) AS average_rating`);
    const recentRuns = await query(
      `SELECT r.id, r.language, r.project_name, r.created_at,
              CASE WHEN u.name IS NULL OR u.name = '' THEN split_part(u.email, '@', 1) ELSE u.name END AS user_name,
              CASE WHEN r.output ILIKE '%error%' OR r.output ILIKE '%failed%' OR r.output ILIKE '%exception%' OR r.output ILIKE '%compilation%' THEN false ELSE true END AS successful
       FROM run_history r
       LEFT JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC LIMIT 10`
    );
    const langUsage = await query(
      `SELECT language, COUNT(*) as count FROM run_history GROUP BY language ORDER BY count DESC LIMIT 10`
    );

    const row = summary[0];
    const totalRuns = Number(row.total_runs);
    const successfulRuns = Number(row.successful_runs);
    const failedRuns = Number(row.failed_runs);

    return NextResponse.json({
      stats: {
        totalUsers: Number(row.total_users), activeUsers: Number(row.active_users), totalRuns,
        successfulRuns, failedRuns,
        successRate: totalRuns ? Number(((successfulRuns / totalRuns) * 100).toFixed(1)) : null,
        errorRate: totalRuns ? Number(((failedRuns / totalRuns) * 100).toFixed(1)) : null,
        totalFeedback: Number(row.total_feedback),
        avgRating: row.average_rating === null ? null : Number(Number(row.average_rating).toFixed(1)),
      },
      recentRuns,
      langUsage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
