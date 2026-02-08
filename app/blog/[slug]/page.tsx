import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User, Phone } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api";
import type { BlogPost } from "@/types/api";
import { getArticleJsonLd } from "@/lib/structured-data";
import { BlogContent } from "./BlogContent";

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
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
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
            <div className="flex items-center gap-4 text-sm text-gray-500">
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
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="container mx-auto px-4 max-w-4xl -mt-2">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl">
              <BlogContent content={post.content} />
            </article>
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
