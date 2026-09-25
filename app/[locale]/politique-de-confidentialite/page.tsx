import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legal";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Atouts Services collecte, utilise et protège vos données personnelles : finalités, durées de conservation, destinataires et vos droits (RGPD).",
  alternates: { canonical: "/politique-de-confidentialite" },
};

// Durations below must stay in sync with the backend RetentionService (src/retention/retention.service.ts)
// and docs/RGPD-registre.md.
const allProcessing: { what: string; data: string; purpose: string; basis: string; retention: string; feature?: boolean }[] = [
  {
    what: "Demandes de devis et de rappel",
    data: "Nom, prénom, e-mail, téléphone, description du projet, type de travaux, surface, délai souhaité ; campagne publicitaire d'origine le cas échéant",
    purpose: "Répondre à votre demande, vous recontacter, établir un devis",
    basis: "Mesures précontractuelles prises à votre demande (art. 6-1-b RGPD)",
    retention: "3 ans après notre dernier échange, puis suppression automatique. Si la demande aboutit à un chantier : voir « Espace client »",
  },
  {
    what: "Espace client et suivi de chantier",
    data: "Identité, coordonnées, mot de passe (chiffré), informations et documents du chantier, messages",
    purpose: "Gérer votre compte, suivre vos travaux, partager les documents du chantier",
    basis: "Exécution du contrat (art. 6-1-b)",
    retention: "Durée de la relation contractuelle, puis 5 ans (prescription civile). Les garanties légales des travaux (jusqu'à 10 ans) peuvent justifier une conservation plus longue des seuls documents de chantier",
  },
  {
    what: "Paiements",
    feature: FEATURES.payments,
    data: "Montant, date, référence de la transaction. Vos données bancaires sont saisies et traitées uniquement par Stripe : nous n'y avons jamais accès",
    purpose: "Encaisser les acomptes et factures",
    basis: "Exécution du contrat et obligation légale comptable (art. 6-1-b et 6-1-c)",
    retention: "10 ans (article L123-22 du Code de commerce)",
  },
  {
    what: "Newsletter",
    data: "Adresse e-mail, date d'inscription",
    purpose: "Vous envoyer nos conseils et actualités (1 à 2 e-mails par mois)",
    basis: "Votre consentement (art. 6-1-a), retirable à tout moment via le lien présent dans chaque e-mail",
    retention: "Jusqu'à votre désinscription ; l'adresse est alors supprimée sous 24 h",
  },
  {
    what: "Avis clients publiés",
    data: "Prénom et initiale du nom, ville, note, commentaire",
    purpose: "Publier des témoignages sur le site",
    basis: "Votre consentement (art. 6-1-a)",
    retention: "Jusqu'au retrait de votre consentement",
  },
  {
    what: "Mesure d'audience",
    data: "Pages vues, pays, type d'appareil, site de provenance — de façon anonyme et agrégée, sans cookie ni conservation de l'adresse IP (Plausible Analytics)",
    purpose: "Comprendre la fréquentation du site pour l'améliorer",
    basis: "Intérêt légitime (art. 6-1-f) ; traceur exempté de consentement (CNIL)",
    retention: "25 mois maximum",
  },
  {
    what: "Sécurité du site",
    data: "Journaux techniques des serveurs (adresse IP, date, page demandée)",
    purpose: "Prévenir les abus et les attaques, limiter les envois massifs de formulaires",
    basis: "Intérêt légitime (art. 6-1-f)",
    retention: "Durée limitée fixée par nos hébergeurs, au plus 12 mois",
  },
];

