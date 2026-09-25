"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  readConsent,
  saveConsent,
  onConsentOpen,
  useConsentStatus,
  type ConsentCategory,
} from "@/lib/consent";

const btn = "rounded-md px-4 py-2.5 text-sm font-semibold transition-colors";
// "Refuse all" and "Accept all" look exactly the same: the CNIL requires refusing to be as easy as accepting.
const choiceBtn = `${btn} bg-white text-neutral-950 hover:bg-neutral-200`;
const secondary = `${btn} border border-neutral-600 text-white hover:bg-neutral-800`;

const allOff: Record<ConsentCategory, boolean> = { thirdParty: false, ads: false };
const allOn: Record<ConsentCategory, boolean> = { thirdParty: true, ads: true };

export function CookieConsent() {
  const t = useTranslations("cookie");
  const status = useConsentStatus();
  const [reopened, setReopened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState(allOff);

  // Footer "Gestion des cookies" reopens the panel with the current choices
  useEffect(
    () =>
      onConsentOpen(() => {
        setChoices(readConsent()?.choices ?? allOff);
        setCustomizing(true);
        setReopened(true);
      }),
    []
  );

  const decide = (c: Record<ConsentCategory, boolean>) => {
    saveConsent(c);
    setReopened(false);
    setCustomizing(false);
  };

  // Shown when never asked, expired (6 months) or new version — or reopened from the footer
  const visible = reopened || status === null;
  if (!visible) return null;

  const categories: { key: ConsentCategory | "necessary" | "analytics"; locked?: boolean }[] = [
    { key: "necessary", locked: true },
    { key: "analytics", locked: true },
    { key: "thirdParty" },
    { key: "ads" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 md:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl bg-neutral-950 p-5 text-white shadow-2xl ring-1 ring-white/10 md:p-6">
        <h2 id="consent-title" className="text-lg font-bold">{t("title")}</h2>
        <p className="mt-2 text-sm text-neutral-300">
          {t("message")}{" "}
          <Link href="/cookies" className="text-sky-400 underline hover:text-sky-300">{t("learnMore")}</Link>
        </p>

        {customizing && (
          <ul className="mt-5 max-h-[45vh] space-y-3 overflow-y-auto">
            {categories.map(({ key, locked }) => {
              const checked = locked ? true : choices[key as ConsentCategory];
              return (
                <li key={key} className="flex items-start justify-between gap-4 rounded-lg bg-neutral-900 p-4">
                  <div>
                    <p className="font-semibold">{t(`${key}Title`)}</p>
                    <p className="mt-1 text-xs text-neutral-400">{t(`${key}Desc`)}</p>
                  </div>
                  {locked ? (
                    <span className="shrink-0 text-xs font-semibold text-sky-400">{t("alwaysOn")}</span>
                  ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      aria-label={t(`${key}Title`)}
                      onClick={() => setChoices((c) => ({ ...c, [key]: !c[key as ConsentCategory] }))}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-sky-400" : "bg-neutral-700"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {customizing ? (
            <button type="button" className={secondary} onClick={() => decide(choices)}>{t("save")}</button>
          ) : (
            <button type="button" className={`${btn} text-neutral-300 underline hover:text-white sm:mr-auto`} onClick={() => setCustomizing(true)}>
              {t("customize")}
            </button>
          )}
          <button type="button" className={choiceBtn} onClick={() => decide(allOff)}>{t("refuseAll")}</button>
          <button type="button" className={choiceBtn} onClick={() => decide(allOn)}>{t("acceptAll")}</button>
        </div>
      </div>
    </div>
  );
}
