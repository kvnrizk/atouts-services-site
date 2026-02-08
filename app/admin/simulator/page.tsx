"use client";

import dynamic from "next/dynamic";

const SimulatorAdminClient = dynamic(
  () => import("./SimulatorAdminClient"),
  { ssr: false }
);

export default function SimulatorAdminPage() {
  return <SimulatorAdminClient />;
}
