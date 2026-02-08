import { Shield, FileText, Users, MapPin } from 'lucide-react';

const trustBadges = [
  { icon: Shield, label: 'Garantie décennale' },
  { icon: FileText, label: 'Devis gratuit' },
  { icon: Users, label: 'Artisans qualifiés' },
  { icon: MapPin, label: 'Île-de-France' },
];

export function TrustBar() {
  return (
    <section className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-700"
            >
              <badge.icon className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm md:text-base">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
