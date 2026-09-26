import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/espace-client/"],
    },
    sitemap: "https://www.atoutservice92.fr/sitemap.xml",
  };
}
