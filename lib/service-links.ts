/**
 * Slug + label of each service page, for menus rendered in the browser (Header).
 * Kept separate from services-data.ts so client bundles don't ship all the page content.
 * Must list the same slugs as servicesData — checked in services-data.ts.
 */
export const serviceLinks = [
  { slug: "electricite", title: "Électricité" },
  { slug: "peinture", title: "Peinture" },
  { slug: "renovation", title: "Rénovation" },
  { slug: "salles-de-bains", title: "Salles de bains" },
  { slug: "revetements-sol", title: "Revêtements de sol" },
] as const;
