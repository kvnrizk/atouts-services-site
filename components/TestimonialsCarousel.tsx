"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
    // md:px-14 keeps room for the arrows inside the container (outside it they overflow the page)
    <div
      className="md:px-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} aria-label="Avis de nos clients">
        <CarouselContent className="-ml-6">
          {items.map((t, i) => (
            <CarouselItem key={t.id ?? i} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <figure className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1" role="img" aria-label={`Note : ${t.rating} sur 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        aria-hidden="true"
                        className={cn("h-5 w-5", n <= t.rating ? "fill-sky-400 text-sky-400" : "text-neutral-300")}
                      />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-sky-100" aria-hidden="true" />
                </div>
                <blockquote className="mt-6 flex-1 text-neutral-700">&ldquo;{t.comment}&rdquo;</blockquote>
                <figcaption className="mt-6 border-t border-neutral-100 pt-4">
                  <div className="font-semibold text-neutral-950">{t.clientName}</div>
                  <div className="text-sm text-neutral-500">
                    {[t.projectLabel, t.clientCity].filter(Boolean).join(" · ")}
                  </div>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-14" aria-label="Avis précédent" />
        <CarouselNext className="hidden md:flex -right-14" aria-label="Avis suivant" />
      </Carousel>

      {snapCount > 1 && (
        <div className="mt-8 flex justify-center gap-2">
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
