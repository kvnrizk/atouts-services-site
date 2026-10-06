"use client";

import Image from "next/image";
import { ArrowRight, Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TrackedPhoneLink } from "@/components/TrackedPhoneLink";
import { COMPANY_INFO } from "@/lib/constants";
import { FEATURES } from "@/lib/features";
import { serviceLinks as services } from "@/lib/service-links";
import { cn } from "@/lib/utils";

// Menu links are pills: grey on hover, the current page sits in a soft grey pill
const pill = "rounded-full px-3.5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950";
const pillActive = "bg-neutral-100 text-neutral-950";

// Every menu entry is a real <Link> (not a scroll button) so Google can follow it,
// visitors can open it in a new tab, and it works the same on every page.
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  // "/#contact" works everywhere (even without JS); pages with their own quote form keep the
  // visitor on the page: the click scrolls to it instead of going back to the homepage.
  const contactHref = "/#contact";
  const onContactClick = (e: React.MouseEvent) => {
    const form = document.getElementById("contact");
    setIsMenuOpen(false);
    if (!form) return;
    e.preventDefault();
    form.scrollIntoView({ behavior: "smooth" });
  };

  // The header always stays visible (sticky); once the page is scrolled it just gets a more
  // opaque background and a shadow. (Hide-on-scroll was removed: it made the menu disappear.)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock the page behind it, close with Escape, close on navigation
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  const close = () => setIsMenuOpen(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Floating capsule: the outer <header> keeps the historic 65px height (8px gap + 57px bar)
          so every page hero that slides under it (-mt-[65px]) stays aligned */}
      <header className="pointer-events-none sticky top-0 z-50 h-[65px] px-3 pt-2 md:px-4">
        <div
          className={cn(
            "pointer-events-auto mx-auto flex h-[57px] max-w-6xl items-center justify-between gap-3 rounded-full border bg-white/80 pl-4 pr-2 backdrop-blur-xl transition-[box-shadow,background-color,border-color] duration-300 motion-reduce:transition-none md:pl-5",
            scrolled
              ? "border-neutral-200/80 bg-white/90 shadow-[0_10px_30px_-12px_rgba(10,10,10,0.25)]"
              : "border-white/60 shadow-[0_6px_20px_-12px_rgba(10,10,10,0.18)]",
          )}
        >
          <Link href="/" className="flex shrink-0 items-center" aria-label="Atouts Services — accueil">
            <Image src="/images/brand/logo-atouts-services.png" alt="Atouts Services" width={120} height={41} sizes="120px" className="h-9 w-auto" priority />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {/* Services dropdown: opens on hover and on keyboard focus, no JS needed */}
            <div className="group relative">
              <Link
                href="/#services"
                className={cn(pill, "inline-flex items-center gap-1", pathname.startsWith("/services/") && pillActive)}
                aria-haspopup="true"
              >
                {t("services")}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition duration-200 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <ul className="w-64 rounded-2xl border border-neutral-200/80 bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(10,10,10,0.3)]">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-neutral-100",
                          pathname === `/services/${s.slug}` ? "font-semibold text-neutral-950" : "text-neutral-700",
                        )}
                      >
                        {s.title}
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link href="/realisations" aria-current={isActive("/realisations") ? "page" : undefined} className={cn(pill, isActive("/realisations") && pillActive)}>
              {t("portfolio")}
            </Link>
            <Link href="/blog" aria-current={isActive("/blog") ? "page" : undefined} className={cn(pill, isActive("/blog") && pillActive)}>
              {t("blog")}
            </Link>
            <Link href={contactHref} onClick={onContactClick} className={pill}>{t("contact")}</Link>
          </nav>

          <div className="flex items-center gap-2">
            {FEATURES.englishVersion && (
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
            )}
            <TrackedPhoneLink
              location="header"
              aria-label={`Appeler le ${COMPANY_INFO.phone}`}
              title={COMPANY_INFO.phone}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95"
            >
              <Phone className="h-4 w-4" />
            </TrackedPhoneLink>
            <Link
              href={contactHref}
              onClick={onContactClick}
              className="group hidden h-10 items-center gap-1.5 rounded-full bg-neutral-950 pl-4 pr-3 text-sm font-semibold text-white transition hover:bg-sky-400 hover:text-neutral-950 active:scale-[0.98] md:inline-flex"
            >
              {t("freeQuote")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white active:scale-95 md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: full-screen dark panel, outside <header> so the header's blur/transform
          cannot trap it (both create a containing block for position:fixed children) */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!isMenuOpen}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-neutral-950 text-white transition duration-300 ease-out md:hidden motion-reduce:transition-none",
          isMenuOpen ? "visible translate-x-0 opacity-100" : "invisible translate-x-8 opacity-0",
        )}
      >
        <div className="container mx-auto flex h-16 shrink-0 items-center justify-between px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Menu</span>
          <button type="button" onClick={close} className="-mr-2 rounded-md p-2 active:scale-95" aria-label="Fermer le menu" tabIndex={isMenuOpen ? 0 : -1}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="container mx-auto flex flex-1 flex-col overflow-y-auto px-4 pb-8" aria-label="Navigation mobile">
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{t("services")}</p>
          <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  onClick={close}
                  tabIndex={isMenuOpen ? 0 : -1}
                  aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between py-4 text-lg font-medium active:text-sky-300",
                    pathname === `/services/${s.slug}` && "text-sky-400",
                  )}
                >
                  {s.title}
                  <ChevronRight className="h-5 w-5 text-neutral-600" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-5 text-2xl font-bold tracking-tight">
            {[
              { href: "/realisations", label: t("portfolio") },
              { href: "/blog", label: t("blog") },
              { href: contactHref, label: t("contact") },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={l.href === contactHref ? onContactClick : close}
                tabIndex={isMenuOpen ? 0 : -1}
                className={cn("active:text-sky-300", isActive(l.href) && "text-sky-400")}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto space-y-4 pt-10">
            {FEATURES.englishVersion && <LanguageSwitcher variant="dark" />}
            <Link
              href={contactHref}
              onClick={onContactClick}
              tabIndex={isMenuOpen ? 0 : -1}
              className="flex items-center justify-center rounded-md bg-sky-400 px-4 py-3.5 font-semibold text-neutral-950 active:scale-[0.98]"
            >
              {t("freeQuote")}
            </Link>
            <TrackedPhoneLink
              location="mobile-menu"
              className="flex items-center justify-center rounded-md border border-white/25 px-4 py-3.5 font-semibold active:scale-[0.98]"
            >
              <Phone className="mr-2 h-5 w-5" />
              {COMPANY_INFO.phone}
            </TrackedPhoneLink>
          </div>
        </nav>
      </div>
    </>
  );
};
