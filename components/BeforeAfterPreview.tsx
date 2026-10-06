import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { apiClient, endpoints } from '@/lib/api';
import { projectTypeLabel } from '@/lib/constants';
import type { BeforeAfter } from '@/types/api';
import { Reveal } from '@/components/Reveal';

/** Same black label as the réalisations page cards */
const tag = "absolute left-3 top-3 rounded-md bg-neutral-950/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur";

/** Homepage teaser: the 3 latest published before/after projects, styled like the réalisations page. */
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
    <section className="bg-white py-20" aria-labelledby="before-after-title">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Avant / après</p>
            <h2 id="before-after-title" className="mt-2 text-4xl font-bold text-neutral-950">
              Nos derniers chantiers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Quelques chantiers réalisés par nos équipes.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const label = projectTypeLabel(project.category);
            return (
              <Reveal key={project.id} delay={i * 80}>
                <Link
                  href={`/realisations/${project.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-sky-200"
                >
                  <div className="grid grid-cols-2 gap-px bg-neutral-200">
                    {[
                      { src: project.beforeImageUrl, text: "Avant" },
                      { src: project.afterImageUrl, text: "Après" },
                    ].map((img) => (
                      <div key={img.text} className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={img.src}
                          alt={`${project.title} — ${img.text.toLowerCase()}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className={tag}>{img.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {label && <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">{label}</p>}
                    <h3 className="mt-2 text-lg font-bold leading-snug text-neutral-950">{project.title}</h3>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/realisations"
            className="group inline-flex items-center rounded-md border-2 border-neutral-950 px-7 py-3.5 font-semibold text-neutral-950 transition hover:bg-neutral-950 hover:text-white active:scale-[0.98]"
          >
            Voir toutes nos réalisations
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
