"use client";

import { useState } from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { trackPhoneClick } from "@/lib/analytics";
import { COMPANY_INFO } from "@/lib/constants";

const inputClass =
  "w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400";

/**
 * Short quote form pinned next to the service page content.
 * Deliberately fewer fields than the homepage multi-step form: on an ad landing page
 * every extra field costs conversions, and the team calls back to qualify anyway.
 */
export function ServiceQuoteCard({ serviceTitle, apiCategory }: { serviceTitle: string; apiCategory: string }) {
  const { submitQuoteRequest, isSubmitting } = useQuoteRequests();
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const [firstName, ...rest] = String(form.get("name")).trim().split(/\s+/);
    const message = String(form.get("message") || "").trim();

    const { success } = await submitQuoteRequest({
      first_name: firstName,
      last_name: rest.join(" ") || "-",
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      project_type: apiCategory,
      message: message || `Demande de devis — ${serviceTitle}`,
    });
    if (success) setSent(true);
  };

  return (
    <div id="contact" className="scroll-mt-24 rounded-2xl bg-neutral-950 p-6 text-white shadow-2xl">
      {sent ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-sky-400" />
          <p className="text-lg font-bold">Demande envoyée !</p>
          <p className="mt-2 text-sm text-neutral-400">Nous vous rappelons sous 24 h ouvrées.</p>
        </div>
      ) : (
        <>
          <p className="text-xl font-bold">Devis gratuit</p>
          <p className="mb-5 text-sm text-neutral-400">{serviceTitle} · réponse sous 24 h</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" required maxLength={200} autoComplete="name" placeholder="Nom et prénom" aria-label="Nom et prénom" className={inputClass} />
            <input name="phone" required type="tel" maxLength={20} autoComplete="tel" placeholder="Téléphone" aria-label="Téléphone" className={inputClass} />
            <input name="email" required type="email" maxLength={255} autoComplete="email" placeholder="Email" aria-label="Email" className={inputClass} />
            <textarea name="message" rows={3} maxLength={2000} placeholder="Votre projet en quelques mots (facultatif)" aria-label="Votre projet" className={inputClass} />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-400 py-6 text-base font-semibold text-neutral-950 hover:bg-sky-300"
            >
              {isSubmitting ? "Envoi…" : "Être rappelé"}
            </Button>
          </form>
        </>
      )}
      <a
        href={COMPANY_INFO.phoneHref}
        onClick={() => trackPhoneClick("service-quote-card")}
        className="mt-5 flex items-center justify-center gap-2 border-t border-neutral-800 pt-5 text-sm text-neutral-300 hover:text-white"
      >
        <Phone className="h-4 w-4 text-sky-400" />
        Ou appelez-nous : <span className="font-bold text-white">{COMPANY_INFO.phone}</span>
      </a>
    </div>
  );
}
