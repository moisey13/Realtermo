import { NextResponse } from "next/server";

import { leadSchema } from "@/lib/lead";
import { createAdminAuditLog, createLead } from "@/lib/leads-db";
import { getRateLimitKey, isRateLimited } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const requestUrl = new URL(request.url);

  if (origin && host) {
    const allowedOrigin = `${requestUrl.protocol}//${host}`;

    if (origin !== allowedOrigin) {
      return NextResponse.json(
        { ok: false, message: "Недопустимый источник запроса." },
        { status: 403, headers: noStoreHeaders },
      );
    }
  }

  if (isRateLimited(`lead:${getRateLimitKey(request)}`, 4, 10 * 60 * 1000)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Слишком много заявок за короткое время. Попробуйте чуть позже.",
      },
      { status: 429, headers: noStoreHeaders },
    );
  }

  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Не удалось обработать форму. Проверьте данные и попробуйте еще раз." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const parsed = leadSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Проверьте корректность телефона и обязательных полей." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const payload = parsed.data;

  if (payload.website) {
    return NextResponse.json({ ok: true, message: "Заявка принята." }, { headers: noStoreHeaders });
  }

  try {
    const knownFields = new Set(["name", "phone", "email", "message", "comment", "consent", "website"]);
    const sourceUrl = request.headers.get("referer")?.slice(0, 500) || requestUrl.origin;
    const extraFields =
      rawPayload && typeof rawPayload === "object"
        ? Object.fromEntries(
            Object.entries(rawPayload as Record<string, unknown>).filter(([key]) => !knownFields.has(key)),
          )
        : {};

    const result = createLead({
      comment: payload.message?.trim() || null,
      email: payload.email?.trim() || null,
      extraFields,
      name: payload.name,
      pageUrl: sourceUrl,
      phone: payload.phone,
    });

    createAdminAuditLog({
      action: result.duplicate ? "lead.duplicate" : "lead.created",
      actor: "site-form",
      details: {
        hasEmail: Boolean(payload.email?.trim()),
        hasMessage: Boolean(payload.message?.trim()),
        pageUrl: sourceUrl,
      },
      ip: getRequestIp(request),
      target: String(result.id),
    });

    if (result.duplicate) {
      return NextResponse.json(
        {
          ok: true,
          message: "Такая заявка уже была недавно отправлена. Мы свяжемся с вами.",
        },
        { headers: noStoreHeaders },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Заявка сохранена. Мы свяжемся с вами.",
      },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    console.error("[lead] Failed to save lead", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Не удалось сохранить заявку. Попробуйте еще раз или свяжитесь с магазином по телефону.",
      },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
