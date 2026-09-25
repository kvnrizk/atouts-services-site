"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Images,
  Image as ImageIcon,
  FileText,
  LogOut,
  Menu,
  X,
  ArrowLeftRight,
  BookOpen,
  MapPin,
  Star,
  Calculator,
  Briefcase,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { FEATURES } from '@/lib/features';
import { useState } from 'react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin/dashboard' },
    { icon: Images, label: 'Portfolio', path: '/admin/portfolio' },
    { icon: ArrowLeftRight, label: 'Avant / Après', path: '/admin/before-after' },
    { icon: ImageIcon, label: 'Photos du site', path: '/admin/photos' },
    { icon: Briefcase, label: 'Projets', path: '/admin/projects' },
    { icon: FileText, label: 'Demandes de devis', path: '/admin/quotes' },
    { icon: BookOpen, label: 'Blog', path: '/admin/blog' },
    { icon: MapPin, label: 'Pages villes', path: '/admin/city-pages' },
    { icon: Star, label: 'Avis clients', path: '/admin/testimonials' },
    ...(FEATURES.simulator ? [{ icon: Calculator, label: 'Simulateur', path: '/admin/simulator' }] : []),
    ...(FEATURES.payments ? [{ icon: CreditCard, label: 'Paiements', path: '/admin/payments' }] : []),
    { icon: BarChart3, label: 'Analytiques', path: '/admin/analytics' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Atouts Services</h1>
          <p className="text-sm text-gray-500 mt-1">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-blue-600">Atouts Services</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start mt-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
