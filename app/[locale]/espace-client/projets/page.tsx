"use client";

import dynamic from "next/dynamic";

const ProjectsListClient = dynamic(() => import("./ProjectsListClient"), { ssr: false });

export default function ProjetsPage() {
  return <ProjectsListClient />;
}
