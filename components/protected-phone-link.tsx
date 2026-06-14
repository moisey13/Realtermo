"use client";

import { useMemo, useState } from "react";
import { Phone } from "lucide-react";

import { phoneDisplayParts, phoneLinkParts } from "@/lib/site";

type ProtectedPhoneLinkProps = {
  className?: string;
  compact?: boolean;
  showIcon?: boolean;
};

function isMobileDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function ProtectedPhoneLink({
  className,
  compact = false,
  showIcon = true,
}: ProtectedPhoneLinkProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [notice, setNotice] = useState("");

  const phoneLabel = useMemo(() => phoneDisplayParts.join(" "), []);
  const telHref = useMemo(() => `tel:${phoneLinkParts.join("")}`, []);
  const defaultLabel = compact ? "Позвонить" : "Телефон";

  async function handleClick() {
    if (!isRevealed) {
      setIsRevealed(true);
      setNotice(isMobileDevice() ? "Нажмите ещё раз, чтобы позвонить." : "Номер показан только после клика.");
      return;
    }

    if (isMobileDevice()) {
      window.location.href = telHref;
      return;
    }

    try {
      await navigator.clipboard.writeText(phoneLabel);
      setNotice("Номер скопирован в буфер обмена.");
    } catch {
      setNotice("Скопируйте номер вручную.");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className={className}
        onClick={handleClick}
        aria-label={isRevealed ? `Телефон ${phoneLabel}` : defaultLabel}
      >
        {showIcon ? <Phone data-icon="inline-start" /> : null}
        {isRevealed ? phoneLabel : defaultLabel}
      </button>
      {notice ? <span className="text-xs text-muted-foreground">{notice}</span> : null}
    </div>
  );
}
