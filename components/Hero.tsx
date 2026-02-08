"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ChevronLeft, ChevronRight, Calculator } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    title: "Rénovation Complète",
    subtitle: "Transformez votre espace de vie",
    description: "Expertise en rénovation d'appartements et maisons à Issy-les-Moulineaux",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1920&h=1080&fit=crop"
  },
  {
    title: "Peinture Intérieure",
    subtitle: "Des finitions impeccables",
    description: "Conseils personnalisés et application professionnelle",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1920&h=1080&fit=crop"
  },
  {
    title: "Salles de Bains",
    subtitle: "Design sur mesure",
    description: "Création et rénovation de salles de bains modernes",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&h=1080&fit=crop"
  },
  {
    title: "Installation Électrique",
    subtitle: "Sécurité et conformité",
    description: "Mise aux normes et installations électriques professionnelles",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&h=1080&fit=crop"
  }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative h-full flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-xl md:text-2xl font-medium mb-4 opacity-90">
                  {slide.subtitle}
                </h2>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-10 opacity-90">
                  {slide.description}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-6 text-lg font-semibold shadow-xl hover:scale-105 transition-transform"
                    onClick={scrollToContact}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Demander un devis gratuit
                  </Button>
                  <Button
                    size="lg"
                    className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all"
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Nos Services
                  </Button>
                  <Link href="/simulateur">
                    <Button
                      size="lg"
                      className="border-2 border-yellow-400 bg-transparent text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-6 text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Estimer mes travaux
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Garantie décennale
                  </span>
                  <span className="hidden sm:inline text-white/40">&bull;</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Devis gratuit
                  </span>
                  <span className="hidden sm:inline text-white/40">&bull;</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Artisans qualifiés
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-yellow-400'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
