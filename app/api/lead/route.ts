import { NextResponse } from "next/server";

import { leadSchema, type LeadPayload } from "@/lib/lead";
import { getRateLimitKey, isRateLimited } from "@/lib/rate-limit";

const googleFormsEndpoint = process.env.GOOGLE_FORMS_ENDPOINT;
const googleNameField = process.env.GOOGLE_FORMS_NAME_FIELD;
const googlePhoneField = process.env.GOOGLE_FORMS_PHONE_FIELD;
const googleMessageField = process.env.GOOGLE_FORMS_MESSAGE_FIELD;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const requestUrl = new URL(request.url);

  if (origin && host) {
    const allowedOrigin = `${requestUrl.protocol}//${host}`;

    if (origin !== allowedOrigin) {
      return NextResponse.json({ ok: false, message: "Недопустимый источник запроса." }, { status: 403, headers: noStoreHeaders });
    }
  }

  if (isRateLimited(`lead:${getRateLimitKey(request)}`, 4, 10 * 60 * 1000)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Слишком много заявок за короткое время. Попробуйте чуть позже или напишите в Telegram.",
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

  const configuredTargets = [
    telegramBotToken ? "telegram" : null,
    googleFormsEndpoint && googleNameField && googlePhoneField ? "googleForms" : null,
  ].filter(Boolean);

  if (configuredTargets.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Форма временно недоступна. Позвоните нам или напишите в Telegram.",
      },
      { status: 503, headers: noStoreHeaders },
    );
  }

  const results = await Promise.allSettled([sendTelegram(payload), sendGoogleForms(payload)]);
  const hasSuccess = results.some((result) => result.status === "fulfilled" && result.value === true);

  if (!hasSuccess) {
    return NextResponse.json(
      { ok: false, message: "Заявка не доставлена. Позвоните нам или напишите в Telegram, чтобы мы точно получили сообщение." },
      { status: 502, headers: noStoreHeaders },
    );
  }

  return NextResponse.json({ ok: true, message: "Заявка доставлена. Мы свяжемся с вами." }, { headers: noStoreHeaders });
}

async function sendTelegram(payload: LeadPayload) {
  if (!telegramBotToken) {
    return false;
  }

  try {
    const chatIds = await resolveTelegramChatIds();

    if (chatIds.length === 0) {
      return false;
    }

    const text = [
      'Новая заявка с сайта "РеалТермо"',
      `Имя: ${payload.name}`,
      `Телефон: ${payload.phone}`,
      payload.message ? `Что интересует: ${payload.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const results = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(10_000),
        });

        return response.ok;
      }),
    );

    return results.some((result) => result.status === "fulfilled" && result.value === true);
  } catch {
    return false;
  }
}

async function sendGoogleForms(payload: LeadPayload) {
  if (!googleFormsEndpoint || !googleNameField || !googlePhoneField) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append(googleNameField, payload.name);
    formData.append(googlePhoneField, payload.phone);

    if (googleMessageField) {
      formData.append(googleMessageField, payload.message ?? "");
    }

    const response = await fetch(googleFormsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      signal: AbortSignal.timeout(10_000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

type TelegramUpdate = {
  channel_post?: {
    chat?: {
      id?: number;
      type?: string;
    };
  };
  message?: {
    chat?: {
      id?: number;
      type?: string;
    };
  };
  update_id: number;
};

async function resolveTelegramChatIds() {
  if (!telegramBotToken) {
    return [];
  }

  if (telegramChatIds.length > 0) {
    return telegramChatIds;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getUpdates`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          result?: TelegramUpdate[];
        }
      | null;

    if (!data?.ok || !Array.isArray(data.result)) {
      return [];
    }

    const recentChat = [...data.result]
      .reverse()
      .map((update) => update.message?.chat ?? update.channel_post?.chat)
      .find((chat) => chat?.id && chat.type && ["private", "group", "supergroup"].includes(chat.type));

    return recentChat?.id ? [String(recentChat.id)] : [];
  } catch {
    return [];
  }
}
