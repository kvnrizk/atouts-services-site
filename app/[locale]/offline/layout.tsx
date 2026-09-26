import type { Metadata } from "next";

// The offline fallback is for the PWA only — keep it out of search results.
export const metadata: Metadata = {
  title: "Hors connexion",
  robots: { index: false, follow: false },
};

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
