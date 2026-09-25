"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie / tracker consent, following the CNIL guidelines (délibération 2020-091/092):
 * - only trackers that REQUIRE consent are listed here. Plausible (cookieless, anonymous
 *   audience measurement) is exempt and always on; it is disclosed in the banner and policy.
 * - refusing is as easy as accepting, nothing is pre-ticked
 * - the choice (accept OR refuse) is remembered 6 months, then asked again
 * - bumping CONSENT_VERSION (e.g. when a new tracker is added) asks everyone again
 * - no consent-based tracker configured => no banner (see ACTIVE_CATEGORIES)
 */
import { ACTIVE_CATEGORIES, CONSENT_NEEDED, type ConsentCategory } from "./consent-config";

export { ACTIVE_CATEGORIES, CONSENT_NEEDED, type ConsentCategory };

export interface ConsentState {
  version: number;
  /** ISO date of the choice — proof of consent and expiry reference */
  date: string;
  choices: Record<ConsentCategory, boolean>;
}

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "atouts_consent";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // ~6 months
const CHANGE_EVENT = "atouts:consent-change";
const OPEN_EVENT = "atouts:consent-open";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as ConsentState;
    const expired = Date.now() - new Date(state.date).getTime() > MAX_AGE_MS;
    if (state.version !== CONSENT_VERSION || expired) return null;
    return state;
  } catch {
    return null;
  }
}

// Cached snapshot so useSyncExternalStore gets a stable reference between renders.
let snapshot: ConsentState | null | undefined;
function getSnapshot(): ConsentState | null {
  if (snapshot === undefined) snapshot = readConsent();
  return snapshot;
}
function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
}

export function saveConsent(choices: Record<ConsentCategory, boolean>) {
  const state: ConsentState = { version: CONSENT_VERSION, date: new Date().toISOString(), choices };
  snapshot = state;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.removeItem("cookie_consent"); // legacy key from the old banner
  } catch {
    // storage blocked (private mode): the choice still applies for this page view
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: state }));
}

/** Reopens the consent panel (footer "Gestion des cookies" link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}

/**
 * Consent status, re-rendering when it changes.
 * "unknown" during server rendering (localStorage isn't readable there) — callers render nothing
 * consent-dependent until the browser knows; null = not decided yet (treated as refused).
 */
export function useConsentStatus(): ConsentState | null | "unknown" {
  return useSyncExternalStore<ConsentState | null | "unknown">(subscribe, getSnapshot, () => "unknown");
}

/** Current consent; null when undecided or not yet known. */
export function useConsent(): ConsentState | null {
  const status = useConsentStatus();
  return status === "unknown" ? null : status;
}

export function hasConsent(state: ConsentState | null, category: ConsentCategory) {
  return state?.choices[category] === true;
}
