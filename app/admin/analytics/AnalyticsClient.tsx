"use client";

import { useState, useEffect } from 'react';
import { apiClient, endpoints } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, Euro, Calculator } from 'lucide-react';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { ConversionFunnel } from '@/components/admin/charts/ConversionFunnel';
import { TrafficSources } from '@/components/admin/charts/TrafficSources';
import { QuoteTrends } from '@/components/admin/charts/QuoteTrends';
import { PopularServices } from '@/components/admin/charts/PopularServices';
import type {
  DashboardAnalytics,
  RevenueData,
  ConversionData,
  QuoteTrendData,
  SourceData,
  PopularServiceData,
} from '@/types/api';
import { FEATURES } from "@/lib/features";

function AnalyticsContent() {
  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [conversions, setConversions] = useState<ConversionData | null>(null);
  const [quoteTrends, setQuoteTrends] = useState<QuoteTrendData[]>([]);
  const [sources, setSources] = useState<SourceData[]>([]);
  const [popularServices, setPopularServices] = useState<PopularServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dash, rev, conv, trends, src, services] = await Promise.all([
          apiClient.get(endpoints.analytics.dashboard),
          apiClient.get(endpoints.analytics.revenue),
          apiClient.get(endpoints.analytics.conversions),
          apiClient.get(endpoints.analytics.quoteTrends),
          apiClient.get(endpoints.analytics.sources),
          apiClient.get(endpoints.analytics.popularServices),
        ]);
        setDashboard(dash);
        setRevenue(rev);
        setConversions(conv);
        setQuoteTrends(trends);
        setSources(src);
        setPopularServices(services);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const allStatCards = [
    {
      title: 'Devis ce mois',
      value: dashboard?.quotes?.thisMonth || 0,
      total: `${dashboard?.quotes?.total || 0} au total`,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Projets actifs',
      value: dashboard?.projects?.active || 0,
      total: `${dashboard?.projects?.total || 0} au total`,
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenu total',
      feature: FEATURES.payments,
      value: `${(dashboard?.payments?.totalRevenue || 0).toLocaleString('fr-FR')} €`,
      total: `${(dashboard?.payments?.thisMonth || 0).toLocaleString('fr-FR')} € ce mois`,
      icon: Euro,
      color: 'bg-green-500',
    },
    {
      title: 'Estimations',
      feature: FEATURES.simulator,
      value: dashboard?.estimations?.total || 0,
      total: `${dashboard?.estimations?.withContact || 0} avec contact`,
      icon: Calculator,
      color: 'bg-amber-500',
    },
  ];

  const statCards = allStatCards.filter((c) => !("feature" in c) || c.feature);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytiques</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble de vos performances</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.total}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue (online payments only) */}
        {FEATURES.payments && (
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue.length > 0 ? (
              <RevenueChart data={revenue} />
            ) : (
              <p className="text-center text-gray-400 py-8">Aucune donnée de revenu</p>
            )}
          </CardContent>
        </Card>
        )}

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Entonnoir de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            {conversions ? (
              <ConversionFunnel data={conversions} />
            ) : (
              <p className="text-center text-gray-400 py-8">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        {/* Quote Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances des devis</CardTitle>
          </CardHeader>
          <CardContent>
            {quoteTrends.length > 0 ? (
              <QuoteTrends data={quoteTrends} />
            ) : (
              <p className="text-center text-gray-400 py-8">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Sources de trafic</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficSources data={sources} />
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Services populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <PopularServices data={popularServices} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AnalyticsClient() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AnalyticsContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
