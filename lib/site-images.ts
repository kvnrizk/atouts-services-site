/**
 * Every photo built into the site (files in public/images/stock), with where it is used and
 * how it may be used. Single source for the pages (Hero, service pages) and for the admin
 * "Photos du site" page. Photos uploaded from the admin (portfolio, avant/après) live in the
 * backend and are listed separately. Keep docs/IMAGES.md in sync.
 */
export interface SiteImage {
  /** Number shown in the admin and in docs/IMAGES.md */
  n: number;
  src: string;
  title: string;
  usedOn: string[];
  source: "Unsplash" | "Atouts Services";
  unsplashId?: string;
  license: string;
  /** Usage restriction, shown prominently in the admin */
  restriction?: string;
}

const UNSPLASH = "Licence Unsplash : usage commercial libre, sans crédit obligatoire. Décor uniquement, jamais présentée comme une réalisation.";

export const SITE_IMAGES = {
  maison: {
    n: 1,
    src: "/images/stock/maison-contemporaine.jpg",
    title: "Maison contemporaine",
    usedOn: ["Accueil — photo principale (1/4)"],
    source: "Unsplash",
    unsplashId: "1600585154340-be6161a56a0c",
    license: UNSPLASH,
  },
  cuisine: {
    n: 2,
    src: "/images/stock/cuisine-blanche.jpg",
    title: "Cuisine blanche",
    usedOn: ["Accueil — photo principale (2/4)", "Service Rénovation — photo d'en-tête"],
    source: "Unsplash",
    unsplashId: "1484154218962-a197022b5858",
    license: UNSPLASH,
  },
  peinture: {
    n: 3,
    src: "/images/stock/rouleau-peinture.jpg",
    title: "Rouleau de peinture",
    usedOn: ["Accueil — photo principale (3/4)", "Service Peinture — photo d'en-tête"],
    source: "Unsplash",
    unsplashId: "1562259949-e8e7689d7828",
    license: UNSPLASH,
  },
  salleDeBains: {
    n: 4,
    src: "/images/stock/salle-de-bains-lumineuse.jpg",
    title: "Salle de bains lumineuse",
    usedOn: ["Accueil — photo principale (4/4)", "Service Salles de bains — photo d'en-tête"],
    source: "Unsplash",
    unsplashId: "1552321554-5fefe8c9ef14",
    license: UNSPLASH,
  },
  electricien: {
    n: 5,
    src: "/images/stock/electricien-au-travail.jpg",
    title: "Électricien au travail",
    usedOn: ["Service Électricité — photo d'en-tête"],
    source: "Unsplash",
    unsplashId: "1621905251189-08b45d6a269e",
    license: UNSPLASH,
    restriction:
      "Ne jamais utiliser dans une publicité (Google Ads, réseaux sociaux, flyers) : personne reconnaissable, sans autorisation écrite de sa part. Site uniquement ; à remplacer par une photo de notre équipe.",
  },
  parquet: {
    n: 6,
    src: "/images/stock/salon-parquet.jpg",
    title: "Salon avec parquet",
    usedOn: ["Service Revêtements de sol — photo d'en-tête"],
    source: "Unsplash",
    unsplashId: "1600210492486-724fe5c67fb0",
    license: UNSPLASH,
  },
} satisfies Record<string, SiteImage>;

export const ALL_SITE_IMAGES: SiteImage[] = Object.values(SITE_IMAGES).sort((a, b) => a.n - b.n);
