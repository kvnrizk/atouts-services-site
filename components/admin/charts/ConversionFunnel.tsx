"use client";

import type { ConversionData } from '@/types/api';

interface ConversionFunnelProps {
  data: ConversionData;
}

const STEPS = [
  { key: 'estimations' as const, label: 'Estimations', color: 'bg-blue-500' },
  { key: 'quotes' as const, label: 'Demandes de devis', color: 'bg-indigo-500' },
  { key: 'projects' as const, label: 'Projets', color: 'bg-purple-500' },
  { key: 'payments' as const, label: 'Paiements', color: 'bg-green-500' },
];

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const max = Math.max(data.estimations, data.quotes, data.projects, data.payments, 1);

  return (
    <div className="space-y-4">
      {STEPS.map((step, index) => {
        const value = data[step.key];
        const widthPercent = Math.max((value / max) * 100, 8);
        const prevValue = index > 0 ? data[STEPS[index - 1].key] : null;
        const rate = prevValue && prevValue > 0 ? ((value / prevValue) * 100).toFixed(1) : null;

        return (
          <div key={step.key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{step.label}</span>
              <span className="text-gray-500">
                {value}
                {rate && <span className="text-xs ml-1">({rate}%)</span>}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-6">
              <div
                className={`${step.color} h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium transition-all`}
                style={{ width: `${widthPercent}%` }}
              >
                {value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
