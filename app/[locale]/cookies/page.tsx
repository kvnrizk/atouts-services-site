import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";

export const metadata: Metadata = {
  title: "Politique cookies",
  description: "Liste des cookies et traceurs utilisés sur le site Atouts Services, leur finalité, leur durée, et comment modifier vos choix.",
  alternates: { canonical: "/cookies" },
};

// Audited 2026-09-25 with a fresh browser: only NEXT_LOCALE + atouts_consent are set without consent.
// Update this list whenever a tracker is added (and bump CONSENT_VERSION in lib/consent.ts).
const trackers = [
  { name: "atouts_consent", who: "Atouts Services", purpose: "Mémoriser vos choix concernant les cookies", duration: "6 mois", consent: "Non requis (strictement nécessaire)" },
  { name: "NEXT_LOCALE", who: "Atouts Services", purpose: "Mémoriser la langue choisie (FR / EN)", duration: "Session du navigateur", consent: "Non requis (strictement nécessaire)" },
  { name: "access_token", who: "Atouts Services", purpose: "Vous garder connecté à l'espace client ou à l'administration (déposé uniquement après connexion)", duration: "7 jours", consent: "Non requis (strictement nécessaire)" },
  { name: "Plausible Analytics", who: "Plausible Insights OÜ (UE)", purpose: "Mesure d'audience anonyme — aucun cookie déposé, aucune adresse IP conservée", duration: "Aucun stockage sur votre appareil", consent: "Non requis (exemption CNIL)" },
  { name: "Cookies Google Maps", who: "Google", purpose: "Afficher la carte interactive de notre zone d'intervention", duration: "Selon Google (jusqu'à 13 mois)", consent: "Oui — catégorie « Contenus tiers »" },
  { name: "Cookies Google Ads", who: "Google", purpose: "Mesurer si une visite venue de nos annonces aboutit à une demande de devis", duration: "Selon Google (jusqu'à 13 mois)", consent: "Oui — catégorie « Publicité »" },
];

export default function CookiesPage() {
  return (
    <LegalPage title="Politique cookies" intro="Ce que nous stockons sur votre appareil, pourquoi, et comment changer d'avis.">
      <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie (ou traceur) est un petit fichier ou une information enregistrée dans votre navigateur lors de la
        visite d&apos;un site. Certains sont indispensables au fonctionnement du site ; les autres ne sont déposés
        qu&apos;avec votre accord.
      </p>

      <h2>2. Cookies et traceurs utilisés</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Nom</th><th>Émetteur</th><th>Finalité</th><th>Durée</th><th>Consentement</th></tr>
          </thead>
          <tbody>
            {trackers.map((t) => (
              <tr key={t.name}>
                <td className="font-semibold text-neutral-950">{t.name}</td>
                <td>{t.who}</td>
                <td>{t.purpose}</td>
                <td>{t.duration}</td>
                <td>{t.consent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Aucune publicité n&apos;est affichée sur ce site et aucune donnée n&apos;est vendue. Les photos d&apos;illustration
        sont servies depuis nos propres serveurs.
      </p>

      <h2>3. Vos choix</h2>
      <p>
        Lors de votre première visite, un bandeau vous permet de <strong>tout accepter</strong>,{" "}
        <strong>tout refuser</strong> ou de <strong>personnaliser</strong> vos choix par catégorie. Refuser est aussi
        simple qu&apos;accepter et n&apos;empêche pas d&apos;utiliser le site (seule la carte interactive est alors
        remplacée par un lien). Votre choix est conservé 6 mois, puis vous sera redemandé.
      </p>
      <p>
        Vous pouvez modifier vos choix à tout moment :{" "}
        <CookieSettingsLink className="font-semibold text-sky-700 underline hover:no-underline" />, également accessible
        en bas de chaque page.
      </p>
      <p>
        Vous pouvez aussi configurer votre navigateur pour bloquer les cookies ; certaines fonctions (connexion à
        l&apos;espace client) pourraient alors ne plus fonctionner.
      </p>

      <h2>4. En savoir plus</h2>
      <p>
        Le traitement de vos données personnelles est détaillé dans notre{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link>. Pour en savoir plus sur les
        cookies : <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" rel="noopener noreferrer" target="_blank">cnil.fr</a>.
      </p>
    </LegalPage>
  );
}
