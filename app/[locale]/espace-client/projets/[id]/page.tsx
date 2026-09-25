"use client";

import dynamic from "next/dynamic";

const ProjectDetailClient = dynamic(() => import("./ProjectDetailClient"), { ssr: false });

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
