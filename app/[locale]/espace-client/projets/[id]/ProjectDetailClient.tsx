"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, endpoints } from '@/lib/api';
import { ClientProtectedRoute } from '@/components/client/ClientProtectedRoute';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ProjectStatusBadge } from '@/components/client/ProjectStatusBadge';
import { ProjectTimeline } from '@/components/client/ProjectTimeline';
import { DocumentList } from '@/components/client/DocumentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Euro, Clock, CreditCard, Loader2 } from 'lucide-react';
import type { Project } from '@/types/api';
import { FEATURES } from "@/lib/features";

export default function ProjectDetailClient() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await apiClient.get(endpoints.projects.myOne(Number(params.id)));
        setProject(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchProject();
  }, [params.id]);

  const handlePayDeposit = async () => {
    if (!project) return;
    setIsPaymentLoading(true);
    try {
      const result = await apiClient.post(endpoints.payments.checkout, {
        project_id: project.id,
        payment_type: 'deposit',
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors de la création du paiement. Veuillez réessayer.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <ClientProtectedRoute>
      <ClientLayout>
        <div className="mb-6">
          <Link href="/espace-client/projets">
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
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-500 mt-1">Réf. {project.reference_number}</p>
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

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.total_amount && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Euro className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Montant total</p>
                        <p className="text-lg font-bold">
                          {Number(project.total_amount).toLocaleString('fr-FR')} &euro;
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.deposit_amount && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Euro className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Acompte ({project.deposit_percentage}%)</p>
                        <p className="text-lg font-bold">
                          {Number(project.deposit_amount).toLocaleString('fr-FR')} &euro;
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.estimated_start_date && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dates estimées</p>
                        <p className="text-sm font-medium">
                          {new Date(project.estimated_start_date).toLocaleDateString('fr-FR')}
                          {project.estimated_end_date && (
                            <> &rarr; {new Date(project.estimated_end_date).toLocaleDateString('fr-FR')}</>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment CTA */}
            {FEATURES.payments && project.status === 'devis_accepte' && project.deposit_amount && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Paiement de l&apos;acompte</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Votre devis a été accepté. Vous pouvez procéder au paiement de l&apos;acompte de{' '}
                        <span className="font-bold">{Number(project.deposit_amount).toLocaleString('fr-FR')} &euro;</span>
                        {' '}({project.deposit_percentage}% du montant total).
                      </p>
                    </div>
                    <Button
                      onClick={handlePayDeposit}
                      disabled={isPaymentLoading}
                      className="shrink-0"
                      size="lg"
                    >
                      {isPaymentLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Payer l&apos;acompte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Updates */}
            {project.updates && project.updates.filter((u) => u.is_visible_to_client).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Mises à jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.updates
                      .filter((u) => u.is_visible_to_client)
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((update) => (
                        <div key={update.id} className="border-l-2 border-blue-300 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{update.title}</p>
                            <span className="text-xs text-gray-400">
                              {new Date(update.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          {update.message && (
                            <p className="text-sm text-gray-600">{update.message}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentList documents={project.documents || []} />
              </CardContent>
            </Card>
          </div>
        )}
      </ClientLayout>
    </ClientProtectedRoute>
  );
}
