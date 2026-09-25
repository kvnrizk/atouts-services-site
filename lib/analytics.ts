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
 * Track a custom event via Plausible
 */
export function trackEvent(
  event: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, props ? { props } : undefined);
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
