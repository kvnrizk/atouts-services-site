import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { FEATURES } from "@/lib/features";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation du site Atouts Services.",
  alternates: { canonical: "/conditions-generales" },
};

export default function ConditionsGeneralesPage() {
  const name = LEGAL.companyName;
  // Sections are numbered at render time, so switching a feature off never leaves a gap.
  const sections: { title: string; body: ReactNode; show?: boolean }[] = [
    {
      title: "Objet",
      body: (
        <>
          <p>
            Les présentes conditions régissent l&apos;utilisation du site atouts-services.fr, édité par {name} (voir les{" "}
            <Link href="/mentions-legales">mentions légales</Link>). Le site présente nos services de rénovation et
            permet de :
          </p>
          <ul>
            <li>découvrir nos services et nos réalisations ;</li>
            {FEATURES.simulator && <li>obtenir une estimation de prix indicative en ligne ;</li>}
            <li>nous envoyer une demande de devis ou de rappel ;</li>
            <li>accéder à l&apos;espace client pour suivre ses chantiers{FEATURES.payments ? " ;" : "."}</li>
            {FEATURES.payments && <li>régler en ligne un acompte ou une facture.</li>}
          </ul>
        </>
      ),
    },
    {
      title: "Accès au site",
      body: (
        <p>
          Le site est accessible gratuitement. {name} peut en suspendre l&apos;accès pour maintenance ou mise à jour.
        </p>
      ),
    },
    {
      title: "Simulateur de prix",
      show: FEATURES.simulator,
      body: (
        <p>
          Le simulateur fournit des <strong>estimations indicatives</strong> à partir des informations saisies. Elles ne
          constituent pas un devis : seul un devis écrit, établi après visite technique, a valeur contractuelle.
        </p>
      ),
    },
    {
      title: "Demandes de devis",
      body: (
        <p>
          L&apos;envoi d&apos;une demande de devis est gratuit et n&apos;engage ni l&apos;utilisateur ni {name}. Le devis
          est établi après étude du projet, généralement après une visite. Les fourchettes de prix publiées à titre
          d&apos;information générale (par exemple sur le blog) ne constituent pas une offre.
        </p>
      ),
    },
    {
      title: "Espace client",
      body: (
        <>
          <p>
            L&apos;espace client nécessite un compte (e-mail et mot de passe). L&apos;utilisateur est responsable de la
            confidentialité de ses identifiants.
          </p>
          <p>{name} peut suspendre un compte en cas d&apos;utilisation frauduleuse ou contraire aux présentes conditions.</p>
        </>
      ),
    },
    {
      title: "Paiements en ligne",
      show: FEATURES.payments,
      body: (
        <>
          <p>
            Les paiements sont réalisés via la plateforme sécurisée <strong>Stripe</strong> ; {name} n&apos;a jamais
            accès à vos données bancaires. Les échanges sont chiffrés (HTTPS).
          </p>
          <p>
            Les conditions de paiement, d&apos;exécution des travaux, d&apos;annulation et de remboursement sont celles
            du devis signé entre les parties.
          </p>
        </>
      ),
    },
    {
      title: "Propriété intellectuelle",
      body: (
        <p>
          Les contenus du site sont protégés par le droit de la propriété intellectuelle ; certaines photos
          d&apos;illustration proviennent d&apos;Unsplash (voir les <Link href="/mentions-legales">mentions légales</Link>).
          Toute reproduction non autorisée est interdite.
        </p>
      ),
    },
    {
      title: "Responsabilité",
      body: (
        <p>
          {name} s&apos;efforce d&apos;assurer la disponibilité et l&apos;exactitude du site mais ne peut garantir
          l&apos;absence d&apos;interruption ou d&apos;erreur, ni répondre du contenu des sites tiers vers lesquels des
          liens renvoient.
        </p>
      ),
    },
    {
      title: "Données personnelles et cookies",
      body: (
        <p>
          Voir notre <Link href="/politique-de-confidentialite">politique de confidentialité</Link> et notre{" "}
          <Link href="/cookies">politique cookies</Link>.
        </p>
      ),
    },
    {
      title: "Réclamations et médiation de la consommation",
      body: (
        <>
          <p>
            Toute réclamation peut être adressée à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> ou par courrier à{" "}
            {LEGAL.address}.
          </p>
          <p>
            À défaut de solution amiable, le client consommateur peut saisir gratuitement le médiateur de la consommation :{" "}
            <Fill value={LEGAL.mediator.name} what="nom du médiateur" /> —{" "}
            <Fill value={LEGAL.mediator.website} what="site web du médiateur" />.
          </p>
        </>
      ),
    },
    {
      title: "Modification des conditions",
      body: <p>Ces conditions peuvent évoluer ; la version applicable est celle en ligne lors de votre visite.</p>,
    },
    {
      title: "Droit applicable",
      body: (
        <p>
          Les présentes conditions sont soumises au droit français. À défaut de résolution amiable ou de médiation, le
          litige est porté devant la juridiction compétente selon les règles de droit commun ; le consommateur peut
          notamment saisir le tribunal du lieu de son domicile.
        </p>
      ),
    },
  ];

  return (
    <LegalPage title="Conditions générales d'utilisation">
      {sections
        .filter((s) => s.show !== false)
        .map((s, i) => (
          <section key={s.title}>
            <h2>
              {i + 1}. {s.title}
            </h2>
            {s.body}
          </section>
        ))}
    </LegalPage>
  );
}
