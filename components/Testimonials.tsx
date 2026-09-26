import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api";
import type { Testimonial } from "@/types/api";
import { Reveal } from "@/components/Reveal";

const fallbackTestimonials = [
  {
    clientName: "Marie Dubois",
    clientCity: "Issy-les-Moulineaux",
    rating: 5,
    comment: "Excellent travail pour la rénovation de notre salle de bain. L’équipe d’Atouts Services est très professionnelle et respecte les délais. Je recommande vivement !",
    projectType: "salles-de-bains",
  },
  {
    clientName: "Pierre Martin",
    clientCity: "Boulogne-Billancourt",
    rating: 5,
    comment: "Peinture complète de notre appartement réalisée dans les règles de l’art. Travail soigné, prix correct et excellent conseil pour les couleurs.",
    projectType: "peinture",
  },
  {
    clientName: "Sophie Leroy",
    clientCity: "Meudon",
    rating: 5,
    comment: "Rénovation électrique conforme aux normes avec un excellent rapport qualité-prix. L’équipe est à l’écoute et très compétente.",
    projectType: "electricite",
  },
];

export async function Testimonials() {
  let testimonials: Testimonial[] = [];

  try {
    const data = await apiClient.get(`${endpoints.testimonials.getAll}?featured=true`);
    testimonials = data as Testimonial[];
  } catch {
    // API unavailable, use fallback
  }

  const items = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section id="testimonials" className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre plus belle r&eacute;compense
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.slice(0, 3).map((testimonial, index) => (
            <Reveal key={index} delay={index * 120}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-1" role="img" aria-label={`Note : ${testimonial.rating} sur 5`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-sky-400 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-sky-100" aria-hidden="true" />
                  </div>

                  <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.comment}&rdquo;</p>

                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.clientName}</div>
                    {testimonial.clientCity && (
                      <div className="text-sm text-gray-600">{testimonial.clientCity}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
