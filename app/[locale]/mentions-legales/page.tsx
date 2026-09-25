import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { LegalPage, Fill } from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Atouts Services : éditeur, hébergeurs, assurance, médiation de la consommation.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  const { insurer, mediator, hosts } = LEGAL;
  return (
    <LegalPage title="Mentions légales">
      <h2>1. Éditeur du site</h2>
      <p>Le site <strong>atouts-services.fr</strong> est édité par :</p>
      <ul>
        <li><strong>{LEGAL.companyName}</strong>, {LEGAL.legalForm}</li>
        <li>Capital social : <Fill value={LEGAL.shareCapital} what="capital social (extrait Kbis)" /></li>
        <li>Siège social : {LEGAL.address}</li>
        <li>SIRET : {LEGAL.siret} — {LEGAL.rcs}</li>
        <li>Répertoire des métiers : <Fill value={LEGAL.rmNumber} what="numéro RM, si immatriculé à la Chambre de métiers" /></li>
        <li>N° TVA intracommunautaire : {LEGAL.vatNumber}</li>
        <li>Activité (code NAF) : {LEGAL.nafCode}</li>
        <li>Téléphone : <a href="tel:+33634026180">{LEGAL.phone}</a> — E-mail : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></li>
      </ul>
      <p>Directeur de la publication : {LEGAL.publicationDirector}.</p>

      <h2>2. Hébergement</h2>
      <h3>Site internet</h3>
      <p>
        {hosts.frontend.name}, {hosts.frontend.address} — <a href={hosts.frontend.website} rel="noopener noreferrer" target="_blank">vercel.com</a>
      </p>
      <h3>Serveur applicatif et base de données</h3>
      <p>
        {hosts.backend.name}, <Fill value={hosts.backend.address} what="adresse postale de Render (render.com/privacy)" /> —{" "}
        <a href={hosts.backend.website} rel="noopener noreferrer" target="_blank">render.com</a>.
        Les données sont hébergées dans la région de {hosts.backend.region}.
      </p>

      <h2>3. Assurance professionnelle</h2>
      <p>
        {LEGAL.companyName} est titulaire d&apos;une assurance de responsabilité civile décennale (articles L241-1 et
        suivants du Code des assurances) :
      </p>
      <ul>
        <li>Assureur : <Fill value={insurer.name} what="nom de l'assureur (attestation décennale)" /></li>
        <li>Adresse de l&apos;assureur : <Fill value={insurer.address} what="adresse de l'assureur" /></li>
        <li>N° de contrat : <Fill value={insurer.policyNumber} what="numéro de police" /></li>
        <li>Couverture géographique : <Fill value={insurer.coverage} what="zone couverte (ex. France métropolitaine)" /></li>
      </ul>

      <h2>4. Médiation de la consommation</h2>
      <p>
        Conformément aux articles L611-1 et suivants du Code de la consommation, en cas de litige non résolu
        directement avec nous, tout client consommateur peut recourir gratuitement au médiateur de la consommation
        suivant :
      </p>
      <ul>
        <li><Fill value={mediator.name} what="nom du médiateur" /></li>
        <li>Site internet : <Fill value={mediator.website} what="site web du médiateur" /></li>
        <li>Adresse : <Fill value={mediator.address} what="adresse du médiateur" /></li>
      </ul>
      <p>
        Une réclamation écrite préalable auprès de {LEGAL.companyName} est nécessaire avant de saisir le médiateur.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        Les textes, le logo, la charte graphique et les photographies de chantiers publiés sur ce site sont la
        propriété d&apos;{LEGAL.companyName}. Toute reproduction sans autorisation écrite préalable est interdite.
      </p>
      <p>
        Certaines photographies d&apos;illustration (en-têtes de pages, visuels d&apos;ambiance) proviennent de la
        banque d&apos;images <a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">Unsplash</a> et
        sont utilisées sous la <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">licence Unsplash</a>.
        Elles ne représentent pas des réalisations d&apos;{LEGAL.companyName}.
      </p>

      <h2>6. Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link> et l&apos;usage des cookies dans
        notre <Link href="/cookies">politique cookies</Link>.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        {LEGAL.companyName} s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées sur ce site, sans
        pouvoir en garantir l&apos;exhaustivité. Les informations générales (conseils, fourchettes de prix indicatives
        publiées sur le blog) ne constituent pas un devis : seul un devis écrit, établi après visite, engage{" "}
        {LEGAL.companyName}. Les liens vers des sites tiers sont fournis à titre informatif ;{" "}
        {LEGAL.companyName} n&apos;est pas responsable de leur contenu.
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. En cas de litige, et après échec de toute
        tentative de résolution amiable ou de médiation, les tribunaux français sont compétents.
      </p>
    </LegalPage>
  );
}
