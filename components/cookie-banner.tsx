"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const consentStorageKey = "cookieConsent";

type Props = {
  yandexMetrikaId?: string;
};

type YandexMetrikaStub = ((...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    __realtermoMetrikaLoaded?: boolean;
    ym?: YandexMetrikaStub;
  }
}

function loadYandexMetrika(yandexMetrikaId?: string) {
  if (!yandexMetrikaId || typeof window === "undefined" || window.__realtermoMetrikaLoaded) {
    return;
  }

  window.__realtermoMetrikaLoaded = true;

  if (!window.ym) {
    const ymStub = ((...args: unknown[]) => {
      ymStub.a = ymStub.a || [];
      ymStub.a.push(args);
    }) as YandexMetrikaStub;

    ymStub.l = Date.now();
    window.ym = ymStub;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(script);

  window.ym?.(Number(yandexMetrikaId), "init", {
    accurateTrackBounce: true,
    clickmap: true,
    trackLinks: true,
    webvisor: true,
  });
}

export function CookieBanner({ yandexMetrikaId }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(consentStorageKey);

    if (storedConsent === "ok") {
      loadYandexMetrika(yandexMetrikaId);
      return;
    }

    if (storedConsent === "no") {
      return;
    }

    setVisible(true);
  }, [yandexMetrikaId]);

  function handleAccept() {
    window.localStorage.setItem(consentStorageKey, "ok");
    loadYandexMetrika(yandexMetrikaId);
    setVisible(false);
  }

  function handleReject() {
    window.localStorage.setItem(consentStorageKey, "no");
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-sky-100 bg-white/96 p-4 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl text-sm leading-6 text-slate-700">
          На сайте используются файлы данных браузера и сервисы аналитики. Они нужны для работы сайта и помогают
          улучшать его качество. Подробнее читайте в{" "}
          <Link className="font-medium text-sky-900 underline-offset-4 hover:underline" href="/cookies">
            политике файлов данных
          </Link>
          .
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={handleReject}
            type="button"
          >
            Только необходимые
          </button>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full border border-sky-200 px-5 text-sm font-medium text-sky-900 transition hover:bg-sky-50"
            href="/cookies"
          >
            Подробнее
          </Link>
          <button
            className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#38bdf8_100%)] px-5 text-sm font-medium text-white shadow-[0_18px_42px_rgba(14,165,233,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
            onClick={handleAccept}
            type="button"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
