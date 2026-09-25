"use client";

import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { key: 'devis_en_cours', label: 'Devis en cours' },
  { key: 'devis_accepte', label: 'Devis accepté' },
  { key: 'acompte_recu', label: 'Acompte reçu' },
  { key: 'travaux_en_cours', label: 'Travaux en cours' },
  { key: 'travaux_termines', label: 'Travaux terminés' },
  { key: 'facture_envoyee', label: 'Facture envoyée' },
  { key: 'paye', label: 'Payé' },
];

export function ProjectTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Line connecting dots */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-blue-500 -z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const isDone = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              {isDone ? (
                <CheckCircle2
                  className={`h-8 w-8 ${isCurrent ? 'text-blue-600' : 'text-green-500'}`}
                  fill={isCurrent ? undefined : 'currentColor'}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                />
              ) : (
                <Circle className="h-8 w-8 text-gray-300" />
              )}
              <span
                className={`text-xs mt-2 text-center max-w-[80px] leading-tight ${
                  isCurrent ? 'font-bold text-blue-600' : isDone ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
