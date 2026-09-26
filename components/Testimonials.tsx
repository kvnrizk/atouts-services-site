import { Star } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api";
import { PROJECT_TYPES } from "@/lib/constants";
import type { Testimonial } from "@/types/api";
import { Reveal } from "@/components/Reveal";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

/**
 * Below this many real reviews the section is hidden: a nearly empty carousel looks worse than none.
 * Only reviews entered in Admin → Avis clients are shown — never placeholder reviews
 * (fake reviews are a deceptive commercial practice, Code de la consommation L121-2).
 */
const MIN_REVIEWS = 3;

export async function Testimonials() {
  let reviews: Testimonial[] = [];
  try {
    reviews = (await apiClient.get(endpoints.testimonials.getAll)) as Testimonial[];
  } catch {
    // API unavailable: no section rather than invented content
  }

  if (reviews.length < MIN_REVIEWS) return null;

  // Featured reviews first, then the most recent
  const sorted = [...reviews].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const label = (type?: string) => PROJECT_TYPES.find((p) => p.value === type)?.label;

  return (
    <section id="testimonials" className="bg-stone-50 py-20" aria-labelledby="testimonials-title">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="mb-14 text-center">
            <h2 id="testimonials-title" className="mb-4 text-4xl font-bold text-gray-900">
              Ce que disent nos clients
            </h2>
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-sm ring-1 ring-neutral-200">
              <div className="flex gap-0.5" aria-hidden="true">
                {/* Filled stars match the real average (rounded), never a flat 5 */}
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={n <= Math.round(average) ? "h-5 w-5 fill-sky-400 text-sky-400" : "h-5 w-5 text-neutral-300"}
                  />
                ))}
              </div>
              <span className="font-semibold text-neutral-950">
                {average.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5
              </span>
              <span className="text-neutral-500">· {reviews.length} avis clients</span>
            </div>
          </div>
        </Reveal>

        <TestimonialsCarousel
          items={sorted.map((r) => ({
            id: r.id,
            clientName: r.clientName,
            clientCity: r.clientCity,
            rating: r.rating,
            comment: r.comment,
            projectLabel: label(r.projectType),
          }))}
        />
      </div>
    </section>
  );
}
