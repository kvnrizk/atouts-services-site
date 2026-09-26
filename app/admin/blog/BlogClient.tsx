"use client";

import Image from "next/image";
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
import type { BlogPost } from "@/types/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

const categories = [
  { value: "renovation", label: "Rénovation" },
  { value: "conseils", label: "Conseils" },
  { value: "aides", label: "Aides financières" },
  { value: "tendances", label: "Tendances" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    category: "renovation",
    tags: "",
    author: "Atouts Services",
    published: false,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await apiClient.get(endpoints.blog.adminAll);
      setPosts(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les articles", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L’image ne doit pas dépasser 5MB", variant: "destructive" });
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
      setFormData((prev) => ({ ...prev, coverImageUrl: `${API_URL}${data.url}` }));
      toast({ title: "Succès", description: "Image téléchargée avec succès" });
    } catch {
      toast({ title: "Erreur", description: "Échec du téléchargement de l’image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingItem ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editingItem) {
        await apiClient.patch(endpoints.blog.update(editingItem.id!), payload);
        toast({ title: "Succès", description: "Article mis à jour" });
      } else {
        await apiClient.post(endpoints.blog.create, payload);
        toast({ title: "Succès", description: "Article créé" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    try {
      await apiClient.delete(endpoints.blog.delete(id));
      toast({ title: "Succès", description: "Article supprimé" });
      fetchPosts();
    } catch {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  const handleTogglePublished = async (item: BlogPost) => {
    try {
      await apiClient.patch(endpoints.blog.update(item.id!), { published: !item.published });
      toast({ title: "Succès", description: item.published ? "Article masqué" : "Article publié" });
      fetchPosts();
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const openEditDialog = (item: BlogPost) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: item.content,
      coverImageUrl: item.coverImageUrl || "",
      category: item.category || "renovation",
      tags: item.tags?.join(", ") || "",
      author: item.author || "Atouts Services",
      published: item.published ?? false,
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: "", slug: "", excerpt: "", content: "", coverImageUrl: "",
      category: "renovation", tags: "", author: "Atouts Services", published: false,
      metaTitle: "", metaDescription: "",
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
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-2">Gérez vos articles de blog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Modifier l’article" : "Nouvel article"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <Input value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Titre de l'article" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="url-de-l-article" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Extrait</label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Résumé court de l'article..." rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenu (Markdown) *</label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Rédigez votre article en Markdown..." rows={12} className="font-mono text-sm" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded-md">
                    {categories.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
                  <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="renovation, cuisine, moderne" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image de couverture</label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  {isUploading && (<p className="text-sm text-gray-500 flex items-center gap-2"><Upload className="h-4 w-4 animate-pulse" />Téléchargement en cours...</p>)}
                  {isImageSrc(formData.coverImageUrl) && (<Image src={formData.coverImageUrl} alt="Preview" width={800} height={192} className="w-full h-48 object-cover rounded-md" />)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta titre (SEO)</label>
                  <Input value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} placeholder="Titre pour les moteurs de recherche" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta description (SEO)</label>
                  <Input value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} placeholder="Description pour les moteurs de recherche" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="rounded" />
                <label htmlFor="published" className="text-sm font-medium">Publier sur le site</label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting || !formData.title || !formData.content} className="flex-1 gradient-primary text-white">
                  {isSubmitting ? "Enregistrement..." : editingItem ? "Mettre à jour" : "Créer"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucun article de blog</p><p className="text-sm text-gray-400 mt-2">Cliquez sur &quot;Nouvel article&quot; pour commencer</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {posts.map((item) => (
            <Card key={item.id} className="overflow-hidden hover-lift">
              <CardContent className="p-4 flex gap-4">
                {isImageSrc(item.coverImageUrl) && (
                  <Image src={item.coverImageUrl} alt={item.title} width={128} height={96} className="w-32 h-24 object-cover rounded-md flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      {item.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.excerpt}</p>}
                    </div>
                    {!item.published && (<span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex-shrink-0">Brouillon</span>)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {item.category && (<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{categories.find((c) => c.value === item.category)?.label || item.category}</span>)}
                    <span className="text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("fr-FR") : ""}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}><Edit className="h-4 w-4 mr-1" />Modifier</Button>
                    <Button size="sm" variant="outline" onClick={() => handleTogglePublished(item)}>{item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/** next/image throws on anything that isn't a "/path" or an http(s) URL — skip the preview instead of crashing the page. */
function isImageSrc(src?: string | null): src is string {
  return !!src && (src.startsWith("/") || /^https?:\/\//.test(src));
}

export default function BlogAdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <BlogContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
