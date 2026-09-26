"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient, endpoints } from "@/lib/api";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  // Newsletter = marketing: RGPD requires a free, explicit, unticked opt-in
  const [consent, setConsent] = useState(false);
  const t = useTranslations("privacyNotice");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setStatus("loading");
    try {
      const result = await apiClient.post(endpoints.newsletter.subscribe, { email });
      setStatus("success");
      setMessage(result?.message || "Inscription réussie !");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Newsletter</h2>
      <p className="mt-2 mb-4 font-semibold text-neutral-950">
        Recevez nos conseils rénovation chaque mois
      </p>

      {status === "success" ? (
        <div className="rounded-lg bg-white p-4 text-center ring-1 ring-sky-200">
          <p className="text-sm font-medium text-neutral-950">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full rounded-md bg-white px-4 py-3 text-sm text-neutral-950 ring-1 ring-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
          <label className="mb-3 flex cursor-pointer items-start gap-2 text-xs text-neutral-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-sky-500"
            />
            <span>
              {t("newsletterConsent")}{" "}
              <Link href="/politique-de-confidentialite" className="underline">{t("link")}</Link>
            </span>
          </label>
          <Button
            type="submit"
            className="w-full bg-neutral-950 font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
            disabled={status === "loading" || !consent}
          >
            {status === "loading" ? "Inscription..." : "S'abonner"}
          </Button>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-600" role="alert">{message}</p>
          )}
        </form>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        Gratuit &bull; Sans spam &bull; Désabonnement facile
      </p>
    </div>
  );
}
