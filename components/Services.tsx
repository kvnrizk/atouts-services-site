"use client";

import { Paintbrush, Home, Zap, Bath, Layers } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Paintbrush,
    title: "Entreprise de Peinture",
    link: "/services/peinture",
    angle: -18,
    shape: "hexagon",
    glowColor: "rgba(250, 204, 21, 0.6)"
  },
  {
    icon: Home,
    title: "Rénovation Immobilière",
    link: "/services/renovation",
    angle: 54,
    shape: "circle",
    glowColor: "rgba(59, 130, 246, 0.6)"
  },
  {
    icon: Zap,
    title: "Électricité",
    link: "/services/electricite",
    angle: 126,
    shape: "diamond",
    glowColor: "rgba(251, 191, 36, 0.6)"
  },
  {
    icon: Layers,
    title: "Revêtements de Sols",
    link: "/services/revetements-sol",
    angle: 198,
    shape: "square",
    glowColor: "rgba(34, 197, 94, 0.6)"
  },
  {
    icon: Bath,
    title: "Salle de Bains",
    link: "/services/salles-de-bains",
    angle: 270,
    shape: "rounded",
    glowColor: "rgba(99, 102, 241, 0.6)"
  }
];

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
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Nos Services</h2>
        </div>

        <div className="relative min-h-[800px] md:min-h-[700px] flex items-center justify-center">
          {/* Central Circle - 3D Rotating Engineering Gear */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]" style={{ perspective: '1200px' }}>
              <div
                className="absolute inset-0 animate-spin-slow"
                style={{
                  transformStyle: 'preserve-3d',
                  animation: 'spin-slow 12s linear infinite'
                }}
              >
                <svg viewBox="0 0 400 400" className="w-full h-full" style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.6))' }}>
                  <defs>
                    <linearGradient id="steelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#CBD5E1" />
                      <stop offset="25%" stopColor="#94A3B8" />
                      <stop offset="50%" stopColor="#64748B" />
                      <stop offset="75%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <radialGradient id="gearGradient" cx="45%" cy="45%">
                      <stop offset="0%" stopColor="#F1F5F9" />
                      <stop offset="20%" stopColor="#E2E8F0" />
                      <stop offset="40%" stopColor="#CBD5E1" />
                      <stop offset="60%" stopColor="#94A3B8" />
                      <stop offset="80%" stopColor="#64748B" />
                      <stop offset="100%" stopColor="#475569" />
                    </radialGradient>
                    <linearGradient id="toothShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                    <filter id="gearShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                      <feOffset dx="3" dy="10" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.6"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <radialGradient id="metalShine">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                      <stop offset="30%" stopColor="#F1F5F9" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <ellipse cx="200" cy="220" rx="95" ry="35" fill="#000000" opacity="0.4" filter="blur(12px)" />

                  <g filter="url(#gearShadow)">
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30) - 90;
                      const innerRadius = 85;
                      const outerRadius = 110;
                      const toothWidth = 12;

                      return (
                        <g key={`tooth-${i}`} transform={`rotate(${angle + 90} 200 200)`}>
                          <rect x={200 - toothWidth / 2 + 2} y={innerRadius - 3} width={toothWidth} height={outerRadius - innerRadius + 8} fill="#1E293B" opacity="0.5" rx="2" />
                          <rect x={200 - toothWidth / 2} y={innerRadius} width={toothWidth} height={outerRadius - innerRadius + 5} fill="url(#toothShadow)" stroke="#334155" strokeWidth="1.5" rx="2" />
                          <rect x={200 - toothWidth / 2 + 1} y={innerRadius + 2} width={toothWidth - 2} height={(outerRadius - innerRadius) / 2} fill="#CBD5E1" opacity="0.6" rx="1" />
                        </g>
                      );
                    })}

                    <circle cx="200" cy="200" r="85" fill="url(#gearGradient)" stroke="#475569" strokeWidth="3" />
                    <circle cx="200" cy="200" r="82" fill="none" stroke="#64748B" strokeWidth="4" opacity="0.6" />
                    <circle cx="200" cy="200" r="75" fill="none" stroke="#475569" strokeWidth="2" opacity="0.5" />
                    <circle cx="200" cy="200" r="70" fill="#94A3B8" opacity="0.3" />
                    <circle cx="200" cy="200" r="60" fill="#64748B" opacity="0.4" />
                    <circle cx="200" cy="200" r="45" fill="url(#steelGradient)" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="200" cy="200" r="42" fill="none" stroke="#475569" strokeWidth="2" />
                    <circle cx="200" cy="200" r="38" fill="none" stroke="#64748B" strokeWidth="1.5" />
                    <circle cx="200" cy="200" r="30" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                    <circle cx="200" cy="200" r="28" fill="#334155" opacity="0.8" />

                    {[...Array(6)].map((_, i) => {
                      const boltAngle = (i * 60) * (Math.PI / 180);
                      const radius = 52;
                      const x = 200 + Math.cos(boltAngle) * radius;
                      const y = 200 + Math.sin(boltAngle) * radius;

                      return (
                        <g key={`bolt-${i}`}>
                          <circle cx={x + 1} cy={y + 1} r="6" fill="#000000" opacity="0.5" />
                          <circle cx={x} cy={y} r="6" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                          <circle cx={x - 1.5} cy={y - 1.5} r="2" fill="#64748B" opacity="0.6" />
                        </g>
                      );
                    })}

                    {[...Array(24)].map((_, i) => {
                      const detailAngle = (i * 15) * (Math.PI / 180);
                      const x1 = 200 + Math.cos(detailAngle) * 62;
                      const y1 = 200 + Math.sin(detailAngle) * 62;
                      const x2 = 200 + Math.cos(detailAngle) * 70;
                      const y2 = 200 + Math.sin(detailAngle) * 70;

                      return (
                        <line key={`detail-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="1.5" opacity="0.4" />
                      );
                    })}

                    <ellipse cx="170" cy="170" rx="40" ry="30" fill="url(#metalShine)" opacity="0.5" transform="rotate(-45 170 170)" />
                    <circle cx="180" cy="180" r="20" fill="#FFFFFF" opacity="0.3" />
                    <circle cx="175" cy="175" r="10" fill="#FFFFFF" opacity="0.5" />
                  </g>
                </svg>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full w-28 h-28 md:w-36 md:h-36 flex items-center justify-center shadow-2xl border-2 border-gray-600/40 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm md:text-lg text-center px-2 drop-shadow-lg leading-tight">
                    NOS<br/>SERVICES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Services positioned around the circle */}
          <div className="w-full">
            {/* Mobile: Stack layout */}
            <div className="md:hidden space-y-8">
              {services.map((service, index) => (
                <Link key={index} href={service.link} className="block group">
                  <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border-2 border-white/30 hover:border-white/80 transition-all duration-300 hover:bg-gray-800/70">
                    <div className="bg-yellow-400 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6 text-gray-900" />
                    </div>
                    <h3 className="text-white font-semibold text-lg uppercase tracking-wide">
                      {service.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop: Circular layout */}
            <div className="hidden md:block relative h-[700px] w-full">
              {services.map((service, index) => {
                const position = getPositionFromAngle(service.angle);
                return (
                  <div key={index} className="absolute transition-all duration-300" style={position}>
                    <Link href={service.link} className="group inline-block">
                      <div className="flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300">
                        <div className="bg-yellow-400 w-14 h-14 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform border-2 border-white/40 group-hover:border-white/90">
                          <service.icon className="h-7 w-7 text-gray-900" />
                        </div>
                        <h3 className="text-white font-semibold text-lg uppercase tracking-wide group-hover:text-yellow-400 transition-colors text-center max-w-[200px]">
                          {service.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-300 text-lg mb-6">
            Une expertise complète pour tous vos projets de rénovation et d&apos;aménagement
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg hover:shadow-xl"
          >
            Demander un devis gratuit
          </button>
        </div>
      </div>
    </section>
  );
};
