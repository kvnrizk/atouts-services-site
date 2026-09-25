"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureVisitContext, trackPageview } from "@/lib/analytics";

/** Records one anonymous page view per public page shown (including client-side navigations). */
export function PageviewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    captureVisitContext();
    if (pathname) trackPageview(pathname);
  }, [pathname]);
  return null;
}
