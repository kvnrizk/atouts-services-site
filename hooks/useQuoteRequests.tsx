"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, endpoints } from "@/lib/api";
import { trackQuoteRequest, getUtmParams } from "@/lib/analytics";
import type { QuoteRequest } from "@/types/api";

export const useQuoteRequests = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitQuoteRequest = async (data: QuoteRequest) => {
    setIsSubmitting(true);

    try {
      const utmParams = getUtmParams();
      const payload = { ...data, ...utmParams };
      await apiClient.post(endpoints.quoteRequests.create, payload);

      trackQuoteRequest(data.project_type || "non-specifie");

      toast({
        title: "Demande envoyée !",
        description: "Nous vous contacterons dans les plus brefs délais.",
      });

      return { success: true };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting quote request:', error);
      }

      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuoteRequest,
    isSubmitting,
  };
};
