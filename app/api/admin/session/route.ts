import { NextResponse } from "next/server";
import { getAdminEmailFromRequest, adminCookieName } from "@/lib/admin-session";

export async function GET(req: Request) {
  const email = await getAdminEmailFromRequest(req);
  return email ? NextResponse.json({ email }) : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}