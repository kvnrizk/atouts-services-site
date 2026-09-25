"use client";

import { ClientAuthProvider } from '@/contexts/ClientAuthContext';

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return <ClientAuthProvider>{children}</ClientAuthProvider>;
}
