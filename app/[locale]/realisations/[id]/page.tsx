import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ClosingCta } from "@/components/ClosingCta";
import { projectTypeLabel as categoryLabel } from "@/lib/constants";
import { apiClient, endpoints } from "@/lib/api";
import type { BeforeAfter } from "@/types/api";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = (await apiClient.get(endpoints.beforeAfter.getOne(+id))) as BeforeAfter;
    return {
      title: item.title,
      description: item.description || `Réalisation avant/après : ${item.title}`,
      alternates: { canonical: `/realisations/${id}` },
    };
  } catch {
    return {};
  }
}

export default async function RealisationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item: BeforeAfter;
  try {
    item = (await apiClient.get(endpoints.beforeAfter.getOne(+id))) as BeforeAfter;
  } catch {
    notFound();
  }

  const label = categoryLabel(item.category);

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow={label ? `Réalisation · ${label}` : "Réalisation"}
          title={item.title}
          intro={item.description}
          top={
            <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-1 text-xs text-neutral-400">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/realisations" className="hover:text-white">Réalisations</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-neutral-200">{item.title}</span>
            </nav>
          }
        />

        <section className="bg-neutral-50 py-16 md:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Faites glisser</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950">Avant / après</h2>
            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-neutral-200">
              <BeforeAfterSlider beforeImage={item.beforeImageUrl} afterImage={item.afterImageUrl} title={item.title} />
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                { src: item.beforeImageUrl, text: "Avant" },
                { src: item.afterImageUrl, text: "Après" },
              ].map((img) => (
                <figure key={img.text}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
                    <Image src={img.src} alt={`${item.title} — ${img.text.toLowerCase()}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">{img.text}</figcaption>
                </figure>
              ))}
            </div>

            <Link href="/realisations" className="mt-12 inline-flex items-center text-sm font-semibold text-neutral-950 hover:text-sky-700">
              ← Toutes nos réalisations
            </Link>
          </div>
        </section>

        <ClosingCta title="Envie d’un résultat similaire ?" trackingLocation="realisation-closing-cta" />
      </main>
      <Footer />
    </>
  );
}
