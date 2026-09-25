"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { SourceData } from '@/types/api';

interface TrafficSourcesProps {
  data: SourceData[];
}

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#65a30d', '#0891b2'];

export function TrafficSources({ data }: TrafficSourcesProps) {
  const formatted = data.map((d) => ({
    name: d.source || 'Direct',
    value: Number(d.count),
  }));

  if (formatted.length === 0) {
    return <p className="text-center text-gray-400 py-8">Aucune donnée disponible</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formatted}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
        >
          {formatted.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
