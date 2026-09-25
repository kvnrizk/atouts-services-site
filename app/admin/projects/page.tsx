"use client";

import dynamic from "next/dynamic";

const ProjectsAdmin = dynamic(() => import("./ProjectsAdmin"), { ssr: false });

export default function ProjectsPage() {
  return <ProjectsAdmin />;
}
