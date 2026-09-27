import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { BeforeAfterPreview } from "@/components/BeforeAfterPreview";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { getLocalBusinessJsonLd, getWebSiteJsonLd } from "@/lib/structured-data";
import type { Metadata } from "next";
import { getSiteImageOverrides, siteImageSrc } from "@/lib/site-image-overrides";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

export default async function HomePage() {
  const jsonLd = [getWebSiteJsonLd(), getLocalBusinessJsonLd()];
  const overrides = await getSiteImageOverrides();
  const heroImages = [SITE_IMAGES.maison, SITE_IMAGES.cuisine, SITE_IMAGES.peinture, SITE_IMAGES.salleDeBains].map((i) =>
    siteImageSrc(i.src, overrides),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <Hero images={heroImages} />
        <TrustBar />
        <Services />
        <BeforeAfterPreview />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
