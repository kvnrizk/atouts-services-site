"use client";

import Image from "next/image";
import { Bathtub, GridFour, HouseLine, Lightning, PaintRoller, type Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { LazyHexNut3D } from "@/components/LazyHexNut3D";
import { Reveal } from "@/components/Reveal";

const services = [
  {
    title: "Entreprise de Peinture",
    link: "/services/peinture",
    angle: -18,
  },
  {
    title: "Rénovation Immobilière",
    link: "/services/renovation",
    angle: 54,
  },
  {
    title: "Électricité",
    link: "/services/electricite",
    angle: 126,
  },
  {
    title: "Revêtements de Sols",
    link: "/services/revetements-sol",
    angle: 198,
  },
  {
    title: "Salle de Bains",
    link: "/services/salles-de-bains",
    angle: 270,
  }
];

/** Roof + house mark of the logo: a soft watermark framing the 3D nut like the house under the roof */
const LOGO_SRC = "/images/brand/logo-mark-large.png";

/** One Phosphor duotone icon per service (MIT): clean outline + light sky fill, professional and on-brand */
const ICONS: Record<string, Icon> = {
  "/services/peinture": PaintRoller,
  "/services/renovation": HouseLine,
  "/services/electricite": Lightning,
  "/services/salles-de-bains": Bathtub,
  "/services/revetements-sol": GridFour,
};

const iconHoverBorder = "group-hover:border-sky-400";
const iconHoverText = "group-hover:text-sky-600";

/** White disc with the duotone icon; the disc turns dark and the icon sky on hover */
function ServiceIcon({ link, size }: { link: string; size: number }) {
  const Glyph = ICONS[link];
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-full bg-white text-sky-700 shadow-md ring-1 ring-neutral-200 transition duration-300 group-hover:bg-neutral-950 group-hover:text-sky-400 group-hover:ring-neutral-950"
      style={{ width: size, height: size }}
    >
      {Glyph && <Glyph size={Math.round(size * 0.46)} weight="duotone" aria-hidden="true" />}
    </span>
  );
}

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

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">Nos Services</h2>
        </div>

        <div className="relative flex items-center justify-center md:min-h-[700px]">
          {/* Central 3D hex nut — desktop only here: it sits in the middle of the circle of services,
              under the faded logo mark (the 3D canvas is transparent) */}
          <div className="absolute top-1/2 left-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="relative h-[420px] w-[420px]">
              <Image
                src={LOGO_SRC}
                alt=""
                aria-hidden="true"
                width={760}
                height={601}
                sizes="760px"
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-[47%] -translate-y-[60%] select-none w-[760px] opacity-[0.16] [mask-image:radial-gradient(closest-side,black_55%,transparent)]"
              />
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
                <Image
                src={LOGO_SRC}
                alt=""
                aria-hidden="true"
                width={400}
                height={317}
                sizes="400px"
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-[47%] -translate-y-[60%] select-none w-[400px] opacity-[0.16] [mask-image:radial-gradient(closest-side,black_55%,transparent)]"
              />
                <div className="relative h-full w-full">
                  <LazyHexNut3D />
                </div>
              </div>
              <div className="space-y-4">
              {services.map((service, index) => (
                <Reveal key={index} delay={index * 60}>
                  <Link href={service.link} className="block group">
                    <div className={`flex items-center gap-4 bg-white shadow-sm p-5 rounded-2xl border border-neutral-200 ${iconHoverBorder} hover:shadow-lg transition-all duration-300 active:scale-[0.98]`}>
                      <ServiceIcon link={service.link} size={56} />
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
                          <ServiceIcon link={service.link} size={80} />
                          <h3 className={`text-neutral-900 font-semibold text-lg uppercase tracking-wide ${iconHoverText} transition-colors text-center max-w-[200px]`}>
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
