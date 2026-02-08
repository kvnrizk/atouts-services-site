import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api";
import type { BlogPost, PaginatedResponse } from "@/types/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog - Conseils R\u00e9novation & Travaux",
  description:
    "D\u00e9couvrez nos articles et guides sur la r\u00e9novation, la peinture, l\u2019\u00e9lectricit\u00e9 et l\u2019am\u00e9nagement int\u00e9rieur. Conseils d\u2019experts pour vos projets.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogListingPage() {
  let posts: BlogPost[] = [];

  try {
    const data = (await apiClient.get(endpoints.blog.getAll)) as PaginatedResponse<BlogPost>;
    posts = data.data;
  } catch {
    // API not available, show empty state
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Notre Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conseils, guides et actualit&eacute;s pour vos projets de r&eacute;novation
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  Aucun article pour le moment.
                </p>
                <p className="text-gray-400 mt-2">
                  Revenez bient&ocirc;t pour d&eacute;couvrir nos conseils et guides.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      {post.coverImageUrl && (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      )}
                      <CardContent className="p-6">
                        {post.category && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {post.category}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-400">
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
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            Lire <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
