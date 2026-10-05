import {
  Paintbrush, Palette, Sparkles, Shield,
  Home, Hammer, Users,
  Zap, Lightbulb, Wrench,
  Bath, Droplets, Ruler,
  Layers, PaintBucket,
  type LucideIcon,
} from "lucide-react";
import { serviceLinks } from "./service-links";
import { SITE_IMAGES } from "./site-images";

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
  /** Section heading only: the reviews themselves come from Admin → Avis clients (real reviews only) */
  testimonials: {
    title: string;
    subtitle: string;
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
      "Peinture intérieure et extérieure pour appartements, maisons et façades. Nous préparons chaque support avant de peindre : c'est cette étape qui fait la tenue et la netteté du résultat.",
    heroIcon: Paintbrush,
    heroImage: SITE_IMAGES.peinture.src,
    apiCategory: "peinture",
    tagline: "Une peinture qui tient, sur des murs bien préparés.",
    duration: "1–2 jours / pièce",
    included: [
      "Protection des sols et du mobilier",
      "Rebouchage, ponçage et enduits",
      "Sous-couche adaptée au support",
      "Murs, plafonds et boiseries",
      "Peintures intérieures classées A+",
      "Peinture extérieure et façades",
      "Enduits et effets décoratifs",
      "Nettoyage en fin de chantier",
    ],
    caseStudies: [],
    features: {
      title: "Notre savoir-faire",
      subtitle: "Ce qui fait la différence sur un chantier de peinture",
      items: [
        { icon: Palette, title: "Conseil couleurs", description: "Nous vous aidons à choisir teintes et finitions selon la lumière et l'usage de chaque pièce." },
        { icon: Sparkles, title: "Peintures classées A+", description: "Des peintures intérieures au plus faible niveau d'émissions de polluants dans l'air." },
        { icon: Paintbrush, title: "Préparation des supports", description: "Rebouchage, ponçage et sous-couche : c'est la préparation qui fait la tenue de la peinture." },
        { icon: Shield, title: "Entreprise assurée", description: "Garantie décennale auprès de la Mutuelle de Poitiers Assurances." },
      ],
    },
    process: {
      title: "Notre méthode",
      subtitle: "Quatre étapes, de la visite à la remise des clés",
      steps: [
        { number: "01", title: "Visite et devis", description: "Nous examinons l'état des murs et plafonds, puis vous remettons un devis détaillé." },
        { number: "02", title: "Protection et préparation", description: "Sols et mobilier protégés, supports rebouchés, poncés et dépoussiérés." },
        { number: "03", title: "Mise en peinture", description: "Sous-couche puis deux couches de finition, avec le matériel adapté à chaque surface." },
        { number: "04", title: "Contrôle et nettoyage", description: "Vérification à la lumière rasante, retouches, puis nettoyage complet." },
      ],
    },
    testimonials: {
      title: "Avis clients",
      subtitle: "Ils nous ont confié leurs travaux de peinture",
    },
    faqs: {
      title: "Questions fréquentes",
      subtitle: "Vos questions sur la peinture",
      items: [
        { question: "Quelles peintures utilisez-vous ?", answer: "Pour l'intérieur, des peintures classées A+, le meilleur niveau de l'étiquette réglementaire sur les émissions de polluants dans l'air intérieur. Nous choisissons ensuite la finition selon la pièce : mate pour les plafonds, velours ou satinée pour les pièces de vie et les pièces humides." },
        { question: "Combien de temps faut-il pour peindre une pièce ?", answer: "Comptez 1 à 2 jours pour une pièce standard, préparation et deux couches comprises. Le délai dépend de la surface, de la hauteur sous plafond et de l'état des murs : une pièce très abîmée demande plus de rebouchage et d'enduit." },
        { question: "Faut-il vider la pièce avant les travaux ?", answer: "Ce n'est pas indispensable. Nous déplaçons le mobilier au centre de la pièce et le protégeons, ainsi que les sols. Nous vous conseillons seulement de ranger les objets fragiles et les petits meubles." },
        { question: "Peignez-vous aussi les façades et l'extérieur ?", answer: "Oui : façades, murets, portails et boiseries extérieures. Pour une façade en copropriété ou visible depuis la rue, une déclaration préalable en mairie peut être nécessaire ; nous vous indiquons les démarches lors de la visite." },
        { question: "Pouvez-vous nous conseiller sur les couleurs ?", answer: "Oui. Nous tenons compte de l'exposition de la pièce, de sa lumière et de votre mobilier, et nous pouvons appliquer des échantillons au mur avant de valider la teinte." },
        { question: "Quel taux de TVA s'applique aux travaux de peinture ?", answer: "Dans un logement achevé depuis plus de deux ans, la TVA est en général de 10 % au lieu de 20 %. Nous l'appliquons directement sur le devis." },
      ],
    },
    beforeAfter: {
      title: "Avant / après",
      subtitle: "Nos chantiers de peinture",
    },
    seo: {
      title: "Peintre à Issy-les-Moulineaux et Paris",
      description: "Peintre en bâtiment à Issy-les-Moulineaux (92), à Paris et en Île-de-France : murs, plafonds, boiseries, façades. Visite et devis gratuits.",
      keywords: ["peintre", "peinture intérieure", "peinture extérieure", "ravalement façade", "peintre Issy-les-Moulineaux", "peintre Hauts-de-Seine", "Paris", "Île-de-France"],
    },
  },

  renovation: {
    slug: "renovation",
    title: "Rénovation",
    description:
      "Rénovation complète d'appartements et de maisons. Nous coordonnons tous les corps de métier, de la démolition aux finitions, avec un seul interlocuteur pour l'ensemble du chantier.",
    heroIcon: Home,
    heroImage: SITE_IMAGES.cuisine.src,
    apiCategory: "renovation",
    tagline: "Votre intérieur repensé de A à Z, avec un seul interlocuteur.",
    duration: "3–6 sem. (60 m²)",
    included: [
      "Démolition et évacuation des gravats",
      "Cloisons, plâtrerie et isolation",
      "Plomberie et électricité",
      "Sols et revêtements muraux",
      "Menuiseries intérieures",
      "Peinture et finitions",
      "Coordination de tous les corps de métier",
      "Nettoyage en fin de chantier",
    ],
    caseStudies: [],
    features: {
      title: "Notre savoir-faire",
      subtitle: "Une rénovation complète, sans multiplier les intervenants",
      items: [
        { icon: Home, title: "Rénovation clé en main", description: "Nous prenons en charge le chantier de la démolition aux finitions." },
        { icon: Hammer, title: "Tous corps d'état", description: "Électricité, plomberie, sols, peinture : chaque métier est confié à un artisan qualifié." },
        { icon: Users, title: "Un seul interlocuteur", description: "La même personne suit votre projet, du devis à la réception des travaux." },
        { icon: Shield, title: "Garantie décennale", description: "Entreprise assurée auprès de la Mutuelle de Poitiers Assurances." },
      ],
    },
    process: {
      title: "Notre méthode",
      subtitle: "Quatre étapes, de la visite à la réception",
      steps: [
        { number: "01", title: "Visite technique", description: "Nous étudions votre logement, vos besoins et les contraintes de l'immeuble." },
        { number: "02", title: "Devis et planning", description: "Un devis détaillé poste par poste et un planning des travaux." },
        { number: "03", title: "Travaux", description: "Les artisans interviennent dans l'ordre prévu ; vous êtes tenu informé de l'avancement." },
        { number: "04", title: "Réception", description: "Visite de fin de chantier ensemble, levée des éventuelles réserves, remise des garanties." },
      ],
    },
    testimonials: {
      title: "Avis clients",
      subtitle: "Ils nous ont confié la rénovation de leur logement",
    },
    faqs: {
      title: "Questions fréquentes",
      subtitle: "Vos questions sur la rénovation",
      items: [
        { question: "Combien de temps dure une rénovation complète ?", answer: "Pour un appartement de 60 m², comptez en général 3 à 6 semaines. La durée dépend de l'ampleur des travaux (reprise de l'électricité et de la plomberie, déplacement de cloisons) et des délais de livraison des matériaux. Le planning est établi avec le devis." },
        { question: "Gérez-vous tous les corps de métier ?", answer: "Oui. Nous coordonnons l'électricité, la plomberie, la plâtrerie, les sols, le carrelage et la peinture. Vous avez un seul interlocuteur et un seul devis." },
        { question: "Puis-je rester dans mon logement pendant les travaux ?", answer: "C'est possible pour une rénovation partielle : nous organisons le chantier pièce par pièce. Pour une rénovation complète avec coupures d'eau et d'électricité, nous vous conseillons de prévoir un autre logement pendant les phases les plus lourdes." },
        { question: "Faut-il une autorisation pour rénover un appartement en copropriété ?", answer: "Les travaux à l'intérieur de votre lot ne demandent en général pas d'autorisation. En revanche, toucher aux parties communes ou à la structure (murs porteurs, colonnes, façade) nécessite l'accord de l'assemblée générale. Consultez aussi votre règlement de copropriété, qui peut imposer des horaires ou une isolation acoustique des sols." },
        { question: "Comment le devis est-il établi ?", answer: "Après une visite gratuite, nous vous remettons un devis détaillé poste par poste : fournitures, main-d'œuvre et durée. Il est gratuit et sans engagement." },
        { question: "Quelles garanties couvrent les travaux ?", answer: "L'entreprise est assurée en garantie décennale auprès de la Mutuelle de Poitiers Assurances, pour les travaux qui touchent à la solidité du bâti ou le rendent impropre à son usage. L'attestation d'assurance vous est remise avec le devis." },
      ],
    },
    beforeAfter: {
      title: "Avant / après",
      subtitle: "Nos chantiers de rénovation",
    },
    seo: {
      title: "Rénovation d'appartement à Issy-les-Moulineaux",
      description: "Rénovation complète d'appartements et de maisons à Issy-les-Moulineaux (92), à Paris et en Île-de-France. Tous corps d'état, un seul interlocuteur.",
      keywords: ["rénovation appartement", "rénovation maison", "rénovation clé en main", "entreprise rénovation Issy-les-Moulineaux", "rénovation Hauts-de-Seine", "Paris", "Île-de-France"],
    },
  },

  electricite: {
    slug: "electricite",
    title: "Électricité",
    description:
      "Installation électrique, mise en sécurité et mise aux normes NF C 15-100, tableau électrique, éclairage et domotique. Une installation sûre, adaptée à votre usage.",
    heroIcon: Zap,
    // ⚠️ NEVER USE IN ADS: recognisable person, no model release (see lib/site-images.ts). Site only.
    heroImage: SITE_IMAGES.electricien.src,
    apiCategory: "electricite",
    tagline: "Une installation électrique sûre et aux normes.",
    included: [
      "Diagnostic de l'installation existante",
      "Mise aux normes NF C 15-100",
      "Remplacement du tableau électrique",
      "Prises, interrupteurs et circuits",
      "Éclairage LED intérieur et extérieur",
      "Domotique et volets connectés",
      "Saignées rebouchées, murs propres",
      "Dépannage aux horaires d'ouverture",
    ],
    caseStudies: [],
    features: {
      title: "Notre savoir-faire",
      subtitle: "Des installations électriques sûres et durables",
      items: [
        { icon: Shield, title: "Norme NF C 15-100", description: "Installations réalisées selon la norme française des installations électriques basse tension." },
        { icon: Lightbulb, title: "Éclairage LED", description: "Un éclairage économe en énergie, intérieur comme extérieur." },
        { icon: Zap, title: "Domotique", description: "Éclairage, volets et chauffage pilotables à distance." },
        { icon: Wrench, title: "Dépannage", description: "Intervention sur panne électrique aux horaires d'ouverture." },
      ],
    },
    process: {
      title: "Notre méthode",
      subtitle: "Quatre étapes, du diagnostic à la mise en service",
      steps: [
        { number: "01", title: "Diagnostic", description: "Nous contrôlons votre installation et repérons les points non conformes." },
        { number: "02", title: "Devis", description: "Une proposition détaillée : ce qui est obligatoire, ce qui est conseillé." },
        { number: "03", title: "Travaux", description: "Réalisés par des électriciens qualifiés, avec un chantier laissé propre." },
        { number: "04", title: "Mise en service", description: "Essais, explications sur votre tableau et attestation Consuel lorsque la réglementation l'exige." },
      ],
    },
    testimonials: {
      title: "Avis clients",
      subtitle: "Ils nous ont confié leur installation électrique",
    },
    faqs: {
      title: "Questions fréquentes",
      subtitle: "Vos questions sur l'électricité",
      items: [
        { question: "Qu'est-ce que la norme NF C 15-100 ?", answer: "C'est la norme française qui fixe les règles des installations électriques basse tension dans les logements : nombre de prises et de circuits, protections différentielles, mise à la terre, règles pour les salles de bains. Elle vise à protéger les personnes et les biens." },
        { question: "La mise aux normes est-elle obligatoire ?", answer: "Elle est obligatoire pour une installation neuve ou entièrement rénovée. Pour un logement existant, elle ne l'est pas, mais un diagnostic électrique est exigé à la vente ou à la location si l'installation a plus de 15 ans. Une mise en sécurité est alors souvent recommandée." },
        { question: "Comment savoir si mon installation est dangereuse ?", answer: "Quelques signes doivent alerter : absence de disjoncteur différentiel, fusibles en porcelaine, prises sans terre, fils apparents, disjonctions fréquentes ou prises qui chauffent. Dans ce cas, faites contrôler votre installation." },
        { question: "Faut-il refaire toute l'installation ?", answer: "Pas toujours. Selon l'état de l'installation, une mise en sécurité (tableau, différentiels, mise à la terre) peut suffire. Nous vous indiquons après diagnostic ce qui est indispensable et ce qui peut attendre." },
        { question: "Proposez-vous des solutions domotiques ?", answer: "Oui : éclairage, volets roulants, chauffage et alarme pilotables à distance, depuis un smartphone ou par programmation." },
        { question: "Intervenez-vous en dépannage ?", answer: "Oui, aux horaires d'ouverture : du lundi au vendredi de 8 h à 18 h et le samedi de 9 h à 17 h. Appelez-nous directement pour une intervention rapide." },
      ],
    },
    beforeAfter: {
      title: "Avant / après",
      subtitle: "Nos chantiers d'électricité",
    },
    seo: {
      title: "Électricien à Issy-les-Moulineaux et Paris",
      description: "Électricien à Issy-les-Moulineaux (92), à Paris et en Île-de-France : mise aux normes NF C 15-100, tableau, éclairage, domotique. Devis gratuit.",
      keywords: ["électricien", "mise aux normes électrique", "NF C 15-100", "tableau électrique", "domotique", "électricien Issy-les-Moulineaux", "électricien Hauts-de-Seine", "Paris"],
    },
  },

  "salles-de-bains": {
    slug: "salles-de-bains",
    title: "Salles de bains",
    description:
      "Création et rénovation de salles de bains : douche à l'italienne, WC suspendu, carrelage, plomberie et électricité. Nous prenons en charge l'ensemble des travaux, de la conception aux finitions.",
    heroIcon: Bath,
    heroImage: SITE_IMAGES.salleDeBains.src,
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
    caseStudies: [],
    features: {
      title: "Notre savoir-faire",
      subtitle: "Une salle de bains conçue pour durer",
      items: [
        { icon: Ruler, title: "Conception sur mesure", description: "Plan d'aménagement et visuel 3D pour valider le projet avant les travaux." },
        { icon: Droplets, title: "Plomberie complète", description: "Alimentations et évacuations refaites ou adaptées à la nouvelle implantation." },
        { icon: Hammer, title: "Carrelage et faïence", description: "Pose de tous formats, y compris le grand format." },
        { icon: Shield, title: "Étanchéité", description: "Système d'étanchéité sous carrelage dans les zones exposées à l'eau." },
      ],
    },
    process: {
      title: "Notre méthode",
      subtitle: "Quatre étapes, de la conception à la première douche",
      steps: [
        { number: "01", title: "Visite", description: "Relevé des dimensions, des arrivées d'eau et des évacuations existantes." },
        { number: "02", title: "Conception et devis", description: "Plan d'aménagement, visuel 3D et devis détaillé." },
        { number: "03", title: "Travaux", description: "Dépose, plomberie, électricité, étanchéité, carrelage et équipements." },
        { number: "04", title: "Finitions", description: "Joints, réglages, essais d'étanchéité et nettoyage complet." },
      ],
    },
    testimonials: {
      title: "Avis clients",
      subtitle: "Ils nous ont confié leur salle de bains",
    },
    faqs: {
      title: "Questions fréquentes",
      subtitle: "Vos questions sur la salle de bains",
      items: [
        { question: "Combien de temps dure la rénovation d'une salle de bains ?", answer: "Entre 5 et 10 jours ouvrés en général, selon la surface, les modifications de plomberie et le type de carrelage. Le planning est précisé dans le devis." },
        { question: "Peut-on installer une douche à l'italienne dans un appartement ?", answer: "Le plus souvent, oui. Le point clé est la pente d'évacuation : selon la hauteur disponible sous le sol, nous encastrons le receveur ou rehaussons légèrement le sol. Nous le vérifions lors de la visite." },
        { question: "Comment évitez-vous les problèmes d'infiltration ?", answer: "Nous posons un système d'étanchéité sous le carrelage dans les zones exposées à l'eau, avec un traitement des angles et des traversées de tuyaux. C'est l'étape qui protège durablement votre logement et celui de vos voisins." },
        { question: "Proposez-vous une solution clé en main ?", answer: "Oui : conception avec visuel 3D, fourniture des matériaux si vous le souhaitez, plomberie, électricité, carrelage et pose des équipements. Vous pouvez aussi choisir vous-même vos équipements ; nous les posons." },
        { question: "Pourrai-je utiliser ma salle de bains pendant les travaux ?", answer: "Non, pas pendant la phase de dépose et de plomberie. Si votre logement n'a qu'une salle de bains, nous organisons le chantier pour limiter la durée d'indisponibilité." },
        { question: "Quelles garanties couvrent les travaux ?", answer: "L'entreprise est assurée en garantie décennale auprès de la Mutuelle de Poitiers Assurances. Les équipements (robinetterie, WC, meubles) bénéficient en plus de la garantie de leur fabricant." },
      ],
    },
    beforeAfter: {
      title: "Avant / après",
      subtitle: "Nos chantiers de salles de bains",
    },
    seo: {
      title: "Rénovation de salle de bains à Issy-les-Moulineaux",
      description: "Rénovation de salles de bains à Issy-les-Moulineaux (92), à Paris et en Île-de-France : douche à l'italienne, carrelage, plomberie. Devis gratuit.",
      keywords: ["rénovation salle de bains", "douche à l'italienne", "salle d'eau", "carrelage salle de bains", "salle de bains Issy-les-Moulineaux", "Hauts-de-Seine", "Paris", "Île-de-France"],
    },
  },

  "revetements-sol": {
    slug: "revetements-sol",
    title: "Revêtements de sol",
    description:
      "Pose de parquet, carrelage, sols vinyles et moquette. Nous préparons le support avant chaque pose, pour un sol plan, durable et adapté à l'usage de la pièce.",
    heroIcon: Layers,
    heroImage: SITE_IMAGES.parquet.src,
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
      "Nettoyage en fin de chantier",
    ],
    caseStudies: [],
    features: {
      title: "Notre savoir-faire",
      subtitle: "Le bon revêtement, posé sur un support bien préparé",
      items: [
        { icon: Layers, title: "Tous types de sols", description: "Parquet, carrelage, sols vinyles et moquette." },
        { icon: PaintBucket, title: "Préparation du support", description: "Ragréage et mise à niveau : un sol plan est la condition d'une pose durable." },
        { icon: Ruler, title: "Pose adaptée", description: "Collée, flottante ou clouée, selon le matériau et la pièce." },
        { icon: Shield, title: "Isolation acoustique", description: "Sous-couches adaptées aux exigences des copropriétés." },
      ],
    },
    process: {
      title: "Notre méthode",
      subtitle: "Quatre étapes, du relevé aux finitions",
      steps: [
        { number: "01", title: "Relevé", description: "Mesure des surfaces et contrôle de la planéité et de l'humidité du support." },
        { number: "02", title: "Préparation", description: "Dépose de l'ancien revêtement, ragréage et mise à niveau." },
        { number: "03", title: "Pose", description: "Pose selon la méthode adaptée au matériau choisi." },
        { number: "04", title: "Finitions", description: "Plinthes, barres de seuil, nettoyage et conseils d'entretien." },
      ],
    },
    testimonials: {
      title: "Avis clients",
      subtitle: "Ils nous ont confié la pose de leurs sols",
    },
    faqs: {
      title: "Questions fréquentes",
      subtitle: "Vos questions sur les revêtements de sol",
      items: [
        { question: "Quel revêtement choisir pour quelle pièce ?", answer: "Le parquet apporte chaleur et confort dans les pièces de vie et les chambres. Le carrelage résiste à l'eau et à l'usure : il convient aux cuisines, salles de bains et entrées. Le sol vinyle (LVT) est un bon compromis : résistant à l'humidité, confortable et économique." },
        { question: "Combien de temps faut-il pour poser un sol ?", answer: "Pour une pièce de 20 m², comptez 1 à 2 jours pour du parquet et 2 à 3 jours pour du carrelage, préparation comprise. Il faut ajouter le temps de séchage d'un éventuel ragréage." },
        { question: "Peut-on poser un nouveau sol sur l'ancien ?", answer: "Parfois, si l'ancien revêtement est sain, plan et bien collé. Dans la plupart des cas, nous recommandons de le déposer pour repartir d'un support propre et éviter les surépaisseurs au niveau des portes." },
        { question: "Faut-il une sous-couche acoustique en appartement ?", answer: "Souvent, oui : beaucoup de règlements de copropriété imposent une isolation contre les bruits d'impact lorsque l'on remplace un revêtement de sol. Nous vous conseillons la sous-couche adaptée." },
        { question: "La dépose de l'ancien revêtement est-elle incluse ?", answer: "Oui, nous assurons la dépose de l'ancien sol et l'évacuation des déchets. Elle figure sur le devis." },
        { question: "Rénovez-vous les parquets anciens ?", answer: "Oui : ponçage, réparation des lames abîmées et vitrification ou huilage. C'est souvent la meilleure option pour un parquet ancien en bon état de structure." },
      ],
    },
    beforeAfter: {
      title: "Avant / après",
      subtitle: "Nos chantiers de revêtements de sol",
    },
    seo: {
      title: "Pose de parquet et carrelage à Issy-les-Moulineaux",
      description: "Pose de parquet, carrelage et sols vinyles à Issy-les-Moulineaux (92), à Paris et en Île-de-France. Préparation du support incluse. Devis gratuit.",
      keywords: ["pose parquet", "pose carrelage", "sol vinyle", "rénovation parquet", "revêtement de sol Issy-les-Moulineaux", "Hauts-de-Seine", "Paris", "Île-de-France"],
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
