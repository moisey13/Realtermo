"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

type ProtectedPhoneLinkProps = {
  className?: string;
  label?: string;
  showIcon?: boolean;
};

export function ProtectedPhoneLink({
  className,
  label = "Позвонить",
  showIcon = true,
}: ProtectedPhoneLinkProps) {
  const [isPending, setIsPending] = useState(false);
  const [notice, setNotice] = useState("");

  async function handleClick() {
    if (isPending) {
      return;
    }

    setIsPending(true);
    setNotice("");

    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            redirectUrl?: string;
          }
        | null;

      if (!response.ok || !result?.ok || !result.redirectUrl) {
        setNotice(result?.message ?? "Не удалось начать звонок. Попробуйте ещё раз.");
        return;
      }

      window.location.href = result.redirectUrl;
    } catch {
      setNotice("Не удалось начать звонок. Попробуйте ещё раз или напишите в Telegram.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className={className}
        onClick={handleClick}
        aria-label={label}
        aria-busy={isPending}
        disabled={isPending}
      >
        {showIcon ? <Phone data-icon="inline-start" /> : null}
        {isPending ? "Соединяем..." : label}
      </button>
      {notice ? <span className="text-xs text-muted-foreground">{notice}</span> : null}
    </div>
  );
}
