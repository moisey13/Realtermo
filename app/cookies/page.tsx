import type { Metadata } from "next";
import Link from "next/link";

import { siteName, yandexMetrikaId } from "@/lib/site";

export const metadata: Metadata = {
  title: `Политика файлов данных | ${siteName}`,
  description: `Политика использования файлов данных браузера и аналитики на сайте ${siteName}.`,
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Политика файлов данных браузера</h1>

        <div className="mt-6 space-y-6 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">1. Какие данные используются</h2>
            <p className="mt-2">
              На сайте используются технические файлы данных браузера, а также аналитические данные для понимания
              посещаемости и улучшения качества сайта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">2. Категории</h2>
            <p className="mt-2">
              Технические файлы необходимы для базовой работы сайта. Аналитические файлы и счетчик Яндекс.Метрики
              включаются только после явного согласия пользователя.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">3. Яндекс.Метрика</h2>
            <p className="mt-2">
              Сервис помогает анализировать посещаемость, поведение на сайте, параметры устройства, браузера и
              источники переходов. До принятия баннера счетчик не загружается.
            </p>
            <p className="mt-2">ID счетчика: {yandexMetrikaId || "[укажите NEXT_PUBLIC_YANDEX_METRIKA_ID]"}.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">4. Сроки хранения</h2>
            <p className="mt-2">
              Аналитические данные могут храниться до 26 месяцев, если иное не определено правилами сервиса. Срок
              хранения прочих файлов зависит от их назначения и настроек браузера пользователя.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">5. Как отказаться</h2>
            <p className="mt-2">
              Пользователь может ограничить аналитические файлы через баннер согласия, а также через настройки своего
              браузера.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="font-medium text-sky-900 hover:text-sky-950" href="/privacy">
            Политика ПДн
          </Link>
          <Link className="font-medium text-sky-900 hover:text-sky-950" href="/">
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
