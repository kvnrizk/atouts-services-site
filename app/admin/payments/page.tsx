"use client";

import dynamic from 'next/dynamic';

const PaymentsAdmin = dynamic(() => import('./PaymentsAdmin'), { ssr: false });

export default function PaymentsPage() {
  return <PaymentsAdmin />;
}
