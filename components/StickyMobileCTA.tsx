"use client";

import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/constants';

export function StickyMobileCTA() {
  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex gap-2">
        <Button
          onClick={handleClick}
          className="flex-1 gradient-primary text-white font-semibold"
        >
          Devis gratuit
        </Button>
        <a href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`}>
          <Button variant="outline" size="icon" className="shrink-0">
            <Phone className="h-5 w-5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
