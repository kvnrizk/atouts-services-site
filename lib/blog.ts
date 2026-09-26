import type { BlogPost } from "@/types/api";

/** "8 septembre 2026" — empty when the post has no date */
export function formatPostDate(date?: string | Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

/** Minutes of reading at ~200 words per minute (at least 1) */
export function readingMinutes(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

/** The API paginates (10 per page by default): ask for everything the listing and sitemap need */
export const BLOG_LIST_LIMIT = 200;

/** What an article card needs — the full content stays on the server (only the reading time is sent). */
export type BlogCardData = Pick<BlogPost, "slug" | "title" | "excerpt" | "category" | "coverImageUrl" | "publishedAt"> & {
  minutes: number;
};

export function toBlogCard(post: BlogPost): BlogCardData {
  const { slug, title, excerpt, category, coverImageUrl, publishedAt } = post;
  return { slug, title, excerpt, category, coverImageUrl, publishedAt, minutes: readingMinutes(post.content) };
}
