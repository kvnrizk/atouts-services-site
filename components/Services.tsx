"use client";

import { Paintbrush, Home, Zap, Bath, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LazyHexNut3D } from "@/components/LazyHexNut3D";
import { Reveal } from "@/components/Reveal";

const services = [
  {
    icon: Paintbrush,
    title: "Entreprise de Peinture",
    link: "/services/peinture",
    angle: -18,
  },
  {
    icon: Home,
    title: "Rénovation Immobilière",
    link: "/services/renovation",
    angle: 54,
  },
  {
    icon: Zap,
    title: "Électricité",
    link: "/services/electricite",
    angle: 126,
  },
  {
    icon: Layers,
    title: "Revêtements de Sols",
    link: "/services/revetements-sol",
    angle: 198,
  },
  {
    icon: Bath,
    title: "Salle de Bains",
    link: "/services/salles-de-bains",
    angle: 270,
  }
];

/** Brand logo (transparent PNG) used as the section backdrop */
const LOGO_SRC = "/images/brand/logo-atouts-services.png";

// One consistent color for every service icon — dark steel to match the
// bolt centerpiece, with the sky accent reserved for the hover state only.
const iconBg = "bg-neutral-900";
const iconHoverBorder = "group-hover:border-sky-400";
const iconHoverText = "group-hover:text-sky-600";

const getPositionFromAngle = (angle: number, radius: number = 320) => {
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)'
  };
};

export const Services = () => {
  return (
    <section id="services" className="py-20 bg-neutral-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-300 rounded-full blur-3xl"></div>
      </div>

      {/* Brand logo in full colour as the backdrop of the whole section (transparent PNG);
          the services, the 3D nut and the button sit on top of it */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-36 md:items-center md:pt-0" aria-hidden="true">
        <Image
          src={LOGO_SRC}
          alt=""
          width={1300}
          height={434}
          sizes="(max-width: 768px) 140vw, 1300px"
          className="w-[140vw] max-w-none select-none md:w-[min(1300px,96vw)]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">Nos Services</h2>
        </div>

        <div className="relative flex items-center justify-center md:min-h-[700px]">
          {/* Central 3D hex nut — desktop only here: it sits in the middle of the circle of services,
              with the logo as a faint watermark behind it (the 3D canvas is transparent) */}
          <div className="absolute top-1/2 left-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="relative h-[420px] w-[420px]">
              <div className="relative h-full w-full">
                <LazyHexNut3D />
              </div>
            </div>
          </div>

          {/* Services positioned around the circle */}
          <div className="w-full">
            {/* Mobile: Stack layout */}
            <div className="md:hidden">
              {/* Mobile: the 3D nut sits above the list, in the flow, so it never covers a card */}
              <div className="relative mx-auto -mt-8 mb-6 h-56 w-56">
                <div className="relative h-full w-full">
                  <LazyHexNut3D />
                </div>
              </div>
              <div className="space-y-4">
              {services.map((service, index) => (
                <Reveal key={index} delay={index * 60}>
                  <Link href={service.link} className="block group">
                    <div className={`flex items-center gap-4 bg-white shadow-sm p-5 rounded-2xl border border-neutral-200 ${iconHoverBorder} hover:shadow-lg transition-all duration-300 active:scale-[0.98]`}>
                      <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-neutral-900 font-semibold text-lg uppercase tracking-wide">
                        {service.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
              </div>
            </div>

            {/* Desktop: Circular layout */}
            <div className="hidden md:block relative h-[700px] w-full">
              {services.map((service, index) => {
                const position = getPositionFromAngle(service.angle);
                return (
                  <div key={index} className="absolute transition-all duration-300" style={position}>
                    <Reveal delay={index * 60}>
                      <Link href={service.link} className="group inline-block">
                        <div className="flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300">
                          <div className={`${iconBg} w-14 h-14 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-md border-2 border-transparent ${iconHoverBorder}`}>
                            <service.icon className="h-7 w-7 text-white" />
                          </div>
                          <h3 className={`text-neutral-900 font-semibold text-lg uppercase tracking-wide ${iconHoverText} transition-colors text-center max-w-[220px] rounded-lg bg-white/80 px-3 py-1 shadow-sm backdrop-blur-sm`}>
                            {service.title}
                          </h3>
                        </div>
                      </Link>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-6">
            Une expertise complète pour tous vos projets de rénovation et d&apos;aménagement
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block rounded-md bg-sky-400 px-8 py-4 text-lg font-semibold text-neutral-950 shadow-lg transition hover:bg-sky-300 hover:shadow-xl active:scale-[0.98]"
          >
            Demander un devis gratuit
          </button>
        </div>
      </div>
    </section>
  );
};
