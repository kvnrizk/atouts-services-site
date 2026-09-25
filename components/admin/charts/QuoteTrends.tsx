"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { QuoteTrendData } from '@/types/api';

interface QuoteTrendsProps {
  data: QuoteTrendData[];
}

export function QuoteTrends({ data }: QuoteTrendsProps) {
  const formatted = data.map((d) => ({
    ...d,
    month: new Date(d.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Devis' : 'Taux de conversion (%)']} />
        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="count" />
        <Line type="monotone" dataKey="conversion_rate" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="conversion_rate" />
      </LineChart>
    </ResponsiveContainer>
  );
}
