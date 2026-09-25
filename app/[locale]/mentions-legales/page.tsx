import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales du site Atouts Services.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mentions L&eacute;gales
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl prose prose-gray">
            <h2>1. &Eacute;diteur du site</h2>
            <p>
              Le site <strong>www.atouts-services.fr</strong> est &eacute;dit&eacute; par :
            </p>
            <ul>
              <li><strong>Raison sociale :</strong> Atouts Services</li>
              <li><strong>Forme juridique :</strong> Entreprise individuelle</li>
              <li><strong>Si&egrave;ge social :</strong> Issy-les-Moulineaux, Hauts-de-Seine (92)</li>
              <li><strong>T&eacute;l&eacute;phone :</strong> 06 34 02 61 80</li>
              <li><strong>Email :</strong> contact@atouts-services.fr</li>
              <li><strong>SIRET :</strong> [Num&eacute;ro SIRET &agrave; renseigner]</li>
              <li><strong>Num&eacute;ro TVA intracommunautaire :</strong> [&Agrave; renseigner]</li>
            </ul>
            <p>
              <strong>Directeur de la publication :</strong> Le repr&eacute;sentant l&eacute;gal de la soci&eacute;t&eacute; Atouts Services.
            </p>

            <h2>2. H&eacute;bergement</h2>
            <p>Le site est h&eacute;berg&eacute; par :</p>
            <ul>
              <li><strong>Vercel Inc.</strong></li>
              <li>440 N Barranca Ave #4133, Covina, CA 91723, &Eacute;tats-Unis</li>
              <li>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
            </ul>

            <h2>3. Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              L&rsquo;ensemble des &eacute;l&eacute;ments composant le site (textes, images, logos, vid&eacute;os, graphismes, ic&ocirc;nes)
              sont la propri&eacute;t&eacute; exclusive d&rsquo;Atouts Services ou de ses partenaires, sauf mention contraire.
              Toute reproduction, repr&eacute;sentation, modification, publication, transmission ou d&eacute;naturation,
              totale ou partielle, est interdite sans l&rsquo;autorisation &eacute;crite pr&eacute;alable d&rsquo;Atouts Services.
            </p>

            <h2>4. Responsabilit&eacute;</h2>
            <p>
              Atouts Services s&rsquo;efforce d&rsquo;assurer l&rsquo;exactitude et la mise &agrave; jour des informations
              diffus&eacute;es sur ce site, dont elle se r&eacute;serve le droit de modifier le contenu &agrave; tout moment
              et sans pr&eacute;avis. Toutefois, Atouts Services ne peut garantir l&rsquo;exactitude, la pr&eacute;cision
              ou l&rsquo;exhaustivit&eacute; des informations mises &agrave; disposition sur ce site.
            </p>
            <p>
              En cons&eacute;quence, Atouts Services d&eacute;cline toute responsabilit&eacute; pour toute impr&eacute;cision,
              inexactitude ou omission portant sur des informations disponibles sur le site.
            </p>

            <h2>5. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers d&rsquo;autres sites internet. Atouts Services n&rsquo;exerce aucun
              contr&ocirc;le sur le contenu de ces sites tiers et d&eacute;cline toute responsabilit&eacute; quant &agrave;
              leur contenu.
            </p>

            <h2>6. Assurance professionnelle</h2>
            <p>
              Atouts Services dispose d&rsquo;une assurance responsabilit&eacute; civile professionnelle et d&rsquo;une
              garantie d&eacute;cennale couvrant l&rsquo;ensemble de ses activit&eacute;s de r&eacute;novation et
              de travaux du b&acirc;timent.
            </p>

            <h2>7. Droit applicable</h2>
            <p>
              Les pr&eacute;sentes mentions l&eacute;gales sont r&eacute;gies par le droit fran&ccedil;ais. En cas de
              litige, les tribunaux fran&ccedil;ais seront seuls comp&eacute;tents.
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
