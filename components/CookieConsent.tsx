"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ACTIVE_CATEGORIES,
  CONSENT_NEEDED,
  readConsent,
  saveConsent,
  onConsentOpen,
  useConsentStatus,
  type ConsentCategory,
} from "@/lib/consent";

const btn = "rounded-md px-4 py-2.5 text-sm font-semibold transition-colors";
// "Tout refuser" and "Tout accepter" look exactly the same: the CNIL requires refusing to be as easy as accepting.
const choiceBtn = `${btn} bg-white text-neutral-950 hover:bg-neutral-200`;
const secondary = `${btn} border border-neutral-600 text-white hover:bg-neutral-800`;

const choicesFor = (value: boolean) =>
  Object.fromEntries(ACTIVE_CATEGORIES.map((c) => [c, value])) as Record<ConsentCategory, boolean>;

/**
 * First layer follows the CNIL recommendation: who sets the cookies, each purpose as a short
 * bold title + one line, the consequence of refusing, how to change one's mind, a link to the
 * full list. Only categories actually configured are shown; with none, no banner at all.
 */
export function CookieConsent() {
  const t = useTranslations("cookie");
  const status = useConsentStatus();
  const [reopened, setReopened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState(() => choicesFor(false));

  // Footer "Gestion des cookies" reopens the panel with the current choices
  useEffect(
    () =>
      onConsentOpen(() => {
        setChoices({ ...choicesFor(false), ...readConsent()?.choices });
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
  if (!CONSENT_NEEDED || !(reopened || status === null)) return null;

  const lockedRows = ["necessary", "analytics"] as const;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-0 bottom-0 z-[60] p-3 md:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-neutral-950 p-5 text-white shadow-2xl ring-1 ring-white/10 md:p-6">
        <h2 id="consent-title" className="text-lg font-bold">{t("title")}</h2>

        {!customizing ? (
          <>
            <p className="mt-2 text-sm text-neutral-300">{t("intro")}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {ACTIVE_CATEGORIES.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                  <span>
                    <strong className="text-white">{t(`${c}Title`)}</strong>
                    <span className="text-neutral-400"> : {t(`${c}Short`)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-neutral-400">
              {t("footnote")}{" "}
              <Link href="/cookies" className="text-sky-400 underline hover:text-sky-300">{t("learnMore")}</Link>
            </p>
          </>
        ) : (
          <ul className="mt-4 max-h-[45vh] space-y-3 overflow-y-auto">
            {lockedRows.map((key) => (
              <li key={key} className="flex items-start justify-between gap-4 rounded-lg bg-neutral-900 p-4">
                <div>
                  <p className="font-semibold">{t(`${key}Title`)}</p>
                  <p className="mt-1 text-xs text-neutral-400">{t(`${key}Desc`)}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-sky-400">{t("alwaysOn")}</span>
              </li>
            ))}
            {ACTIVE_CATEGORIES.map((key) => {
              const checked = choices[key];
              return (
                <li key={key} className="flex items-start justify-between gap-4 rounded-lg bg-neutral-900 p-4">
                  <div>
                    <p className="font-semibold">{t(`${key}Title`)}</p>
                    <p className="mt-1 text-xs text-neutral-400">{t(`${key}Desc`)}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={t(`${key}Title`)}
                    onClick={() => setChoices((c) => ({ ...c, [key]: !c[key] }))}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-sky-400" : "bg-neutral-700"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
                  </button>
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
          <button type="button" className={choiceBtn} onClick={() => decide(choicesFor(false))}>{t("refuseAll")}</button>
          <button type="button" className={choiceBtn} onClick={() => decide(choicesFor(true))}>{t("acceptAll")}</button>
        </div>
      </div>
    </div>
  );
}
