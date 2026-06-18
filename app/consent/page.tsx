import type { Metadata } from "next";
import Link from "next/link";

import {
  companyInn,
  companyLegalAddress,
  companyName,
  companyOgrn,
  siteName,
  siteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `Согласие на обработку персональных данных | ${siteName}`,
  description: `Текст согласия на обработку персональных данных для сайта ${siteName}.`,
  alternates: {
    canonical: "/consent",
  },
};

export default function ConsentPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Согласие на обработку персональных данных
        </h1>

        <div className="mt-6 space-y-6 text-base leading-7 text-slate-700">
          <p>
            Я даю {companyName} (ОГРН {companyOgrn}, ИНН {companyInn}, адрес: {companyLegalAddress}) свое согласие на
            обработку персональных данных, переданных мной через формы сайта {siteUrl}.
          </p>
          <p>
            К таким данным могут относиться фамилия, имя, отчество, телефон, e-mail, адрес доставки, содержание
            обращения и иные сведения, которые я добровольно указываю при заполнении формы.
          </p>
          <p>
            Обработка осуществляется для связи с клиентом, обработки заявки, оказания услуг, обработки заказа,
            организации доставки и отправки сервисных уведомлений.
          </p>
          <p>
            Согласие действует с момента отправки формы до достижения целей обработки либо до его отзыва субъектом
            персональных данных в порядке, установленном законодательством РФ.
          </p>
          <p>
            Я подтверждаю, что ознакомлен(-а) с{" "}
            <Link className="font-medium text-sky-900 underline-offset-4 hover:underline" href="/privacy">
              политикой обработки персональных данных
            </Link>{" "}
            и{" "}
            <Link className="font-medium text-sky-900 underline-offset-4 hover:underline" href="/cookies">
              политикой файлов данных браузера
            </Link>
            .
          </p>
        </div>

        <Link className="mt-8 inline-flex font-medium text-sky-900 hover:text-sky-950" href="/">
          На главную
        </Link>
      </div>
    </main>
  );
}
