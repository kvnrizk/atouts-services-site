"use client";

import { Shield, FileText, Users, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustBar() {
  const t = useTranslations('trust');

  const trustBadges = [
    { icon: Shield, label: t('decennalGuarantee') },
    { icon: FileText, label: t('freeQuote') },
    { icon: Users, label: t('qualifiedArtisans') },
    { icon: MapPin, label: t('ileDeFrance') },
  ];

  return (
    <section className="bg-neutral-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-neutral-700"
            >
              <badge.icon className="h-5 w-5 text-sky-600" />
              <span className="font-medium text-sm md:text-base">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
