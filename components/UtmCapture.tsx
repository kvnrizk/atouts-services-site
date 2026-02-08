"use client";

import { useEffect } from "react";
import { captureUtmParams } from "@/lib/analytics";

/**
 * Client component that captures UTM parameters from the URL on mount.
 * Include once in the root layout.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}
