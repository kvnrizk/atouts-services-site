"use client";

import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { useEffect } from 'react';

export function ClientProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useClientAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/espace-client/connexion');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
