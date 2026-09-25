"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONSENT_NEEDED, openConsentSettings } from "@/lib/consent";

/**
 * Footer link that reopens the consent panel — withdrawing consent must stay one click away.
 * With no consent-based tracker active there is nothing to choose: it opens the cookie page instead.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  const t = useTranslations("cookie");
  if (!CONSENT_NEEDED) {
    return <Link href="/cookies" className={className}>{t("settings")}</Link>;
  }
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {t("settings")}
    </button>
  );
}
