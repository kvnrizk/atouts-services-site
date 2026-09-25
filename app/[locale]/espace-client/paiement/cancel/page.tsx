"use client";

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { FEATURES } from '@/lib/features';

export default function PaymentCancelPage() {
  if (!FEATURES.payments) notFound();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Paiement annulé</h1>
          <p className="text-gray-600">
            Le paiement a été annulé. Aucun montant n&apos;a été débité.
            Vous pouvez réessayer à tout moment depuis votre espace client.
          </p>
          <div className="pt-4">
            <Link href="/espace-client/projets">
              <Button className="w-full">Retour à mes projets</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
