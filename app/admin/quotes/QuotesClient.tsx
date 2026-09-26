"use client";

import { useEffect, useState, useMemo } from 'react';
import { apiClient, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, Mail, Phone, Calendar, Download, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { QuoteRequestResponse } from '@/types/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useConfirm } from "@/components/admin/ConfirmDialog";

const STATUS_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'traite', label: 'Traité' },
  { value: 'archive', label: 'Archivé' },
];

const PROJECT_OPTIONS = [
  { value: '', label: 'Tous les types' },
  { value: 'peinture', label: 'Peinture' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'salles-de-bains', label: 'Salle de bain' },
  { value: 'revetements-sol', label: 'Revêtement de sol' },
];

function QuoteRequestsContent() {
  const [requests, setRequests] = useState<QuoteRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const { toast } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get(endpoints.quoteRequests.getAll);
      setRequests(response.data ?? response);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les demandes', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (projectFilter && r.project_type !== projectFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${r.first_name} ${r.last_name} ${r.email} ${r.phone}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [requests, statusFilter, projectFilter, searchQuery]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiClient.patch(endpoints.quoteRequests.updateStatus(id), { status });
      toast({ title: 'Succès', description: 'Statut mis à jour' });
      fetchRequests();
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la mise à jour', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    const request = requests.find((r) => r.id === id);
    const ok = await confirm({
      title: "Supprimer cette demande de devis ?",
      description: <>La demande de {request ? `${request.first_name} ${request.last_name}` : "ce client"} sera définitivement supprimée, avec ses coordonnées.</>,
    });
    if (!ok) return;
    try {
      await apiClient.delete(endpoints.quoteRequests.delete(id));
      toast({ title: 'Succès', description: 'Demande supprimée' });
      fetchRequests();
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/quote-requests/export/csv`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Succès', description: 'Export CSV téléchargé' });
    } catch {
      toast({ title: 'Erreur', description: "Échec de l'export", variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      nouveau: { label: 'Nouveau', className: 'bg-orange-100 text-orange-700' },
      en_cours: { label: 'En cours', className: 'bg-blue-100 text-blue-700' },
      traite: { label: 'Traité', className: 'bg-green-100 text-green-700' },
      archive: { label: 'Archivé', className: 'bg-gray-100 text-gray-700' },
    };
    const variant = variants[status] || variants.nouveau;
    return <Badge className={variant.className}>{variant.label}</Badge>;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes de devis</h1>
          <p className="text-gray-600 mt-1">
            {filteredRequests.length} sur {requests.length} {requests.length > 1 ? 'demandes' : 'demande'}
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCsv}>
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PROJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucune demande de devis trouvée</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover-lift">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{request.first_name} {request.last_name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(request.created_at), 'PPP', { locale: fr })}
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">{request.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">{request.phone}</a>
                  </div>
                </div>

                {request.project_type && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Type de projet : </span>
                    <Badge variant="outline" className="ml-2">{request.project_type}</Badge>
                  </div>
                )}

                {/* Enhanced details from multi-step form */}
                {(request.surface_area || request.rooms || request.current_state) && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    {request.surface_area && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{request.surface_area} m²</span>
                    )}
                    {request.rooms && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{request.rooms} pièces</span>
                    )}
                    {request.current_state && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{request.current_state}</span>
                    )}
                    {request.desired_timeline && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{request.desired_timeline}</span>
                    )}
                  </div>
                )}

                {/* UTM source info */}
                {request.utm_source && (
                  <div className="text-xs text-gray-400">
                    Source: {request.utm_source} / {request.utm_medium || '-'} / {request.utm_campaign || '-'}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Message :</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{request.message}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button size="sm" variant={request.status === 'nouveau' ? 'default' : 'outline'} onClick={() => handleStatusChange(request.id, 'nouveau')}>Nouveau</Button>
                  <Button size="sm" variant={request.status === 'en_cours' ? 'default' : 'outline'} onClick={() => handleStatusChange(request.id, 'en_cours')}>En cours</Button>
                  <Button size="sm" variant={request.status === 'traite' ? 'default' : 'outline'} onClick={() => handleStatusChange(request.id, 'traite')}>Traité</Button>
                  <Button size="sm" variant={request.status === 'archive' ? 'default' : 'outline'} onClick={() => handleStatusChange(request.id, 'archive')}>Archiver</Button>
                  <div className="ml-auto">
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(request.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />Supprimer
                    </Button>
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

export default function QuoteRequestsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <QuoteRequestsContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
