import type { Metadata } from "next";
import { FEATURES } from "@/lib/features";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles du site Atouts Services.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Politique de Confidentialit&eacute;
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl prose prose-gray">
            <p>
              La pr&eacute;sente politique de confidentialit&eacute; d&eacute;crit la mani&egrave;re dont
              Atouts Services collecte, utilise et prot&egrave;ge vos donn&eacute;es personnelles
              conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD).
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des donn&eacute;es est :
            </p>
            <ul>
              <li><strong>Atouts Services</strong></li>
              <li>Issy-les-Moulineaux, Hauts-de-Seine (92)</li>
              <li>Email : contact@atouts-services.fr</li>
              <li>T&eacute;l&eacute;phone : 06 34 02 61 80</li>
            </ul>

            <h2>2. Donn&eacute;es collect&eacute;es</h2>
            <p>Nous collectons les donn&eacute;es suivantes :</p>
            <ul>
              <li>
                <strong>Formulaire de devis :</strong> nom, pr&eacute;nom, email, t&eacute;l&eacute;phone,
                adresse, description du projet, type de travaux.
              </li>
              {FEATURES.simulator && (
              <>
              <li>
                <strong>Simulateur de prix :</strong> cat&eacute;gorie de travaux, surface, options
                s&eacute;lectionn&eacute;es. Si vous laissez vos coordonn&eacute;es : nom, pr&eacute;nom,
                email, t&eacute;l&eacute;phone.
              </li>
              </>
              )}
              <li>
                <strong>Espace client :</strong> nom, pr&eacute;nom, email, t&eacute;l&eacute;phone,
                mot de passe (chiffr&eacute;).
              </li>
              <li>
                <strong>Donn&eacute;es de navigation :</strong> pages visit&eacute;es, dur&eacute;e de visite,
                source de trafic (UTM). Ces donn&eacute;es sont collect&eacute;es de mani&egrave;re anonyme
                via Plausible Analytics, un outil respectueux de la vie priv&eacute;e qui ne d&eacute;pose
                aucun cookie.
              </li>
            </ul>

            <h2>3. Finalit&eacute;s du traitement</h2>
            <p>Vos donn&eacute;es sont utilis&eacute;es pour :</p>
            <ul>
              <li>R&eacute;pondre &agrave; vos demandes de devis et vous recontacter</li>
              <li>G&eacute;n&eacute;rer des estimations de prix personnalis&eacute;es</li>
              <li>G&eacute;rer votre espace client et le suivi de vos projets</li>
              <li>Traiter vos paiements de mani&egrave;re s&eacute;curis&eacute;e via Stripe</li>
              <li>Am&eacute;liorer nos services et notre site web</li>
              <li>Respecter nos obligations l&eacute;gales et comptables</li>
            </ul>

            <h2>4. Base l&eacute;gale du traitement</h2>
            <ul>
              <li>
                <strong>Ex&eacute;cution d&rsquo;un contrat :</strong> traitement de vos demandes de devis,
                gestion de projets, paiements.
              </li>
              <li>
                <strong>Int&eacute;r&ecirc;t l&eacute;gitime :</strong> am&eacute;lioration de nos services,
                analyses statistiques anonymes.
              </li>
              <li>
                <strong>Obligation l&eacute;gale :</strong> conservation des documents comptables.
              </li>
            </ul>

            <h2>5. Dur&eacute;e de conservation</h2>
            <ul>
              <li><strong>Demandes de devis :</strong> 3 ans apr&egrave;s le dernier contact</li>
              <li><strong>Donn&eacute;es clients :</strong> dur&eacute;e de la relation contractuelle + 5 ans</li>
              <li><strong>Donn&eacute;es comptables :</strong> 10 ans (obligation l&eacute;gale)</li>
              <li><strong>Donn&eacute;es de navigation :</strong> 26 mois maximum</li>
            </ul>

            <h2>6. Destinataires des donn&eacute;es</h2>
            <p>
              Vos donn&eacute;es sont accessibles uniquement au personnel habilit&eacute; d&rsquo;Atouts Services.
              Elles peuvent &ecirc;tre transmises aux sous-traitants suivants :
            </p>
            <ul>
              <li><strong>Vercel</strong> (h&eacute;bergement du site)</li>
              <li><strong>Stripe</strong> (traitement des paiements)</li>
              <li><strong>Plausible Analytics</strong> (statistiques anonymes de visite)</li>
            </ul>
            <p>
              Aucune donn&eacute;e n&rsquo;est transf&eacute;r&eacute;e en dehors de l&rsquo;Union Europ&eacute;enne
              sans garanties appropri&eacute;es.
            </p>

            <h2>7. Cookies</h2>
            <p>
              Ce site n&rsquo;utilise <strong>aucun cookie publicitaire ni de tra&ccedil;age</strong>.
              Nous utilisons Plausible Analytics, un outil d&rsquo;analyse web qui fonctionne sans cookies
              et respecte votre vie priv&eacute;e. Un cookie fonctionnel peut &ecirc;tre utilis&eacute;
              pour m&eacute;moriser votre pr&eacute;f&eacute;rence de consentement.
            </p>

            <h2>8. Vos droits</h2>
            <p>
              Conform&eacute;ment au RGPD, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d&rsquo;acc&egrave;s :</strong> obtenir une copie de vos donn&eacute;es personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des donn&eacute;es inexactes</li>
              <li><strong>Droit &agrave; l&rsquo;effacement :</strong> demander la suppression de vos donn&eacute;es</li>
              <li><strong>Droit &agrave; la limitation :</strong> limiter le traitement de vos donn&eacute;es</li>
              <li><strong>Droit &agrave; la portabilit&eacute; :</strong> recevoir vos donn&eacute;es dans un format structur&eacute;</li>
              <li><strong>Droit d&rsquo;opposition :</strong> vous opposer au traitement de vos donn&eacute;es</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous &agrave; :
              <a href="mailto:contact@atouts-services.fr">contact@atouts-services.fr</a>
            </p>
            <p>
              Vous pouvez &eacute;galement adresser une r&eacute;clamation aupr&egrave;s de la CNIL
              (Commission Nationale de l&rsquo;Informatique et des Libert&eacute;s) :
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>

            <h2>9. S&eacute;curit&eacute; des donn&eacute;es</h2>
            <p>
              Nous mettons en &oelig;uvre les mesures techniques et organisationnelles suivantes
              pour prot&eacute;ger vos donn&eacute;es :
            </p>
            <ul>
              <li>Chiffrement des communications (HTTPS/SSL)</li>
              <li>Mots de passe chiffr&eacute;s (bcrypt)</li>
              <li>Acc&egrave;s restreint aux donn&eacute;es (authentification JWT)</li>
              <li>Protection contre les attaques (rate limiting, validation des entr&eacute;es)</li>
              <li>Sauvegardes r&eacute;guli&egrave;res de la base de donn&eacute;es</li>
            </ul>

            <h2>10. Modification de la politique</h2>
            <p>
              Cette politique de confidentialit&eacute; peut &ecirc;tre mise &agrave; jour &agrave; tout moment.
              La date de derni&egrave;re mise &agrave; jour est indiqu&eacute;e ci-dessous.
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Derni&egrave;re mise &agrave; jour : f&eacute;vrier 2026
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
