"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackPhoneClick } from "@/lib/analytics";
import { COMPANY_INFO } from "@/lib/constants";

/** tel: link that records a "Phone Click" event, usable from server components.
 *  Other <a> attributes (aria-label, tabIndex…) are passed through. */
export function TrackedPhoneLink({
  location,
  children,
  ...rest
}: {
  location: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "children">) {
  return (
    <a {...rest} href={COMPANY_INFO.phoneHref} onClick={() => trackPhoneClick(location)}>
      {children}
    </a>
  );
}
