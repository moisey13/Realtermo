export const siteName = "РеалТермо";
export const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME?.trim() || "[указать наименование оператора]";
export const siteUrl = "https://реалтермо.рф";
export const companyInn = process.env.NEXT_PUBLIC_COMPANY_INN?.trim() || "[указать ИНН]";
export const companyOgrn = process.env.NEXT_PUBLIC_COMPANY_OGRN?.trim() || "[указать ОГРН]";
export const companyLegalAddress =
  process.env.NEXT_PUBLIC_COMPANY_LEGAL_ADDRESS?.trim() || "[указать юридический адрес]";
export const personalDataEmail = process.env.NEXT_PUBLIC_PD_EMAIL?.trim() || "[указать e-mail для обращений]";
export const personalDataResponsibleName =
  process.env.NEXT_PUBLIC_PD_RESPONSIBLE_NAME?.trim() || "[указать Ф.И.О. ответственного]";
export const personalDataResponsibleRole =
  process.env.NEXT_PUBLIC_PD_RESPONSIBLE_ROLE?.trim() || "[указать должность ответственного]";
export const privacyEffectiveDate = process.env.NEXT_PUBLIC_PRIVACY_EFFECTIVE_DATE?.trim() || "18.06.2026";
export const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || "";
export const personalDataProcessors =
  process.env.NEXT_PUBLIC_PD_PROCESSORS?.trim() || "[указать хостинг-провайдера и сервисы, которым поручена обработка, если такие есть]";
export const personalDataDatabaseLocation =
  process.env.NEXT_PUBLIC_PD_DATABASE_LOCATION?.trim() || "[указать место нахождения базы данных с ПДн граждан РФ]";
export const personalDataRknNotice =
  process.env.NEXT_PUBLIC_PD_RKN_NOTICE?.trim() || "[указать статус уведомления в Роскомнадзор или номер в реестре]";

export const phoneDisplayParts = ["+7", "(905)", "067-04-44"] as const;
export const phoneLinkParts = ["+7", "905", "067", "0444"] as const;
export const phone = phoneDisplayParts.join(" ");
export const phoneHref = `tel:${phoneLinkParts.join("")}`;
export const phoneE164 = phoneHref.replace("tel:", "");
export const logoPath = "/realtermo-logo-header.png";
export const maxHref =
  "https://max.ru/u/f9LHodD0cOL4B5zNdJvPnFCG1AifWDiZFUBke9hDBViEEVK_5hcEM5nwp0w";
export const yandexMapHref = "https://yandex.ru/maps/-/CPtvrE8f";
export const address = "г. Мыски, ул. Кутузова, 15";

export const seoTitle = "РеалТермо - магазин сантехники, отопления и водоснабжения в Мысках";
export const seoDescription =
  "РеалТермо - магазин сантехники в Мысках. Сантехника, отопление, водоснабжение, товары для ванной, консультация, звонок и Max, адрес и режим работы.";
