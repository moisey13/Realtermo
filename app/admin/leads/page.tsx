import type { Metadata } from "next";
import { headers } from "next/headers";

import { getAdminUsername, isAdminAuthConfigured, isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminAuditLog, getAllLeads, getLeadsDatabasePath, getRecentAdminAuditLogs } from "@/lib/leads-db";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Заявки | Реалтермо",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getSearchParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(errorCode?: string) {
  switch (errorCode) {
    case "auth":
      return "Неверный логин или пароль.";
    case "config":
      return "Не настроен доступ в админку. Заполните ADMIN_PASSWORD_HASH и ADMIN_SESSION_SECRET.";
    case "update":
      return "Не удалось обновить статус заявки.";
    default:
      return "";
  }
}

function renderExtraFields(extraFields: Record<string, unknown>) {
  return Object.entries(extraFields)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => (
      <li className="text-xs text-slate-600" key={key}>
        <span className="font-medium text-slate-700">{key}:</span> {String(value)}
      </li>
    ));
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const errorCode = getSearchParamValue(params, "error");
  const errorMessage = getErrorMessage(errorCode);
  const isConfigured = isAdminAuthConfigured();
  const isAuthenticated = isConfigured ? await isAdminAuthenticated() : false;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Реалтермо</p>
            <h1 className="text-2xl font-semibold text-slate-950">Просмотр заявок</h1>
            <p className="text-sm leading-6 text-slate-600">
              Войдите по логину и паролю, чтобы открыть список заявок.
            </p>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {!isConfigured ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              Сначала задайте переменные окружения <code>ADMIN_PASSWORD_HASH</code> и{" "}
              <code>ADMIN_SESSION_SECRET</code>.
            </div>
          ) : null}

          <form action="/admin/login" className="mt-6 space-y-4" method="post">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-800">Логин</span>
              <input
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                defaultValue={getAdminUsername()}
                name="username"
                type="text"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-800">Пароль</span>
              <input
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                name="password"
                type="password"
              />
            </label>

            <button
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              type="submit"
            >
              Войти
            </button>
          </form>
        </div>
      </main>
    );
  }

  const leads = getAllLeads();
  const requestHeaders = await headers();
  createAdminAuditLog({
    action: "admin.leads_view",
    actor: getAdminUsername(),
    ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip"),
  });
  const auditLogs = getRecentAdminAuditLogs();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Реалтермо</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Заявки</h1>
            <p className="mt-2 text-sm text-slate-600">
              База: <code>{getLeadsDatabasePath()}</code>
            </p>
          </div>

          <form action="/admin/logout" method="post">
            <button
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              type="submit"
            >
              Выйти
            </button>
          </form>
        </header>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
        ) : null}

        {leads.length === 0 ? (
          <section className="rounded-3xl bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Заявок пока нет</h2>
            <p className="mt-2 text-sm text-slate-600">Как только кто-то отправит форму, запись появится здесь.</p>
          </section>
        ) : (
          <section className="space-y-4">
            {leads.map((lead) => {
              const extraFields = renderExtraFields(lead.extraFields);

              return (
                <article
                  className="rounded-3xl bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-6"
                  key={lead.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-slate-950">{lead.name}</span>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            lead.status === "processed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {lead.status === "processed" ? "Обработано" : "Новая"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500">{formatLeadDate(lead.createdAt)}</p>

                      <a
                        className="inline-flex text-lg font-medium text-sky-700 underline-offset-4 hover:underline"
                        href={`tel:+${lead.phone}`}
                      >
                        +{lead.phone}
                      </a>

                      {lead.email ? (
                        <p className="text-sm text-slate-700">
                          Email:{" "}
                          <a className="text-sky-700 underline-offset-4 hover:underline" href={`mailto:${lead.email}`}>
                            {lead.email}
                          </a>
                        </p>
                      ) : null}
                    </div>

                    <form action="/admin/leads/update" method="post">
                      <input name="id" type="hidden" value={lead.id} />
                      <input
                        name="status"
                        type="hidden"
                        value={lead.status === "processed" ? "new" : "processed"}
                      />
                      <button
                        className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                        type="submit"
                      >
                        {lead.status === "processed" ? "Вернуть в новые" : "Обработано"}
                      </button>
                    </form>
                  </div>

                  <dl className="mt-5 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-slate-900">Комментарий</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-slate-600">{lead.comment || "Без комментария"}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-slate-900">Страница</dt>
                      <dd className="mt-1 break-all text-slate-600">{lead.pageUrl}</dd>
                    </div>
                  </dl>

                  {extraFields.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-900">Дополнительные поля</p>
                      <ul className="mt-2 space-y-1">{extraFields}</ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        )}

        <section className="rounded-3xl bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-950">Журнал действий</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2 font-medium">Дата</th>
                  <th className="px-3 py-2 font-medium">Действие</th>
                  <th className="px-3 py-2 font-medium">Кто</th>
                  <th className="px-3 py-2 font-medium">Цель</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((item) => (
                  <tr className="border-b border-slate-100 last:border-b-0" key={item.id}>
                    <td className="px-3 py-2">{formatLeadDate(item.createdAt)}</td>
                    <td className="px-3 py-2">{item.action}</td>
                    <td className="px-3 py-2">{item.actor}</td>
                    <td className="px-3 py-2">{item.target || "-"}</td>
                    <td className="px-3 py-2">{item.ip || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
