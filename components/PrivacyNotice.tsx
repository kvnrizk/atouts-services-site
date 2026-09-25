"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * RGPD art. 13 information shown right where personal data is collected:
 * purpose, retention period, rights, and a link to the full policy.
 */
export function PrivacyNotice({ kind = "quote", className = "" }: { kind?: "quote" | "account"; className?: string }) {
  const t = useTranslations("privacyNotice");
  return (
    <p className={`text-xs leading-relaxed ${className}`}>
      {t(kind)}{" "}
      <Link href="/politique-de-confidentialite" className="underline hover:no-underline">
        {t("link")}
      </Link>
    </p>
  );
}
