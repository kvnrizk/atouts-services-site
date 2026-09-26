"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// three.js is ~150 KB gzipped and heavy to boot: keep it out of the homepage bundle
// and only fetch it when the Services section is about to scroll into view.
const HexNut3D = dynamic(() => import("@/components/HexNut3D").then((m) => m.HexNut3D), {
  ssr: false,
});

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

  return <div ref={ref} className="h-full w-full">{visible && <HexNut3D />}</div>;
}
