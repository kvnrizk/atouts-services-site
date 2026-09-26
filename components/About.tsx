import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { SITE_IMAGES } from "@/lib/site-images";
import { getSiteImageOverrides, siteImageSrc } from "@/lib/site-image-overrides";

/**
 * "Pourquoi Atouts Services" — concrete commitments confirmed by the owner (2026-09-26),
 * a photo, and a proof bar of verifiable facts only (no figures repeated from the hero,
 * no "100 % satisfaction"). The SIRET stays in the legal notices only (owner request).
 */
const commitments = [
  {
    title: "Un seul interlocuteur",
    text: "Du premier rendez-vous à la réception du chantier, vous échangez avec la même personne.",
  },
  {
    title: "Des artisans qualifiés et certifiés",
    text: "Chaque métier est confié à un professionnel certifié dans sa spécialité : électricité, plomberie, peinture, sols.",
  },
  {
    title: "Un chantier protégé et laissé propre",
    text: "Sols et mobilier protégés pendant les travaux, et un chantier rendu propre à la fin.",
  },
  {
    title: "Visite et devis gratuits",
    text: "Nous venons voir votre projet et vous remettons un devis gratuit, sans engagement.",
  },
];

const proofs = [
  { value: "Depuis 2006", label: "Entreprise fondée à Issy-les-Moulineaux" },
  { value: "Artisans certifiés", label: "Dans chaque métier" },
  { value: "Décennale AXA", label: "Assurance sur tous nos travaux" },
  { value: "Paris & IDF", label: "Zone d'intervention" },
];

export const About = async () => {
  const photo = siteImageSrc(SITE_IMAGES.appartementRenove.src, await getSiteImageOverrides());
  return (
    <section id="about" className="bg-neutral-950 py-24 text-white md:py-28" aria-labelledby="about-title">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-400">Pourquoi Atouts Services</p>
              <h2 id="about-title" className="mt-4 text-4xl font-bold tracking-tight [text-wrap:balance] md:text-5xl">
                Une équipe, tous vos travaux.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-neutral-400">
                Depuis 2006, nous rénovons appartements et maisons à Paris et dans toute l&apos;Île-de-France,
                depuis Issy-les-Moulineaux. Plus de 500 chantiers menés avec la même exigence : un travail
                propre, confié aux bons artisans.
              </p>
            </Reveal>

            <ol className="mt-10 border-t border-white/10">
              {commitments.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <li className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5">
                    <span className="pt-0.5 font-mono text-sm text-sky-400">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg font-semibold transition-colors group-hover:text-sky-300">{c.title}</h3>
                      <p className="mt-1 text-neutral-400">{c.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={360}>
              <a
                href="#contact"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3.5 font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.98]"
              >
                Parlons de votre projet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          {/* Photo (stock, decoration only) with floating proof badges */}
          <Reveal delay={120}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900 ring-1 ring-white/10">
                <Image
                  src={photo}
                  alt="Appartement lumineux entièrement rénové"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
              </div>

              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-neutral-950/60 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                Depuis 2006
              </div>

              <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-2xl bg-white p-4 text-neutral-950 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] sm:left-auto sm:right-8 sm:max-w-xs">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                  <ShieldCheck size={26} weight="duotone" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">Garantie décennale</p>
                  <p className="text-sm text-neutral-500">Assureur : AXA · tous nos travaux couverts 10 ans</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Proof bar: verifiable facts only */}
        <dl className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {proofs.map((p) => (
            <div key={p.value} className="bg-neutral-950 px-6 py-5">
              <dt className="text-sm text-neutral-500">{p.label}</dt>
              <dd className="mt-1 text-xl font-bold tracking-tight">{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
