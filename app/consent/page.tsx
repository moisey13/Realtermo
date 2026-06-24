import type { Metadata } from "next";
import Link from "next/link";

import {
  companyInn,
  companyLegalAddress,
  companyName,
  companyOgrn,
  personalDataEmail,
  personalDataProcessors,
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
            Я, как субъект персональных данных, действуя свободно, своей волей и в своем интересе, даю {companyName}
            {" "} (ИНН {companyInn}, ОГРН {companyOgrn}, адрес: {companyLegalAddress}) согласие на обработку моих
            персональных данных, передаваемых через формы сайта {siteUrl}.
          </p>
          <p>
            Перечень персональных данных, на обработку которых дается согласие: имя, номер телефона, адрес электронной
            почты, содержание обращения, сведения о странице отправки формы, а также иные сведения, которые я
            добровольно указываю в форме заявки.
          </p>
          <p>
            Цели обработки: прием и обработка заявки, обратная связь со мной, уточнение характеристик товара или
            услуги, подготовка предложения, согласование условий заказа, доставки и сопутствующей коммуникации.
          </p>
          <p>
            Перечень действий с персональными данными: сбор, запись, систематизация, накопление, хранение, уточнение,
            извлечение, использование, передача в случаях, предусмотренных законодательством и политикой оператора,
            обезличивание, блокирование, удаление и уничтожение.
          </p>
          <p>
            Обработка может осуществляться как с использованием средств автоматизации, так и без их использования.
            Лица и сервисы, которым может быть поручена обработка: {personalDataProcessors}.
          </p>
          <p>
            Согласие действует с момента отправки формы до достижения целей обработки либо до момента отзыва согласия
            субъектом персональных данных, если оператор не вправе продолжить обработку по иному законному основанию.
          </p>
          <p>
            Отзыв согласия можно направить по адресу {personalDataEmail}. Отзыв согласия не влияет на законность
            обработки, осуществленной до его получения оператором.
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
