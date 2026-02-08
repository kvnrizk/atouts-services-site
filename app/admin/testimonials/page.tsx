"use client";

import dynamic from "next/dynamic";

const TestimonialsClient = dynamic(
  () => import("./TestimonialsClient"),
  { ssr: false }
);

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
