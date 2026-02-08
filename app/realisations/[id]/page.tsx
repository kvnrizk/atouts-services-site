import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";
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
      description: item.description || `R\u00e9alisation avant/apr\u00e8s : ${item.title}`,
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

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link
              href="/realisations"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux r&eacute;alisations
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {item.title}
            </h1>
            {item.description && (
              <p className="text-lg text-gray-600 mb-2">{item.description}</p>
            )}
            {item.category && (
              <span className="inline-block text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-8">
                {item.category}
              </span>
            )}

            {/* Before/After Slider */}
            <div className="my-8">
              <BeforeAfterSlider
                beforeImage={item.beforeImageUrl}
                afterImage={item.afterImageUrl}
                title={item.title}
              />
            </div>

            {/* Side by side */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <p className="text-sm font-bold text-red-600 mb-2">AVANT</p>
                <img
                  src={item.beforeImageUrl}
                  alt={`${item.title} - Avant`}
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-green-600 mb-2">APR&Egrave;S</p>
                <img
                  src={item.afterImageUrl}
                  alt={`${item.title} - Apr\u00e8s`}
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Envie d&apos;un r&eacute;sultat similaire ?
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
