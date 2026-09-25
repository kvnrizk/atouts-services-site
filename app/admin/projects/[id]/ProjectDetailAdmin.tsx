"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, endpoints } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProjectStatusBadge, STATUS_CONFIG } from '@/components/client/ProjectStatusBadge';
import { ProjectTimeline } from '@/components/client/ProjectTimeline';
import { DocumentList } from '@/components/client/DocumentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Save, Plus, MessageSquare, FileUp } from 'lucide-react';
import type { Project } from '@/types/api';

export default function ProjectDetailAdmin() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editStatus, setEditStatus] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDepositPct, setEditDepositPct] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update form
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', message: '', is_visible_to_client: true });

  // Document form
  const [showDocDialog, setShowDocDialog] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', file_url: '', document_type: 'devis' });

  const fetchProject = useCallback(async () => {
    try {
      const data = await apiClient.get(endpoints.projects.adminAll);
      const found = (data as Project[]).find((p) => p.id === Number(params.id));
      if (found) {
        setProject(found);
        setEditStatus(found.status);
        setEditAmount(found.total_amount?.toString() || '');
        setEditDepositPct(found.deposit_percentage?.toString() || '30');
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) fetchProject();
  }, [params.id, fetchProject]);

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      await apiClient.patch(endpoints.projects.update(project.id), {
        status: editStatus,
        total_amount: editAmount ? Number(editAmount) : undefined,
        deposit_percentage: editDepositPct ? Number(editDepositPct) : undefined,
      });
      fetchProject();
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await apiClient.post(endpoints.projects.addUpdate(project.id), updateForm);
      setShowUpdateDialog(false);
      setUpdateForm({ title: '', message: '', is_visible_to_client: true });
      fetchProject();
    } catch {
      // ignore
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await apiClient.post(endpoints.projects.addDocument(project.id), docForm);
      setShowDocDialog(false);
      setDocForm({ name: '', file_url: '', document_type: 'devis' });
      fetchProject();
    } catch {
      // ignore
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mb-6">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : !project ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-gray-500">Projet introuvable</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <p className="text-gray-500">
                  Réf. {project.reference_number} &middot; Client: {project.client?.full_name || `#${project.client_id}`}
                </p>
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avancement</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectTimeline currentStatus={project.status} />
              </CardContent>
            </Card>

            {/* Edit Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modifier le projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                          <SelectItem key={key} value={key}>
                            {val.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Montant total (&euro;)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Acompte (%)</Label>
                    <Input
                      type="number"
                      value={editDepositPct}
                      onChange={(e) => setEditDepositPct(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="mt-4" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Mises à jour</CardTitle>
                <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une mise à jour</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Titre</Label>
                        <Input
                          value={updateForm.title}
                          onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                          placeholder="Début des travaux"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message (optionnel)</Label>
                        <Textarea
                          value={updateForm.message}
                          onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={updateForm.is_visible_to_client}
                          onCheckedChange={(checked) => setUpdateForm({ ...updateForm, is_visible_to_client: checked })}
                        />
                        <Label>Visible par le client</Label>
                      </div>
                      <Button type="submit" className="w-full">Ajouter</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {!project.updates || project.updates.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucune mise à jour</p>
                ) : (
                  <div className="space-y-3">
                    {project.updates
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((update) => (
                        <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{update.title}</p>
                              {!update.is_visible_to_client && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Interne</span>
                              )}
                            </div>
                            {update.message && <p className="text-sm text-gray-600 mt-1">{update.message}</p>}
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(update.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Documents</CardTitle>
                <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un document</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddDocument} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nom du document</Label>
                        <Input
                          value={docForm.name}
                          onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                          placeholder="Devis rénovation salle de bain"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL du fichier</Label>
                        <Input
                          value={docForm.file_url}
                          onChange={(e) => setDocForm({ ...docForm, file_url: e.target.value })}
                          placeholder="https://..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={docForm.document_type} onValueChange={(v) => setDocForm({ ...docForm, document_type: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="devis">Devis</SelectItem>
                            <SelectItem value="facture">Facture</SelectItem>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="attestation">Attestation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">Ajouter</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <DocumentList documents={project.documents || []} />
              </CardContent>
            </Card>

            {/* Notes */}
            {project.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes internes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
