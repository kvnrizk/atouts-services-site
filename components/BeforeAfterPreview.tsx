import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient, endpoints } from '@/lib/api';
import type { BeforeAfter } from '@/types/api';

export async function BeforeAfterPreview() {
  let projects: BeforeAfter[] = [];

  try {
    const data = await apiClient.get(`${endpoints.beforeAfter.getAll}?published=true`);
    projects = (data as BeforeAfter[]).slice(0, 3);
  } catch {
    // Silently fail - section won't render
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Avant / Après
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos transformations et la qualité de notre travail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-2 gap-px bg-gray-200">
                <div className="relative">
                  <Image
                    src={project.beforeImageUrl}
                    alt="Avant"
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    AVANT
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src={project.afterImageUrl}
                    alt="Après"
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    APRÈS
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
                {project.category && (
                  <span className="inline-block text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/realisations">
            <Button variant="outline" size="lg" className="group">
              Voir toutes nos r&eacute;alisations
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
