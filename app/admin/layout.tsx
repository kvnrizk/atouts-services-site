"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import { ConfirmProvider } from '@/components/admin/ConfirmDialog';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </AuthProvider>
  );
}
