import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Small uppercase label above the title */
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Optional background photo (self-hosted path); without it the band is plain off-black */
  image?: string;
  imageAlt?: string;
  /** Slot above the title (breadcrumb, back link) */
  top?: ReactNode;
  /** Slot under the intro (meta line, buttons) */
  children?: ReactNode;
  className?: string;
}

/**
 * Dark page header shared by the blog, réalisations and city pages — same language as the
 * service page hero. Pulled up under the sticky header (65px) so the band starts at the top.
 */
export function PageHero({ eyebrow, title, intro, image, imageAlt = "", top, children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative -mt-[65px] flex items-end overflow-hidden bg-neutral-950 text-white",
        image ? "min-h-[62svh]" : "min-h-[340px]",
        className,
      )}
    >
      {image && (
        <>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neutral-950/75 via-neutral-950/25 to-transparent" />
        </>
      )}
      <div className="container relative mx-auto px-4 pb-14 pt-[calc(65px+4rem)]">
        {top}
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-sky-400 md:text-sm">{eyebrow}</p>
          )}
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight [text-wrap:balance] md:text-6xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg text-neutral-300 [text-wrap:pretty]">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
