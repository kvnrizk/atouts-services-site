import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LEGAL } from "@/lib/legal";

/** Shared layout for legal pages. Styles plain HTML children (h2, p, ul, table, a). */
export function LegalPage({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-neutral-950 py-16 text-white md:py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Informations légales</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">{title}</h1>
            {intro && <p className="mt-4 text-lg text-neutral-400">{intro}</p>}
            <p className="mt-6 text-sm text-neutral-500">Dernière mise à jour : {LEGAL.lastUpdated}</p>
          </div>
        </section>
        <article
          className="container mx-auto max-w-3xl px-4 py-16 text-neutral-700 leading-relaxed
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-neutral-950 [&>h2:first-child]:mt-0 [&>section:first-child>h2]:mt-0
            [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-neutral-950
            [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
            [&_a]:text-sky-700 [&_a]:underline hover:[&_a]:no-underline
            [&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
            [&_th]:border-b-2 [&_th]:border-neutral-300 [&_th]:p-2 [&_th]:text-left [&_th]:text-neutral-950
            [&_td]:border-b [&_td]:border-neutral-200 [&_td]:p-2 [&_td]:align-top"
        >
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}

/** Shows a value from lib/legal.ts, or a visible marker when it is still missing. */
export function Fill({ value, what }: { value: string | null | undefined; what: string }) {
  if (value) return <>{value}</>;
  return (
    <mark className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900">[À COMPLÉTER : {what}]</mark>
  );
}
