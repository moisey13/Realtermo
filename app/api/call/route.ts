import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { phoneHref } from "@/lib/site";
import { getRateLimitKey, isRateLimited } from "@/lib/rate-limit";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

const callTokens = new Map<string, number>();

function cleanupExpiredTokens(now: number) {
  if (callTokens.size < 1000) {
    return;
  }

  for (const [token, expiresAt] of callTokens.entries()) {
    if (expiresAt <= now) {
      callTokens.delete(token);
    }
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const requestUrl = new URL(request.url);

  if (!origin || !host) {
    return true;
  }

  return origin === `${requestUrl.protocol}//${host}`;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Недопустимый источник запроса." }, { status: 403, headers: noStoreHeaders });
  }

  if (isRateLimited(`call:${getRateLimitKey(request)}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Слишком много попыток звонка за короткое время. Попробуйте чуть позже.",
      },
      { status: 429, headers: noStoreHeaders },
    );
  }

  const now = Date.now();
  cleanupExpiredTokens(now);

  const token = randomUUID();
  callTokens.set(token, now + 30_000);

  return NextResponse.json(
    {
      ok: true,
      redirectUrl: `/api/call?token=${encodeURIComponent(token)}`,
    },
    { headers: noStoreHeaders },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ ok: false, message: "Ссылка для звонка недействительна." }, { status: 400, headers: noStoreHeaders });
  }

  const expiresAt = callTokens.get(token);
  callTokens.delete(token);

  if (!expiresAt || expiresAt <= Date.now()) {
    return NextResponse.json(
      { ok: false, message: "Ссылка для звонка истекла. Нажмите кнопку ещё раз." },
      { status: 410, headers: noStoreHeaders },
    );
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      ...noStoreHeaders,
      Location: phoneHref,
    },
  });
}
