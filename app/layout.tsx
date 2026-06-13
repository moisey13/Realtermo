import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "РеалТермо — магазин сантехники в Мысках",
  description:
    "Сантехника, товары для водоснабжения, отопления, канализации и ванной комнаты. Магазин «РеалТермо», Мыски, ул. Кутузова, 15.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
