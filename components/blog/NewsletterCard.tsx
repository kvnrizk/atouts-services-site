"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient, endpoints } from "@/lib/api";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6">
      <h3 className="font-bold text-xl mb-2">Newsletter</h3>
      <p className="text-white/90 text-sm mb-4">
        Recevez nos conseils rénovation chaque mois
      </p>

      {status === "success" ? (
        <div className="bg-white/20 rounded-lg p-4 text-center">
          <p className="text-sm font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg mb-3 text-gray-900 text-sm"
            required
          />
          <Button
            type="submit"
            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-medium"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Inscription..." : "S'abonner"}
          </Button>
          {status === "error" && (
            <p className="text-xs text-red-200 mt-2">{message}</p>
          )}
        </form>
      )}

      <p className="text-xs text-white/70 mt-3">
        Gratuit &bull; Sans spam &bull; Désabonnement facile
      </p>
    </div>
  );
}
