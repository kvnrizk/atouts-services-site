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
 * Capture UTM parameters from the URL and store in sessionStorage.
 * Call this on page load (e.g., in a client layout effect).
 */
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

  if (hasUtm) {
    sessionStorage.setItem("utm_params", JSON.stringify(utm));
  }
}

/**
 * Retrieve stored UTM parameters (to attach to form submissions).
 */
export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem("utm_params");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
