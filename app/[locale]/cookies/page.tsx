import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { ACTIVE_CATEGORIES, CONSENT_NEEDED, type ConsentCategory } from "@/lib/consent-config";

export const metadata: Metadata = {
  title: "Politique cookies",
  description: "Liste des cookies et traceurs utilisés sur le site Atouts Services, leur finalité, leur durée, et comment modifier vos choix.",
  alternates: { canonical: "/cookies" },
};

// Audited 2026-09-25 with a fresh browser: only NEXT_LOCALE + atouts_consent are set without consent.
// Update this list whenever a tracker is added (and bump CONSENT_VERSION in lib/consent.ts).
const trackers: { name: string; who: string; purpose: string; duration: string; consent: string; category?: ConsentCategory }[] = [
  { name: "atouts_consent", who: "Atouts Services", purpose: "Mémoriser vos choix concernant les cookies", duration: "6 mois", consent: "Non requis (strictement nécessaire)" },
  { name: "NEXT_LOCALE", who: "Atouts Services", purpose: "Mémoriser la langue choisie (FR / EN)", duration: "Session du navigateur", consent: "Non requis (strictement nécessaire)" },
  { name: "access_token", who: "Atouts Services", purpose: "Vous garder connecté à l'espace client ou à l'administration (déposé uniquement après connexion)", duration: "7 jours", consent: "Non requis (strictement nécessaire)" },
  { name: "Statistiques de visite", who: "Atouts Services (outil interne)", purpose: "Compter les visites de façon anonyme — aucun cookie déposé, adresse IP ni conservée ni transmise", duration: "Aucun stockage sur votre appareil", consent: "Non requis (exemption CNIL)" },
  { name: "Cookies Google Maps", who: "Google", purpose: "Afficher la carte interactive de notre zone d'intervention", duration: "Selon Google (jusqu'à 13 mois)", consent: "Oui — « Carte interactive »", category: "thirdParty" },
  { name: "Cookies Google Ads", who: "Google", purpose: "Mesurer si une visite venue de nos annonces aboutit à une demande de devis", duration: "Selon Google (jusqu'à 13 mois)", consent: "Oui — « Mesure de nos annonces »", category: "ads" },
];

// Only list what is actually configured on the site (lib/consent-config.ts)
const activeTrackers = trackers.filter(
  (t) =>
    (t.name !== "atouts_consent" || CONSENT_NEEDED) && // only created when there is a banner
    (!t.category || ACTIVE_CATEGORIES.includes(t.category)),
);

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
            {activeTrackers.map((t) => (
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
      {CONSENT_NEEDED ? (
        <>
          <p>
            Lors de votre première visite, un bandeau vous permet de <strong>tout accepter</strong>,{" "}
            <strong>tout refuser</strong> ou de <strong>personnaliser</strong> vos choix. Refuser est aussi simple
            qu&apos;accepter et n&apos;empêche pas d&apos;utiliser le site. Votre choix est conservé 6 mois, puis vous
            sera redemandé.
          </p>
          <p>
            Vous pouvez modifier vos choix à tout moment :{" "}
            <CookieSettingsLink className="font-semibold text-sky-700 underline hover:no-underline" />, également
            accessible en bas de chaque page.
          </p>
        </>
      ) : (
        <p>
          Ce site n&apos;utilise actuellement <strong>aucun cookie soumis à votre consentement</strong> : seuls les
          traceurs strictement nécessaires ci-dessus sont utilisés. C&apos;est pourquoi aucun bandeau ne vous est
          présenté. Si nous ajoutons un jour un service qui en nécessite, votre accord vous sera demandé avant tout dépôt.
        </p>
      )}
      <p>
        Vous pouvez aussi configurer votre navigateur pour bloquer les cookies ; la connexion à l&apos;espace client
        pourrait alors ne plus fonctionner.
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
