"use client";

import { useEffect, useState } from "react";
import { apiClient, endpoints, API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Upload, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CityPage } from "@/types/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function CityPagesContent() {
  const [pages, setPages] = useState<CityPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CityPage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cityName: "",
    slug: "",
    department: "",
    postalCode: "",
    content: "",
    heroImageUrl: "",
    metaTitle: "",
    metaDescription: "",
    published: false,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await apiClient.get(endpoints.cityPages.adminAll);
      setPages(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les pages villes", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L\u2019image ne doit pas d\u00e9passer 5MB", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const response = await fetch(`${API_URL}${endpoints.upload.image}`, {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setFormData((prev) => ({ ...prev, heroImageUrl: `${API_URL}${data.url}` }));
      toast({ title: "Succ\u00e8s", description: "Image t\u00e9l\u00e9charg\u00e9e" });
    } catch {
      toast({ title: "Erreur", description: "\u00c9chec du t\u00e9l\u00e9chargement", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCityNameChange = (cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      cityName,
      slug: editingItem ? prev.slug : slugify(cityName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await apiClient.patch(endpoints.cityPages.update(editingItem.id!), formData);
        toast({ title: "Succ\u00e8s", description: "Page ville mise \u00e0 jour" });
      } else {
        await apiClient.post(endpoints.cityPages.create, formData);
        toast({ title: "Succ\u00e8s", description: "Page ville cr\u00e9\u00e9e" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("\u00cates-vous s\u00fbr de vouloir supprimer cette page ?")) return;
    try {
      await apiClient.delete(endpoints.cityPages.delete(id));
      toast({ title: "Succ\u00e8s", description: "Page supprim\u00e9e" });
      fetchPages();
    } catch {
      toast({ title: "Erreur", description: "\u00c9chec de la suppression", variant: "destructive" });
    }
  };

  const handleTogglePublished = async (item: CityPage) => {
    try {
      await apiClient.patch(endpoints.cityPages.update(item.id!), { published: !item.published });
      toast({ title: "Succ\u00e8s", description: item.published ? "Page masqu\u00e9e" : "Page publi\u00e9e" });
      fetchPages();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const openEditDialog = (item: CityPage) => {
    setEditingItem(item);
    setFormData({
      cityName: item.cityName,
      slug: item.slug,
      department: item.department || "",
      postalCode: item.postalCode || "",
      content: item.content,
      heroImageUrl: item.heroImageUrl || "",
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      published: item.published ?? false,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      cityName: "", slug: "", department: "", postalCode: "", content: "",
      heroImageUrl: "", metaTitle: "", metaDescription: "", published: false,
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Pages villes</h1>
          <p className="text-gray-600 mt-2">G\u00e9rez vos pages de r\u00e9f\u00e9rencement local</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle page ville
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Modifier la page" : "Nouvelle page ville"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom de la ville *</label>
                  <Input value={formData.cityName} onChange={(e) => handleCityNameChange(e.target.value)} placeholder="Issy-les-Moulineaux" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="issy-les-moulineaux" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">D\u00e9partement</label>
                  <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Hauts-de-Seine" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code postal</label>
                  <Input value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} placeholder="92130" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenu (Markdown) *</label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Contenu de la page ville en Markdown..." rows={10} className="font-mono text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image hero</label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  {isUploading && (<p className="text-sm text-gray-500 flex items-center gap-2"><Upload className="h-4 w-4 animate-pulse" />T\u00e9l\u00e9chargement...</p>)}
                  {formData.heroImageUrl && (<img src={formData.heroImageUrl} alt="Preview" className="w-full h-48 object-cover rounded-md" />)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta titre (SEO)</label>
                  <Input value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} placeholder="R\u00e9novation \u00e0 Issy-les-Moulineaux" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta description (SEO)</label>
                  <Input value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} placeholder="Description pour Google..." />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="rounded" />
                <label htmlFor="published" className="text-sm font-medium">Publier sur le site</label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting || !formData.cityName || !formData.content} className="flex-1 gradient-primary text-white">
                  {isSubmitting ? "Enregistrement..." : editingItem ? "Mettre \u00e0 jour" : "Cr\u00e9er"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {pages.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucune page ville</p><p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Nouvelle page ville&quot; pour commencer</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift">
              {item.heroImageUrl && (
                <img src={item.heroImageUrl} alt={item.cityName} className="w-full h-40 object-cover" />
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.cityName}</h3>
                    {item.department && <p className="text-sm text-gray-500">{item.department} ({item.postalCode})</p>}
                  </div>
                  {!item.published && (<span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Brouillon</span>)}
                </div>
                <p className="text-sm text-gray-400 mt-1">/{item.slug}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(item)} className="flex-1"><Edit className="h-4 w-4 mr-1" />Modifier</Button>
                  <Button size="sm" variant="outline" onClick={() => handleTogglePublished(item)}>{item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CityPagesAdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CityPagesContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
