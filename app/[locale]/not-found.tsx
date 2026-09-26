import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

/** 404 inside the site (unknown address, deleted article, city page…) — keeps header and footer. */
export default function LocaleNotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="-mt-[65px] pt-[65px] bg-neutral-950">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
