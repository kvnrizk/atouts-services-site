import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { serviceLinks } from "@/lib/service-links";

/**
 * 404 body shared by app/not-found.tsx (outside the locale, no header) and
 * app/[locale]/not-found.tsx (with header/footer). Plain next/link: no i18n context needed.
 */
export function NotFoundContent() {
  return (
    <section className="bg-neutral-950 text-white">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Erreur 404</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Cette page n&apos;existe pas ou a été déplacée.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-neutral-400">
          Voici les pages les plus consultées. Vous pouvez aussi nous appeler directement.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-sky-400 px-6 py-3.5 font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.98]"
          >
            Retour à l&apos;accueil
          </Link>
          <a
            href={COMPANY_INFO.phoneHref}
            className="inline-flex items-center rounded-md border-2 border-white/30 px-6 py-3.5 font-semibold transition hover:bg-white hover:text-neutral-950 active:scale-[0.98]"
          >
            <Phone className="mr-2 h-5 w-5" />
            {COMPANY_INFO.phone}
          </a>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ...serviceLinks.slice(0, 2).map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
            { href: "/realisations", label: "Nos réalisations" },
            { href: "/blog", label: "Conseils & guides" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex items-center justify-between bg-neutral-950 px-6 py-5 transition-colors hover:bg-neutral-900">
                <span className="font-medium">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-sky-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
