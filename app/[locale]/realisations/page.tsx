import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos R&eacute;alisations
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              D&eacute;couvrez nos projets de r&eacute;novation, peinture et am&eacute;nagement
            </p>
          </div>
        </section>

        {/* Before/After Section */}
        {beforeAfterItems.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Avant / Apr&egrave;s
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {beforeAfterItems.map((item) => (
                  <Link key={item.id} href={`/realisations/${item.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-2 gap-px bg-gray-200">
                        <div className="relative">
                          <Image
                            src={item.beforeImageUrl}
                            alt="Avant"
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                            AVANT
                          </div>
                        </div>
                        <div className="relative">
                          <Image
                            src={item.afterImageUrl}
                            alt="Après"
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                            APR&Egrave;S
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.category && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2">
                            {item.category}
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Portfolio Section */}
        {portfolioItems.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={400}
                      height={224}
                      className="w-full h-56 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.category && (
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2">
                          {item.category}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {beforeAfterItems.length === 0 && portfolioItems.length === 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-500 text-lg">
                Nos r&eacute;alisations seront bient&ocirc;t disponibles.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
