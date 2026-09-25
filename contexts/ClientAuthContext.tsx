"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, endpoints } from '@/lib/api';
import type { User, LoginCredentials, ClientRegisterData } from '@/types/api';

interface ClientAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: ClientRegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await apiClient.get(endpoints.clientAuth.me);
      if (data && data.role === 'client') {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await apiClient.post(endpoints.clientAuth.login, credentials);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Identifiants incorrects',
      };
    }
  };

  const register = async (data: ClientRegisterData) => {
    try {
      const result = await apiClient.post(endpoints.clientAuth.register, data);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur lors de l'inscription",
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post(endpoints.clientAuth.logout);
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <ClientAuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}
