"use client";

import dynamic from "next/dynamic";

const QuotesClient = dynamic(
  () => import("./QuotesClient"),
  { ssr: false }
);

export default function QuotesPage() {
  return <QuotesClient />;
}
