import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User, Phone, Clock, Tag } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api";
import type { BlogPost } from "@/types/api";
import { getArticleJsonLd } from "@/lib/structured-data";
import { BlogContent } from "./BlogContent";
import { AuthorCard } from "@/components/blog/AuthorCard";
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
        endpoints.blog.getByCategory(post.category)
      )) as BlogPost[];
      relatedPosts = categoryPosts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);
    } catch {
      // Related articles not critical
    }
  }

  // Calculate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Link>
            {post.category && (
              <span className="inline-block text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author || "Atouts Services"}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="container mx-auto px-4 max-w-5xl -mt-2">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Content + Sidebar */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl">
                  <BlogContent content={post.content} />
                </article>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-600">Tags :</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="px-3 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 rounded-full text-sm transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Share */}
                <div className="mt-8">
                  <SocialShareButtons title={post.title} />
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8">
                {/* Author Card */}
                <AuthorCard authorName={post.author || "Atouts Services"} />

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-6">
                      Articles similaires
                    </h3>
                    <div className="space-y-6">
                      {relatedPosts.map((related, index) => (
                        <div
                          key={related.slug}
                          className={index > 0 ? "pt-6 border-t border-gray-200" : ""}
                        >
                          {related.coverImageUrl && (
                            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                              <img
                                src={related.coverImageUrl}
                                alt={related.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <Link
                            href={`/blog/${related.slug}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 block"
                          >
                            {related.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-2">
                            {related.publishedAt
                              ? new Date(related.publishedAt).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                            {" "}
                            &bull;{" "}
                            {Math.max(
                              1,
                              Math.ceil(related.content.split(/\s+/).length / 200)
                            )}{" "}
                            min
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/blog"
                      className="block text-center text-blue-600 hover:text-blue-800 font-medium mt-6 pt-6 border-t border-gray-200"
                    >
                      Voir tous les articles &rarr;
                    </Link>
                  </div>
                )}

                {/* Newsletter */}
                <NewsletterCard />
              </aside>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d&apos;un devis pour votre projet ?
            </h2>
            <p className="text-gray-600 mb-8">
              Contactez-nous pour un devis gratuit et sans engagement
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              asChild
            >
              <a href="/#contact">
                <Phone className="h-5 w-5 mr-2" />
                Demander un Devis Gratuit
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
