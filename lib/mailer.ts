import nodemailer from "nodemailer";

type LeadEmailInput = {
  email: string | null;
  extraFields: Record<string, unknown>;
  message: string | null;
  name: string;
  pageUrl: string;
  phone: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required mail config: ${name}`);
  }

  return value;
}

function createTransport() {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASSWORD");

  return nodemailer.createTransport({
    auth: {
      pass,
      user,
    },
    host,
    port,
    secure: port === 465,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderExtraFields(extraFields: Record<string, unknown>) {
  const items = Object.entries(extraFields).filter(([, value]) => value !== "" && value !== null && value !== undefined);

  if (items.length === 0) {
    return {
      html: "<p><strong>Дополнительные поля:</strong> нет</p>",
      text: "Дополнительные поля: нет",
    };
  }

  return {
    html: `<p><strong>Дополнительные поля:</strong></p><ul>${items
      .map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</li>`)
      .join("")}</ul>`,
    text: `Дополнительные поля:\n${items.map(([key, value]) => `- ${key}: ${String(value)}`).join("\n")}`,
  };
}

export async function sendLeadEmail(input: LeadEmailInput) {
  const transporter = createTransport();
  const to = process.env.LEADS_EMAIL_TO?.trim() || "rtermo@yandex.ru";
  const from = process.env.LEADS_EMAIL_FROM?.trim() || getRequiredEnv("SMTP_USER");
  const replyTo = input.email || undefined;
  const extraFields = renderExtraFields(input.extraFields);
  const subject = `Новая заявка с сайта: ${input.name}`;
  const html = `
    <h1>Новая заявка с сайта</h1>
    <p><strong>Имя:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Телефон:</strong> ${escapeHtml(input.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email || "не указан")}</p>
    <p><strong>Страница:</strong> ${escapeHtml(input.pageUrl)}</p>
    <p><strong>Сообщение:</strong><br />${escapeHtml(input.message || "без сообщения").replaceAll("\n", "<br />")}</p>
    ${extraFields.html}
  `;
  const text = [
    "Новая заявка с сайта",
    `Имя: ${input.name}`,
    `Телефон: ${input.phone}`,
    `Email: ${input.email || "не указан"}`,
    `Страница: ${input.pageUrl}`,
    `Сообщение: ${input.message || "без сообщения"}`,
    "",
    extraFields.text,
  ].join("\n");

  await transporter.sendMail({
    from,
    html,
    replyTo,
    subject,
    text,
    to,
  });
}
