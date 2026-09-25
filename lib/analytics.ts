/**
 * Analytics utilities for Plausible Analytics
 * Plausible is privacy-friendly and CNIL-exempt (no cookies).
 * Custom domain: configured via NEXT_PUBLIC_PLAUSIBLE_DOMAIN env var.
 */

// Extend window for Plausible
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

/**
 * Events that also feed the built-in visitor analytics (admin → Analytiques), mapped to the
 * backend's event names with only the small props it keeps.
 */
const COLLECTED_EVENTS: Record<string, { name: string; prop: string }> = {
  "Phone Click": { name: "phone_click", prop: "location" },
  "Quote Request": { name: "quote_submitted", prop: "service" },
  "Quote Form Step": { name: "quote_step", prop: "step" },
};

/**
 * Track a custom event: Plausible (if configured) + built-in analytics for conversion events.
 */
export function trackEvent(
  event: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
  const collected = COLLECTED_EVENTS[event];
  if (collected) {
    const value = props?.[collected.prop];
    sendToCollector({
      type: "event",
      name: collected.name,
      path: window.location.pathname,
      props: value !== undefined ? { [collected.prop]: String(value) } : {},
    });
  }
}

// --- Built-in visitor analytics (cookieless, see app/api/collect/route.ts) ---

/** Where the visit started, captured once and kept in memory (never written to the device). */
let entryReferrer: string | undefined;
let paidClick = false;
let visitCaptured = false;

export function captureVisitContext() {
  if (typeof window === "undefined" || visitCaptured) return;
  visitCaptured = true;
  captureUtmParams();
  entryReferrer = document.referrer || undefined;
  const params = new URLSearchParams(window.location.search);
  // Google Ads click ids: only their presence is used, to label the visit "Google Ads"
  paidClick = ["gclid", "gbraid", "wbraid"].some((k) => params.has(k));
}

/** Private or utility pages that shouldn't count as audience. */
const UNTRACKED = /^\/(en\/)?(espace-client|newsletter)(\/|$)/;

export function trackPageview(path: string) {
  if (UNTRACKED.test(path)) return;
  sendToCollector({ type: "pageview", path });
}

function sendToCollector(payload: { type: "pageview" | "event"; path: string; name?: string; props?: Record<string, string> }) {
  captureVisitContext();
  const body = JSON.stringify({ ...payload, referrer: entryReferrer, utm: capturedUtm, paid: paidClick });
  try {
    // sendBeacon survives page unloads (e.g. tapping the phone number); text/plain avoids a CORS preflight
    if (!navigator.sendBeacon?.("/api/collect", new Blob([body], { type: "text/plain" }))) {
      void fetch("/api/collect", { method: "POST", body, keepalive: true });
    }
  } catch {
    // analytics must never break the page
  }
}

// --- Specific event helpers ---

export function trackQuoteRequest(service: string) {
  trackEvent("Quote Request", { service });
}

export function trackPhoneClick(location: string) {
  trackEvent("Phone Click", { location });
}

export function trackServiceView(service: string) {
  trackEvent("Service View", { service });
}

export function trackBeforeAfterView(projectId: number) {
  trackEvent("Before After View", { project: String(projectId) });
}

export function trackBlogView(slug: string) {
  trackEvent("Blog View", { slug });
}

export function trackSimulatorStart() {
  trackEvent("Simulator Start");
}

export function trackSimulatorComplete() {
  trackEvent("Simulator Complete");
}

// --- UTM parameter tracking ---

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * UTM parameters (which campaign/ad brought the visitor) are kept IN MEMORY only, never written
 * to the visitor's device: writing to the device would require consent (ePrivacy art. 82), and
 * linking a campaign to a named quote request is not anonymous statistics. Internal links use
 * client-side navigation, so the value survives from the landing page to the quote form.
 */
let capturedUtm: UtmParams = {};

/** Call once on page load (UtmCapture component). */
export function captureUtmParams() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  let hasUtm = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
      hasUtm = true;
    }
  }

  if (hasUtm) capturedUtm = utm;
}

/** UTM parameters captured on this visit (attached to quote requests). */
export function getUtmParams(): UtmParams {
  return capturedUtm;
}
