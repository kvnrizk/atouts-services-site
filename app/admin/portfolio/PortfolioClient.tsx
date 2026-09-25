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
import type { Portfolio } from '@/types/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

const categories = [
  { value: 'peinture', label: 'Peinture' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'salles-de-bains', label: 'Salles de bains' },
  { value: 'revetements-sol', label: 'Revêtements de sol' },
];

function PortfolioContent() {
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'peinture',
    published: true,
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await apiClient.get(endpoints.portfolio.getAll);
      setPortfolioItems(data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger le portfolio', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Erreur', description: "L'image ne doit pas dépasser 5MB", variant: 'destructive' });
      return;
    }
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await fetch(`${API_URL}${endpoints.upload.image}`, {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: `${API_URL}${data.url}` }));
      toast({ title: 'Succès', description: 'Image téléchargée avec succès' });
    } catch {
      toast({ title: 'Erreur', description: "Échec du téléchargement de l'image", variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await apiClient.patch(endpoints.portfolio.update(editingItem.id!), formData);
        toast({ title: 'Succès', description: 'Portfolio mis à jour' });
      } else {
        await apiClient.post(endpoints.portfolio.create, formData);
        toast({ title: 'Succès', description: 'Photo ajoutée au portfolio' });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchPortfolio();
    } catch {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      await apiClient.delete(endpoints.portfolio.delete(id));
      toast({ title: 'Succès', description: 'Élément supprimé' });
      fetchPortfolio();
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
    }
  };

  const handleTogglePublished = async (item: Portfolio) => {
    try {
      await apiClient.patch(endpoints.portfolio.update(item.id!), { published: !item.published });
      toast({ title: 'Succès', description: item.published ? 'Photo masquée' : 'Photo publiée' });
      fetchPortfolio();
    } catch {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    }
  };

  const openEditDialog = (item: Portfolio) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      category: item.category || 'peinture',
      published: item.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', imageUrl: '', category: 'peinture', published: true });
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
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600 mt-2">Gérez vos photos de réalisations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifier la photo' : 'Ajouter une photo'}</DialogTitle>
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
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  {isUploading && (<p className="text-sm text-gray-500 flex items-center gap-2"><Upload className="h-4 w-4 animate-pulse" />Téléchargement en cours...</p>)}
                  {formData.imageUrl && (<Image src={formData.imageUrl} alt="Preview" width={400} height={192} className="w-full h-48 object-cover rounded-md" />)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="rounded" />
                <label htmlFor="published" className="text-sm font-medium">Publier sur le site</label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting || !formData.imageUrl} className="flex-1 gradient-primary text-white">
                  {isSubmitting ? 'Enregistrement...' : editingItem ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {portfolioItems.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucune photo dans le portfolio</p><p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Ajouter une photo&quot; pour commencer</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift">
              <div className="relative">
                <Image src={item.imageUrl} alt={item.title} width={400} height={192} className="w-full h-48 object-cover" />
                {!item.published && (<div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Non publié</div>)}
              </div>
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

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <PortfolioContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
