/**
 * Feature switches. Turning a feature off hides it everywhere (public page, admin menu,
 * admin page, legal texts) without deleting its code or data, so it can come back later.
 */
export const FEATURES = {
  /** Price simulator (/simulateur + /admin/simulator). Disabled 2026-09-25 at the owner's request. */
  simulator: false,
} as const;
