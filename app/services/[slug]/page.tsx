import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, ChevronDown, Star } from "lucide-react";
import { servicesData, allServiceSlugs } from "@/lib/services-data";
import { apiClient, endpoints } from "@/lib/api";
import type { BeforeAfter, Testimonial } from "@/types/api";
import { getServiceJsonLd } from "@/lib/structured-data";

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
      images: [{ url: service.heroImage, width: 1920, height: 1080 }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) notFound();

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

  const testimonialItems = apiTestimonials.length > 0
    ? apiTestimonials.map((t) => ({
        name: t.clientName,
        rating: t.rating,
        text: t.comment,
        project: t.clientCity || service.title,
      }))
    : service.testimonials.items;

  const HeroIcon = service.heroIcon;
  const jsonLd = getServiceJsonLd({
    title: service.title,
    description: service.description,
    slug: service.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${service.heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="relative container mx-auto px-4 py-20">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l&apos;accueil
            </Link>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <HeroIcon className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">{service.title}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">{service.description}</p>
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-6 text-lg font-semibold shadow-xl"
                asChild
              >
                <a href="/#contact">
                  <Phone className="h-5 w-5 mr-2" />
                  Demander un Devis Gratuit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {service.features.title}
              </h2>
              <p className="text-xl text-gray-600">
                {service.features.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.features.items.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FeatureIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Before/After Section */}
        {beforeAfterProjects.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {service.beforeAfter.title}
                </h2>
                <p className="text-xl text-gray-600">
                  {service.beforeAfter.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {beforeAfterProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-px bg-gray-200">
                      <div className="relative">
                        <img
                          src={project.beforeImageUrl}
                          alt="Avant"
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          AVANT
                        </div>
                      </div>
                      <div className="relative">
                        <img
                          src={project.afterImageUrl}
                          alt="Après"
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          APRÈS
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process Steps */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {service.process.title}
              </h2>
              <p className="text-xl text-gray-600">
                {service.process.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {service.process.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {service.testimonials.title}
              </h2>
              <p className="text-xl text-gray-600">
                {service.testimonials.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonialItems.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-blue-600">
                        {testimonial.project}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {service.faqs.title}
              </h2>
              <p className="text-xl text-gray-600">
                {service.faqs.subtitle}
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {service.faqs.items.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-gray-50 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180 flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 gradient-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour un devis gratuit et sans engagement
            </p>
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
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
