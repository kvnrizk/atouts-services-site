import {
  Paintbrush, Palette, Sparkles, Shield,
  Home, Hammer, Users,
  Zap, Lightbulb, Wrench,
  Bath, Droplets, Ruler,
  Layers, PaintBucket,
  type LucideIcon,
} from "lucide-react";
import { serviceLinks } from "./service-links";

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  project: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CaseStudy {
  location: string;
  surface: string;
  duration: string;
  title: string;
  problem: string;
  solution: string;
  result: string;
  image: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  description: string;
  heroIcon: LucideIcon;
  heroImage: string;
  apiCategory: string;
  /** Hero headline — the promise, not the service name (the name is in the eyebrow). */
  tagline: string;
  /** Typical duration shown in the trust bar; must stay consistent with the FAQ answers. */
  duration?: string;
  /** Concrete "what's included" checklist — answers "do you do X?" and adds indexable text. */
  included: string[];
  /** Real projects told as problem → solution → result. Section is hidden when empty. */
  caseStudies: CaseStudy[];
  features: {
    title: string;
    subtitle: string;
    items: ServiceFeature[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Testimonial[];
  };
  faqs: {
    title: string;
    subtitle: string;
    items: FAQ[];
  };
  beforeAfter: {
    title: string;
    subtitle: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const servicesData: Record<string, ServiceData> = {
  peinture: {
    slug: "peinture",
    title: "Peinture",
    description:
      "Services de peinture professionnels pour l'intérieur et l'extérieur. Transformez vos espaces avec des finitions impeccables et des couleurs qui vous ressemblent.",
    heroIcon: Paintbrush,
    heroImage:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1920&h=1080&fit=crop",
    apiCategory: "peinture",
    tagline: "Des murs nets, des finitions impeccables.",
    duration: "1–2 jours / pièce",
    included: [
      "Protection des sols et du mobilier",
      "Rebouchage, ponçage et enduits",
      "Sous-couche adaptée au support",
      "Murs, plafonds et boiseries",
      "Peintures labellisées A+",
      "Peinture extérieure et façades",
      "Enduits et effets décoratifs",
      "Nettoyage de fin de chantier",
    ],
    caseStudies: [],
    features: {
      title: "Notre Expertise",
      subtitle: "Des services complets pour vos projets de peinture",
      items: [
        { icon: Palette, title: "Conseils Couleurs", description: "Expertise pour choisir les teintes parfaites" },
        { icon: Sparkles, title: "Finitions Premium", description: "Peintures écologiques et sans solvants" },
        { icon: Paintbrush, title: "Application Pro", description: "Techniques professionnelles et soignées" },
        { icon: Shield, title: "Garantie 2 ans", description: "Qualité garantie sur tous nos travaux" },
      ],
    },
    process: {
      title: "Notre Processus",
      subtitle: "4 étapes pour votre projet réussi",
      steps: [
        { number: "01", title: "Consultation", description: "Analyse de vos besoins et conseils personnalisés" },
        { number: "02", title: "Préparation", description: "Protection et préparation minutieuse des surfaces" },
        { number: "03", title: "Application", description: "Peinture avec matériel professionnel" },
        { number: "04", title: "Finition", description: "Contrôle qualité et nettoyage complet" },
      ],
    },
    testimonials: {
      title: "Avis Clients",
      subtitle: "Ce que disent nos clients satisfaits",
      items: [
        { name: "Sophie D.", rating: 5, text: "Travail parfait ! Les couleurs choisies ont complètement transformé mon salon. Très professionnel.", project: "Peinture intérieure" },
        { name: "Marc T.", rating: 5, text: "Excellent service pour le ravalement de façade. Finitions impeccables et respect des délais.", project: "Peinture extérieure" },
      ],
    },
    faqs: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      items: [
        { question: "Quels types de peinture utilisez-vous ?", answer: "Nous utilisons principalement des peintures écologiques sans solvants, respectueuses de l'environnement et de votre santé. Nous adaptons le type de peinture selon vos besoins (intérieur, extérieur, décorative)." },
        { question: "Combien de temps faut-il pour peindre une pièce ?", answer: "Pour une pièce standard, comptez 1 à 2 jours incluant la préparation et 2 couches de peinture. Le délai varie selon la surface et l'état des murs." },
        { question: "Proposez-vous des conseils pour le choix des couleurs ?", answer: "Absolument ! Nous vous conseillons sur les couleurs et les associations selon votre style, la luminosité et l'ambiance souhaitée." },
      ],
    },
    beforeAfter: {
      title: "Avant / Après",
      subtitle: "Découvrez nos transformations",
    },
    seo: {
      title: "Peinture Intérieure & Extérieure | Atouts Services Issy-les-Moulineaux",
      description: "Services de peinture professionnels à Issy-les-Moulineaux et Hauts-de-Seine. Peinture intérieure, extérieure, ravalement. Devis gratuit.",
      keywords: ["peinture", "peinture intérieure", "peinture extérieure", "ravalement façade", "Issy-les-Moulineaux", "92"],
    },
  },

  renovation: {
    slug: "renovation",
    title: "Rénovation",
    description:
      "Rénovation complète d'appartements et maisons. De la conception à la réalisation, nous transformons vos espaces avec expertise et savoir-faire.",
    heroIcon: Home,
    heroImage:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1920&h=1080&fit=crop",
    apiCategory: "renovation",
    tagline: "Votre intérieur, repensé de A à Z.",
    duration: "3–6 sem. (60 m²)",
    included: [
      "Démolition et évacuation des gravats",
      "Cloisons, plâtrerie et isolation",
      "Plomberie et électricité",
      "Sols et revêtements muraux",
      "Menuiseries intérieures",
      "Peinture et finitions",
      "Coordination de tous les corps de métier",
      "Nettoyage de fin de chantier",
    ],
    caseStudies: [],
    features: {
      title: "Notre Expertise",
      subtitle: "Des services complets pour vos projets de rénovation",
      items: [
        { icon: Home, title: "Rénovation Clé en Main", description: "Gestion complète de votre projet" },
        { icon: Hammer, title: "Tous Corps d'État", description: "Coordination de tous les artisans" },
        { icon: Users, title: "Design Personnalisé", description: "Conception sur mesure de vos espaces" },
        { icon: Shield, title: "Garantie Décennale", description: "Travaux garantis 10 ans" },
      ],
    },
    process: {
      title: "Notre Processus",
      subtitle: "4 étapes pour votre projet réussi",
      steps: [
        { number: "01", title: "Étude", description: "Visite et étude de faisabilité" },
        { number: "02", title: "Conception", description: "Plans et devis détaillés" },
        { number: "03", title: "Travaux", description: "Réalisation par nos équipes" },
        { number: "04", title: "Livraison", description: "Réception et garanties" },
      ],
    },
    testimonials: {
      title: "Avis Clients",
      subtitle: "Ce que disent nos clients satisfaits",
      items: [
        { name: "Claire B.", rating: 5, text: "Rénovation parfaite de notre appartement. Équipe professionnelle et résultat au-delà de nos attentes.", project: "Rénovation appartement" },
        { name: "Thomas R.", rating: 5, text: "Excellente coordination et respect du planning. Notre cuisine est magnifique !", project: "Rénovation cuisine" },
      ],
    },
    faqs: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      items: [
        { question: "Combien de temps dure une rénovation complète ?", answer: "Cela dépend de la surface et des travaux. Pour un appartement de 60m², comptez 3 à 6 semaines. Nous établissons un planning précis dès le devis." },
        { question: "Gérez-vous tous les corps de métier ?", answer: "Oui, nous coordonnons l'ensemble des intervenants (électricité, plomberie, peinture, carrelage, etc.) pour un projet clé en main." },
        { question: "Puis-je rester dans mon logement pendant les travaux ?", answer: "Selon l'ampleur des travaux, c'est possible. Nous organisons le chantier pour minimiser les désagréments." },
      ],
    },
    beforeAfter: {
      title: "Avant / Après",
      subtitle: "Découvrez nos transformations",
    },
    seo: {
      title: "Rénovation Appartement & Maison | Atouts Services Issy-les-Moulineaux",
      description: "Rénovation complète d'appartements et maisons à Issy-les-Moulineaux. Clé en main, tous corps d'état. Devis gratuit.",
      keywords: ["rénovation", "rénovation appartement", "rénovation maison", "clé en main", "Issy-les-Moulineaux", "92"],
    },
  },

  electricite: {
    slug: "electricite",
    title: "Électricité",
    description:
      "Installation électrique, mise aux normes NFC 15-100, domotique et éclairage LED. Sécurisez et modernisez votre installation avec nos experts.",
    heroIcon: Zap,
    heroImage:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&h=1080&fit=crop",
    apiCategory: "electricite",
    tagline: "Une installation sûre, aux normes.",
    included: [
      "Diagnostic de l'installation existante",
      "Mise aux normes NF C 15-100",
      "Remplacement du tableau électrique",
      "Prises, interrupteurs et circuits",
      "Éclairage LED intérieur et extérieur",
      "Domotique et volets connectés",
      "Saignées rebouchées, murs propres",
      "Attestation de conformité",
    ],
    caseStudies: [],
    features: {
      title: "Notre Expertise",
      subtitle: "Des services complets pour vos installations électriques",
      items: [
        { icon: Shield, title: "Normes NFC 15-100", description: "Mise aux normes électriques garantie" },
        { icon: Lightbulb, title: "Éclairage LED", description: "Installations économes en énergie" },
        { icon: Zap, title: "Domotique", description: "Maison connectée et intelligente" },
        { icon: Wrench, title: "Dépannage 24/7", description: "Intervention rapide en urgence" },
      ],
    },
    process: {
      title: "Notre Processus",
      subtitle: "4 étapes pour votre installation réussie",
      steps: [
        { number: "01", title: "Diagnostic", description: "Analyse de votre installation" },
        { number: "02", title: "Devis", description: "Proposition détaillée et transparente" },
        { number: "03", title: "Installation", description: "Travaux par électriciens qualifiés" },
        { number: "04", title: "Certification", description: "Attestation de conformité Consuel" },
      ],
    },
    testimonials: {
      title: "Avis Clients",
      subtitle: "Ce que disent nos clients satisfaits",
      items: [
        { name: "Laurent M.", rating: 5, text: "Mise aux normes impeccable. Travail soigné et conforme aux normes. Je recommande !", project: "Mise aux normes électrique" },
        { name: "Nathalie P.", rating: 5, text: "Installation domotique parfaite. Équipe compétente et à l'écoute de nos besoins.", project: "Domotique" },
      ],
    },
    faqs: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      items: [
        { question: "Qu'est-ce que la norme NFC 15-100 ?", answer: "C'est la norme française qui définit les règles des installations électriques basse tension. Elle garantit la sécurité et le bon fonctionnement de votre installation." },
        { question: "Est-ce obligatoire de mettre aux normes son installation ?", answer: "Obligatoire pour les constructions neuves et fortement recommandé pour l'ancien, surtout en cas de vente. C'est surtout une question de sécurité." },
        { question: "Proposez-vous des solutions domotiques ?", answer: "Oui, nous installons des systèmes de maison connectée : éclairage, chauffage, volets, alarme pilotables à distance." },
      ],
    },
    beforeAfter: {
      title: "Avant / Après",
      subtitle: "Découvrez nos installations",
    },
    seo: {
      title: "Électricité & Domotique | Atouts Services Issy-les-Moulineaux",
      description: "Installation électrique, mise aux normes NFC 15-100, domotique à Issy-les-Moulineaux. Électriciens qualifiés. Devis gratuit.",
      keywords: ["électricité", "mise aux normes", "NFC 15-100", "domotique", "éclairage LED", "Issy-les-Moulineaux", "92"],
    },
  },

  "salles-de-bains": {
    slug: "salles-de-bains",
    title: "Salles de bains",
    description:
      "Création et rénovation de salles de bains sur mesure. Du design moderne à l'installation complète, transformez votre espace en un lieu de détente unique.",
    heroIcon: Bath,
    heroImage:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&h=1080&fit=crop",
    apiCategory: "salles-de-bains",
    tagline: "De la baignoire à la douche à l'italienne.",
    duration: "5–10 jours",
    included: [
      "Dépose de l'existant et évacuation",
      "Douche à l'italienne",
      "WC suspendu",
      "Étanchéité sous carrelage",
      "Plomberie et électricité",
      "Faïence et carrelage grand format",
      "Meuble vasque et robinetterie",
      "Sèche-serviettes",
    ],
    // PLACEHOLDER — exemples fictifs pour la maquette. À remplacer par de vrais chantiers avant la mise en ligne.
    caseStudies: [
      {
        location: "Issy-les-Moulineaux",
        surface: "6 m²",
        duration: "8 jours",
        title: "Une baignoire inutilisée devient une douche XXL",
        problem: "Baignoire des années 90 jamais utilisée, carrelage fissuré, peu de rangement.",
        solution: "Douche à l'italienne avec paroi fixe, WC suspendu, carrelage grand format et niche murale.",
        result: "Une pièce visuellement deux fois plus grande, entièrement accessible.",
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&h=900&fit=crop&q=75",
      },
      {
        location: "Boulogne-Billancourt",
        surface: "4 m²",
        duration: "6 jours",
        title: "Salle d'eau sous combles optimisée",
        problem: "Pièce mansardée, plafond bas, ancienne cabine de douche qui fuyait.",
        solution: "Reprise complète de l'étanchéité, douche sur mesure sous la pente, meuble vasque suspendu.",
        result: "Plus aucune fuite et 30 % de rangement en plus.",
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&h=900&fit=crop&q=75",
      },
    ],
    features: {
      title: "Notre Expertise",
      subtitle: "Des services complets pour votre salle de bains",
      items: [
        { icon: Ruler, title: "Design Personnalisé", description: "Conception sur mesure adaptée à vos besoins" },
        { icon: Droplets, title: "Plomberie Complète", description: "Installation et rénovation de toute la plomberie" },
        { icon: Hammer, title: "Carrelage & Faïence", description: "Pose professionnelle de tous types de revêtements" },
        { icon: Shield, title: "Étanchéité Garantie", description: "Protection optimale contre l'humidité" },
      ],
    },
    process: {
      title: "Notre Processus",
      subtitle: "4 étapes pour votre projet réussi",
      steps: [
        { number: "01", title: "Consultation", description: "Rencontre et analyse de vos besoins" },
        { number: "02", title: "Design & Devis", description: "Conception 3D et proposition détaillée" },
        { number: "03", title: "Réalisation", description: "Travaux réalisés par nos experts" },
        { number: "04", title: "Finition", description: "Contrôle qualité et nettoyage final" },
      ],
    },
    testimonials: {
      title: "Avis Clients",
      subtitle: "Ce que disent nos clients satisfaits",
      items: [
        { name: "Marie L.", rating: 5, text: "Travail impeccable ! Ma nouvelle salle de bain est magnifique. L'équipe a été professionnelle du début à la fin.", project: "Rénovation complète" },
        { name: "Jean-Pierre M.", rating: 5, text: "Très satisfait du résultat. Respect des délais et du budget. Je recommande vivement !", project: "Création salle d'eau" },
      ],
    },
    faqs: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      items: [
        { question: "Quel est le délai moyen pour rénover une salle de bains ?", answer: "En moyenne, une rénovation complète prend entre 5 et 10 jours selon la complexité du projet. Nous vous fournissons un planning détaillé dès le devis." },
        { question: "Proposez-vous des solutions clé en main ?", answer: "Oui, nous gérons l'intégralité du projet : conception, fourniture des matériaux, travaux et finitions. Vous n'avez qu'à profiter du résultat !" },
        { question: "Quelles sont les garanties ?", answer: "Tous nos travaux sont couverts par une garantie décennale. Nous utilisons uniquement des matériaux de qualité avec garantie fabricant." },
      ],
    },
    beforeAfter: {
      title: "Avant / Après",
      subtitle: "Découvrez nos transformations",
    },
    seo: {
      title: "Salle de Bains | Rénovation & Création | Atouts Services Issy-les-Moulineaux",
      description: "Création et rénovation de salles de bains à Issy-les-Moulineaux. Design sur mesure, plomberie, carrelage. Devis gratuit.",
      keywords: ["salle de bains", "rénovation salle de bains", "création salle d'eau", "plomberie", "carrelage", "Issy-les-Moulineaux", "92"],
    },
  },

  "revetements-sol": {
    slug: "revetements-sol",
    title: "Revêtements de sol",
    description:
      "Pose de parquet, carrelage, PVC, moquette et sols techniques. Des finitions impeccables pour sublimer vos intérieurs.",
    heroIcon: Layers,
    heroImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=1080&fit=crop",
    apiCategory: "revetements-sol",
    tagline: "Des sols qui durent, posés au millimètre.",
    duration: "1–3 jours / pièce",
    included: [
      "Dépose de l'ancien revêtement",
      "Ragréage et préparation du support",
      "Parquet massif ou contrecollé",
      "Carrelage et grès cérame",
      "Sols vinyles (LVT)",
      "Plinthes et barres de seuil",
      "Ponçage et vitrification",
      "Nettoyage de fin de chantier",
    ],
    caseStudies: [],
    features: {
      title: "Notre Expertise",
      subtitle: "Des solutions complètes pour tous vos sols",
      items: [
        { icon: Layers, title: "Tous Types de Sols", description: "Parquet, carrelage, PVC, moquette" },
        { icon: PaintBucket, title: "Préparation Expert", description: "Ragréage et nivellement parfait" },
        { icon: Ruler, title: "Pose Professionnelle", description: "Techniques adaptées à chaque matériau" },
        { icon: Shield, title: "Garantie Qualité", description: "Finitions durables et soignées" },
      ],
    },
    process: {
      title: "Notre Processus",
      subtitle: "4 étapes pour un sol parfait",
      steps: [
        { number: "01", title: "Mesures", description: "Relevé précis des surfaces" },
        { number: "02", title: "Préparation", description: "Ragréage et mise à niveau" },
        { number: "03", title: "Pose", description: "Installation par nos poseurs experts" },
        { number: "04", title: "Finitions", description: "Plinthes et derniers détails" },
      ],
    },
    testimonials: {
      title: "Avis Clients",
      subtitle: "Ce que disent nos clients satisfaits",
      items: [
        { name: "Isabelle D.", rating: 5, text: "Magnifique parquet posé avec soin. Le résultat dépasse nos espérances. Très pro !", project: "Pose parquet" },
        { name: "David L.", rating: 5, text: "Carrelage impeccablement posé. Joints parfaits et respect total du planning.", project: "Carrelage salon" },
      ],
    },
    faqs: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      items: [
        { question: "Quel type de sol choisir pour mon projet ?", answer: "Cela dépend de l'usage (pièce humide, trafic intense), de votre budget et de vos goûts. Le parquet apporte chaleur et élégance, le carrelage résiste mieux à l'humidité, le PVC est économique et facile d'entretien." },
        { question: "Combien de temps pour poser du parquet ou du carrelage ?", answer: "Pour une pièce de 20m², comptez 1 à 2 jours pour du parquet, 2 à 3 jours pour du carrelage (incluant la préparation et le temps de séchage)." },
        { question: "Proposez-vous la dépose de l'ancien revêtement ?", answer: "Oui, nous gérons la dépose de l'ancien sol et l'évacuation des déchets. C'est inclus dans nos prestations." },
      ],
    },
    beforeAfter: {
      title: "Avant / Après",
      subtitle: "Découvrez nos réalisations",
    },
    seo: {
      title: "Revêtements de Sol | Parquet, Carrelage, PVC | Atouts Services Issy-les-Moulineaux",
      description: "Pose de parquet, carrelage, PVC et moquette à Issy-les-Moulineaux. Poseurs professionnels, finitions soignées. Devis gratuit.",
      keywords: ["revêtement sol", "parquet", "carrelage", "PVC", "moquette", "pose sol", "Issy-les-Moulineaux", "92"],
    },
  },
};

export const allServiceSlugs = Object.keys(servicesData);

// Keep the lightweight menu list (lib/service-links.ts) in sync with the real pages.
if (process.env.NODE_ENV !== "production") {
  const menuSlugs = serviceLinks.map((l) => l.slug).join(",");
  if (menuSlugs !== allServiceSlugs.join(",")) {
    console.warn(`[services] service-links.ts (${menuSlugs}) is out of sync with servicesData (${allServiceSlugs.join(",")})`);
  }
}

export function getServiceData(slug: string): ServiceData | undefined {
  return servicesData[slug];
}
