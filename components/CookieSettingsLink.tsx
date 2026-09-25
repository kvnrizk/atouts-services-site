"use client";

import { useTranslations } from "next-intl";
import { openConsentSettings } from "@/lib/consent";

/** Footer link that reopens the consent panel — withdrawing consent must stay one click away. */
export function CookieSettingsLink({ className }: { className?: string }) {
  const t = useTranslations("cookie");
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {t("settings")}
    </button>
  );
}
