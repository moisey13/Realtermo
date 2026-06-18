import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminAuditLog, updateLeadStatus } from "@/lib/leads-db";
import { getRequestIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    createAdminAuditLog({
      action: "admin.update_denied",
      actor: "unknown",
      ip: getRequestIp(request),
    });
    return NextResponse.redirect(new URL("/admin/leads?error=auth", request.url));
  }

  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || id <= 0 || !["new", "processed"].includes(status)) {
    createAdminAuditLog({
      action: "admin.update_invalid",
      actor: "admin",
      ip: getRequestIp(request),
      target: String(id),
    });
    return NextResponse.redirect(new URL("/admin/leads?error=update", request.url));
  }

  updateLeadStatus(id, status as "new" | "processed");
  createAdminAuditLog({
    action: "lead.status_updated",
    actor: "admin",
    details: { status },
    ip: getRequestIp(request),
    target: String(id),
  });
  return NextResponse.redirect(new URL("/admin/leads", request.url));
}
