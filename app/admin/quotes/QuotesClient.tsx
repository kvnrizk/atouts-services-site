"use client";

import { useEffect, useState } from 'react';
import { apiClient, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { QuoteRequestResponse } from '@/types/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

function QuoteRequestsContent() {
  const [requests, setRequests] = useState<QuoteRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    try {
      await apiClient.delete(endpoints.quoteRequests.delete(id));
      toast({ title: 'Succès', description: 'Demande supprimée' });
      fetchRequests();
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Demandes de devis</h1>
        <p className="text-gray-600 mt-2">
          Gérez les demandes de vos clients ({requests.length} {requests.length > 1 ? 'demandes' : 'demande'})
        </p>
      </div>

      {requests.length === 0 ? (
        <Card><CardContent className="text-center py-12"><p className="text-gray-500">Aucune demande de devis</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
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
