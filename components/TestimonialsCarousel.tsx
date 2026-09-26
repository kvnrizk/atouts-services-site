"use client";

import { useEffect, useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { PROJECT_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface TestimonialCard {
  clientName: string;
  clientCity?: string;
  rating: number;
  comment: string;
  projectType?: string;
}

const projectLabel = (value?: string) => PROJECT_TYPES.find((p) => p.value === value)?.label;

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} role="img" aria-label={`Note : ${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("h-4 w-4", i < rating ? "fill-sky-400 text-sky-400" : "fill-neutral-200 text-neutral-200")}
        />
      ))}
    </div>
  );
}

export function TestimonialsCarousel({ items }: { items: TestimonialCard[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  // Autoplay every 5 s, paused while hovered; never for visitors who asked for reduced motion
  const plugins = useMemo(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
    return [Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })];
  }, []);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSnapCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={plugins}
        opts={{ align: "start", loop: items.length > 3 }}
        aria-label="Avis de nos clients"
      >
        <CarouselContent className="-ml-6">
          {items.map((t, i) => (
            <CarouselItem key={`${t.clientName}-${i}`} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <figure className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-neutral-200">
                <div className="flex items-center justify-between">
                  <Stars rating={t.rating} />
                  <Quote className="h-7 w-7 text-sky-100" aria-hidden="true" />
                </div>
                <blockquote className="mt-5 flex-1 text-neutral-700">&ldquo;{t.comment}&rdquo;</blockquote>
                <figcaption className="mt-6 border-t border-neutral-100 pt-4 text-sm">
                  <span className="block font-semibold text-neutral-950">{t.clientName}</span>
                  <span className="text-neutral-500">
                    {[t.clientCity, projectLabel(t.projectType)].filter(Boolean).join(" · ")}
                  </span>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {snapCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
            aria-label="Avis précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: snapCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === selected ? "w-6 bg-sky-500" : "w-2 bg-neutral-300 hover:bg-neutral-400",
                )}
                aria-label={`Aller à l'avis ${i + 1}`}
                aria-current={i === selected}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
            aria-label="Avis suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Average of the real reviews, shown above the carousel ("4,9/5 · 12 avis"). */
export function RatingSummary({ items }: { items: TestimonialCard[] }) {
  const average = items.reduce((sum, t) => sum + t.rating, 0) / items.length;
  const rounded = Math.round(average * 10) / 10;
  return (
    <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-neutral-200">
      <Stars rating={Math.round(average)} />
      <span className="text-sm text-neutral-700">
        <strong className="text-neutral-950">{rounded.toLocaleString("fr-FR")}/5</strong> · {items.length} avis client{items.length > 1 ? "s" : ""}
      </span>
    </div>
  );
}
