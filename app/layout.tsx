import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { PlausibleAnalytics } from "@/components/PlausibleAnalytics";
import { UtmCapture } from "@/components/UtmCapture";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.atoutservice92.fr"),
  title: {
    default: "Entreprise de rénovation à Issy-les-Moulineaux et Paris | Atouts Services",
    template: "%s | Atouts Services",
  },
  description:
    "Entreprise de rénovation basée à Issy-les-Moulineaux (92) depuis 2006. Peinture, électricité, salles de bains et sols à Paris et en Île-de-France. Visite et devis gratuits.",
  keywords: [
    "rénovation",
    "peinture",
    "électricité",
    "salle de bains",
    "Issy-les-Moulineaux",
    "Paris",
    "Île-de-France",
    "Hauts-de-Seine",
    "92",
    "travaux",
    "artisan",
  ],
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:text-sm"
        >
          Aller au contenu principal
        </a>
        {children}
        <Toaster />
        <PlausibleAnalytics />
        <UtmCapture />
      </body>
    </html>
  );
}
