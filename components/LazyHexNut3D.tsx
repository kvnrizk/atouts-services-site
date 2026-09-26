"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// three.js is ~150 KB gzipped and heavy to boot: keep it out of the homepage bundle
// and only fetch it when the Services section is about to scroll into view.
const HexNut3D = dynamic(() => import("@/components/HexNut3D").then((m) => m.HexNut3D), {
  ssr: false,
  loading: () => <NutPlaceholder />,
});

/** Soft hexagon silhouette shown until the 3D model is ready */
function NutPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-1/2 w-1/2 animate-pulse text-neutral-300 motion-reduce:animate-none">
        <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>
    </div>
  );
}

export function LazyHexNut3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="h-full w-full">{visible ? <HexNut3D /> : <NutPlaceholder />}</div>;
}
