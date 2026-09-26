"use client";

import { useEffect, useState } from "react";
import { MapPin, Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface TestimonialCard {
  id?: number;
  clientName: string;
  clientCity?: string;
  rating: number;
  comment: string;
  projectLabel?: string;
}

const AUTOPLAY_MS = 5000;

/** "Marie D." -> "MD", "Jean-Paul" -> "JP" */
function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function TestimonialsCarousel({ items }: { items: TestimonialCard[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [paused, setPaused] = useState(false);

  // Dots follow the carousel (the number of snaps changes with the screen width)
  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setSnapCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  // Autoplay: paused while hovered or focused, and off for users who ask for reduced motion
  useEffect(() => {
    if (!api || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [api, paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        aria-label="Avis de nos clients"
        // Soft fade on the left/right edges (desktop) so cards slide in and out instead of being cut
        className="md:[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
      >
        <CarouselContent className="-ml-6 py-4">
          {items.map((t, i) => (
            <CarouselItem key={t.id ?? i} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <figure className="group flex h-full flex-col rounded-3xl bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(0,0,0,0.18)] ring-1 ring-neutral-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-20px_rgba(14,165,233,0.35)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-0.5" role="img" aria-label={`Note : ${t.rating} sur 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        aria-hidden="true"
                        className={cn("h-4 w-4", n <= t.rating ? "fill-sky-400 text-sky-400" : "fill-neutral-200 text-neutral-200")}
                      />
                    ))}
                  </div>
                  {t.projectLabel && (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">{t.projectLabel}</span>
                  )}
                </div>

                <Quote className="mt-6 h-7 w-7 fill-sky-400/15 text-sky-400/40" aria-hidden="true" />
                <blockquote className="mt-3 line-clamp-6 flex-1 text-[1.05rem] leading-relaxed text-neutral-800">
                  {t.comment}
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-sky-300"
                  >
                    {initials(t.clientName)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-neutral-950">{t.clientName}</span>
                    {t.clientCity && (
                      <span className="flex items-center gap-1 text-sm text-neutral-500">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {t.clientCity}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {snapCount > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: snapCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Aller à l'avis ${i + 1}`}
              aria-current={i === selected}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selected ? "w-8 bg-sky-500" : "w-2 bg-neutral-300 hover:bg-neutral-400",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
