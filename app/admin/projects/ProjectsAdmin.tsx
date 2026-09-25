"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiClient, endpoints } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProjectStatusBadge } from '@/components/client/ProjectStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Eye, FolderOpen, TrendingUp } from 'lucide-react';
import type { Project, ProjectStats } from '@/types/api';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    client_id: '',
    title: '',
    description: '',
    total_amount: '',
    deposit_percentage: '30',
    estimated_start_date: '',
    estimated_end_date: '',
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [projectsData, statsData] = await Promise.all([
        apiClient.get(endpoints.projects.adminAll),
        apiClient.get(endpoints.projects.adminStats),
      ]);
      setProjects(projectsData);
      setStats(statsData);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(endpoints.projects.create, {
        client_id: Number(createForm.client_id),
        title: createForm.title,
        description: createForm.description || undefined,
        total_amount: createForm.total_amount ? Number(createForm.total_amount) : undefined,
        deposit_percentage: Number(createForm.deposit_percentage),
        estimated_start_date: createForm.estimated_start_date || undefined,
        estimated_end_date: createForm.estimated_end_date || undefined,
        notes: createForm.notes || undefined,
      });
      setShowCreateDialog(false);
      setCreateForm({
        client_id: '', title: '', description: '', total_amount: '',
        deposit_percentage: '30', estimated_start_date: '', estimated_end_date: '', notes: '',
      });
      fetchData();
    } catch {
      // ignore
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
            <p className="text-gray-500 mt-1">Gérez les projets clients</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau projet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un projet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>ID Client</Label>
                  <Input
                    type="number"
                    value={createForm.client_id}
                    onChange={(e) => setCreateForm({ ...createForm, client_id: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Rénovation salle de bain"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Montant total (&euro;)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={createForm.total_amount}
                      onChange={(e) => setCreateForm({ ...createForm, total_amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Acompte (%)</Label>
                    <Input
                      type="number"
                      value={createForm.deposit_percentage}
                      onChange={(e) => setCreateForm({ ...createForm, deposit_percentage: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date début estimée</Label>
                    <Input
                      type="date"
                      value={createForm.estimated_start_date}
                      onChange={(e) => setCreateForm({ ...createForm, estimated_start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date fin estimée</Label>
                    <Input
                      type="date"
                      value={createForm.estimated_end_date}
                      onChange={(e) => setCreateForm({ ...createForm, estimated_end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes internes</Label>
                  <Textarea
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                    rows={2}
                  />
                </div>
                <Button type="submit" className="w-full">Créer le projet</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-gray-500">Total projets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Number(stats.totalRevenue).toLocaleString('fr-FR')} &euro;
                    </p>
                    <p className="text-sm text-gray-500">Revenus (payés)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {stats.byStatus.slice(0, 2).map((s) => (
              <Card key={s.status}>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-2xl font-bold">{s.count}</p>
                    <ProjectStatusBadge status={s.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Projects Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun projet pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-500">Référence</th>
                      <th className="text-left p-4 font-medium text-gray-500">Titre</th>
                      <th className="text-left p-4 font-medium text-gray-500">Client</th>
                      <th className="text-left p-4 font-medium text-gray-500">Statut</th>
                      <th className="text-left p-4 font-medium text-gray-500">Montant</th>
                      <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      <th className="text-left p-4 font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono text-xs">{project.reference_number}</td>
                        <td className="p-4 font-medium">{project.title}</td>
                        <td className="p-4 text-gray-600">{project.client?.full_name || `#${project.client_id}`}</td>
                        <td className="p-4"><ProjectStatusBadge status={project.status} /></td>
                        <td className="p-4">
                          {project.total_amount
                            ? `${Number(project.total_amount).toLocaleString('fr-FR')} \u20AC`
                            : '-'}
                        </td>
                        <td className="p-4 text-gray-500">
                          {new Date(project.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <Link href={`/admin/projects/${project.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
