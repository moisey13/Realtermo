import { NextResponse } from "next/server";

import { getAdminSessionCookieName } from "@/lib/admin-auth";
import { createAdminAuditLog } from "@/lib/leads-db";
import { getRequestIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  createAdminAuditLog({
    action: "admin.logout",
    actor: "admin",
    ip: getRequestIp(request),
  });

  const response = NextResponse.redirect(new URL("/admin/leads", request.url));
  response.cookies.set({
    maxAge: 0,
    name: getAdminSessionCookieName(),
    path: "/",
    value: "",
  });

  return response;
}
