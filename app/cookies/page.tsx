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
            <h2 className="text-xl font-semibold text-slate-950">1. Что используется на сайте</h2>
            <p className="mt-2">
              Сайт использует технические cookie и локальное хранилище браузера для базовой работы интерфейса, а при
              отдельном согласии пользователя также аналитические инструменты.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">2. Необходимые данные</h2>
            <p className="mt-2">
              К необходимым относятся данные, без которых невозможно корректно показать баннер выбора, запомнить
              решение пользователя и обеспечить базовую работу сайта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">3. Аналитика</h2>
            <p className="mt-2">
              Для анализа посещаемости может использоваться Яндекс.Метрика{yandexMetrikaId ? ` (ID ${yandexMetrikaId})` : ""}.
              Счетчик загружается только после явного выбора пользователя «Принять».
            </p>
            <p className="mt-2">
              Если пользователь выбирает вариант «Только необходимые», аналитические инструменты не подключаются.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">4. Какие сведения могут собираться</h2>
            <p className="mt-2">
              При включении аналитики могут обрабатываться IP-адрес в сокращенном или сервисном виде, сведения о
              браузере и устройстве, источник перехода, посещенные страницы, события взаимодействия с сайтом и иные
              технические сведения, формируемые сервисом веб-аналитики.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">5. Срок хранения</h2>
            <p className="mt-2">
              Срок хранения файлов данных зависит от их назначения, настроек браузера и правил используемого сервиса.
              Для аналитики срок хранения определяется поставщиком сервиса и настройками оператора.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">6. Как изменить выбор</h2>
            <p className="mt-2">
              Пользователь может удалить cookie и данные локального хранилища в настройках браузера, а также ограничить
              использование аналитики средствами браузера и блокировщиков контента.
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
