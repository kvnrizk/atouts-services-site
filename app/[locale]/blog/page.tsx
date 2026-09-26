import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ClosingCta } from "@/components/ClosingCta";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { apiClient, endpoints } from "@/lib/api";
import { BLOG_LIST_LIMIT, toBlogCard } from "@/lib/blog";
import type { BlogPost, PaginatedResponse } from "@/types/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog - Conseils Rénovation & Travaux",
  description:
    "Découvrez nos articles et guides sur la rénovation, la peinture, l’électricité et l’aménagement intérieur. Conseils d’experts pour vos projets.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogListingPage() {
  let posts: BlogPost[] = [];

  try {
    const data = (await apiClient.get(`${endpoints.blog.getAll}?limit=${BLOG_LIST_LIMIT}`)) as PaginatedResponse<BlogPost>;
    posts = data.data;
  } catch {
    // API not available, show empty state
  }

  const cards = posts.map(toBlogCard);
  const [latest, ...others] = cards;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow="Conseils & guides"
          title="Le blog rénovation"
          intro="Durées, aides, réglementation, choix des matériaux : nos réponses concrètes aux questions qu’on nous pose avant chaque chantier."
        />

        <section className="bg-neutral-50 py-16 md:py-20">
          <div className="container mx-auto px-4">
            {!latest ? (
              <div className="mx-auto max-w-xl py-16 text-center">
                <p className="text-lg font-semibold text-neutral-950">Aucun article pour le moment.</p>
                <p className="mt-2 text-neutral-600">Revenez bientôt pour découvrir nos conseils et guides.</p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Dernier article</p>
                <BlogCard post={latest} variant="featured" />
                {others.length > 0 && (
                  <div className="mt-16">
                    <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">Tous les articles</h2>
                    <BlogGrid posts={others} />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <ClosingCta trackingLocation="blog-list-closing-cta" />
      </main>
      <Footer />
    </>
  );
}
