import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TrackedPhoneLink } from "@/components/TrackedPhoneLink";
import { COMPANY_INFO } from "@/lib/constants";

interface ClosingCtaProps {
  title?: string;
  text?: string;
  /** Where the quote button goes: "#contact" when the page has its own form, else the homepage form */
  quoteHref?: string;
  /** Analytics label for the phone click */
  trackingLocation: string;
}

/** Black closing band ("Parlons de votre projet.") — same as the end of the service pages. */
export function ClosingCta({
  title = "Parlons de votre projet.",
  text = "Visite et devis gratuits, sans engagement.",
  quoteHref = "/#contact",
  trackingLocation,
}: ClosingCtaProps) {
  const quoteClass =
    "inline-flex items-center rounded-md bg-sky-400 px-7 py-4 font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.98]";
  return (
    <section className="bg-neutral-950 py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {quoteHref.startsWith("#") ? (
            <a href={quoteHref} className={quoteClass}>Demander mon devis</a>
          ) : (
            <Link href={quoteHref} className={quoteClass}>Demander mon devis</Link>
          )}
          <TrackedPhoneLink
            location={trackingLocation}
            className="inline-flex items-center rounded-md border-2 border-white/40 px-7 py-4 font-semibold transition hover:bg-white hover:text-neutral-950 active:scale-[0.98]"
          >
            <Phone className="mr-2 h-5 w-5" />
            {COMPANY_INFO.phone}
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
