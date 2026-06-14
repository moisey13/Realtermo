export const siteName = "РеалТермо";
export const companyName = 'ООО "МебельТрейд"';
export const siteUrl = "https://реалтермо.рф";

export const phoneDisplayParts = ["+7", "(905)", "067-04-44"] as const;
export const phoneLinkParts = ["+7", "905", "067", "0444"] as const;
export const phone = phoneDisplayParts.join(" ");
export const phoneHref = `tel:${phoneLinkParts.join("")}`;
export const phoneE164 = phoneHref.replace("tel:", "");
export const logoPath = "/realtermo-logo-header.png";
export const telegram = "@Realtermo";
export const telegramHref = "https://t.me/Realtermo";
export const maxHref =
  "https://max.ru/u/f9LHodD0cOL4B5zNdJvPnFCG1AifWDiZFUBke9hDBViEEVK_5hcEM5nwp0w";
export const yandexMapHref = "https://yandex.ru/maps/-/CPtvrE8f";
export const address = "г. Мыски, ул. Кутузова, 15";

export const seoTitle = "РеалТермо - магазин сантехники, отопления и водоснабжения в Мысках";
export const seoDescription =
  "РеалТермо - магазин сантехники в Мысках. Сантехника, отопление, водоснабжение, товары для ванной, консультация, звонок и мессенджеры, адрес и режим работы.";
