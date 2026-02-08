"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { MultiStepQuoteForm } from "@/components/MultiStepQuoteForm";
import { trackPhoneClick } from "@/lib/analytics";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Parlons de votre projet ! Devis gratuit sous 24h
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Adresse</h4>
                    <p className="text-gray-600">Issy-les-Moulineaux<br />Hauts-de-Seine (92)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Téléphone</h4>
                    <a
                      href="tel:+33XXXXXXXXX"
                      onClick={() => trackPhoneClick("contact")}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      01 XX XX XX XX
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Cliquez pour appeler</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <a
                      href="mailto:contact@atouts-services.fr"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      contact@atouts-services.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Horaires</h4>
                    <p className="text-gray-600">
                      Lun - Ven: 8h00 - 18h00<br />
                      Sam: 9h00 - 17h00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="gradient-primary text-white border-0 shadow-elegant">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-2">Zone d&apos;intervention</h4>
                <p className="text-white/90">
                  Nous intervenons dans tout le département des Hauts-de-Seine et Paris :
                  Issy-les-Moulineaux, Boulogne-Billancourt, Meudon, Sèvres, Vanves,
                  Clamart et communes limitrophes.
                </p>
              </CardContent>
            </Card>
          </div>

          <MultiStepQuoteForm />
        </div>
      </div>
    </section>
  );
};
