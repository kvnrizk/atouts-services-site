/**
 * Feature switches. Turning a feature off hides it everywhere (public page, admin menu,
 * admin page, legal texts) without deleting its code or data, so it can come back later.
 */
export const FEATURES = {
  /** Price simulator (/simulateur + /admin/simulator). Disabled 2026-09-25 at the owner's request. */
  simulator: false,
  /** Online payments (Stripe checkout, /admin/payments, /espace-client/paiement). Disabled 2026-09-25:
   *  the company does not take payments through the site (deposits are paid outside it). */
  payments: false,
  /** FR/EN switch in the header and mobile menu. Hidden 2026-10-07: only the menu, footer and cookie
   *  banner are translated, page bodies are still in French. Turn back on once the pages are translated. */
  englishVersion: false,
} as const;
