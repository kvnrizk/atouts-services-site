"use client";

import dynamic from "next/dynamic";

const CityPagesClient = dynamic(
  () => import("./CityPagesClient"),
  { ssr: false }
);

export default function CityPagesPage() {
  return <CityPagesClient />;
}
