"use client";

import { useMemo } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Quote, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .replace(/[^A-Za-zÀ-ÿ]/g, "")
    .slice(0, 2)
    .toUpperCase();

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
  // Continuous "wheel" scroll, paused while hovered or touched; static for visitors who asked for reduced motion
  const plugins = useMemo(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
    return [AutoScroll({ speed: 0.8, startDelay: 0, stopOnMouseEnter: true, stopOnInteraction: false })];
  }, []);

  return (
    // Edges fade out so the cards appear to come from and go back into the sides
    <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <Carousel plugins={plugins} opts={{ align: "start", loop: true, dragFree: true }} aria-label="Avis de nos clients">
        <CarouselContent className="-ml-6 py-4">
          {items.map((t, i) => (
            <CarouselItem key={`${t.clientName}-${i}`} className="basis-[85%] pl-6 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <figure className="group flex h-full flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-neutral-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-sky-200">
                <div className="flex items-center justify-between">
                  <Stars rating={t.rating} />
                  <Quote className="h-8 w-8 text-sky-100 transition-colors group-hover:text-sky-200" aria-hidden="true" />
                </div>
                <blockquote className="mt-5 flex-1 leading-relaxed text-neutral-700">&ldquo;{t.comment}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-sm font-semibold text-white"
                  >
                    {initials(t.clientName)}
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="block font-semibold text-neutral-950">{t.clientName}</span>
                    <span className="block truncate text-neutral-500">
                      {[t.clientCity, projectLabel(t.projectType)].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

/** Average of the real reviews, shown above the carousel ("4,8/5 · 15 avis"). */
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
