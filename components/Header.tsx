"use client";

import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleQuoteClick = () => {
    scrollToSection('contact');
  };

  const handleAccueilClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3" onClick={handleAccueilClick}>
            <img
              src="/main.png"
              alt="Atouts Services Logo"
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
              onClick={handleAccueilClick}
            >
              Accueil
            </Link>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Témoignages
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          <Button
            onClick={handleQuoteClick}
            className="hidden md:flex gradient-primary hover:opacity-90 shadow-elegant text-white"
          >
            <Phone className="h-4 w-4 mr-2" />
            Devis gratuit
          </Button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={(e) => {
                  handleAccueilClick(e);
                  setIsMenuOpen(false);
                }}
              >
                Accueil
              </Link>
              <button
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Témoignages
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Contact
              </button>
              <Button
                onClick={handleQuoteClick}
                className="gradient-primary hover:opacity-90 shadow-elegant text-white w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Devis gratuit
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
