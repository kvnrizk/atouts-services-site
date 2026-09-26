import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EnvelopeSimple, MapPin, MapTrifold, Phone } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { servicesData } from "@/lib/services-data";
import { apiClient, endpoints } from "@/lib/api";
import { COMPANY_INFO } from "@/lib/constants";
import { LEGAL } from "@/lib/legal";
import type { CityPage } from "@/types/api";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";

// Column titles use the same eyebrow style as the section labels of the site
const heading = "mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400";
// Links: grey, white on hover with a small arrow sliding in
const footerLink = "group inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-white";

function LinkArrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
    />
  );
}

/** Contact line: duotone icon in a dark disc (same language as the contact section) */
function ContactLine({ icon: Glyph, children }: { icon: Icon; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-sky-400 ring-1 ring-white/10">
        <Glyph size={18} weight="duotone" aria-hidden="true" />
      </span>
      {children}
    </li>
  );
}

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
    <footer className="bg-neutral-950 pb-24 pt-20 text-white md:pb-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            {/* White card: the dark "ATOUTS" letters of the logo stay readable on the black footer */}
            <Link href="/" aria-label="Atouts Services — accueil" className="inline-flex rounded-2xl bg-white px-4 py-3 transition hover:shadow-[0_0_0_4px_rgba(56,189,248,0.25)]">
              <Image src="/images/brand/logo-atouts-services.png" alt="Atouts Services" width={170} height={58} sizes="170px" className="h-12 w-auto" />
            </Link>
            <p className="mb-7 mt-6 max-w-sm text-sm text-neutral-400">{t("description")}</p>
            <ul className="space-y-3 text-sm">
              <ContactLine icon={Phone}>
                <a href={COMPANY_INFO.phoneHref} className="font-semibold text-white transition-colors hover:text-sky-300">
                  {COMPANY_INFO.phone}
                </a>
              </ContactLine>
              <ContactLine icon={EnvelopeSimple}>
                <a href={`mailto:${COMPANY_INFO.email}`} className="break-all text-neutral-300 transition-colors hover:text-white">
                  {COMPANY_INFO.email}
                </a>
              </ContactLine>
              <ContactLine icon={MapPin}>
                <span className="text-neutral-300">{COMPANY_INFO.address}</span>
              </ContactLine>
            </ul>
          </div>

          <nav aria-label={t("servicesTitle")}>
            <h2 className={heading}>{t("servicesTitle")}</h2>
            <ul className="space-y-3 text-sm">
              {Object.values(servicesData).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={footerLink}>
                    {s.title}
                    <LinkArrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("companyTitle")}>
            <h2 className={heading}>{t("companyTitle")}</h2>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/realisations", label: nav("portfolio") },
                { href: "/blog", label: nav("blog") },
                { href: "/#contact", label: nav("contact") },
                { href: "/espace-client/connexion", label: nav("clientPortal") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={footerLink}>
                    {l.label}
                    <LinkArrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("areasTitle")}>
            <h2 className={heading}>{t("areasTitle")}</h2>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-sky-400 ring-1 ring-white/10">
                <MapTrifold size={18} weight="duotone" aria-hidden="true" />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-white">{t("serviceAreaValue")}</p>
                <p className="mt-1 text-neutral-500">{t("serviceAreaBase")}</p>
              </div>
            </div>
            {cities.length > 0 && (
              <ul className="mt-5 space-y-3 text-sm">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}`} className={footerLink}>
                      Rénovation {c.cityName}
                      {c.postalCode ? ` (${c.postalCode})` : ""}
                      <LinkArrow />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} {t("allRightsReserved")} · {t("decennalGuarantee")}
            {LEGAL.insurer.name ? ` ${LEGAL.insurer.name}` : ""}
          </p>
          <nav aria-label={t("legalLinks")} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/mentions-legales" className="text-neutral-400 transition-colors hover:text-white">{t("legalMentions")}</Link>
            <Link href="/politique-de-confidentialite" className="text-neutral-400 transition-colors hover:text-white">{t("privacyPolicy")}</Link>
            <Link href="/conditions-generales" className="text-neutral-400 transition-colors hover:text-white">{t("termsOfUse")}</Link>
            <Link href="/cookies" className="text-neutral-400 transition-colors hover:text-white">Cookies</Link>
            <CookieSettingsLink className="text-neutral-400 transition-colors hover:text-white" />
          </nav>
        </div>
      </div>
    </footer>
  );
}
