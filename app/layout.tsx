import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Manrope } from "next/font/google";

import { CookieBanner } from "@/components/cookie-banner";
import { YandexMetrikaHit } from "@/components/yandex-metrika-hit";
import { logoPath, seoDescription, seoTitle, siteName, siteUrl, yandexMetrikaId } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5fbff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seoTitle,
  description: seoDescription,
  keywords: ["сантехника Мыски", "отопление Мыски", "водоснабжение Мыски", "магазин сантехники РеалТермо"],
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    title: seoTitle,
    description: seoDescription,
    siteName,
    images: [
      {
        url: logoPath,
        width: 1200,
        height: 630,
        alt: "Магазин РеалТермо в Мысках",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [logoPath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={manrope.className}>
        {children}
        <CookieBanner yandexMetrikaId={yandexMetrikaId} />
        <Suspense fallback={null}>
          <YandexMetrikaHit yandexMetrikaId={yandexMetrikaId} />
        </Suspense>
      </body>
    </html>
  );
}
