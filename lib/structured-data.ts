import { COMPANY_INFO, SERVICE_AREAS } from "./constants";

const BASE_URL = "https://www.atouts-services.fr";

/** Stable id of the company entity: every other page references it instead of re-declaring a business. */
const BUSINESS_ID = `${BASE_URL}/#business`;
const LOGO_URL = `${BASE_URL}/main.png`;

/** Real registered address (SIRENE) — the only address the site may declare (NAP consistency). */
const BUSINESS_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "20 rue d'Estienne d'Orves",
  addressLocality: "Issy-les-Moulineaux",
  addressRegion: "Hauts-de-Seine",
  postalCode: "92130",
  addressCountry: "FR",
};

/** From api-adresse.data.gouv.fr for the address above. */
const BUSINESS_GEO = { "@type": "GeoCoordinates", latitude: 48.823498, longitude: 2.266302 };

const providerRef = { "@type": "HomeAndConstructionBusiness", "@id": BUSINESS_ID, name: COMPANY_INFO.name };

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: COMPANY_INFO.name,
    legalName: "ATOUTS SERVICES",
    url: BASE_URL,
    logo: LOGO_URL,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phoneHref.replace("tel:", ""),
    address: BUSINESS_ADDRESS,
    geo: BUSINESS_GEO,
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "City",
      name: area,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    image: LOGO_URL,
    description:
      "Entreprise de rénovation à Issy-les-Moulineaux (92). Peinture, électricité, salles de bains, revêtements de sol. Devis gratuit, garantie décennale.",
  };
}

export function getArticleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedAt: string;
  coverImageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${BASE_URL}/blog/${article.slug}`,
    author: {
      "@type": "Organization",
      name: article.author || COMPANY_INFO.name,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.name,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    datePublished: article.publishedAt,
    ...(article.coverImageUrl ? { image: article.coverImageUrl } : {}),
  };
}

/**
 * City landing pages describe the service offered IN that city by the Issy business.
 * They must not declare a business located in the city: a made-up local address per town
 * is treated by Google as local-SEO spam (fake locations) and can hurt the Business Profile.
 */
export function getCityLocalBusinessJsonLd(city: {
  cityName: string;
  slug: string;
  postalCode?: string;
  department?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Rénovation à ${city.cityName}`,
    serviceType: "Rénovation intérieure",
    url: `${BASE_URL}/${city.slug}`,
    provider: providerRef,
    areaServed: {
      "@type": "City",
      name: city.cityName,
      ...(city.postalCode ? { postalCode: city.postalCode } : {}),
    },
  };
}

export function getServiceJsonLd(service: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: providerRef,
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "City",
      name: area,
    })),
  };
}

/** Breadcrumb trail shown in Google results instead of the raw URL. Items are [name, path]. */
export function getBreadcrumbJsonLd(items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${BASE_URL}${path}`,
    })),
  };
}
