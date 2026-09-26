import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ClosingCta } from "@/components/ClosingCta";
import { apiClient, endpoints } from "@/lib/api";
import type { BlogPost } from "@/types/api";
import { getArticleJsonLd } from "@/lib/structured-data";
import { formatPostDate, readingMinutes, toBlogCard } from "@/lib/blog";
import { BlogContent } from "./BlogContent";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterCard } from "@/components/blog/NewsletterCard";
import { SocialShareButtons } from "@/components/blog/SocialShareButtons";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = (await apiClient.get(endpoints.blog.getBySlug(slug))) as BlogPost;
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || "",
        ...(post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : {}),
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost;
  try {
    post = (await apiClient.get(endpoints.blog.getBySlug(slug))) as BlogPost;
  } catch {
    notFound();
  }

  // Fetch related articles from same category
  let relatedPosts: BlogPost[] = [];
  if (post.category) {
    try {
      const categoryPosts = (await apiClient.get(
        endpoints.blog.getByCategory(encodeURIComponent(post.category))
      )) as BlogPost[];
      relatedPosts = categoryPosts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);
    } catch {
      // Related articles not critical
    }
  }

  const readingTime = readingMinutes(post.content);
  const published = formatPostDate(post.publishedAt);

  const jsonLd = getArticleJsonLd({
    title: post.title,
    description: post.metaDescription || post.excerpt || "",
    slug: post.slug,
    author: post.author || "Atouts Services",
    publishedAt: post.publishedAt || post.createdAt || "",
    coverImageUrl: post.coverImageUrl,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <PageHero
          image={post.coverImageUrl || undefined}
          eyebrow={post.category}
          title={post.title}
          intro={post.excerpt}
          top={
            <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-1 text-xs text-neutral-400">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              {post.category && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-neutral-200">{post.category}</span>
                </>
              )}
            </nav>
          }
        >
          <p className="mt-6 text-sm text-neutral-400">
            {[post.author || "Atouts Services", published, `${readingTime} min de lecture`].filter(Boolean).join(" · ")}
          </p>
        </PageHero>

        <div className="bg-white">
          <div className="container mx-auto grid gap-14 px-4 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <article className="prose prose-lg prose-neutral max-w-[68ch] prose-headings:tracking-tight prose-headings:text-neutral-950 prose-h2:mt-14 prose-p:text-neutral-700 prose-a:font-medium prose-a:text-sky-700 prose-a:underline-offset-4 hover:prose-a:text-sky-900 prose-strong:text-neutral-950 prose-li:text-neutral-700 prose-li:marker:text-sky-500 prose-table:text-base prose-th:text-neutral-950 prose-img:rounded-2xl">
                <BlogContent content={post.content} />
              </article>

              {post.tags && post.tags.length > 0 && (
                <ul className="mt-12 flex max-w-[68ch] flex-wrap gap-2 border-t border-neutral-200 pt-8" aria-label="Thèmes de l'article">
                  {post.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">{tag}</li>
                  ))}
                </ul>
              )}

              <div className="mt-8 max-w-[68ch]">
                <SocialShareButtons title={post.title} />
              </div>
            </div>

            <aside className="space-y-8">
              <AuthorCard authorName={post.author || "Atouts Services"} />

              {relatedPosts.length > 0 && (
                <div className="rounded-2xl p-6 ring-1 ring-neutral-200">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Articles similaires</h2>
                  <div className="mt-5 space-y-5">
                    {relatedPosts.map((related) => (
                      <BlogCard key={related.slug} post={toBlogCard(related)} variant="compact" />
                    ))}
                  </div>
                  <Link
                    href="/blog"
                    className="mt-6 block border-t border-neutral-100 pt-5 text-sm font-semibold text-neutral-950 hover:text-sky-700"
                  >
                    Voir tous les articles →
                  </Link>
                </div>
              )}

              <NewsletterCard />
            </aside>
          </div>
        </div>

        <ClosingCta trackingLocation="blog-article-closing-cta" />
      </main>
      <Footer />
    </>
  );
}
