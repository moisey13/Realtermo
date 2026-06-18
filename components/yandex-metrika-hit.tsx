"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  yandexMetrikaId?: string;
};

type YandexMetrikaStub = ((...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: YandexMetrikaStub;
  }
}

export function YandexMetrikaHit({ yandexMetrikaId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!yandexMetrikaId || typeof window === "undefined") {
      return;
    }

    if (window.localStorage.getItem("cookieConsent") !== "ok") {
      return;
    }

    const query = searchParams.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    window.ym?.(Number(yandexMetrikaId), "hit", url);
  }, [pathname, searchParams, yandexMetrikaId]);

  return null;
}
