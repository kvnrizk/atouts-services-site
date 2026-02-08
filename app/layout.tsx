import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.atouts-services.fr"),
  title: {
    default: "Atouts Services | Rénovation & Travaux à Issy-les-Moulineaux",
    template: "%s | Atouts Services",
  },
  description:
    "Entreprise de rénovation à Issy-les-Moulineaux (92). Peinture, électricité, salles de bains, revêtements de sol. Devis gratuit, garantie décennale.",
  keywords: [
    "rénovation",
    "peinture",
    "électricité",
    "salle de bains",
    "Issy-les-Moulineaux",
    "Hauts-de-Seine",
    "92",
    "travaux",
    "artisan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Atouts Services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
