"use client";

import Image from "next/image";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { serviceLinks as services } from "@/lib/service-links";

const navLink = "text-gray-700 hover:text-sky-600 transition-colors font-medium";

// Every menu entry is a real <Link> (not a scroll button) so Google can follow it,
// visitors can open it in a new tab, and it works the same on every page.
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Pages that have their own #contact block keep the visitor on the page.
  const contactHref = pathname === "/" || pathname.startsWith("/services/") ? "#contact" : "/#contact";
  const close = () => setIsMenuOpen(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center" aria-label="Atouts Services — accueil">
            <Image src="/main.png" alt="Atouts Services" width={48} height={48} className="h-12 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
            {/* Services dropdown: opens on hover and on keyboard focus, no JS needed */}
            <div className="relative group">
              <Link href="/#services" className={`${navLink} inline-flex items-center gap-1`} aria-haspopup="true">
                {t("services")}
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
              </Link>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all absolute left-1/2 -translate-x-1/2 top-full pt-3">
                <ul className="w-64 rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className={`block rounded-lg px-4 py-2.5 text-sm hover:bg-sky-50 hover:text-sky-700 ${
                          pathname === `/services/${s.slug}` ? "text-sky-700 font-semibold" : "text-gray-700"
                        }`}
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link href="/realisations" className={navLink}>{t("portfolio")}</Link>
            <Link href="/blog" className={navLink}>{t("blog")}</Link>
            <Link href={contactHref} className={navLink}>{t("contact")}</Link>
            <LanguageSwitcher />
          </nav>

          <Link
            href={contactHref}
            className="hidden md:inline-flex items-center rounded-md bg-neutral-950 hover:bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-elegant"
          >
            <Phone className="h-4 w-4 mr-2" />
            {t("freeQuote")}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t" id="mobile-menu">
            <nav className="flex flex-col gap-4" aria-label="Navigation mobile">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("services")}</p>
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className={`${navLink} pl-3`} onClick={close}>
                  {s.title}
                </Link>
              ))}
              <Link href="/realisations" className={navLink} onClick={close}>{t("portfolio")}</Link>
              <Link href="/blog" className={navLink} onClick={close}>{t("blog")}</Link>
              <Link href={contactHref} className={navLink} onClick={close}>{t("contact")}</Link>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
              <Link
                href={contactHref}
                onClick={close}
                className="flex items-center justify-center rounded-md bg-neutral-950 hover:bg-neutral-800 px-4 py-2.5 font-medium text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                {t("freeQuote")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
