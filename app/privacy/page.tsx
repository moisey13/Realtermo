import type { Metadata } from "next";
import Link from "next/link";

import {
  companyInn,
  companyLegalAddress,
  companyName,
  companyOgrn,
  personalDataEmail,
  personalDataResponsibleName,
  personalDataResponsibleRole,
  privacyEffectiveDate,
  siteName,
  siteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `Политика обработки персональных данных | ${siteName}`,
  description: `Политика обработки персональных данных сайта ${siteName}.`,
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "1. Общие положения",
    content: [
      `Настоящая политика обработки персональных данных действует в отношении сайта ${siteUrl} и определяет порядок обработки персональных данных пользователей.`,
      `Оператор персональных данных: ${companyName}, ИНН ${companyInn}, ОГРН ${companyOgrn}, юридический адрес: ${companyLegalAddress}.`,
    ],
  },
  {
    title: "2. Какие данные обрабатываются",
    content: [
      "Оператор может обрабатывать фамилию, имя, отчество, телефон, e-mail, адрес доставки, содержание обращения и иную информацию, которую пользователь добровольно указывает в формах сайта.",
      "При согласии пользователя могут обрабатываться технические данные браузера и устройства в аналитических целях.",
    ],
  },
  {
    title: "3. Цели обработки",
    content: [
      "Обработка персональных данных осуществляется для приема и обработки заявок, обратной связи с клиентом, предоставления услуг, обработки заказа, доставки товара и отправки сервисных уведомлений.",
    ],
  },
  {
    title: "4. Правовые основания",
    content: [
      "Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных», а также на основании согласия субъекта персональных данных, договора и иных оснований, предусмотренных законодательством РФ.",
    ],
  },
  {
    title: "5. Хранение и защита данных",
    content: [
      "Персональные данные хранятся в защищенных базах данных на серверах, расположенных на территории Российской Федерации.",
      "Срок хранения персональных данных ограничивается сроком достижения целей обработки, если иной срок не установлен договором или законодательством. После этого данные уничтожаются либо обезличиваются.",
      "Для защиты применяются ограничение доступа, пароли, резервное копирование, антивирусная защита и использование защищенного соединения HTTPS.",
    ],
  },
  {
    title: "6. Передача третьим лицам",
    content: [
      "Оператор не передает персональные данные третьим лицам без согласия субъекта, кроме случаев, когда это необходимо для исполнения заявки, доставки товара, исполнения требований закона или работы обязательных сервисов сайта.",
    ],
  },
  {
    title: "7. Трансграничная передача",
    content: [
      "Трансграничная передача персональных данных пользователей сайта не осуществляется, если иное отдельно не согласовано с субъектом персональных данных.",
    ],
  },
  {
    title: "8. Права субъекта персональных данных",
    content: [
      "Пользователь вправе запросить уточнение, блокирование, удаление или уничтожение своих персональных данных, а также отозвать согласие на их обработку в порядке, установленном законодательством РФ.",
    ],
  },
  {
    title: "9. Порядок отзыва согласия",
    content: [
      `Для отзыва согласия необходимо направить обращение на ${personalDataEmail} с темой письма «Отзыв согласия на обработку ПДн». После подтверждения обращения обработка прекращается, а данные удаляются в срок до 30 календарных дней, если иное не требуется по закону.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <p className="text-sm text-muted-foreground">Дата вступления в силу: {privacyEffectiveDate}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Политика обработки персональных данных
        </h1>

        <div className="mt-6 space-y-6 text-base leading-7 text-slate-700">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <div className="mt-2 space-y-3">
                {section.content.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>
          ))}

          <section id="user-agreement">
            <h2 className="text-xl font-semibold text-slate-950">10. Пользовательское соглашение</h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>Пользователь обязуется указывать достоверные данные при отправке заявки через сайт.</li>
              <li>Оформляя заявку, пользователь принимает условия связи, обработки заказа и доставки товара.</li>
              <li>Материалы сайта принадлежат правообладателю и не подлежат незаконному копированию.</li>
              <li>Все споры и иные вопросы регулируются законодательством Российской Федерации.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">11. Контакты по вопросам ПДн</h2>
            <p className="mt-2">
              {personalDataResponsibleName}, {personalDataResponsibleRole}
            </p>
            <p>{personalDataEmail}</p>
            <p>{companyLegalAddress}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">12. Актуальная версия</h2>
            <p className="mt-2">
              Оператор вправе вносить изменения в настоящую политику. Актуальная версия всегда размещается на сайте.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="font-medium text-sky-900 hover:text-sky-950" href="/cookies">
            Политика файлов данных
          </Link>
          <Link className="font-medium text-sky-900 hover:text-sky-950" href="/consent">
            Согласие на обработку ПДн
          </Link>
          <Link className="font-medium text-sky-900 hover:text-sky-950" href="/">
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
