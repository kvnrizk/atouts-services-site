import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

/** Fallback 404 outside the [locale] segment (no i18n context, so no full header). */
export default function NotFound() {
  return (
    <main id="main-content" className="min-h-svh bg-neutral-950">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" aria-label="Atouts Services — accueil">
          <Image src="/images/brand/logo-atouts-services.png" alt="Atouts Services" width={150} height={51} sizes="150px" className="h-11 w-auto" />
        </Link>
      </div>
      <NotFoundContent />
    </main>
  );
}
