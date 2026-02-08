"use client";

import dynamic from "next/dynamic";

const BeforeAfterClient = dynamic(
  () => import("./BeforeAfterClient"),
  { ssr: false }
);

export default function BeforeAfterPage() {
  return <BeforeAfterClient />;
}
