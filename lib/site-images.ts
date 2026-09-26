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
  blogPompeAChaleur: {
    n: 7,
    src: "/images/blog/maprimerenov-2026-travaux-eligibles.jpg",
    title: "Pompe à chaleur extérieure",
    usedOn: ["Blog — « MaPrimeRénov' 2026 : quels travaux sont encore éligibles ? »"],
    source: "Unsplash",
    unsplashId: "1776860150305-108ed577d7d4",
    license: UNSPLASH,
  },
  blogCalculatrice: {
    n: 8,
    src: "/images/blog/tva-10-ou-5-5-travaux.jpg",
    title: "Calculatrice et devis",
    usedOn: ["Blog — « TVA à 10 % ou 5,5 % sur les travaux »"],
    source: "Unsplash",
    unsplashId: "1625225233840-695456021cde",
    license: UNSPLASH,
  },
  blogTableauElectrique: {
    n: 9,
    src: "/images/blog/norme-nf-c-15-100-refaire-electricite.jpg",
    title: "Tableau électrique",
    usedOn: ["Blog — « Norme NF C 15-100 : quand refaire son électricité ? »"],
    source: "Unsplash",
    unsplashId: "1576446468729-7674e99608f5",
    license: UNSPLASH,
  },
  blogFacadeImmeuble: {
    n: 10,
    src: "/images/blog/travaux-copropriete-autorisation.jpg",
    title: "Façade d'immeuble haussmannien",
    usedOn: ["Blog — « Travaux en copropriété : quelle autorisation ? »"],
    source: "Unsplash",
    unsplashId: "1762419371724-62026e913a70",
    license: UNSPLASH,
  },
  blogDoucheItalienne: {
    n: 11,
    src: "/images/blog/douche-italienne-erreurs-a-eviter.jpg",
    title: "Douche à l'italienne vitrée",
    usedOn: ["Blog — « Douche à l'italienne : les 5 erreurs à éviter »"],
    source: "Unsplash",
    unsplashId: "1771929662486-f793e08f0f16",
    license: UNSPLASH,
  },
  blogSalleDeBainsComplete: {
    n: 12,
    src: "/images/blog/duree-renovation-salle-de-bains.jpg",
    title: "Salle de bains rénovée",
    usedOn: ["Blog — « Combien de temps dure la rénovation d'une salle de bains ? »"],
    source: "Unsplash",
    unsplashId: "1721824320926-3d4f13d9b5e8",
    license: UNSPLASH,
  },
  blogCuisineSolBois: {
    n: 13,
    src: "/images/blog/parquet-ou-carrelage-cuisine.jpg",
    title: "Cuisine blanche, sol bois",
    usedOn: ["Blog — « Parquet ou carrelage dans une cuisine ? »"],
    source: "Unsplash",
    unsplashId: "1722348672280-c6fe1b1246c2",
    license: UNSPLASH,
  },
  blogParquetPointDeHongrie: {
    n: 14,
    src: "/images/blog/renover-appartement-ancien-boulogne-billancourt.jpg",
    title: "Parquet à bâtons rompus",
    usedOn: ["Blog — « Rénover un appartement ancien à Boulogne-Billancourt »"],
    source: "Unsplash",
    unsplashId: "1786020843199-9f86e68d4bb7",
    license: UNSPLASH,
  },
  appartementRenove: {
    n: 15,
    src: "/images/stock/appartement-renove.jpg",
    title: "Appartement rénové (vide, lumineux)",
    usedOn: ["Accueil — section « Pourquoi Atouts Services »"],
    source: "Unsplash",
    unsplashId: "1630699376289-b62375a35505",
    license: UNSPLASH,
  },
} satisfies Record<string, SiteImage>;

export const ALL_SITE_IMAGES: SiteImage[] = Object.values(SITE_IMAGES).sort((a, b) => a.n - b.n);
