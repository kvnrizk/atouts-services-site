import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Paintbrush, Zap, Bath, Layers, Hammer } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api";
import type { CityPage } from "@/types/api";
import { getCityLocalBusinessJsonLd } from "@/lib/structured-data";
import { CityContent } from "./CityContent";

export const revalidate = 3600;

const services = [
  { icon: Paintbrush, title: "Peinture", slug: "peinture" },
  { icon: Hammer, title: "R\u00e9novation", slug: "renovation" },
  { icon: Zap, title: "\u00c9lectricit\u00e9", slug: "electricite" },
  { icon: Bath, title: "Salles de bains", slug: "salles-de-bains" },
  { icon: Layers, title: "Rev\u00eatements de sol", slug: "revetements-sol" },
];

export async function generateStaticParams() {
  try {
    const cityPages = (await apiClient.get(endpoints.cityPages.getAll)) as CityPage[];
    return cityPages.map((page) => ({ city: page.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  try {
    const page = (await apiClient.get(endpoints.cityPages.getBySlug(city))) as CityPage;
    return {
      title: page.metaTitle || `R\u00e9novation \u00e0 ${page.cityName} | Atouts Services`,
      description: page.metaDescription || `Entreprise de r\u00e9novation \u00e0 ${page.cityName}. Peinture, \u00e9lectricit\u00e9, salles de bains. Devis gratuit.`,
      alternates: { canonical: `/${city}` },
    };
  } catch {
    return {};
  }
}

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

  const jsonLd = getCityLocalBusinessJsonLd({
    cityName: page.cityName,
    slug: page.slug,
    postalCode: page.postalCode,
    department: page.department,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[50vh] flex items-center">
          {page.heroImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${page.heroImageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          ) : (
            <div className="absolute inset-0 gradient-primary"></div>
          )}
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">{page.cityName}</span>
                {page.postalCode && (
                  <span className="text-white/70">({page.postalCode})</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                R&eacute;novation &agrave; {page.cityName}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Votre artisan de confiance pour tous vos travaux de r&eacute;novation &agrave; {page.cityName} et ses environs
              </p>
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-6 text-lg font-semibold"
                asChild
              >
                <a href="/#contact">
                  <Phone className="h-5 w-5 mr-2" />
                  Devis Gratuit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Nos services &agrave; {page.cityName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <a
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{service.title}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content */}
        {page.content && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
                <CityContent content={page.content} />
              </article>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 gradient-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pr&ecirc;t &agrave; d&eacute;marrer votre projet &agrave; {page.cityName} ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour un devis gratuit et sans engagement
            </p>
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
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
