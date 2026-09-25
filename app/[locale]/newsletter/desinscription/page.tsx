import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UnsubscribeClient } from "./UnsubscribeClient";

export const metadata: Metadata = {
  title: "Désinscription de la newsletter",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <>
      <Header />
      <main id="main-content" className="bg-neutral-50 py-24">
        <div className="container mx-auto max-w-lg px-4 text-center">
          <UnsubscribeClient token={token ?? ""} />
        </div>
      </main>
      <Footer />
    </>
  );
}
