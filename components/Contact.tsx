"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import { EnvelopeSimple, MapPin, MapTrifold, type Icon } from "@phosphor-icons/react";
import { GoogleMap } from "@/components/GoogleMap";
import { Reveal } from "@/components/Reveal";
import { ServiceQuoteCard } from "@/components/ServiceQuoteCard";
import { TrackedPhoneLink } from "@/components/TrackedPhoneLink";
import { COMPANY_INFO } from "@/lib/constants";

/** One contact line: duotone icon in a white disc (same language as "Nos services") */
function ContactRow({ icon: Glyph, label, children }: { icon: Icon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sky-700 shadow-sm ring-1 ring-neutral-200">
        <Glyph size={22} weight="duotone" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-neutral-500">{label}</p>
        <div className="mt-0.5 font-medium text-neutral-950">{children}</div>
      </div>
    </div>
  );
}

export const Contact = () => {
  return (
    <section id="contact" className="bg-white py-24 md:py-28" aria-labelledby="contact-title">
      <div className="container mx-auto px-4">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Contact</p>
              <h2 id="contact-title" className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 [text-wrap:balance] md:text-5xl">
                Parlons de votre projet.
              </h2>
              <p className="mt-5 max-w-lg text-lg text-neutral-600">
                Visite et devis gratuits. Appelez-nous ou laissez vos coordonnées : nous vous répondons le jour même.
              </p>
            </Reveal>

            {/* The phone brings most leads: the whole card is the call link */}
            <Reveal delay={80}>
              <TrackedPhoneLink
                location="contact"
                className="group mt-10 flex items-center justify-between gap-6 rounded-3xl bg-neutral-950 p-6 text-white transition hover:bg-neutral-900 active:scale-[0.99] md:p-8"
              >
                <div>
                  <p className="text-sm text-neutral-400">Appelez-nous</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{COMPANY_INFO.phone}</p>
                  <p className="mt-2 text-sm text-neutral-400">
                    {COMPANY_INFO.hours.weekday} · {COMPANY_INFO.hours.saturday}
                  </p>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-400 text-neutral-950 transition group-hover:scale-105">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </span>
              </TrackedPhoneLink>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-6 divide-y divide-neutral-200 border-b border-neutral-200">
                <ContactRow icon={EnvelopeSimple} label="Email">
                  <a href={`mailto:${COMPANY_INFO.email}`} className="inline-flex items-center gap-1 transition-colors hover:text-sky-700">
                    {COMPANY_INFO.email}
                    <ArrowUpRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                  </a>
                </ContactRow>
                <ContactRow icon={MapPin} label="Adresse">
                  {COMPANY_INFO.address}
                </ContactRow>
                <ContactRow icon={MapTrifold} label="Zone d'intervention">
                  Paris et toute l&apos;Île-de-France, en priorité Issy, Boulogne, Vanves, Meudon, Sèvres et Clamart.
                </ContactRow>
              </div>
            </Reveal>
          </div>

          <Reveal className="space-y-6" delay={120}>
            {/* The section already carries id="contact" (target of every "Devis gratuit" link) */}
            <ServiceQuoteCard anchorId={null} trackingLocation="contact-form" />
            <GoogleMap className="h-[220px] overflow-hidden rounded-3xl ring-1 ring-neutral-200" zoom={13} />
          </Reveal>
        </div>
      </div>
    </section>
  );
};
