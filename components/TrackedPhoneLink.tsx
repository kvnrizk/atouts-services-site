"use client";

import type { ReactNode } from "react";
import { trackPhoneClick } from "@/lib/analytics";
import { COMPANY_INFO } from "@/lib/constants";

/** tel: link that records a "Phone Click" event, usable from server components. */
export function TrackedPhoneLink({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={COMPANY_INFO.phoneHref}
      onClick={() => trackPhoneClick(location)}
      className={className}
    >
      {children}
    </a>
  );
}
