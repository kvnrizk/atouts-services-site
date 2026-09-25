"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PopularServiceData } from '@/types/api';

interface PopularServicesProps {
  data: PopularServiceData[];
}

export function PopularServices({ data }: PopularServicesProps) {
  const formatted = data.map((d) => ({
    name: d.service || 'Non spécifié',
    count: Number(d.count),
  }));

  if (formatted.length === 0) {
    return <p className="text-center text-gray-400 py-8">Aucune donnée disponible</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formatted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" fontSize={12} />
        <YAxis type="category" dataKey="name" fontSize={12} width={120} />
        <Tooltip />
        <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} name="Demandes" />
      </BarChart>
    </ResponsiveContainer>
  );
}
