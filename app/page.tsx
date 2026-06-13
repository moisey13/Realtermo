import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bath,
  Clock,
  Droplets,
  Flame,
  MapPin,
  MessageCircle,
  MessageSquareMore,
  Phone,
  Send,
  ShowerHead,
  Truck,
  Wrench,
} from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { ParallaxBackground } from "@/components/parallax-background";
import {
  address,
  companyName,
  maxHref,
  phone,
  phoneHref,
  telegram,
  telegramHref,
  yandexMapHref,
} from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const hoverMotionClass =
  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(24,64,102,0.16)]";
const callButtonClass =
  "bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#38bdf8_100%)] text-white shadow-[0_18px_42px_rgba(14,165,233,0.34)] ring-1 ring-sky-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_26px_56px_rgba(14,165,233,0.42)]";
const outlineButtonClass =
  "border-sky-200/80 bg-white/76 text-sky-900 shadow-[0_14px_35px_rgba(59,130,246,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50/92 hover:text-sky-950 hover:shadow-[0_22px_44px_rgba(59,130,246,0.18)]";
const mapButtonClass =
  "min-h-16 rounded-full border-sky-300/90 bg-white/88 px-8 text-base font-semibold text-sky-950 shadow-[0_22px_50px_rgba(59,130,246,0.18)] ring-1 ring-white/65 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_60px_rgba(59,130,246,0.24)] sm:min-h-18 sm:px-10 sm:text-lg";
const secondaryButtonClass =
  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(14,165,233,0.12)]";

const benefits = [
  { title: "Большой опыт", text: "17 лет на рынке сантехники.", icon: Clock },
  { title: "Большой выбор", text: "Товары для дома, ремонта и инженерных систем.", icon: ShowerHead },
  { title: "Наличие и заказ", text: "Большой ассортимент товаров, есть возможность привезти под заказ.", icon: Wrench },
  { title: "Доставка", text: "Быстрая доставка в пределах города.", icon: Truck },
  { title: "Помощь в подборе", text: "Подскажем по характеристикам и поможем подобрать аналог.", icon: MessageCircle },
  { title: "Проверенные мастера", text: "Подскажем контакты специалистов.", icon: MessageCircle },
];

const categories = [
  { name: "Водоснабжение", icon: Droplets },
  { name: "Отопление", icon: Flame },
  { name: "Канализация", icon: Wrench },
  { name: "Смесители", icon: ShowerHead },
  { name: "Радиаторы", icon: Flame },
  { name: "Насосы", icon: Droplets },
  { name: "Унитазы", icon: Bath },
  { name: "Ванны", icon: Bath },
  { name: "Мойки и раковины", icon: Droplets },
  { name: "Мебель для ванной", icon: Bath },
  { name: "Водонагреватели", icon: Flame },
  { name: "Полотенцесушители", icon: Wrench },
  { name: "Котлы длительного горения", icon: Flame },
];

const gallery = [
  { src: "/водонагреватели.jpg", alt: "Водонагреватели в магазине РеалТермо", wide: true },
  { src: "/Мебель для ванной.jpg", alt: "Мебель для ванной в магазине РеалТермо" },
  { src: "/насосы.jpg", alt: "Насосы в магазине РеалТермо" },
  { src: "/прочее.jpg", alt: "Товары сантехники в магазине РеалТермо", tall: true },
  { src: "/радиаторы.jpg", alt: "Радиаторы в магазине РеалТермо" },
  { src: "/Смесители1.jpg", alt: "Смесители в магазине РеалТермо", wide: true },
  { src: "/Смесители2.jpg", alt: "Смесители и товары для ванной в магазине РеалТермо" },
  { src: "/Унитазы.jpg", alt: "Унитазы в магазине РеалТермо" },
];

const faqItems = [
  {
    question: "Где купить сантехнику в Мысках?",
    answer:
      "В магазине «РеалТермо» представлен широкий ассортимент товаров для водоснабжения, отопления и канализации. Мы помогаем подобрать подходящие решения как для квартир, так и для частных домов.",
  },
  {
    question: "Можно ли заказать сантехнику, если нужного товара нет в наличии?",
    answer:
      "Да. Если необходимой позиции нет в магазине, мы можем заказать её у поставщиков. Срок поставки зависит от конкретного товара и уточняется при обращении.",
  },
  {
    question: "Помогаете ли вы подобрать оборудование для отопления и водоснабжения?",
    answer:
      "Да. Мы помогаем подобрать радиаторы, трубы, фитинги, запорную арматуру и другие товары для систем отопления, водоснабжения и канализации.",
  },
  {
    question: "Какие товары для отопления и водоснабжения есть в продаже?",
    answer:
      "В наличии и под заказ доступны товары для отопления, водоснабжения, канализации, ремонта ванной комнаты, а также комплектующие и расходные материалы для монтажа инженерных систем.",
  },
  {
    question: "Где находится магазин РеалТермо?",
    answer:
      "Магазин расположен в городе Мыски по адресу: улица Кутузова, 15. На сайте можно посмотреть карту и построить маршрут до магазина.",
  },
  {
    question: "Можно ли получить консультацию перед покупкой?",
    answer:
      "Конечно. Вы можете обратиться к нам по телефону, через мессенджер или лично в магазине. Мы поможем подобрать подходящие товары и ответим на возникающие вопросы.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "РеалТермо",
  legalName: companyName,
  image: "/Hero.jpg",
  telephone: phone,
  address: {
    "@type": "PostalAddress",
    addressCountry: "RU",
    addressLocality: "Мыски",
    streetAddress: "ул. Кутузова, 15",
  },
  areaServed: "Мыски",
  url: "https://реалтермо.рф",
  sameAs: [telegramHref, maxHref],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "17:00",
    },
  ],
};

