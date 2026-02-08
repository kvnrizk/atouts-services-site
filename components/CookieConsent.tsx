"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * CNIL-compliant cookie consent banner.
 * Plausible Analytics is actually cookie-free and CNIL-exempt,
 * but we show a minimal banner for transparency and best practice.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 md:p-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl">
        <p className="text-sm text-gray-600 text-center sm:text-left">
          Ce site utilise des outils d&apos;analyse respectueux de votre vie privée pour
          améliorer votre expérience. Aucun cookie publicitaire n&apos;est utilisé.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={decline}>
            Refuser
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={accept}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
