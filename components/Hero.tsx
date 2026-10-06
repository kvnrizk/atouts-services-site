"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { trackPhoneClick } from "@/lib/analytics";
import { SITE_IMAGES } from "@/lib/site-images";

const defaultHeroImages = [SITE_IMAGES.maison, SITE_IMAGES.cuisine, SITE_IMAGES.peinture, SITE_IMAGES.salleDeBains].map((i) => i.src);

/** `images`: the 4 slides, with any photo replaced from the admin (resolved by the page) */
export const Hero = ({ images: heroImages = defaultHeroImages }: { images?: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slideCount = heroImages.length;
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, 4000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative -mt-[65px] h-svh min-h-[520px] w-full overflow-hidden bg-neutral-950" aria-label="Présentation">
      <div className="absolute inset-0">
        {/* next/image serves AVIF/WebP at the screen's width; only the first slide is
            preloaded (LCP), the others load lazily before their turn comes */}
        {heroImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === activeIndex ? 1 : 0 }}
            aria-hidden
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
      </div>

      <div className="relative h-full flex flex-col justify-end">
        <div className="container mx-auto px-4 pt-[calc(65px+3svh)] pb-[6svh]">
          <div className="max-w-3xl">
            {/* The eyebrow is inside the H1 so the heading carries the "rénovation + city" keyword */}
            <h1 className="mb-[3svh]">
              <span className="block text-xs md:text-sm font-medium tracking-[0.2em] text-sky-400 uppercase mb-[3svh]">
                Rénovation à Issy-les-Moulineaux · Paris · Île-de-France
              </span>
              <span className="block text-[clamp(2.25rem,min(9vw,8.5svh),4.5rem)] font-bold text-white leading-[1.05]">
                Rénovation d&apos;intérieur,<br />depuis 2006.
              </span>
            </h1>
            <p className="text-[clamp(1rem,2.5svh,1.25rem)] text-neutral-300 max-w-xl mb-[4svh]">
              Électricité, peinture, salle de bains et sols, réalisés par des artisans
              qualifiés et coordonnés par un seul interlocuteur. Entreprise assurée en garantie décennale.
            </p>

            <div className="flex flex-wrap gap-4 mb-[5svh]">
              <a href="tel:+33634026180" onClick={() => trackPhoneClick("hero")}>
                <Button
                  size="lg"
                  className="bg-sky-400 hover:bg-sky-300 text-neutral-950 px-8 py-[clamp(0.75rem,2svh,1.5rem)] text-base font-semibold shadow-xl"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Nous appeler
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
                Demander un devis gratuit
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-neutral-400 border-t border-white/10 pt-[3svh]">
              <div>
                <span className="text-2xl font-bold text-white">20 ans</span> d&apos;expérience
              </div>
              <div>
                <span className="text-2xl font-bold text-white">24 h</span> pour vous rappeler
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Décennale</span> entreprise assurée
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
