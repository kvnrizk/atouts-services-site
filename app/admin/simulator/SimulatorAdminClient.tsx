"use client";

import { useEffect, useState } from "react";
import { apiClient, endpoints } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Eye, EyeOff, Calculator, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PriceReference, Estimation, EstimationStats } from "@/types/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CATEGORIES = [
  { value: "peinture", label: "Peinture" },
  { value: "renovation", label: "Renovation" },
  { value: "electricite", label: "Electricite" },
  { value: "salles-de-bains", label: "Salle de bain" },
  { value: "revetements-sol", label: "Revetement de sol" },
];

const UNITS = [
  { value: "m2", label: "m2" },
  { value: "ml", label: "ml" },
  { value: "unite", label: "unite" },
  { value: "forfait", label: "forfait" },
];

function SimulatorAdminContent() {
  const [activeTab, setActiveTab] = useState<"prices" | "leads">("prices");
  const [priceRefs, setPriceRefs] = useState<PriceReference[]>([]);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [stats, setStats] = useState<EstimationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceReference | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: "peinture",
    workItem: "",
    label: "",
    unit: "m2",
    priceLow: 0,
    priceMid: 0,
    priceHigh: 0,
    active: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [refs, ests, st] = await Promise.all([
        apiClient.get(endpoints.priceReferences.adminAll),
        apiClient.get(endpoints.estimations.adminAll),
        apiClient.get(endpoints.estimations.stats),
      ]);
      setPriceRefs(refs);
      setEstimations(ests);
      setStats(st);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les donnees", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await apiClient.patch(endpoints.priceReferences.update(editingItem.id!), formData);
        toast({ title: "Succes", description: "Tarif mis a jour" });
      } else {
        await apiClient.post(endpoints.priceReferences.create, formData);
        toast({ title: "Succes", description: "Tarif ajoute" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce tarif ?")) return;
    try {
      await apiClient.delete(endpoints.priceReferences.delete(id));
      toast({ title: "Succes", description: "Tarif supprime" });
      fetchData();
    } catch {
      toast({ title: "Erreur", description: "Echec de la suppression", variant: "destructive" });
    }
  };

  const handleToggleActive = async (item: PriceReference) => {
    try {
      await apiClient.patch(endpoints.priceReferences.update(item.id!), { active: !item.active });
      toast({ title: "Succes", description: item.active ? "Tarif desactive" : "Tarif active" });
      fetchData();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const openEditDialog = (item: PriceReference) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      workItem: item.workItem,
      label: item.label,
      unit: item.unit,
      priceLow: item.priceLow,
      priceMid: item.priceMid,
      priceHigh: item.priceHigh,
      active: item.active ?? true,
      sortOrder: item.sortOrder ?? 0,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      category: "peinture",
      workItem: "",
      label: "",
      unit: "m2",
      priceLow: 0,
      priceMid: 0,
      priceHigh: 0,
      active: true,
      sortOrder: 0,
    });
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  // Group price refs by category
  const groupedRefs = CATEGORIES.map((cat) => ({
    ...cat,
    items: priceRefs.filter((r) => r.category === cat.value),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulateur de prix</h1>
          <p className="text-gray-600 mt-2">Gerez les tarifs de reference et consultez les leads</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Simulations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.withContact}</p>
                <p className="text-sm text-gray-500">Leads captures</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                <p className="text-sm text-gray-500">Taux de conversion</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatPrice(stats.avgEstimate)}</p>
                <p className="text-sm text-gray-500">Estimation moyenne</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "prices" ? "default" : "outline"}
          onClick={() => setActiveTab("prices")}
        >
          Tarifs de reference
        </Button>
        <Button
          variant={activeTab === "leads" ? "default" : "outline"}
          onClick={() => setActiveTab("leads")}
        >
          Leads simulateur ({estimations.filter((e) => e.email).length})
        </Button>
      </div>

      {/* Prices tab */}
      {activeTab === "prices" && (
        <div>
          <div className="flex justify-end mb-4">
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un tarif
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Modifier le tarif" : "Ajouter un tarif"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categorie *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Unite *</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        {UNITS.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Identifiant technique *</label>
                    <Input
                      value={formData.workItem}
                      onChange={(e) => setFormData({ ...formData, workItem: e.target.value })}
                      placeholder="Ex: murs_2_couches"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Libelle affiche *</label>
                    <Input
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Ex: Peinture murs - 2 couches"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prix bas (EUR)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.priceLow}
                        onChange={(e) => setFormData({ ...formData, priceLow: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prix moyen (EUR)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.priceMid}
                        onChange={(e) => setFormData({ ...formData, priceMid: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prix haut (EUR)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.priceHigh}
                        onChange={(e) => setFormData({ ...formData, priceHigh: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ordre d&apos;affichage</label>
                      <Input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center gap-2 pb-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="active" className="text-sm font-medium">Actif</label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting} className="flex-1 gradient-primary text-white">
                      {isSubmitting ? "Enregistrement..." : editingItem ? "Mettre a jour" : "Ajouter"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {groupedRefs.map((group) => (
            <div key={group.value} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{group.label}</h3>
              {group.items.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun tarif</p>
              ) : (
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.active ? "border-gray-200" : "border-gray-100 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500">
                          {item.workItem} | {formatPrice(item.priceLow)} - {formatPrice(item.priceMid)} - {formatPrice(item.priceHigh)} / {item.unit}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleToggleActive(item)}>
                          {item.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leads tab */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          {estimations.filter((e) => e.email).length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Aucun lead pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            estimations
              .filter((e) => e.email)
              .map((est) => (
                <Card key={est.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {est.firstName} {est.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {est.createdAt && format(new Date(est.createdAt), "PPP", { locale: fr })}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {CATEGORIES.find((c) => c.value === est.category)?.label || est.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email</span>
                        <p className="font-medium">{est.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Telephone</span>
                        <p className="font-medium">{est.phone || "-"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Surface</span>
                        <p className="font-medium">{est.surfaceArea} m2</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estimation</span>
                        <p className="font-medium">
                          {formatPrice(est.totalLow)} - {formatPrice(est.totalHigh)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
}

export default function SimulatorAdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <SimulatorAdminContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
