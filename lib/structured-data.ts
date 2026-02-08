import { COMPANY_INFO, SERVICE_AREAS } from "./constants";

const BASE_URL = "https://www.atouts-services.fr";

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: COMPANY_INFO.name,
    url: BASE_URL,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Issy-les-Moulineaux",
      addressRegion: "Hauts-de-Seine",
      postalCode: "92130",
      addressCountry: "FR",
    },
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
    priceRange: "$$",
    image: `${BASE_URL}/main.png`,
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
        url: `${BASE_URL}/main.png`,
      },
    },
    datePublished: article.publishedAt,
    ...(article.coverImageUrl ? { image: article.coverImageUrl } : {}),
  };
}

export function getCityLocalBusinessJsonLd(city: {
  cityName: string;
  slug: string;
  postalCode?: string;
  department?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${COMPANY_INFO.name} - ${city.cityName}`,
    url: `${BASE_URL}/${city.slug}`,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.cityName,
      addressRegion: city.department || "Hauts-de-Seine",
      postalCode: city.postalCode || "",
      addressCountry: "FR",
    },
    areaServed: {
      "@type": "City",
      name: city.cityName,
    },
    priceRange: "$$",
    image: `${BASE_URL}/main.png`,
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
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: COMPANY_INFO.name,
      url: BASE_URL,
    },
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "City",
      name: area,
    })),
  };
}
