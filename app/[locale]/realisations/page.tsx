import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ClosingCta } from "@/components/ClosingCta";
import { RealisationsGrid, type RealisationItem } from "@/components/RealisationsGrid";
import { apiClient, endpoints } from "@/lib/api";
import type { BeforeAfter, Portfolio } from "@/types/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nos Réalisations",
  description:
    "Découvrez nos réalisations en peinture, rénovation, électricité et aménagement. Photos avant/après de nos projets à Paris et en Île-de-France.",
  alternates: {
    canonical: "/realisations",
  },
};

export default async function RealisationsPage() {
  let beforeAfterItems: BeforeAfter[] = [];
  let portfolioItems: Portfolio[] = [];

  try {
    const [baData, pData] = await Promise.all([
      apiClient.get(endpoints.beforeAfter.getAll),
      apiClient.get(endpoints.portfolio.getAll),
    ]);
    beforeAfterItems = (baData as BeforeAfter[]).filter((i) => i.published);
    portfolioItems = (pData as Portfolio[]).filter((i) => i.published);
  } catch {
    // API unavailable
  }

  // Before/after projects first (they have a detail page), then portfolio photos
  const items: RealisationItem[] = [
    ...beforeAfterItems.map((i) => ({
      kind: "beforeAfter" as const,
      id: i.id!,
      title: i.title,
      description: i.description,
      category: i.category,
      beforeImageUrl: i.beforeImageUrl,
      afterImageUrl: i.afterImageUrl,
    })),
    ...portfolioItems.map((i) => ({
      kind: "photo" as const,
      id: i.id!,
      title: i.title,
      description: i.description,
      category: i.category,
      imageUrl: i.imageUrl,
    })),
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow="Nos chantiers"
          title="Nos réalisations"
          intro="Salles de bains, peinture, électricité, sols et rénovations complètes réalisés à Paris et en Île-de-France."
        />

        <section className="bg-neutral-50 py-16 md:py-20">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <RealisationsGrid items={items} />
            ) : (
              <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center ring-1 ring-neutral-200 md:p-14">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Bientôt en ligne</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                  Nos premiers chantiers seront publiés ici très prochainement.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-neutral-600">
                  En attendant, découvrez nos services ou demandez-nous un devis gratuit.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/#services"
                    className="inline-flex items-center rounded-md px-6 py-3 font-semibold text-neutral-950 ring-1 ring-neutral-300 transition hover:ring-neutral-950 active:scale-[0.98]"
                  >
                    Nos services
                  </Link>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center rounded-md bg-sky-400 px-6 py-3 font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.98]"
                  >
                    Demander un devis
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <ClosingCta trackingLocation="realisations-closing-cta" />
      </main>
      <Footer />
    </>
  );
}
