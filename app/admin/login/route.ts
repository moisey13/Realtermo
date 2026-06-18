import { NextResponse } from "next/server";

import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionMaxAge,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { createAdminAuditLog } from "@/lib/leads-db";
import { getRequestIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    createAdminAuditLog({
      action: "admin.login_config_missing",
      actor: "admin",
      ip: getRequestIp(request),
    });
    return NextResponse.redirect(new URL("/admin/leads?error=config", request.url));
  }

  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    createAdminAuditLog({
      action: "admin.login_failed",
      actor: username || "unknown",
      ip: getRequestIp(request),
    });
    return NextResponse.redirect(new URL("/admin/leads?error=auth", request.url));
  }

  createAdminAuditLog({
    action: "admin.login_success",
    actor: username,
    ip: getRequestIp(request),
  });

  const response = NextResponse.redirect(new URL("/admin/leads", request.url));
  response.cookies.set({
    httpOnly: true,
    maxAge: getAdminSessionMaxAge(),
    name: getAdminSessionCookieName(),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: createAdminSessionToken(),
  });

  return response;
}
