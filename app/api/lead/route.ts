import { NextResponse } from "next/server";

import { leadSchema, type LeadPayload } from "@/lib/lead";

const googleFormsEndpoint = process.env.GOOGLE_FORMS_ENDPOINT;
const googleNameField = process.env.GOOGLE_FORMS_NAME_FIELD;
const googlePhoneField = process.env.GOOGLE_FORMS_PHONE_FIELD;
const googleMessageField = process.env.GOOGLE_FORMS_MESSAGE_FIELD;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Не удалось обработать форму. Проверьте данные и попробуйте еще раз." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Проверьте корректность телефона и обязательных полей." },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  if (payload.website) {
    return NextResponse.json({ ok: true, message: "Заявка принята." });
  }

  const configuredTargets = [
    telegramBotToken && telegramChatId ? "telegram" : null,
    googleFormsEndpoint && googleNameField && googlePhoneField ? "googleForms" : null,
  ].filter(Boolean);

  if (configuredTargets.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Форма временно недоступна. Позвоните нам или напишите в Telegram.",
      },
      { status: 503 },
    );
  }

  const results = await Promise.allSettled([sendTelegram(payload), sendGoogleForms(payload)]);
  const hasSuccess = results.some((result) => result.status === "fulfilled" && result.value === true);

  if (!hasSuccess) {
    return NextResponse.json(
      { ok: false, message: "Заявка не доставлена. Позвоните нам или напишите в Telegram, чтобы мы точно получили сообщение." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Заявка доставлена. Мы свяжемся с вами." });
}

async function sendTelegram(payload: LeadPayload) {
  if (!telegramBotToken || !telegramChatId) {
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

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  return response.ok;
}

async function sendGoogleForms(payload: LeadPayload) {
  if (!googleFormsEndpoint || !googleNameField || !googlePhoneField) {
    return false;
  }

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
  });

  return response.ok;
}
