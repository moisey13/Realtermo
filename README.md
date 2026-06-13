# Лендинг «РеалТермо»

Готовый лендинг для магазина сантехники «РеалТермо» в Мысках.

## Структура сайта

- Hero: название, адрес, CTA, фото фасада `public/Hero.jpg`.
- Преимущества: большой опыт, выбор товаров, заказ нужных позиций, быстрая доставка по городу, помощь в подборе.
- Категории: водоснабжение, отопление, канализация, смесители, радиаторы, насосы, котлы, унитазы, ванны, мебель для ванной, водонагреватели, полотенцесушители, мойки и раковины, котлы длительного горения.
- Галерея: 8 фотографий из `public`.
- Консультация: звонок, Telegram, заявка.
- Контакты: адрес, режим работы, телефон, Telegram, место для карты.

## Тексты блоков

### Hero

Заголовок: `Магазин сантехники «РеалТермо»`

Подзаголовок: `Всё для водоснабжения, отопления, канализации и ванной комнаты. Большой выбор товаров в наличии и под заказ.`

CTA:
- `Позвонить`
- `Написать в Telegram`
- `Оставить заявку`

### Консультация

`Можно позвонить или написать в Telegram: подскажем по наличию, поможем подобрать подходящий товар или аналог, сориентируем по срокам и стоимости доставки.`

### Форма

Поля:
- имя;
- телефон;
- что нужно подобрать или уточнить.

## Установка и запуск

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## shadcn/ui

В проекте уже добавлены локальные shadcn/ui-совместимые компоненты:

- `Button`
- `Card`
- `Input`
- `Textarea`
- `Label`
- `Badge`
- `Separator`

Если нужно переустановить shadcn/ui через CLI:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea label badge separator
```

## Куда подставить данные

- Фото фасада: замените файл `public/Hero.jpg`.
- 8 фото галереи: замените файлы в `public` или обновите массив `gallery` в `app/page.tsx`.
- Parallax background: архив `ezgif-split.zip` распакован в `public/parallax`; сейчас используются `public/parallax/frame_00_delay-0.083s.png` и `public/parallax/frame_48_delay-0.083s.png`. Заменить можно в `app/globals.css` в `.parallax-shell::before` и `.parallax-shell::after`.
- Telegram Bot Token: `TELEGRAM_BOT_TOKEN` в `.env.local`.
- Telegram Chat ID: `TELEGRAM_CHAT_ID` в `.env.local`.
- Google Forms endpoint: `GOOGLE_FORMS_ENDPOINT` в `.env.local`.
- Google Forms поля: `GOOGLE_FORMS_NAME_FIELD`, `GOOGLE_FORMS_PHONE_FIELD`, `GOOGLE_FORMS_MESSAGE_FIELD` в `.env.local`.
- Карта: замените placeholder в секции контактов на iframe карты в `app/page.tsx`.

Создайте `.env.local` на основе `.env.local.example`.

## Чеклист перед деплоем

- Проверить телефон `+7 (905) 067-0444` и Telegram `@Realtermo`.
- Подключить реальные переменные Telegram и Google Forms.
- Заменить placeholder карты на iframe.
- Проверить, что фото фасада и 8 фото галереи актуальны.
- Открыть сайт на телефоне и проверить CTA, форму, галерею, адрес и режим работы.
- Запустить `npm run build`.
