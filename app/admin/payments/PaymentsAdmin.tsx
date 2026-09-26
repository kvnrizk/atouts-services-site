"use client";

import { useState, useEffect } from 'react';
import { apiClient, endpoints } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Euro, CreditCard, Clock, RefreshCw, Loader2 } from 'lucide-react';
import type { Payment, PaymentStats } from '@/types/api';
import { useConfirm } from "@/components/admin/ConfirmDialog";

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Payé',
  pending: 'En attente',
  failed: 'Échoué',
  refunded: 'Remboursé',
};

function PaymentsContent() {
  const confirm = useConfirm();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [paymentsData, statsData] = await Promise.all([
        apiClient.get(endpoints.payments.adminAll),
        apiClient.get(endpoints.payments.adminStats),
      ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefund = async (paymentId: number) => {
    const payment = payments.find((p) => p.id === paymentId);
    const ok = await confirm({
      title: "Rembourser ce paiement ?",
      description: <>{payment ? `${Number(payment.amount).toLocaleString("fr-FR")} € ` : ""}seront remboursés au client. Cette action ne peut pas être annulée.</>,
      confirmLabel: "Rembourser",
    });
    if (!ok) return;
    setRefundingId(paymentId);
    try {
      await apiClient.post(endpoints.payments.refund(paymentId));
      await fetchData();
    } catch (error) {
      console.error('Refund error:', error);
      alert('Erreur lors du remboursement');
    } finally {
      setRefundingId(null);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-600 mt-2">Gestion des paiements Stripe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total paiements</CardTitle>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Montant encaissé</CardTitle>
            <Euro className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(stats?.completedAmount || 0).toLocaleString('fr-FR')} &euro;
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Payés</CardTitle>
            <Euro className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun paiement pour le moment</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {payment.project?.title || `Projet #${payment.project_id}`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.payment_type === 'deposit' ? 'Acompte' : 'Solde'}
                    </TableCell>
                    <TableCell className="text-sm font-bold">
                      {Number(payment.amount).toLocaleString('fr-FR')} &euro;
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[payment.status] || ''}>
                        {STATUS_LABELS[payment.status] || payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(payment.id)}
                          disabled={refundingId === payment.id}
                        >
                          {refundingId === payment.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          Rembourser
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentsAdmin() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <PaymentsContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
