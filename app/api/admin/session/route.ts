import { NextResponse } from "next/server";
import { getAdminEmailFromRequest, adminCookieName } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}

export async function GET(req: Request) {
  const email = await getAdminEmailFromRequest(req);

  if (!email) {
    return noStore(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  return noStore(NextResponse.json({ email }));
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return noStore(response);
}
