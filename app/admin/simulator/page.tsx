"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { FEATURES } from "@/lib/features";

const SimulatorAdminClient = dynamic(
  () => import("./SimulatorAdminClient"),
  { ssr: false }
);

export default function SimulatorAdminPage() {
  if (!FEATURES.simulator) notFound();
  return <SimulatorAdminClient />;
}