// Hide processing activities of switched-off features (lib/features.ts)
const processing = allProcessing.filter((p) => p.feature !== false);

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Nous collectons uniquement les données nécessaires pour répondre à vos demandes et réaliser vos travaux. Nous ne les vendons ni ne les louons jamais."
    >
      <h2>1. Responsable du traitement</h2>
      <p>
        {LEGAL.companyName} ({LEGAL.legalForm}), {LEGAL.address} — SIRET {LEGAL.siret}. Contact pour toute question
        relative à vos données : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>

      <h2>2. Données collectées, finalités, bases légales et durées de conservation</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Traitement</th>
              <th>Données</th>
              <th>Finalité et base légale</th>
              <th>Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            {processing.map((p) => (
              <tr key={p.what}>
                <td className="font-semibold text-neutral-950">{p.what}</td>
                <td>{p.data}</td>
                <td>{p.purpose}. <em>{p.basis}</em></td>
                <td>{p.retention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Les champs obligatoires des formulaires sont signalés : sans eux, nous ne pouvons pas traiter votre demande.
        Nous ne prenons aucune décision automatisée à votre égard.
      </p>

      <h2>3. Destinataires et sous-traitants</h2>
      <p>
        Vos données sont accessibles uniquement aux personnes habilitées d&apos;{LEGAL.companyName}. Elles sont
        également traitées, pour notre compte et selon nos instructions, par :
      </p>
      <ul>
        <li><strong>{LEGAL.hosts.frontend.name}</strong> — hébergement du site (États-Unis)</li>
        <li><strong>{LEGAL.hosts.backend.name}</strong> — serveur et base de données, hébergés à {LEGAL.hosts.backend.region}</li>
        {FEATURES.payments && <li><strong>Stripe Payments Europe, Ltd.</strong> (Irlande) — paiement en ligne</li>}
        <li><strong>Plausible Insights OÜ</strong> (Estonie) — mesure d&apos;audience anonyme, serveurs dans l&apos;Union européenne</li>
        <li><strong><Fill value={LEGAL.emailProvider} what="prestataire d'envoi des e-mails" /></strong> — envoi des e-mails (confirmations, newsletter)</li>
        <li>
          <strong>Google</strong> — uniquement si vous l&apos;acceptez dans le bandeau cookies : carte Google Maps
          (« Contenus tiers ») et mesure des conversions Google Ads (« Publicité »)
        </li>
      </ul>

      <h2>4. Transferts hors de l&apos;Union européenne</h2>
      <p>
        Certains prestataires (Vercel, Render, Google) sont établis aux États-Unis. Ces transferts sont encadrés par le
        cadre de protection des données UE–États-Unis (<em>Data Privacy Framework</em>) lorsque le prestataire y est
        certifié, ou à défaut par les clauses contractuelles types de la Commission européenne. Notre base de données
        est hébergée dans l&apos;Union européenne.
      </p>

      <h2>5. Vos droits</h2>
      <p>Vous disposez à tout moment des droits suivants sur vos données :</p>
      <ul>
        <li><strong>accès</strong> : savoir quelles données nous détenons et en obtenir une copie ;</li>
        <li><strong>rectification</strong> des données inexactes ;</li>
        <li><strong>effacement</strong> (« droit à l&apos;oubli »), sauf obligation légale de conservation ;</li>
        <li><strong>limitation</strong> du traitement et <strong>opposition</strong> ;</li>
        <li><strong>portabilité</strong> : recevoir vos données dans un format réutilisable ;</li>
        <li><strong>retrait de votre consentement</strong> (newsletter, cookies, avis) à tout moment ;</li>
        <li>définir des <strong>directives</strong> sur le sort de vos données après votre décès.</li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> ou à{" "}
        {LEGAL.companyName}, {LEGAL.address}. Nous répondons dans un délai d&apos;un mois. Un justificatif
        d&apos;identité ne vous sera demandé qu&apos;en cas de doute raisonnable sur votre identité.
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une
        réclamation à la CNIL (<a href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer" target="_blank">cnil.fr/fr/plaintes</a>).
      </p>

      <h2>6. Cookies</h2>
      <p>
        Ce site ne dépose aucun cookie publicitaire sans votre accord. Le détail des cookies et la façon de modifier
        vos choix figurent dans notre <Link href="/cookies">politique cookies</Link>.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Connexions chiffrées (HTTPS), mots de passe stockés sous forme chiffrée, accès à l&apos;administration réservé
        aux personnes habilitées, limitation du nombre d&apos;envois de formulaires, suppression automatique des
        données arrivées au terme de leur durée de conservation.
      </p>

      <h2>8. Modifications</h2>
      <p>
        Cette politique peut évoluer (nouveau service, nouvelle obligation légale). La date de dernière mise à jour
        figure en haut de page.
      </p>
    </LegalPage>
  );
}
