"use client";

import { useState } from "react";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { Phone, CheckCircle2 } from "lucide-react";
import { ChatText, EnvelopeSimple, Phone as PhoneIcon, User, type Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { trackPhoneClick } from "@/lib/analytics";
import { COMPANY_INFO } from "@/lib/constants";
import { serviceLinks } from "@/lib/service-links";

/* Dark-card field: subtle fill, lighter border on hover, sky border + soft glow on focus,
   red border only after the visitor has interacted (:user-invalid), no white autofill */
const fieldClass =
  "peer w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[15px] text-white outline-none transition " +
  "placeholder:text-transparent hover:border-white/20 focus:border-sky-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-sky-400/15 " +
  "user-invalid:border-red-400/80 user-invalid:focus:ring-red-400/15 " +
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#171717] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff]";

/* Label sits inside the field and slides up when the field is focused or filled */
const labelClass =
  "pointer-events-none absolute left-11 text-neutral-500 transition-all duration-200 " +
  "peer-focus:text-[11px] peer-focus:text-sky-300 peer-[:not(:placeholder-shown)]:text-[11px]";

/** Input with an icon and a floating label (placeholder=" " drives the :placeholder-shown state) */
function Field({ icon: Glyph, label, multiline, ...props }: { icon: Icon; label: string; multiline?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `quote-${props.name}`;
  return (
    <div className="relative">
      {multiline ? (
        <textarea id={id} placeholder=" " {...props} className={`${fieldClass} min-h-[104px] resize-y pb-3 pt-7`} />
      ) : (
        <input id={id} placeholder=" " {...props} className={`${fieldClass} h-14 pb-2 pt-6`} />
      )}
      <Glyph size={18} weight="duotone" aria-hidden="true" className={`pointer-events-none absolute left-4 text-sky-400/80 ${multiline ? "top-4" : "top-1/2 -translate-y-1/2"}`} />
      <label
        htmlFor={id}
        className={`${labelClass} ${
          multiline
            ? "top-4 text-[15px] peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2"
            : "top-1/2 -translate-y-1/2 text-[15px] peer-focus:top-4 peer-[:not(:placeholder-shown)]:top-4"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

/**
 * Short quote form, used on service pages (service fixed) and on the homepage (service picked
 * from a list). Deliberately few fields: on an ad landing page every extra field costs
 * conversions, and the team calls back to qualify anyway.
 */
export function ServiceQuoteCard({
  serviceTitle,
  apiCategory,
  anchorId = "contact",
  trackingLocation = "service-quote-card",
}: {
  /** Omit both to let the visitor choose the service. */
  serviceTitle?: string;
  apiCategory?: string;
  /** Element id the "Devis gratuit" links scroll to; null when the surrounding section already has it. */
  anchorId?: string | null;
  trackingLocation?: string;
}) {
  const { submitQuoteRequest, isSubmitting } = useQuoteRequests();
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const [firstName, ...rest] = String(form.get("name")).trim().split(/\s+/);
    const message = String(form.get("message") || "").trim();
    const type = apiCategory ?? String(form.get("service") || "autre");
    const typeLabel = serviceTitle ?? serviceLinks.find((s) => s.slug === type)?.title ?? "Travaux";

    const { success } = await submitQuoteRequest({
      first_name: firstName,
      last_name: rest.join(" ") || "-",
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      project_type: type,
      message: message || `Demande de devis — ${typeLabel}`,
    });
    if (success) setSent(true);
  };

  return (
    <div id={anchorId ?? undefined} className="scroll-mt-24 rounded-3xl bg-neutral-950 p-6 text-white shadow-2xl md:p-7">
      {sent ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-sky-400" />
          <p className="text-lg font-bold">Demande envoyée !</p>
          <p className="mt-2 text-sm text-neutral-400">Nous vous rappelons sous 24 h ouvrées.</p>
        </div>
      ) : (
        <>
          <p className="text-xl font-bold">Devis gratuit</p>
          <p className="mb-5 text-sm text-neutral-400">{serviceTitle ? `${serviceTitle} · ` : ""}réponse sous 24 h</p>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!apiCategory && (
              <fieldset>
                <legend className="mb-2 text-sm text-neutral-400">Type de travaux</legend>
                <div className="flex flex-wrap gap-2">
                  {[...serviceLinks.map((s) => ({ value: s.slug as string, label: s.title as string })), { value: "autre", label: "Autre" }].map((o) => (
                    <label key={o.value} className="cursor-pointer">
                      <input type="radio" name="service" value={o.value} required className="peer sr-only" />
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-neutral-300 transition hover:border-white/25 hover:text-white active:scale-[0.97] peer-checked:border-sky-400 peer-checked:bg-sky-400 peer-checked:font-semibold peer-checked:text-neutral-950 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400/60">
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <Field icon={User} label="Nom et prénom" name="name" required maxLength={200} autoComplete="name" />
            <Field icon={PhoneIcon} label="Téléphone" name="phone" required type="tel" maxLength={20} autoComplete="tel" />
            <Field icon={EnvelopeSimple} label="Email" name="email" required type="email" maxLength={255} autoComplete="email" />
            <Field icon={ChatText} label="Votre projet en quelques mots (facultatif)" name="message" multiline rows={3} maxLength={2000} />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-xl bg-sky-400 text-base font-semibold text-neutral-950 transition hover:bg-sky-300 active:scale-[0.99]"
            >
              {isSubmitting ? "Envoi…" : "Être rappelé"}
            </Button>
            <PrivacyNotice className="text-neutral-500" />
          </form>
        </>
      )}
      <a
        href={COMPANY_INFO.phoneHref}
        onClick={() => trackPhoneClick(trackingLocation)}
        className="mt-5 flex items-center justify-center gap-2 border-t border-neutral-800 pt-5 text-sm text-neutral-300 hover:text-white"
      >
        <Phone className="h-4 w-4 text-sky-400" />
        Ou appelez-nous : <span className="font-bold text-white">{COMPANY_INFO.phone}</span>
      </a>
    </div>
  );
}
