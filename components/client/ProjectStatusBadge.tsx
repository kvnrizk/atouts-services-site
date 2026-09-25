"use client";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  devis_en_cours: { label: 'Devis en cours', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  devis_accepte: { label: 'Devis accepté', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  acompte_recu: { label: 'Acompte reçu', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  travaux_en_cours: { label: 'Travaux en cours', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  travaux_termines: { label: 'Travaux terminés', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  facture_envoyee: { label: 'Facture envoyée', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  paye: { label: 'Payé', color: 'text-green-800', bg: 'bg-green-100 border-green-300' },
};

export function ProjectStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
