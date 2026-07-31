import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email || !await isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userCount = await query("SELECT COUNT(*) as c FROM users");
    const langCount = await query("SELECT COUNT(*) as c FROM languages WHERE is_active = true");
    const runCount = await query("SELECT COUNT(*) as c FROM run_history");
    const feedbackCount = await query("SELECT COUNT(*) as c FROM feedback");
    const avgRating = await query("SELECT AVG(rating) as avg FROM feedback");

    // Recent runs
    const recentRuns = await query(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM run_history r
       LEFT JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC LIMIT 10`
    );

    // Language usage
    const langUsage = await query(
      `SELECT language, COUNT(*) as count FROM run_history GROUP BY language ORDER BY count DESC LIMIT 10`
    );

    // Error rate
    const totalRuns = await query("SELECT COUNT(*) as c FROM run_history");
    const errorRuns = await query("SELECT COUNT(*) as c FROM run_history WHERE output LIKE '%Error%'");

    return NextResponse.json({
      stats: {
        totalUsers: userCount[0].c,
        totalLanguages: langCount[0].c,
        totalRuns: runCount[0].c,
        totalFeedback: feedbackCount[0].c,
        avgRating: parseFloat(String(avgRating[0]?.avg || "0")) || 0,
        errorRate: totalRuns[0].c > 0
          ? Number(((errorRuns[0].c / totalRuns[0].c) * 100).toFixed(1))
          : 0,
      },
      recentRuns,
      langUsage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
