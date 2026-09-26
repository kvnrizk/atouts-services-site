import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ClosingCta } from "@/components/ClosingCta";
import { Reveal } from "@/components/Reveal";
import { ServiceQuoteCard } from "@/components/ServiceQuoteCard";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrackedPhoneLink } from "@/components/TrackedPhoneLink";
import { Stars } from "@/components/TestimonialsCarousel";
import { apiClient, endpoints } from "@/lib/api";
import { COMPANY_INFO, projectTypeLabel as projectLabel } from "@/lib/constants";
import { servicesData } from "@/lib/services-data";
import { SITE_IMAGES } from "@/lib/site-images";
import type { CityPage, Testimonial } from "@/types/api";
import { getCityLocalBusinessJsonLd } from "@/lib/structured-data";
import { getSiteImageOverrides, siteImageSrc } from "@/lib/site-image-overrides";
import { CityContent } from "./CityContent";
import { CityMap } from "./CityMap";

// Rendered on each visit, like the service pages: the translations read the request, which a
// page prepared in advance may not do (unknown or new towns crashed with a 500 instead of a 404)
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  try {
    const page = (await apiClient.get(endpoints.cityPages.getBySlug(city))) as CityPage;
    return {
      title: page.metaTitle || `Rénovation à ${page.cityName}`,
      description: page.metaDescription || `Entreprise de rénovation à ${page.cityName}. Peinture, électricité, salles de bains. Devis gratuit.`,
      alternates: { canonical: `/${city}` },
    };
  } catch {
    return {};
  }
}

const eyebrow = "text-xs font-semibold uppercase tracking-[0.2em] text-sky-600";
const sectionTitle = "mt-2 text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl";

