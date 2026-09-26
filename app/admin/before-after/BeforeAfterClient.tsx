"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { apiClient, endpoints, API_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Upload, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BeforeAfter } from '@/types/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useConfirm } from "@/components/admin/ConfirmDialog";

const categories = [
  { value: 'peinture', label: 'Peinture' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'salles-de-bains', label: 'Salles de bains' },
  { value: 'revetements-sol', label: 'Revêtements de sol' },
];

function BeforeAfterContent() {
  const [items, setItems] = useState<BeforeAfter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeforeAfter | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const { toast } = useToast();
  const confirm = useConfirm();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    beforeImageUrl: '',
    afterImageUrl: '',
    category: 'peinture',
    published: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await apiClient.get(endpoints.beforeAfter.getAll);
      setItems(data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les photos avant/après', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Erreur', description: "L'image ne doit pas dépasser 5MB", variant: 'destructive' });
      return;
    }
    if (type === 'before') setIsUploadingBefore(true); else setIsUploadingAfter(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await fetch(`${API_URL}${endpoints.upload.image}`, { method: 'POST', body: formDataUpload, credentials: 'include' });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const imageUrl = `${API_URL}${data.url}`;
      if (type === 'before') setFormData(prev => ({ ...prev, beforeImageUrl: imageUrl }));
      else setFormData(prev => ({ ...prev, afterImageUrl: imageUrl }));
      toast({ title: 'Succès', description: 'Image téléchargée avec succès' });
    } catch {
      toast({ title: 'Erreur', description: "Échec du téléchargement de l'image", variant: 'destructive' });
    } finally {
      if (type === 'before') setIsUploadingBefore(false); else setIsUploadingAfter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await apiClient.patch(endpoints.beforeAfter.update(editingItem.id!), formData);
        toast({ title: 'Succès', description: 'Projet avant/après mis à jour' });
      } else {
        await apiClient.post(endpoints.beforeAfter.create, formData);
        toast({ title: 'Succès', description: 'Projet avant/après ajouté' });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const item = items.find((i) => i.id === id);
    const ok = await confirm({
      title: "Supprimer cet avant / après ?",
      description: <>« {item?.title ?? "Projet"} » sera définitivement supprimé, avec ses deux photos.</>,
    });
    if (!ok) return;
    try {
      await apiClient.delete(endpoints.beforeAfter.delete(id));
      toast({ title: 'Succès', description: 'Élément supprimé' });
      fetchItems();
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
    }
  };

  const handleTogglePublished = async (item: BeforeAfter) => {
    try {
      await apiClient.patch(endpoints.beforeAfter.update(item.id!), { published: !item.published });
      toast({ title: 'Succès', description: item.published ? 'Projet masqué' : 'Projet publié' });
      fetchItems();
    } catch {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    }
  };

  const openEditDialog = (item: BeforeAfter) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      beforeImageUrl: item.beforeImageUrl,
      afterImageUrl: item.afterImageUrl,
      category: item.category || 'peinture',
      published: item.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', beforeImageUrl: '', afterImageUrl: '', category: 'peinture', published: true });
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
          <h1 className="text-3xl font-bold text-gray-900">Avant / Après</h1>
          <p className="text-gray-600 mt-2">Gérez vos photos avant/après de réalisations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifier le projet' : 'Ajouter un projet avant/après'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Rénovation cuisine moderne" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Décrivez le projet..." rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded-md">
                  {categories.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image AVANT *</label>
                  <div className="space-y-2">
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'before')} disabled={isUploadingBefore} />
                    {isUploadingBefore && (<p className="text-sm text-gray-500 flex items-center gap-2"><Upload className="h-4 w-4 animate-pulse" />Téléchargement...</p>)}
                    {formData.beforeImageUrl && (
                      <div className="relative">
                        <Image src={formData.beforeImageUrl} alt="Avant" width={400} height={192} className="w-full h-48 object-cover rounded-md" />
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">AVANT</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image APRÈS *</label>
                  <div className="space-y-2">
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'after')} disabled={isUploadingAfter} />
                    {isUploadingAfter && (<p className="text-sm text-gray-500 flex items-center gap-2"><Upload className="h-4 w-4 animate-pulse" />Téléchargement...</p>)}
                    {formData.afterImageUrl && (
                      <div className="relative">
                        <Image src={formData.afterImageUrl} alt="Après" width={400} height={192} className="w-full h-48 object-cover rounded-md" />
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">APRÈS</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="rounded" />
                <label htmlFor="published" className="text-sm font-medium">Publier sur le site</label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting || !formData.beforeImageUrl || !formData.afterImageUrl} className="flex-1 gradient-primary text-white">
                  {isSubmitting ? 'Enregistrement...' : editingItem ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucun projet avant/après</p><p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Ajouter un projet&quot; pour commencer</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift">
              <div className="grid grid-cols-2 gap-px bg-gray-200">
                <div className="relative">
                  <Image src={item.beforeImageUrl} alt="Avant" width={400} height={192} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">AVANT</div>
                </div>
                <div className="relative">
                  <Image src={item.afterImageUrl} alt="Après" width={400} height={192} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">APRÈS</div>
                </div>
              </div>
              {!item.published && (<div className="bg-red-500 text-white px-3 py-1 text-center text-xs font-bold">Non publié</div>)}
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                {item.description && (<p className="text-sm text-gray-600 mb-3">{item.description}</p>)}
                {item.category && (<span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mb-3">{categories.find((c) => c.value === item.category)?.label || item.category}</span>)}
                <div className="flex gap-2">
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

export default function BeforeAfterPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <BeforeAfterContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
