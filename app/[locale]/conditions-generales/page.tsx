import type { Metadata } from "next";
import { FEATURES } from "@/lib/features";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions générales d'utilisation du site Atouts Services.",
  alternates: { canonical: "/conditions-generales" },
};

export default function ConditionsGeneralesPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conditions G&eacute;n&eacute;rales d&rsquo;Utilisation
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl prose prose-gray">
            <p>
              Les pr&eacute;sentes conditions g&eacute;n&eacute;rales d&rsquo;utilisation (CGU) r&eacute;gissent
              l&rsquo;acc&egrave;s et l&rsquo;utilisation du site <strong>www.atouts-services.fr</strong>.
              En acc&eacute;dant au site, vous acceptez sans r&eacute;serve les pr&eacute;sentes CGU.
            </p>

            <h2>1. Objet</h2>
            <p>
              Le site www.atouts-services.fr est un site vitrine pr&eacute;sentant les activit&eacute;s
              de r&eacute;novation et de travaux d&rsquo;Atouts Services. Il permet &eacute;galement
              aux utilisateurs de :
            </p>
            <ul>
              <li>D&eacute;couvrir les services propos&eacute;s</li>
              <li>Consulter les r&eacute;alisations et t&eacute;moignages clients</li>
              <li>Effectuer une estimation de prix en ligne</li>
              <li>Envoyer une demande de devis</li>
              <li>Acc&eacute;der &agrave; leur espace client pour suivre leurs projets</li>
              <li>Proc&eacute;der au paiement d&rsquo;acomptes en ligne</li>
            </ul>

            <h2>2. Acc&egrave;s au site</h2>
            <p>
              Le site est accessible gratuitement &agrave; tout utilisateur disposant d&rsquo;un acc&egrave;s Internet.
              Atouts Services se r&eacute;serve le droit de suspendre ou d&rsquo;interrompre l&rsquo;acc&egrave;s
              au site pour des raisons de maintenance ou de mise &agrave; jour, sans pr&eacute;avis ni indemnit&eacute;.
            </p>

            {FEATURES.simulator && (
            <>
            <h2>3. Simulateur de prix</h2>
            <p>
              Le simulateur de prix en ligne fournit des <strong>estimations indicatives</strong> bas&eacute;es
              sur les informations renseign&eacute;es par l&rsquo;utilisateur. Ces estimations ne constituent
              en aucun cas un devis ferme et d&eacute;finitif. Seul un devis &eacute;tabli apr&egrave;s visite
              technique a valeur contractuelle.
            </p>
            </>
            )}

            <h2>4. Demandes de devis</h2>
            <p>
              L&rsquo;envoi d&rsquo;une demande de devis via le formulaire du site n&rsquo;engage ni
              l&rsquo;utilisateur ni Atouts Services. Le devis sera &eacute;tabli gratuitement apr&egrave;s
              &eacute;tude du projet. L&rsquo;utilisateur s&rsquo;engage &agrave; fournir des informations
              exactes et compl&egrave;tes.
            </p>

            <h2>5. Espace client</h2>
            <p>
              L&rsquo;acc&egrave;s &agrave; l&rsquo;espace client n&eacute;cessite la cr&eacute;ation d&rsquo;un
              compte avec un email et un mot de passe. L&rsquo;utilisateur est responsable de la
              confidentialit&eacute; de ses identifiants et de toutes les actions effectu&eacute;es
              depuis son compte.
            </p>
            <p>
              Atouts Services se r&eacute;serve le droit de suspendre ou supprimer un compte en cas
              d&rsquo;utilisation frauduleuse ou non conforme aux pr&eacute;sentes CGU.
            </p>

            <h2>6. Paiements en ligne</h2>
            <p>
              Les paiements d&rsquo;acomptes sont r&eacute;alis&eacute;s via la plateforme s&eacute;curis&eacute;e
              <strong> Stripe</strong>. Atouts Services ne stocke aucune donn&eacute;e bancaire.
              Les transactions sont prot&eacute;g&eacute;es par le protocole SSL.
            </p>
            <p>
              Le paiement d&rsquo;un acompte vaut acceptation du devis correspondant. Les conditions
              d&rsquo;annulation et de remboursement sont d&eacute;finies dans le devis sign&eacute;
              entre les parties.
            </p>

            <h2>7. Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              L&rsquo;ensemble du contenu du site (textes, images, logos, vid&eacute;os) est prot&eacute;g&eacute;
              par le droit de la propri&eacute;t&eacute; intellectuelle. Toute reproduction ou utilisation
              non autoris&eacute;e est interdite.
            </p>

            <h2>8. Limitation de responsabilit&eacute;</h2>
            <p>
              Atouts Services s&rsquo;efforce d&rsquo;assurer la disponibilit&eacute; et l&rsquo;exactitude
              des informations du site. Toutefois, Atouts Services ne saurait &ecirc;tre tenu responsable :
            </p>
            <ul>
              <li>Des interruptions temporaires d&rsquo;acc&egrave;s au site</li>
              <li>Des erreurs ou omissions dans les contenus publi&eacute;s</li>
              <li>Des dommages r&eacute;sultant de l&rsquo;utilisation du site</li>
              <li>Du contenu des sites tiers vers lesquels des liens pourraient renvoyer</li>
            </ul>

            <h2>9. Donn&eacute;es personnelles</h2>
            <p>
              Le traitement des donn&eacute;es personnelles est d&eacute;crit dans notre{" "}
              <Link href="/politique-de-confidentialite">politique de confidentialit&eacute;</Link>.
            </p>

            <h2>10. Modification des CGU</h2>
            <p>
              Atouts Services se r&eacute;serve le droit de modifier les pr&eacute;sentes CGU &agrave; tout moment.
              Les modifications prennent effet d&egrave;s leur publication sur le site.
              L&rsquo;utilisation continue du site apr&egrave;s modification vaut acceptation des nouvelles CGU.
            </p>

            <h2>11. Droit applicable et juridiction</h2>
            <p>
              Les pr&eacute;sentes CGU sont soumises au droit fran&ccedil;ais. En cas de litige,
              et apr&egrave;s tentative de r&eacute;solution amiable, les tribunaux comp&eacute;tents
              de Nanterre seront seuls comp&eacute;tents.
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
