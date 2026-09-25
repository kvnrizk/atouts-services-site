import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { servicesData } from "@/lib/services-data";
import { apiClient, endpoints } from "@/lib/api";
import { COMPANY_INFO } from "@/lib/constants";
import type { CityPage } from "@/types/api";

const heading = "text-sm font-semibold uppercase tracking-wider text-white mb-4";
const footerLink = "text-neutral-400 hover:text-white transition-colors";

// Server component: every page is listed as a plain link in the HTML, which is what
// search engines crawl — this footer is the site map for visitors and for Google.
export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  let cities: CityPage[] = [];
  try {
    cities = ((await apiClient.get(endpoints.cityPages.getAll)) as CityPage[]).filter((c) => c.published !== false);
  } catch {
    // API down: the "Zones" column falls back to the service-area text only
  }

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-24 md:pb-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <Image src="/main.png" alt="Atouts Services" width={48} height={48} className="h-12 w-auto mb-4" />
            <p className="text-neutral-400 text-sm mb-6 max-w-sm">{t("description")}</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={COMPANY_INFO.phoneHref} className={`${footerLink} inline-flex items-center gap-3`}>
                  <Phone className="h-4 w-4 text-sky-400" /> {COMPANY_INFO.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_INFO.email}`} className={`${footerLink} inline-flex items-center gap-3`}>
                  <Mail className="h-4 w-4 text-sky-400" /> {COMPANY_INFO.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-neutral-400">
                <MapPin className="h-4 w-4 text-sky-400" /> {COMPANY_INFO.address}
              </li>
            </ul>
          </div>

          <nav aria-label={t("servicesTitle")}>
            <h2 className={heading}>{t("servicesTitle")}</h2>
            <ul className="space-y-2 text-sm">
              {Object.values(servicesData).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={footerLink}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("companyTitle")}>
            <h2 className={heading}>{t("companyTitle")}</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/realisations" className={footerLink}>{nav("portfolio")}</Link></li>
              <li><Link href="/blog" className={footerLink}>{nav("blog")}</Link></li>
              <li><Link href="/#contact" className={footerLink}>{nav("contact")}</Link></li>
              <li><Link href="/espace-client/connexion" className={footerLink}>{nav("clientPortal")}</Link></li>
            </ul>
          </nav>

          <nav aria-label={t("areasTitle")}>
            <h2 className={heading}>{t("areasTitle")}</h2>
            {cities.length > 0 && (
              <ul className="space-y-2 text-sm mb-4">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}`} className={footerLink}>
                      Rénovation {c.cityName}{c.postalCode ? ` (${c.postalCode})` : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-neutral-500 text-sm">{t("serviceAreaValue")}</p>
          </nav>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} {t("allRightsReserved")} · {t("decennalGuarantee")} · {t("insuredCompany")}
          </p>
          <nav aria-label={t("legalLinks")} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/mentions-legales" className={footerLink}>{t("legalMentions")}</Link>
            <Link href="/politique-de-confidentialite" className={footerLink}>{t("privacyPolicy")}</Link>
            <Link href="/conditions-generales" className={footerLink}>{t("termsOfUse")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
