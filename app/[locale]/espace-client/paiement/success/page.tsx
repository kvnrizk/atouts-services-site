"use client";

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Paiement confirmé</h1>
          <p className="text-gray-600">
            Votre paiement a bien été enregistré. Vous recevrez une confirmation par email.
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
