"use client";

import { useState } from "react";
import { apiClient, endpoints } from "@/lib/api";

/**
 * Unsubscribing needs a click: email security scanners open links automatically,
 * so doing it on page load would unsubscribe people without them knowing.
 */
export function UnsubscribeClient({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const unsubscribe = async () => {
    setState("loading");
    try {
      const res = await apiClient.post(endpoints.newsletter.unsubscribe, { token });
      setMessage(res?.message ?? "Vous êtes désinscrit.");
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (!token) {
    return <p className="text-neutral-600">Lien de désinscription invalide. Utilisez le lien présent en bas de nos e-mails, ou écrivez-nous à atouts.services92@gmail.com.</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-neutral-950">Newsletter</h1>
      {state === "done" ? (
        <p className="mt-6 text-neutral-700">{message}</p>
      ) : (
        <>
          <p className="mt-4 text-neutral-600">Vous ne recevrez plus nos e-mails et votre adresse sera supprimée.</p>
          <button
            type="button"
            onClick={unsubscribe}
            disabled={state === "loading"}
            className="mt-8 rounded-md bg-neutral-950 px-6 py-3 font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {state === "loading" ? "…" : "Confirmer la désinscription"}
          </button>
          {state === "error" && (
            <p className="mt-4 text-sm text-red-600">Une erreur est survenue. Réessayez ou écrivez-nous à atouts.services92@gmail.com.</p>
          )}
        </>
      )}
    </>
  );
}
