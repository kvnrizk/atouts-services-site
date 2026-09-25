"use client";

import { Paintbrush, Home, Zap, Bath, Layers } from "lucide-react";
import Link from "next/link";
import { HexNut3D } from "@/components/HexNut3D";
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">Nos Services</h2>
        </div>

        <div className="relative min-h-[800px] md:min-h-[700px] flex items-center justify-center">
          {/* Central Circle - 3D Hex Nut */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
              <HexNut3D />
            </div>
          </div>

          {/* Services positioned around the circle */}
          <div className="w-full">
            {/* Mobile: Stack layout */}
            <div className="md:hidden space-y-8">
              {services.map((service, index) => (
                <Reveal key={index} delay={index * 100}>
                  <Link href={service.link} className="block group">
                    <div className={`flex items-center gap-4 bg-white shadow-md p-6 rounded-xl border-2 border-neutral-200 ${iconHoverBorder} hover:shadow-lg transition-all duration-300`}>
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

            {/* Desktop: Circular layout */}
            <div className="hidden md:block relative h-[700px] w-full">
              {services.map((service, index) => {
                const position = getPositionFromAngle(service.angle);
                return (
                  <div key={index} className="absolute transition-all duration-300" style={position}>
                    <Reveal delay={index * 100}>
                      <Link href={service.link} className="group inline-block">
                        <div className="flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300">
                          <div className={`${iconBg} w-14 h-14 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-md border-2 border-transparent ${iconHoverBorder}`}>
                            <service.icon className="h-7 w-7 text-white" />
                          </div>
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
            className="inline-block bg-sky-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-400 transition-colors shadow-lg hover:shadow-xl"
          >
            Demander un devis gratuit
          </button>
        </div>
      </div>
    </section>
  );
};
