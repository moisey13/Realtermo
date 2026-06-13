import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  message?: string;
};

const googleFormsEndpoint = process.env.GOOGLE_FORMS_ENDPOINT;
const googleNameField = process.env.GOOGLE_FORMS_NAME_FIELD;
const googlePhoneField = process.env.GOOGLE_FORMS_PHONE_FIELD;
const googleMessageField = process.env.GOOGLE_FORMS_MESSAGE_FIELD;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;
  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  const message = payload.message?.trim();

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, message: "Укажите имя и телефон." },
      { status: 400 },
    );
  }

  const results = await Promise.allSettled([
    sendTelegram({ name, phone, message }),
    sendGoogleForms({ name, phone, message }),
  ]);

  const configuredTargets = [
    telegramBotToken && telegramChatId ? "telegram" : null,
    googleFormsEndpoint && googleNameField && googlePhoneField ? "googleForms" : null,
  ].filter(Boolean);

  if (configuredTargets.length === 0) {
    return NextResponse.json({
      ok: true,
      message:
        "Заявка принята на сайте. Чтобы включить отправку, заполните Telegram и Google Forms переменные в .env.local.",
      debug: results.map((result) => result.status),
    });
  }

  const hasSuccess = results.some((result) => result.status === "fulfilled" && result.value);

  if (!hasSuccess) {
    return NextResponse.json(
      { ok: false, message: "Не удалось отправить заявку. Попробуйте позвонить, написать в Telegram или Max." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Заявка отправлена. Мы свяжемся с вами." });
}

async function sendTelegram(payload: Required<Pick<LeadPayload, "name" | "phone">> & Pick<LeadPayload, "message">) {
  if (!telegramBotToken || !telegramChatId) {
    return false;
  }

  const text = [
    "Новая заявка с сайта «РеалТермо»",
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

async function sendGoogleForms(payload: Required<Pick<LeadPayload, "name" | "phone">> & Pick<LeadPayload, "message">) {
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

  return response.ok || response.status === 0;
}
