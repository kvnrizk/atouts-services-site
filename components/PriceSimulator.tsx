"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Calculator,
  Minus,
  Plus as PlusIcon,
  Download,
} from "lucide-react";
import { apiClient, endpoints, API_URL } from "@/lib/api";
import { trackEvent, trackSimulatorStart, trackSimulatorComplete, getUtmParams } from "@/lib/analytics";
import type { PriceReference, EstimationResult } from "@/types/api";

const SERVICES = [
  { value: "peinture", label: "Peinture", icon: Paintbrush, desc: "Interieure et exterieure" },
  { value: "renovation", label: "Renovation", icon: Wrench, desc: "Appartement ou maison" },
  { value: "electricite", label: "Electricite", icon: Zap, desc: "Installation et mise aux normes" },
  { value: "salles-de-bains", label: "Salle de bain", icon: ShowerHead, desc: "Creation et renovation" },
  { value: "revetements-sol", label: "Revetement de sol", icon: Layers, desc: "Parquet, carrelage, vinyle" },
] as const;

const QUALITY_LEVELS = [
  { value: "eco", label: "Eco", desc: "Materiaux economiques, bon rapport qualite-prix", multiplier: "x0.85" },
  { value: "standard", label: "Standard", desc: "Materiaux de qualite moyenne, le meilleur compromis", multiplier: "x1.0" },
  { value: "premium", label: "Premium", desc: "Materiaux haut de gamme, finitions soignees", multiplier: "x1.3" },
];

interface SelectedItem {
  workItem: string;
  quantity: number;
}

