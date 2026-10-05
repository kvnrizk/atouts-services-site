import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LazyHexNut3D } from "@/components/LazyHexNut3D";
import { Reveal } from "@/components/Reveal";
import { servicesData } from "@/lib/services-data";

/**
 * "Nos services" as a showroom: the 3D nut presented like a product on the left,
 * the five trades as a numbered list on the right, each row linking to its page.
 */
export function Services() {
  const services = Object.values(servicesData);

  return (
    <section id="services" className="overflow-hidden bg-neutral-50 py-24 text-neutral-950 md:py-28" aria-labelledby="services-title">
      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Showroom stage: soft light behind the nut and a contact shadow under it, so it stands
            on something instead of floating */}
        <div className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-[480px]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_42%,#ffffff,rgba(255,255,255,0)_62%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[6%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-neutral-950/25 blur-xl" />
          <div className="relative h-full w-full">
            <LazyHexNut3D />
          </div>
        </div>

        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Nos services</p>
            <h2 id="services-title" className="mt-4 text-4xl font-bold tracking-tight [text-wrap:balance] md:text-5xl">
              Cinq métiers, une seule entreprise.
            </h2>
            <p className="mt-5 max-w-lg text-lg text-neutral-600">
              Chaque métier est confié à un artisan qualifié, et un seul interlocuteur suit votre chantier
              du devis à la réception.
            </p>
          </Reveal>

          <ol className="mt-10 border-t border-neutral-200">
            {services.map((service, i) => (
              <li key={service.slug} className="border-b border-neutral-200">
                <Reveal delay={i * 60}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-2 py-5 transition-colors"
                  >
                    <span className="font-mono text-sm text-sky-600">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-xl font-semibold transition-colors group-hover:text-sky-700 md:text-2xl">
                        {service.title}
                      </span>
                      <span className="mt-1 block text-sm text-neutral-500 transition-colors group-hover:text-neutral-700">
                        {service.tagline}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5 text-neutral-400 transition duration-300 group-hover:translate-x-1 group-hover:text-sky-700"
                    />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>

          <a
            href="#contact"
            className="mt-10 inline-flex items-center rounded-md bg-sky-400 px-7 py-4 font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.98]"
          >
            Demander un devis gratuit
          </a>
        </div>
      </div>
    </section>
  );
}
