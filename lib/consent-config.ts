// Shared by server and client code (no "use client"): which consent categories are active.

export type ConsentCategory = "thirdParty" | "ads";

/**
 * Categories actually in use, derived from configuration. Asking consent for a tracker that isn't
 * installed is pointless friction, so the banner only lists — and only appears for — active ones.
 * NEXT_PUBLIC_* values are inlined at build time, so they must be referenced literally.
 */
export const ACTIVE_CATEGORIES: ConsentCategory[] = [
  ...(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (["thirdParty"] as const) : []),
  ...(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? (["ads"] as const) : []),
];

/** false = no tracker requires consent: no banner at all (CNIL: none needed). */
export const CONSENT_NEEDED = ACTIVE_CATEGORIES.length > 0;

