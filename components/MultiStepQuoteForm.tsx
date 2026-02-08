"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Paintbrush,
  Wrench,
  Zap,
  ShowerHead,
  Layers,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle,
} from "lucide-react";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { trackEvent } from "@/lib/analytics";

const SERVICES = [
  { value: "peinture", label: "Peinture", icon: Paintbrush, desc: "Intérieure et extérieure" },
  { value: "renovation", label: "Rénovation", icon: Wrench, desc: "Appartement ou maison" },
  { value: "electricite", label: "Électricité", icon: Zap, desc: "Installation et mise aux normes" },
  { value: "salles-de-bains", label: "Salle de bain", icon: ShowerHead, desc: "Création et rénovation" },
  { value: "revetements-sol", label: "Revêtement de sol", icon: Layers, desc: "Parquet, carrelage, vinyle" },
] as const;

const STATES = [
  { value: "bon_etat", label: "Bon état", desc: "Quelques retouches à faire" },
  { value: "a_rafraichir", label: "À rafraîchir", desc: "Peinture défraîchie, petits défauts" },
  { value: "a_renover", label: "À rénover", desc: "Rénovation complète nécessaire" },
];

const TIMELINES = [
  { value: "urgent", label: "Urgent (< 1 mois)" },
  { value: "1-3-mois", label: "1 à 3 mois" },
  { value: "3-6-mois", label: "3 à 6 mois" },
  { value: "flexible", label: "Flexible" },
];

interface FormData {
  project_type: string;
  surface_area: string;
  rooms: string;
  current_state: string;
  desired_timeline: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}

export function MultiStepQuoteForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { submitQuoteRequest, isSubmitting } = useQuoteRequests();
  const [formData, setFormData] = useState<FormData>({
    project_type: "",
    surface_area: "",
    rooms: "",
    current_state: "",
    desired_timeline: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    trackEvent("Quote Form Step", { step: String(step + 1) });
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const result = await submitQuoteRequest(formData);
    if (result.success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Demande envoyée !</h3>
          <p className="text-gray-600 mb-2">
            Merci {formData.first_name}, nous avons bien reçu votre demande.
          </p>
          <p className="text-gray-600">
            Un membre de notre équipe vous recontactera <strong>sous 24 heures</strong>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <button
              onClick={() => s < step && setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              } ${s < step ? "cursor-pointer hover:bg-blue-700" : ""}`}
              disabled={s >= step}
            >
              {s}
            </button>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  s < step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 text-center mb-6">
        {step === 1 && "Type de projet"}
        {step === 2 && "Détails du projet"}
        {step === 3 && "Vos coordonnées"}
        {step === 4 && "Message & envoi"}
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          {/* Step 1: Service type */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quel type de travaux souhaitez-vous ?
              </h3>
              <p className="text-gray-600 mb-6">Sélectionnez le service qui correspond à votre projet</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  const selected = formData.project_type === service.value;
                  return (
                    <button
                      key={service.value}
                      onClick={() => updateField("project_type", service.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${selected ? "text-blue-600" : "text-gray-400"}`} />
                      <div className="font-semibold text-gray-900">{service.label}</div>
                      <div className="text-sm text-gray-500">{service.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Project details */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Détails de votre projet
              </h3>
              <p className="text-gray-600 mb-6">Ces informations nous aident à préparer votre devis</p>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface approximative (m²)
                    </label>
                    <Input
                      type="number"
                      value={formData.surface_area}
                      onChange={(e) => updateField("surface_area", e.target.value)}
                      placeholder="Ex: 70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de pièces
                    </label>
                    <Input
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => updateField("rooms", e.target.value)}
                      placeholder="Ex: 3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État actuel
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STATES.map((state) => {
                      const selected = formData.current_state === state.value;
                      return (
                        <button
                          key={state.value}
                          onClick={() => updateField("current_state", state.value)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            selected
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="font-medium text-gray-900 text-sm">{state.label}</div>
                          <div className="text-xs text-gray-500">{state.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Délai souhaité
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {TIMELINES.map((tl) => {
                      const selected = formData.desired_timeline === tl.value;
                      return (
                        <button
                          key={tl.value}
                          onClick={() => updateField("desired_timeline", tl.value)}
                          className={`p-3 rounded-lg border-2 text-center transition-all text-sm ${
                            selected
                              ? "border-blue-600 bg-blue-50 font-semibold"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          {tl.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact info */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Vos coordonnées
              </h3>
              <p className="text-gray-600 mb-6">Pour que nous puissions vous recontacter</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => updateField("first_name", e.target.value)}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => updateField("last_name", e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="06 XX XX XX XX"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Message */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Décrivez votre projet
              </h3>
              <p className="text-gray-600 mb-6">Ajoutez les détails qui nous aideront à préparer votre devis</p>
              <Textarea
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Décrivez votre projet en quelques mots : travaux souhaités, contraintes particulières, budget approximatif..."
                rows={6}
                required
              />

              {/* Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Récapitulatif</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Service</div>
                  <div className="text-gray-900 font-medium">
                    {SERVICES.find((s) => s.value === formData.project_type)?.label || "Non spécifié"}
                  </div>
                  {formData.surface_area && (
                    <>
                      <div className="text-gray-500">Surface</div>
                      <div className="text-gray-900">{formData.surface_area} m²</div>
                    </>
                  )}
                  {formData.rooms && (
                    <>
                      <div className="text-gray-500">Pièces</div>
                      <div className="text-gray-900">{formData.rooms}</div>
                    </>
                  )}
                  <div className="text-gray-500">Contact</div>
                  <div className="text-gray-900">{formData.first_name} {formData.last_name}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && !formData.project_type}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.first_name || !formData.email || !formData.phone || !formData.message}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 text-center mt-4">
        Devis gratuit et sans engagement
      </p>
    </div>
  );
}
