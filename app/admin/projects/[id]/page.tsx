"use client";

import dynamic from "next/dynamic";

const ProjectDetailAdmin = dynamic(() => import("./ProjectDetailAdmin"), { ssr: false });

export default function ProjectDetailPage() {
  return <ProjectDetailAdmin />;
}
