"use client";

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { FEATURES } from '@/lib/features';

const PaymentsAdmin = dynamic(() => import('./PaymentsAdmin'), { ssr: false });

export default function PaymentsPage() {
  if (!FEATURES.payments) notFound();
  return <PaymentsAdmin />;
}
