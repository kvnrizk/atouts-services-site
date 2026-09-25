"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { trackPhoneClick } from "@/lib/analytics";

const heroImages = [
  "/images/stock/maison-contemporaine.jpg",
  "/images/stock/cuisine-blanche.jpg",
  "/images/stock/rouleau-peinture.jpg",
  "/images/stock/salle-de-bains-lumineuse.jpg",
];

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative -mt-[65px] h-svh min-h-[520px] w-full overflow-hidden bg-neutral-950" aria-label="Présentation">
      <div className="absolute inset-0">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${src})`, opacity: index === activeIndex ? 1 : 0 }}
            aria-hidden={index !== activeIndex}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
      </div>

      <div className="relative h-full flex flex-col justify-end">
        <div className="container mx-auto px-4 pt-[calc(65px+3svh)] pb-[6svh]">
          <div className="max-w-3xl">
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-sky-400 uppercase mb-[3svh]">
              Rénovation à Issy-les-Moulineaux · Hauts-de-Seine
            </div>
            <h1 className="text-[clamp(2.25rem,min(9vw,8.5svh),4.5rem)] font-bold text-white leading-[1.05] mb-[3svh]">
              Tous vos travaux,<br />une seule équipe.
            </h1>
            <p className="text-[clamp(1rem,2.5svh,1.25rem)] text-neutral-300 max-w-xl mb-[4svh]">
              Peinture, rénovation, électricité, salle de bains, revêtements de sol —
              réalisés par des artisans qualifiés, garantis 10 ans.
            </p>

            <div className="flex flex-wrap gap-4 mb-[5svh]">
              <a href="tel:+33634026180" onClick={() => trackPhoneClick("hero")}>
                <Button
                  size="lg"
                  className="bg-sky-400 hover:bg-sky-300 text-neutral-950 px-8 py-[clamp(0.75rem,2svh,1.5rem)] text-base font-semibold shadow-xl"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Appelez-nous maintenant
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-neutral-950 px-8 py-[clamp(0.75rem,2svh,1.5rem)] text-base font-semibold"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Nos services
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-neutral-300 hover:text-white hover:bg-white/10 px-8 py-[clamp(0.75rem,2svh,1.5rem)] text-base font-semibold"
                onClick={scrollToContact}
              >
                Nous écrire
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-neutral-400 border-t border-white/10 pt-[3svh]">
              <div>
                <span className="text-2xl font-bold text-white">10+</span> ans d&apos;expérience
              </div>
              <div>
                <span className="text-2xl font-bold text-white">500+</span> projets réalisés
              </div>
              <div>
                <span className="text-2xl font-bold text-white">10 ans</span> garantie décennale
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
