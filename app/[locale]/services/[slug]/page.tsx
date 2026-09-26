import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Reveal } from "@/components/Reveal";
import { ServiceQuoteCard } from "@/components/ServiceQuoteCard";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrackedPhoneLink } from "@/components/TrackedPhoneLink";
import { COMPANY_INFO } from "@/lib/constants";
import { Check, ChevronDown, ChevronRight, Phone, Star } from "lucide-react";
import { servicesData, allServiceSlugs } from "@/lib/services-data";
import { apiClient, endpoints } from "@/lib/api";
import type { BeforeAfter, Testimonial } from "@/types/api";
import { getBreadcrumbJsonLd, getServiceJsonLd } from "@/lib/structured-data";
import { getSiteImageOverrides, siteImageSrc } from "@/lib/site-image-overrides";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return allServiceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) return {};

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      images: [{ url: siteImageSrc(service.heroImage, await getSiteImageOverrides()), width: 1920, height: 1080 }],
    },
  };
}

const eyebrow = "text-xs font-semibold uppercase tracking-[0.2em] text-sky-600";
const sectionTitle = "mt-2 text-3xl font-bold text-neutral-950 md:text-4xl";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) notFound();
  const overrides = await getSiteImageOverrides();

  let beforeAfterProjects: BeforeAfter[] = [];
  let apiTestimonials: Testimonial[] = [];
  try {
    const [baData, tData] = await Promise.all([
      apiClient.get(endpoints.beforeAfter.getByCategory(service.apiCategory)),
      apiClient.get(`${endpoints.testimonials.getAll}?projectType=${service.apiCategory}`),
    ]);
    beforeAfterProjects = baData as BeforeAfter[];
    apiTestimonials = tData as Testimonial[];
  } catch {
    // API not available during build, that's fine
  }

  // Real reviews for this service only (Admin → Avis clients); no placeholder reviews
  const testimonialItems = apiTestimonials.map((t) => ({
    name: t.clientName,
    rating: t.rating,
    text: t.comment,
    project: t.clientCity || service.title,
  }));


  const jsonLd = [
    getServiceJsonLd({
      title: service.title,
      description: service.description,
      slug: service.slug,
    }),
    getBreadcrumbJsonLd([
      ["Accueil", "/"],
      ["Services", "/#services"],
      [service.title, `/services/${service.slug}`],
    ]),
  ];

  const trustItems = [
    { value: "20 ans", label: "d'expérience" },
    { value: "500+", label: "projets réalisés" },
    { value: "Décennale", label: "garantie 10 ans" },
    ...(service.duration ? [{ value: service.duration, label: "durée moyenne" }] : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        {/* Hero — the service's own photo (lib/site-images.ts), optimised by next/image.
            Pulled up under the sticky header (65px) so the image fills the viewport. */}
        <section className="relative -mt-[65px] h-[88svh] min-h-[560px] bg-neutral-950 text-white" aria-label={service.title}>
          <Image
            src={siteImageSrc(service.heroImage, overrides)}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient and text sit on top of the photo */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/20 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <div className="container mx-auto px-4 pb-16">
              <nav aria-label="Fil d'Ariane" className="pointer-events-auto mb-6 flex items-center gap-1 text-xs text-neutral-400">
                <Link href="/" className="hover:text-white">Accueil</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/#services" className="hover:text-white">Services</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-neutral-200">{service.title}</span>
              </nav>
              <h1 className="max-w-3xl">
                <span className="mb-4 block text-xs font-medium uppercase tracking-[0.2em] text-sky-400 md:text-sm">
                  {service.title} à Paris · Île-de-France
                </span>
                <span className="block text-4xl font-bold leading-[1.05] md:text-6xl">{service.tagline}</span>
              </h1>
              <div className="pointer-events-auto mt-8 inline-flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-md bg-sky-400 px-7 py-4 font-semibold text-neutral-950 shadow-xl hover:bg-sky-300"
                >
                  Devis gratuit
                </a>
                <TrackedPhoneLink
                  location="service-hero"
                  className="inline-flex items-center rounded-md border-2 border-white/40 px-7 py-4 font-semibold text-white hover:bg-white hover:text-neutral-950"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  {COMPANY_INFO.phone}
                </TrackedPhoneLink>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-y border-white/10 bg-neutral-950 text-white" aria-label="Nos garanties">
          <div className="container mx-auto flex flex-wrap gap-x-12 gap-y-4 px-4 py-6">
            {trustItems.map((item) => (
              <div key={item.label} className="text-sm text-neutral-400">
                <span className="mr-2 text-xl font-bold text-white">{item.value}</span>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* Content column + pinned quote card */}
        <div className="bg-neutral-50">
          <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-24">
              {/* What's included */}
              <Reveal>
                <section>
                  <p className={eyebrow}>Ce qui est inclus</p>
                  <h2 className={sectionTitle}>Un seul interlocuteur, du début à la fin</h2>
                  <p className="mt-4 max-w-2xl text-lg text-neutral-600">{service.description}</p>
                  <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {service.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-neutral-800">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100">
                          <Check className="h-4 w-4 text-sky-600" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>

              {/* Case studies */}
              {service.caseStudies.length > 0 && (
                <section>
                  <p className={eyebrow}>Nos chantiers</p>
                  <h2 className={sectionTitle}>Des projets concrets, près de chez vous</h2>
                  <div className="mt-10 space-y-14">
                    {service.caseStudies.map((cs, i) => (
                      <Reveal key={cs.title}>
                        <article className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                          <div className={`aspect-[4/3] overflow-hidden rounded-2xl ${i % 2 ? "md:order-2" : ""}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cs.image} alt={cs.title} loading="lazy" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                              {cs.location} · {cs.surface} · {cs.duration}
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-neutral-950">{cs.title}</h3>
                            <dl className="mt-5 space-y-3 text-neutral-600">
                              <div><dt className="inline font-semibold text-neutral-900">Le problème — </dt><dd className="inline">{cs.problem}</dd></div>
                              <div><dt className="inline font-semibold text-neutral-900">Notre solution — </dt><dd className="inline">{cs.solution}</dd></div>
                              <div><dt className="inline font-semibold text-neutral-900">Le résultat — </dt><dd className="inline">{cs.result}</dd></div>
                            </dl>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}

              {/* Real before/after projects added from the admin (hidden when there are none) */}
              {beforeAfterProjects.length > 0 && (
                <Reveal>
                  <section>
                    <p className={eyebrow}>{service.beforeAfter.title}</p>
                    <h2 className={sectionTitle}>{service.beforeAfter.subtitle}</h2>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                      {beforeAfterProjects.slice(0, 4).map((project) => (
                        <figure key={project.id}>
                          <BeforeAfterSlider
                            beforeImage={project.beforeImageUrl}
                            afterImage={project.afterImageUrl}
                            title={project.title}
                          />
                          <figcaption className="mt-3 font-semibold text-neutral-900">{project.title}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* Process — one row */}
              <Reveal>
                <section>
                  <p className={eyebrow}>Notre méthode</p>
                  <h2 className={sectionTitle}>{service.process.subtitle}</h2>
                  <ol className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                    {service.process.steps.map((step) => (
                      <li key={step.number} className="border-t-2 border-sky-400 pt-4">
                        <span className="text-sm font-bold text-sky-600">{step.number}</span>
                        <h3 className="mt-1 text-lg font-bold text-neutral-950">{step.title}</h3>
                        <p className="mt-1 text-sm text-neutral-600">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </Reveal>

              {/* Testimonials — hidden until real reviews exist for this service */}
              {testimonialItems.length > 0 && (
                <Reveal>
                  <section>
                    <p className={eyebrow}>{service.testimonials.title}</p>
                    <h2 className={sectionTitle}>{service.testimonials.subtitle}</h2>
                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                      {testimonialItems.map((t) => (
                        <figure key={t.name} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-neutral-200">
                          <div className="flex gap-1" aria-label={`${t.rating} sur 5`}>
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-sky-400 text-sky-400" />
                            ))}
                          </div>
                          <blockquote className="mt-4 text-neutral-700">&ldquo;{t.text}&rdquo;</blockquote>
                          <figcaption className="mt-5 text-sm">
                            <span className="font-semibold text-neutral-950">{t.name}</span>
                            <span className="text-neutral-500"> · {t.project}</span>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* FAQ */}
              <Reveal>
                <section>
                  <p className={eyebrow}>{service.faqs.title}</p>
                  <h2 className={sectionTitle}>{service.faqs.subtitle}</h2>
                  <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
                    {service.faqs.items.map((faq) => (
                      <details key={faq.question} className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between py-5">
                          <h3 className="pr-4 font-semibold text-neutral-950">{faq.question}</h3>
                          <ChevronDown className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="pb-5 text-neutral-600">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </Reveal>
            </div>

            {/* Pinned quote card; on mobile it stacks under the content and StickyMobileCTA scrolls to it (#contact) */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ServiceQuoteCard serviceTitle={service.title} apiCategory={service.apiCategory} />
            </aside>
          </div>
        </div>

        {/* Other services — internal links between service pages */}
        <section className="bg-white py-20" aria-labelledby="other-services">
          <div className="container mx-auto px-4">
            <p className={eyebrow}>Nos autres services</p>
            <h2 id="other-services" className={sectionTitle}>Un seul artisan pour tout votre intérieur</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Object.values(servicesData)
                .filter((s) => s.slug !== service.slug)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900"
                  >
                    <Image
                      src={siteImageSrc(s.heroImage, overrides)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-neutral-950 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Parlons de votre projet.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">Visite et devis gratuits, sans engagement.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="#contact" className="inline-flex items-center rounded-md bg-sky-400 px-7 py-4 font-semibold text-neutral-950 hover:bg-sky-300">
                Demander mon devis
              </a>
              <TrackedPhoneLink
                location="service-closing-cta"
                className="inline-flex items-center rounded-md border-2 border-white/40 px-7 py-4 font-semibold hover:bg-white hover:text-neutral-950"
              >
                <Phone className="mr-2 h-5 w-5" />
                {COMPANY_INFO.phone}
              </TrackedPhoneLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
