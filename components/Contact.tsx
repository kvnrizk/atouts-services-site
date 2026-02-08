"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import type { QuoteRequest } from "@/types/api";

export const Contact = () => {
  const { submitQuoteRequest, isSubmitting } = useQuoteRequests();
  const [formData, setFormData] = useState<QuoteRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    project_type: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submitQuoteRequest(formData);

    if (result.success) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        project_type: "",
        message: "",
      });
    }
  };

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

          <Card className="border-0 shadow-elegant hover-lift">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Demande de devis</h3>
              <p className="text-gray-600 mb-6">
                Décrivez votre projet, nous vous répondons rapidement. Sans engagement.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01 XX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de projet</label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un service</option>
                    <option value="peinture">Peinture</option>
                    <option value="renovation">Rénovation</option>
                    <option value="electricite">Électricité</option>
                    <option value="salles-de-bains">Salle de bain</option>
                    <option value="revetements-sol">Revêtement de sol</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Décrivez votre projet *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre projet en quelques mots..."
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary hover:opacity-90 text-white py-3 shadow-elegant transition-all"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Champs obligatoires
                </p>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Vous préférez nous appeler ?{' '}
                    <a
                      href="tel:+33XXXXXXXXX"
                      className="text-primary font-semibold hover:underline"
                    >
                      01 XX XX XX XX
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
