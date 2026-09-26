import type { MetadataRoute } from "next";
import { allServiceSlugs } from "@/lib/services-data";
import { apiClient, endpoints } from "@/lib/api";
import type { BlogPost, CityPage, BeforeAfter } from "@/types/api";
import { BLOG_LIST_LIMIT } from "@/lib/blog";

const BASE_URL = "https://www.atoutservice92.fr";

// Rebuilt every hour so new blog articles and city pages appear without a redeploy
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const servicePages = allServiceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Fetch dynamic content from API
  let blogPosts: BlogPost[] = [];
  let cityPages: CityPage[] = [];
  let beforeAfterItems: BeforeAfter[] = [];

  try {
    const [blogData, cityData, baData] = await Promise.all([
      apiClient.get(`${endpoints.blog.getAll}?limit=${BLOG_LIST_LIMIT}`),
      apiClient.get(endpoints.cityPages.getAll),
      apiClient.get(`${endpoints.beforeAfter.getAll}?published=true`),
    ]);
    blogPosts = ((blogData as { data?: BlogPost[] })?.data || blogData) as BlogPost[];
    cityPages = cityData as CityPage[];
    beforeAfterItems = baData as BeforeAfter[];
  } catch {
    // API unavailable during build
  }

  const blogPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const cityLandingPages = cityPages.map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const realisationPages = beforeAfterItems.map((item) => ({
    url: `${BASE_URL}/realisations/${item.id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...servicePages,
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPages,
    {
      url: `${BASE_URL}/realisations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...realisationPages,
    ...cityLandingPages,
  ];
}
