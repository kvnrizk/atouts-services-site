"use client";

import { WifiOff, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gray-100 rounded-full">
              <WifiOff className="h-12 w-12 text-gray-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hors connexion</h1>
            <p className="text-gray-600 mt-2">
              Vous n&apos;avez pas de connexion internet. Veuillez vérifier votre réseau et réessayer.
            </p>
          </div>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Réessayer
            </Button>
            <a href="tel:+33634026180" className="block">
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Nous appeler
              </Button>
            </a>
          </div>
          <p className="text-sm text-gray-400">
            Atouts Services &mdash; Rénovation & Travaux
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
