import type { Metadata } from "next";
import Link from "next/link";

import { address, companyName, phone, siteName, siteUrl, telegramHref } from "@/lib/site";

export const metadata: Metadata = {
  title: `Политика конфиденциальности | ${siteName}`,
  description: `Политика конфиденциальности сайта ${siteName}.`,
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <p className="text-sm text-muted-foreground">Обновлено: 13.06.2026</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Политика конфиденциальности</h1>
        <div className="mt-6 space-y-6 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">1. Общие положения</h2>
            <p className="mt-2">
              Настоящая политика определяет порядок обработки персональных данных пользователей сайта{" "}
              <a className="text-sky-900 underline-offset-4 hover:underline" href={siteUrl}>
                {siteUrl}
              </a>
              . Оператор персональных данных: {companyName}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">2. Какие данные мы собираем</h2>
            <p className="mt-2">
              Через форму обратной связи сайт может получать имя, номер телефона и текст сообщения пользователя.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">3. Цель обработки данных</h2>
            <p className="mt-2">
              Персональные данные используются только для обратной связи с пользователем, уточнения наличия товара,
              консультации, согласования звонка и ответа на обращение.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">4. Правовые основания</h2>
            <p className="mt-2">
              Основанием для обработки является согласие пользователя, выраженное при отправке формы на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">5. Хранение и передача</h2>
            <p className="mt-2">
              Данные хранятся только в объеме, необходимом для обработки обращения. Для доставки заявок могут
              использоваться технические сервисы обмена сообщениями и формы приема обращений. Данные не используются
              для публичного распространения и не продаются третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">6. Права пользователя</h2>
            <p className="mt-2">
              Пользователь вправе запросить уточнение, обновление или удаление своих персональных данных, а также
              отозвать согласие на их обработку.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">7. Контакты оператора</h2>
            <p className="mt-2">Оператор: {companyName}.</p>
            <p>Адрес магазина: {address}.</p>
            <p>
              Телефон для обращений:{" "}
              <a className="text-sky-900 underline-offset-4 hover:underline" href="tel:+79050670444">
                {phone}
              </a>
              .
            </p>
            <p>
              Дополнительный канал связи:{" "}
              <a className="text-sky-900 underline-offset-4 hover:underline" href={telegramHref} rel="noreferrer" target="_blank">
                Telegram
              </a>
              .
            </p>
          </section>
        </div>

        <Link className="mt-8 inline-flex font-medium text-sky-900 hover:text-sky-950" href="/">
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