/** Case- and accent-insensitive town match ("Boulogne-Billancourt" = "boulogne billancourt") */
const normalise = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  let page: CityPage;
  try {
    page = (await apiClient.get(endpoints.cityPages.getBySlug(city))) as CityPage;
  } catch {
    notFound();
  }

  // Reviews from this town and the other published towns: nice to have, never blocking
  const overrides = await getSiteImageOverrides();
  let townReviews: Testimonial[] = [];
  let otherTowns: CityPage[] = [];
  try {
    const [reviews, towns] = await Promise.all([
      apiClient.get(endpoints.testimonials.getAll) as Promise<Testimonial[]>,
      apiClient.get(endpoints.cityPages.getAll) as Promise<CityPage[]>,
    ]);
    townReviews = reviews.filter((t) => t.clientCity && normalise(t.clientCity) === normalise(page.cityName)).slice(0, 3);
    otherTowns = towns.filter((t) => t.slug !== page.slug && t.published !== false).slice(0, 6);
  } catch {
    // API partially unavailable
  }

  const jsonLd = getCityLocalBusinessJsonLd({
    cityName: page.cityName,
    slug: page.slug,
    postalCode: page.postalCode,
    department: page.department,
  });

  // Uploaded photo if it is a usable URL, otherwise the site's house photo
  const heroImage =
    page.heroImageUrl && /^(\/|https?:\/\/)/.test(page.heroImageUrl) ? page.heroImageUrl : siteImageSrc(SITE_IMAGES.maison.src, overrides);

  const trustItems = [
    { value: "20 ans", label: "d'expérience" },
    { value: "Décennale", label: "garantie 10 ans" },
    { value: "24 h", label: "pour votre devis" },
    { value: page.postalCode ?? page.department ?? "", label: page.postalCode ? page.cityName : "" },
  ].filter((i) => i.value);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main-content">
        <PageHero
          image={heroImage}
          eyebrow={
            <>
              Rénovation · {page.cityName}
              {page.postalCode ? ` (${page.postalCode})` : ""}
            </>
          }
          title={<>Rénovation à {page.cityName}</>}
          intro={`Peinture, électricité, salles de bains, sols et rénovation complète à ${page.cityName}. Un seul interlocuteur, basé à Issy-les-Moulineaux.`}
          top={
            <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-1 text-xs text-neutral-400">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-neutral-200">{page.cityName}</span>
            </nav>
          }
        >
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center rounded-md bg-sky-400 px-7 py-4 font-semibold text-neutral-950 shadow-xl transition hover:bg-sky-300 active:scale-[0.98]"
            >
              Devis gratuit
            </a>
            <TrackedPhoneLink
              location="city-hero"
              className="inline-flex items-center rounded-md border-2 border-white/40 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-neutral-950 active:scale-[0.98]"
            >
              <Phone className="mr-2 h-5 w-5" />
              {COMPANY_INFO.phone}
            </TrackedPhoneLink>
          </div>
        </PageHero>

        {/* Trust bar */}
        <section className="border-y border-white/10 bg-neutral-950 text-white" aria-label="Nos garanties">
          <div className="container mx-auto flex flex-wrap gap-x-12 gap-y-4 px-4 py-6">
            {trustItems.map((item) => (
              <div key={item.value} className="text-sm text-neutral-400">
                <span className="mr-2 text-xl font-bold text-white">{item.value}</span>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* Content column + pinned quote card */}
        <div className="bg-neutral-50">
          <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-24">
              {page.content && (
                <Reveal>
                  <section>
                    <p className={eyebrow}>Nos travaux à {page.cityName}</p>
                    <article className="prose prose-lg prose-neutral mt-4 max-w-[68ch] prose-headings:tracking-tight prose-headings:text-neutral-950 prose-p:text-neutral-700 prose-a:text-sky-700 prose-strong:text-neutral-950 prose-li:marker:text-sky-500">
                      <CityContent content={page.content} />
                    </article>
                  </section>
                </Reveal>
              )}

              {/* Services — photo cards, same as "Nos autres services" on the service pages */}
              <Reveal>
                <section aria-labelledby="city-services">
                  <p className={eyebrow}>Nos services</p>
                  <h2 id="city-services" className={sectionTitle}>Tous vos travaux à {page.cityName}</h2>
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.values(servicesData).map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900"
                      >
                        <Image
                          src={siteImageSrc(s.heroImage, overrides)}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <h3 className="text-xl font-bold">{s.title}</h3>
                          <p className="mt-1 inline-flex items-center text-sm text-sky-300">
                            Découvrir <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Reviews from this town (hidden when there are none) */}
              {townReviews.length > 0 && (
                <Reveal>
                  <section aria-labelledby="city-reviews">
                    <p className={eyebrow}>Avis clients</p>
                    <h2 id="city-reviews" className={sectionTitle}>Ils nous ont fait confiance à {page.cityName}</h2>
                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                      {townReviews.map((t) => (
                        <figure key={t.id ?? t.clientName} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-neutral-200">
                          <Stars rating={t.rating} />
                          <blockquote className="mt-4 text-neutral-700">&ldquo;{t.comment}&rdquo;</blockquote>
                          <figcaption className="mt-5 text-sm">
                            <span className="font-semibold text-neutral-950">{t.clientName}</span>
                            {projectLabel(t.projectType) && <span className="text-neutral-500"> · {projectLabel(t.projectType)}</span>}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* Map */}
              <Reveal>
                <section aria-labelledby="city-map">
                  <p className={eyebrow}>Zone d&apos;intervention</p>
                  <h2 id="city-map" className={sectionTitle}>Nous intervenons à {page.cityName}</h2>
                  <p className="mt-4 max-w-2xl text-neutral-600">
                    Basés à Issy-les-Moulineaux, nous intervenons à {page.cityName}, à Paris et dans toute l&apos;Île-de-France.
                  </p>
                  <div className="mt-8">
                    <CityMap slug={page.slug} />
                  </div>
                </section>
              </Reveal>
            </div>

            {/* Pinned quote card; on mobile it stacks under the content and StickyMobileCTA scrolls to it (#contact) */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ServiceQuoteCard trackingLocation="city-quote-card" />
            </aside>
          </div>
        </div>

        {/* Other towns — internal links between city pages */}
        {otherTowns.length > 0 && (
          <section className="bg-white py-16" aria-labelledby="other-towns">
            <div className="container mx-auto px-4">
              <p className={eyebrow}>Autour de {page.cityName}</p>
              <h2 id="other-towns" className={sectionTitle}>Nous intervenons aussi à</h2>
              <ul className="mt-8 flex flex-wrap gap-3">
                {otherTowns.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/${t.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-800 ring-1 ring-neutral-200 transition hover:bg-neutral-950 hover:text-white hover:ring-neutral-950 active:scale-[0.98]"
                    >
                      <MapPin className="h-4 w-4 text-sky-500" />
                      {t.cityName}
                      {t.postalCode && <span className="text-neutral-400">{t.postalCode}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <ClosingCta
          title={`Un projet à ${page.cityName} ?`}
          quoteHref="#contact"
          trackingLocation="city-closing-cta"
        />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
