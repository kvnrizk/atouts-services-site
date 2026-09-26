import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceSimulator } from "@/components/PriceSimulator";
import { notFound } from "next/navigation";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Simulateur de Prix | Estimez vos Travaux",
  description:
    "Estimez le cout de vos travaux de renovation en quelques clics. Peinture, electricite, salle de bain, revetements de sol. Estimation gratuite et instantanee.",
  alternates: {
    canonical: "/simulateur",
  },
};

export default function SimulateurPage() {
  if (!FEATURES.simulator) notFound();
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-gray-50">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Simulateur de Prix
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Estimez le budget de vos travaux en quelques clics.
                Gratuit, instantane et sans engagement.
              </p>
            </div>
            <PriceSimulator />
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Simulateur de Prix - Atouts Services",
            url: "https://www.atoutservice92.fr/simulateur",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            description:
              "Estimez le cout de vos travaux de renovation : peinture, electricite, salle de bain, revetements de sol.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          }),
        }}
      />
    </>
  );
}
