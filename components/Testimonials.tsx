import { apiClient, endpoints } from "@/lib/api";
import type { Testimonial } from "@/types/api";
import { Reveal } from "@/components/Reveal";
import { RatingSummary, TestimonialsCarousel } from "@/components/TestimonialsCarousel";

/**
 * Homepage reviews. Only REAL reviews entered in the admin (Avis clients) are shown:
 * no invented fallback — fake reviews are a misleading commercial practice
 * (Code de la consommation, art. L121-4). With no review yet, the section is hidden.
 */
export async function Testimonials() {
  let testimonials: Testimonial[] = [];

  try {
    const data = await apiClient.get(`${endpoints.testimonials.getAll}?featured=true`);
    testimonials = data as Testimonial[];
  } catch {
    // API unavailable: hide the section rather than show anything invented
  }

  if (testimonials.length === 0) return null;

  const items = testimonials.map((t) => ({
    clientName: t.clientName,
    clientCity: t.clientCity,
    rating: t.rating,
    comment: t.comment,
    projectType: t.projectType,
  }));

  return (
    <section id="testimonials" className="bg-neutral-50 py-20" aria-labelledby="testimonials-title">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Avis clients</p>
            <h2 id="testimonials-title" className="mt-2 text-4xl font-bold text-neutral-950">
              Ce que disent nos clients
            </h2>
            <RatingSummary items={items} />
          </div>
        </Reveal>
        <TestimonialsCarousel items={items} />
      </div>
    </section>
  );
}
