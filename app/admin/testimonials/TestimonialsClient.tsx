"use client";

import { useEffect, useState } from "react";
import { apiClient, endpoints } from "@/lib/api";
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
import { Plus, Trash2, Edit, Star, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@/types/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useConfirm } from "@/components/admin/ConfirmDialog";

const projectTypes = [
  { value: "peinture", label: "Peinture" },
  { value: "renovation", label: "Rénovation" },
  { value: "electricite", label: "Électricité" },
  { value: "salles-de-bains", label: "Salle de bain" },
  { value: "revetements-sol", label: "Revêtement de sol" },
];

function TestimonialsContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const confirm = useConfirm();

  const [formData, setFormData] = useState({
    clientName: "",
    clientCity: "",
    rating: 5,
    comment: "",
    projectType: "peinture",
    published: true,
    featured: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await apiClient.get(endpoints.testimonials.adminAll);
      setTestimonials(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les avis", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await apiClient.patch(endpoints.testimonials.update(editingItem.id!), formData);
        toast({ title: "Succès", description: "Avis mis à jour" });
      } else {
        await apiClient.post(endpoints.testimonials.create, formData);
        toast({ title: "Succès", description: "Avis ajouté" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const testimonial = testimonials.find((t) => t.id === id);
    const ok = await confirm({
      title: "Supprimer cet avis ?",
      description: <>L&apos;avis de {testimonial?.clientName ?? "ce client"} sera définitivement supprimé.</>,
    });
    if (!ok) return;
    try {
      await apiClient.delete(endpoints.testimonials.delete(id));
      toast({ title: "Succès", description: "Avis supprimé" });
      fetchTestimonials();
    } catch {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  const handleTogglePublished = async (item: Testimonial) => {
    try {
      await apiClient.patch(endpoints.testimonials.update(item.id!), { published: !item.published });
      toast({ title: "Succès", description: item.published ? "Avis masqué" : "Avis publié" });
      fetchTestimonials();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const handleToggleFeatured = async (item: Testimonial) => {
    try {
      await apiClient.patch(endpoints.testimonials.update(item.id!), { featured: !item.featured });
      toast({ title: "Succès", description: item.featured ? "Retiré des favoris" : "Ajouté aux favoris" });
      fetchTestimonials();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const openEditDialog = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName,
      clientCity: item.clientCity || "",
      rating: item.rating,
      comment: item.comment,
      projectType: item.projectType || "peinture",
      published: item.published ?? true,
      featured: item.featured ?? false,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      clientName: "", clientCity: "", rating: 5, comment: "",
      projectType: "peinture", published: true, featured: false,
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
          <h1 className="text-3xl font-bold text-gray-900">Avis clients</h1>
          <p className="text-gray-600 mt-2">Gérez les témoignages clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel avis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Modifier l’avis" : "Nouvel avis"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du client *</label>
                  <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="Jean D." required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <Input value={formData.clientCity} onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })} placeholder="Issy-les-Moulineaux" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Note *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star className={`h-8 w-8 ${star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Commentaire *</label>
                <Textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} placeholder="Témoignage du client..." rows={4} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type de projet</label>
                <select value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className="w-full p-2 border rounded-md">
                  {projectTypes.map((pt) => (<option key={pt.value} value={pt.value}>{pt.label}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pub" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="rounded" />
                  <label htmlFor="pub" className="text-sm font-medium">Publié</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="feat" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded" />
                  <label htmlFor="feat" className="text-sm font-medium">Mis en avant</label>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting || !formData.clientName || !formData.comment} className="flex-1 gradient-primary text-white">
                  {isSubmitting ? "Enregistrement..." : editingItem ? "Mettre à jour" : "Ajouter"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucun avis client</p><p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Nouvel avis&quot; pour commencer</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{item.clientName}</h3>
                    {item.clientCity && <p className="text-sm text-gray-500">{item.clientCity}</p>}
                  </div>
                  <div className="flex gap-1">
                    {!item.published && (<span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Masqué</span>)}
                    {item.featured && (<span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Favori</span>)}
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-2">&ldquo;{item.comment}&rdquo;</p>
                {item.projectType && (<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{projectTypes.find((pt) => pt.value === item.projectType)?.label || item.projectType}</span>)}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(item)} className="flex-1"><Edit className="h-4 w-4 mr-1" />Modifier</Button>
                  <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(item)} title={item.featured ? "Retirer des favoris" : "Mettre en avant"}><Star className={`h-4 w-4 ${item.featured ? "text-yellow-400 fill-current" : ""}`} /></Button>
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

export default function TestimonialsAdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <TestimonialsContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