export default function Home() {
  return (
    <main className="relative overflow-hidden pb-28 sm:pb-0">
      <ParallaxBackground />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3 rounded-full bg-white/72 px-4 py-2 shadow-sm backdrop-blur-xl" href="#">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            РТ
          </span>
          <span className="font-semibold tracking-tight">РеалТермо</span>
        </a>
        <a className="hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:flex" href={phoneHref}>
          <Phone data-icon="inline-start" />
          {phone}
        </a>
      </header>

      <section className="relative isolate mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-5 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:grid-rows-[auto_1fr] lg:px-8 lg:pb-20 lg:pt-10">
        <div className="flex flex-wrap gap-3 lg:col-start-1 lg:row-start-1">
          <Badge variant="secondary">Магазин сантехники</Badge>
          <Badge variant="outline">
            <MapPin data-icon="inline-start" />
            {address}
          </Badge>
        </div>
        <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-6 shadow-soft backdrop-blur-xl sm:p-8 lg:col-start-1 lg:row-start-2 lg:h-full lg:p-10">
            <h1 className="max-w-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-primary bg-clip-text text-4xl font-semibold tracking-[-0.04em] text-transparent sm:text-5xl lg:text-6xl">
              Магазин сантехники «РеалТермо»
            </h1>
            <p className="mt-5 max-w-2xl rounded-[1.6rem] bg-gradient-to-r from-sky-50/96 to-white/78 p-4 text-lg font-medium leading-8 text-slate-800 shadow-sm ring-1 ring-sky-100/80 sm:text-xl">
              Всё для водоснабжения, отопления, канализации и ванной комнаты. Большой выбор товаров в наличии и под заказ.
            </p>
            <div className="mt-4 inline-flex rounded-full bg-sky-50/88 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-sky-100/80">
              Пн-Пт: 9:00-18:00, Сб: 9:00-17:00, Вс: выходной
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className={callButtonClass}>
                <a href={phoneHref}>
                  <Phone data-icon="inline-start" />
                  Позвонить
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className={secondaryButtonClass}>
                <a href={telegramHref} rel="noreferrer" target="_blank">
                  <Send data-icon="inline-start" />
                  Написать в Telegram
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className={outlineButtonClass}>
                <a href={maxHref} rel="noreferrer" target="_blank">
                  <MessageSquareMore data-icon="inline-start" />
                  Написать в Max
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className={outlineButtonClass}>
                <a href="#lead">
                  Оставить заявку
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>

        <Card className="overflow-hidden p-3 lg:col-start-2 lg:row-start-2 lg:h-full">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.6rem] sm:min-h-[500px] lg:h-full lg:min-h-0">
            <Image
              src="/Hero.jpg"
              alt="Фасад магазина сантехники РеалТермо в Мысках"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] border border-white/18 bg-slate-950/58 p-4 text-white shadow-[0_20px_44px_rgba(15,23,42,0.4)] backdrop-blur-xl">
              <p className="text-sm font-medium text-white/78">Адрес магазина</p>
              <a
                className="mt-1 block text-lg font-semibold tracking-[-0.01em] text-white transition-colors hover:text-sky-100"
                href={yandexMapHref}
                rel="noreferrer"
                target="_blank"
              >
                {address}
              </a>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <Card
                className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/90 hover:shadow-[0_24px_55px_rgba(14,165,233,0.18)]"
                key={benefit.title}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0),rgba(255,255,255,0.14))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="h-full">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                  <CardDescription>{benefit.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 rounded-[2rem] bg-white/72 p-6 shadow-soft backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary">Категории</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Что можно найти в магазине</h2>
          </div>
          <p className="max-w-xl text-muted-foreground">
            Коротко по основным направлениям: сантехника, инженерные товары и решения для ванной комнаты.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-white/74 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/90 hover:shadow-[0_22px_45px_rgba(14,165,233,0.16)]"
                key={category.name}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(125,211,252,0.1)_38%,transparent_60%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon />
                </span>
                <span className="relative font-medium">{category.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 rounded-[2rem] bg-white/72 p-6 shadow-soft backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary">Галерея</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Фото магазина и товаров</h2>
          </div>
        </div>
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
          {gallery.map((item) => (
            <div
              className={[
                "group relative overflow-hidden rounded-[2rem] bg-white/70 shadow-soft backdrop-blur-xl",
                item.wide ? "md:col-span-2" : "",
                item.tall ? "md:row-span-2" : "",
              ].join(" ")}
              key={item.src}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 25vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <CardHeader className="justify-center p-6 sm:p-8 lg:p-10">
              <Badge className="w-fit" variant="secondary">
                Консультация
              </Badge>
              <CardTitle className="text-3xl tracking-[-0.03em] sm:text-4xl">
                Уточните наличие, подбор или доставку
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Можно позвонить или написать в Telegram или Max: подскажем по наличию, поможем подобрать подходящий товар или аналог, сориентируем по срокам и стоимости доставки.
              </CardDescription>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button asChild className={callButtonClass}>
                  <a href={phoneHref}>
                    <Phone data-icon="inline-start" />
                    {phone}
                  </a>
                </Button>
                <Button asChild variant="outline" className={outlineButtonClass}>
                  <a href={telegramHref} rel="noreferrer" target="_blank">
                    <MessageCircle data-icon="inline-start" />
                    {telegram}
                  </a>
                </Button>
                <Button asChild variant="outline" className={outlineButtonClass}>
                  <a href={maxHref} rel="noreferrer" target="_blank">
                    <MessageSquareMore data-icon="inline-start" />
                    Max
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">При необходимости дадим контакты проверенных специалистов.</p>
            </CardHeader>
            <div id="lead" className="bg-white/62 p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">Заявка на обратный звонок</h2>
              <p className="mt-2 text-muted-foreground">
                Оставьте контакты и коротко опишите задачу — поможем подобрать нужный товар и проконсультируем.
              </p>
              <div className="mt-6">
                <LeadForm />
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <Badge className="w-fit" variant="secondary">
                Контакты
              </Badge>
              <CardTitle className="text-3xl tracking-[-0.03em]">Как найти «РеалТермо»</CardTitle>
              <CardDescription>Адрес, режим работы и быстрые способы связи.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ContactRow icon={MapPin} title="Адрес" text={address} href={yandexMapHref} />
              <Separator />
              <ContactRow
                icon={Clock}
                title="Режим работы"
                text={
                  <div className="flex flex-col gap-1">
                    <span>Понедельник-Пятница: 9:00-18:00</span>
                    <span>Суббота: 9:00-17:00</span>
                    <span>Воскресенье: выходной</span>
                  </div>
                }
              />
              <Separator />
              <ContactRow icon={Phone} title="Телефон" text={phone} href={phoneHref} />
              <Separator />
              <ContactRow icon={MessageCircle} title="Telegram" text={telegram} href={telegramHref} />
              <Separator />
              <ContactRow icon={MessageSquareMore} title="Max" text="Написать в Max" href={maxHref} />
            </CardContent>
          </Card>
          <Card className="min-h-[360px] overflow-hidden">
            <div className="flex h-full min-h-[360px] items-center justify-center bg-gradient-to-br from-secondary/80 via-white/72 to-accent/60 p-8 text-center">
              <Button asChild size="lg" variant="outline" className={mapButtonClass}>
                <a href={yandexMapHref} rel="noreferrer" target="_blank">
                  Открыть адрес в Яндекс Картах
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 rounded-[2rem] bg-white/72 p-6 shadow-soft backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary">FAQ</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Часто задаваемые вопросы</h2>
          </div>
          <p className="max-w-xl text-muted-foreground">
            Ответили на самые популярные вопросы покупателей магазина РеалТермо.
          </p>
        </div>
        <Card className="overflow-hidden bg-white/74 backdrop-blur-xl">
          <CardContent className="p-3 sm:p-4 lg:p-5">
            <Accordion type="single" collapsible className="flex flex-col gap-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index + 1}`}
                  className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-white/82 px-0 shadow-sm transition-all duration-300 data-[state=open]:shadow-[0_18px_40px_rgba(24,64,102,0.08)]"
                >
                  <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold tracking-[-0.02em] text-foreground hover:no-underline sm:px-6 sm:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-base leading-7 text-muted-foreground sm:px-6 sm:pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-[1.6rem] bg-white/72 px-5 py-4 text-sm text-muted-foreground shadow-soft backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
          <p>Оператор персональных данных: {companyName}</p>
          <Link className="mt-2 inline-flex font-medium text-sky-900 hover:text-sky-950 sm:mt-0" href="/privacy-policy">
            Политика конфиденциальности
          </Link>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sky-100 bg-white/96 p-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3">
          <Button asChild className={callButtonClass}>
            <a href={phoneHref}>
              <Phone data-icon="inline-start" />
              Позвонить
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={telegramHref} rel="noreferrer" target="_blank">
              <Send data-icon="inline-start" />
              Написать
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}

function ContactRow({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: LucideIcon;
  title: string;
  text: ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="mt-1 font-semibold text-foreground">{text}</div>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      target={href.startsWith("http") ? "_blank" : undefined}
      className={`-mx-3 block rounded-[1.3rem] px-3 py-2 ${hoverMotionClass}`}
    >
      {content}
    </a>
  );
}
