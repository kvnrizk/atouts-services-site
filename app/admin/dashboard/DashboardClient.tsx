"use client";

import { useEffect, useState } from 'react';
import { apiClient, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, FileText, CheckCircle, Clock } from 'lucide-react';
import type { QuoteRequestStats } from '@/types/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

function DashboardContent() {
  const [stats, setStats] = useState<QuoteRequestStats | null>(null);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quoteStats, portfolioData] = await Promise.all([
          apiClient.get(endpoints.quoteRequests.stats),
          apiClient.get(endpoints.portfolio.getAll),
        ]);
        setStats(quoteStats);
        setPortfolioCount(Array.isArray(portfolioData) ? portfolioData.length : 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Photos Portfolio', value: portfolioCount, icon: Images, color: 'bg-blue-500' },
    { title: 'Total Demandes', value: stats?.total || 0, icon: FileText, color: 'bg-purple-500' },
    { title: 'Nouvelles Demandes', value: stats?.nouveau || 0, icon: Clock, color: 'bg-orange-500' },
    { title: 'Demandes Traitées', value: stats?.traite || 0, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue sur votre espace admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Depuis cet espace, vous pouvez gérer :</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                <span>Vos photos de réalisations (Portfolio)</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Les demandes de devis clients</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nouveau</span>
                <span className="font-bold text-orange-600">{stats?.nouveau || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">En cours</span>
                <span className="font-bold text-blue-600">{stats?.en_cours || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Traité</span>
                <span className="font-bold text-green-600">{stats?.traite || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
