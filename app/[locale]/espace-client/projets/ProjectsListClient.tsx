"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient, endpoints } from '@/lib/api';
import { ClientProtectedRoute } from '@/components/client/ClientProtectedRoute';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ProjectStatusBadge } from '@/components/client/ProjectStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Calendar, ChevronRight } from 'lucide-react';
import type { Project } from '@/types/api';

export default function ProjectsListClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiClient.get(endpoints.projects.my);
        setProjects(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <ClientProtectedRoute>
      <ClientLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mes Projets</h1>
          <p className="text-gray-500 mt-1">Suivez l'avancement de vos travaux</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun projet</h3>
              <p className="text-gray-500 text-sm text-center max-w-sm">
                Vous n'avez pas encore de projet en cours. Demandez un devis pour commencer !
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/espace-client/projets/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Réf. {project.reference_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <ProjectStatusBadge status={project.status} />
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      {project.total_amount && (
                        <span className="font-medium text-gray-700">
                          {Number(project.total_amount).toLocaleString('fr-FR')} &euro;
                        </span>
                      )}
                      {project.estimated_start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          D&eacute;but : {new Date(project.estimated_start_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span>
                        {project.documents?.length || 0} document(s)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </ClientLayout>
    </ClientProtectedRoute>
  );
}