export function PriceSimulator() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [qualityLevel, setQualityLevel] = useState("standard");
  const [priceRefs, setPriceRefs] = useState<PriceReference[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [isLoadingRefs, setIsLoadingRefs] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  useEffect(() => {
    trackSimulatorStart();
  }, []);

  const fetchPriceRefs = useCallback(async (cat: string) => {
    setIsLoadingRefs(true);
    try {
      const rawData = await apiClient.get(endpoints.priceReferences.getByCategory(cat));
      // Deduplicate by workItem (keep first occurrence)
      const seen = new Set<string>();
      const data = (rawData as PriceReference[]).filter((ref) => {
        if (seen.has(ref.workItem)) return false;
        seen.add(ref.workItem);
        return true;
      });
      setPriceRefs(data);
      // Pre-select all items with default quantities based on surface
      const surface = parseFloat(surfaceArea) || 50;
      const items: SelectedItem[] = data.map((ref) => ({
        workItem: ref.workItem,
        quantity: ref.unit === "forfait" ? 1 : ref.unit === "unite" ? 5 : ref.unit === "ml" ? Math.round(surface * 0.5) : surface,
      }));
      setSelectedItems(items);
    } catch {
      setPriceRefs([]);
    } finally {
      setIsLoadingRefs(false);
    }
  }, [surfaceArea]);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    trackEvent("Simulator Step", { step: "1", category: cat });
  };

  const goToStep2 = () => {
    setStep(2);
    fetchPriceRefs(category);
    trackEvent("Simulator Step", { step: "2" });
  };

  const goToStep3 = async () => {
    setIsCalculating(true);
    trackEvent("Simulator Step", { step: "3" });
    try {
      const utm = getUtmParams();
      const payload = {
        category,
        surfaceArea: parseFloat(surfaceArea) || 50,
        rooms: rooms ? parseInt(rooms) : undefined,
        qualityLevel,
        selectedItems: selectedItems.filter((i) => i.quantity > 0),
        ...utm,
      };
      const data = await apiClient.post(endpoints.estimations.calculate, payload);
      setResult(data);
      setStep(3);
    } catch {
      // Show error
    } finally {
      setIsCalculating(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!result?.sessionId || !contact.firstName || !contact.email) return;
    setIsSubmittingContact(true);
    try {
      await apiClient.patch(endpoints.estimations.captureContact(result.sessionId), contact);
      setContactSubmitted(true);
      trackSimulatorComplete();
    } catch {
      // Error
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result?.sessionId) return;
    try {
      const response = await fetch(`${API_URL}${endpoints.estimations.downloadPdf(result.sessionId)}`);
      if (!response.ok) throw new Error("PDF download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estimation-atouts-services.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silent fail
    }
  };

  const toggleItem = (workItem: string) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.workItem === workItem);
      if (existing) {
        return prev.filter((i) => i.workItem !== workItem);
      }
      const ref = priceRefs.find((r) => r.workItem === workItem);
      if (!ref) return prev;
      const surface = parseFloat(surfaceArea) || 50;
      const qty = ref.unit === "forfait" ? 1 : ref.unit === "unite" ? 5 : ref.unit === "ml" ? Math.round(surface * 0.5) : surface;
      return [...prev, { workItem, quantity: qty }];
    });
  };

  const updateQuantity = (workItem: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.workItem === workItem ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      )
    );
  };

  const formatPrice = (n: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Success state
  if (contactSubmitted && result) {
    return (
      <Card className="border-0 shadow-lg max-w-3xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Estimation envoyee !</h3>
          <p className="text-gray-600 mb-6">
            Merci {contact.firstName}, votre estimation a ete enregistree.
            Un conseiller vous recontactera pour affiner votre projet.
          </p>
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-blue-700 mb-2">Estimation pour votre projet</p>
            <p className="text-4xl font-bold text-blue-900">{formatPrice(result.totalMid)}</p>
            <p className="text-sm text-blue-600 mt-1">
              Fourchette : {formatPrice(result.totalLow)} - {formatPrice(result.totalHigh)}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Telecharger le PDF
            </Button>
            <Button
              onClick={() => window.location.href = "/#contact"}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Demander un devis formel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <button
              onClick={() => s < step && setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              } ${s < step ? "cursor-pointer hover:bg-blue-700" : ""}`}
              disabled={s >= step}
            >
              {s}
            </button>
            {s < 4 && (
              <div className={`flex-1 h-1 mx-2 rounded ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 text-center mb-6">
        {step === 1 && "Type de travaux"}
        {step === 2 && "Details et prestations"}
        {step === 3 && "Votre estimation"}
        {step === 4 && "Vos coordonnees"}
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          {/* Step 1: Service type */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quel type de travaux souhaitez-vous estimer ?
              </h3>
              <p className="text-gray-600 mb-6">Selectionnez le service pour obtenir une estimation</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  const selected = category === service.value;
                  return (
                    <button
                      key={service.value}
                      onClick={() => handleCategorySelect(service.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
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

          {/* Step 2: Details + work items */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Details de votre projet
              </h3>
              <p className="text-gray-600 mb-6">Ajustez les parametres pour affiner l&apos;estimation</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface approximative (m2)
                  </label>
                  <Input
                    type="number"
                    value={surfaceArea}
                    onChange={(e) => setSurfaceArea(e.target.value)}
                    placeholder="Ex: 50"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de pieces
                  </label>
                  <Input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    placeholder="Ex: 3"
                    min="1"
                  />
                </div>
              </div>

              {/* Quality level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de qualite
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {QUALITY_LEVELS.map((q) => {
                    const selected = qualityLevel === q.value;
                    return (
                      <button
                        key={q.value}
                        onClick={() => setQualityLevel(q.value)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900 text-sm">{q.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{q.desc}</div>
                        <div className="text-xs font-mono text-blue-600 mt-1">{q.multiplier}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Work items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prestations souhaitees
                </label>
                {isLoadingRefs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {priceRefs.map((ref) => {
                      const item = selectedItems.find((i) => i.workItem === ref.workItem);
                      const isSelected = !!item;
                      return (
                        <div
                          key={ref.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            isSelected ? "border-blue-300 bg-blue-50/50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItem(ref.workItem)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{ref.label}</div>
                              <div className="text-xs text-gray-500">
                                {formatPrice(ref.priceLow)} - {formatPrice(ref.priceHigh)} / {ref.unit}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(ref.workItem, ref.unit === "forfait" ? -1 : -5)}
                                className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium w-12 text-center">
                                {item.quantity} {ref.unit === "m2" ? "m2" : ref.unit === "ml" ? "ml" : ""}
                              </span>
                              <button
                                onClick={() => updateQuantity(ref.workItem, ref.unit === "forfait" ? 1 : 5)}
                                className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <div>
              <div className="text-center mb-8">
                <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Votre estimation
                </h3>
                <p className="text-gray-600">Pour votre projet de {SERVICES.find((s) => s.value === category)?.label.toLowerCase()}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white mb-8">
                <p className="text-blue-200 text-sm mb-1">Estimation</p>
                <p className="text-5xl font-bold mb-2">{formatPrice(result.totalMid)}</p>
                <p className="text-blue-200">
                  Fourchette : {formatPrice(result.totalLow)} - {formatPrice(result.totalHigh)}
                </p>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Detail par prestation</h4>
                <div className="space-y-2">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.label} ({item.quantity} {item.unit})
                      </span>
                      <span className="font-medium text-gray-900">{formatPrice(item.totalMid)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(result.totalMid)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mb-4">
                * Estimation indicative basee sur nos tarifs moyens. Le prix final depend du diagnostic sur place.
              </p>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recevez votre estimation detaillee
              </h3>
              <p className="text-gray-600 mb-6">
                Laissez vos coordonnees pour qu&apos;un conseiller vous recontacte avec une estimation personnalisee.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prenom *</label>
                    <Input
                      value={contact.firstName}
                      onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))}
                      placeholder="Votre prenom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <Input
                      value={contact.lastName}
                      onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telephone</label>
                  <Input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="06 XX XX XX XX"
                  />
                </div>
              </div>

              {/* Mini summary */}
              {result && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Votre estimation</span>
                    <span className="text-lg font-bold text-blue-900">{formatPrice(result.totalMid)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Precedent
              </Button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <Button
                onClick={goToStep2}
                disabled={!category}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={goToStep3}
                disabled={isCalculating || selectedItems.filter((i) => i.quantity > 0).length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calcul en cours...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculer mon estimation
                  </>
                )}
              </Button>
            )}

            {step === 3 && (
              <Button
                onClick={() => { setStep(4); trackEvent("Simulator Step", { step: "4" }); }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Obtenir mon estimation detaillee
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {step === 4 && (
              <Button
                onClick={handleContactSubmit}
                disabled={isSubmittingContact || !contact.firstName || !contact.email}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmittingContact ? "Envoi en cours..." : "Recevoir mon estimation"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 text-center mt-4">
        Estimation gratuite et sans engagement
      </p>
    </div>
  );
}
