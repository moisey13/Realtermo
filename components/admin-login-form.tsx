"use client";

import { useState } from "react";

export function AdminLoginForm({ defaultUsername }: { defaultUsername: string }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form action="/admin/login" className="mt-6 space-y-4" method="post">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Логин</span>
        <input
          autoComplete="username"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          defaultValue={defaultUsername}
          name="username"
          type="text"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-800">Пароль</span>
        <div className="flex gap-2">
          <input
            autoComplete="current-password"
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
          />
          <button
            aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            className="shrink-0 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => setIsPasswordVisible((value) => !value)}
            type="button"
          >
            {isPasswordVisible ? "Скрыть" : "Показать"}
          </button>
        </div>
      </label>

      <button
        className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        type="submit"
      >
        Войти
      </button>
    </form>
  );
}
