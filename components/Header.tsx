"use client";

import Image from "next/image";
import { Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TrackedPhoneLink } from "@/components/TrackedPhoneLink";
import { COMPANY_INFO } from "@/lib/constants";
import { serviceLinks as services } from "@/lib/service-links";
import { cn } from "@/lib/utils";

const navLink = "relative font-medium text-neutral-700 transition-colors hover:text-neutral-950";
// Current page: dark text + a short sky underline
const navActive = "text-neutral-950 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-sky-400";

// Every menu entry is a real <Link> (not a scroll button) so Google can follow it,
// visitors can open it in a new tab, and it works the same on every page.
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
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

  // Hide while scrolling down, show again as soon as the visitor scrolls up (one rAF per frame max)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        setHidden(y > 160 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y <= 160) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
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
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[transform,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
          scrolled ? "border-neutral-200/70 bg-white/90 shadow-sm backdrop-blur-md" : "border-transparent bg-white/75 backdrop-blur-md",
          hidden && !isMenuOpen && "-translate-y-full",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="Atouts Services — accueil">
              <Image src="/main.png" alt="Atouts Services" width={48} height={48} className="h-12 w-auto" priority />
            </Link>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
              {/* Services dropdown: opens on hover and on keyboard focus, no JS needed */}
              <div className="group relative">
                <Link
                  href="/#services"
                  className={cn(navLink, "inline-flex items-center gap-1", pathname.startsWith("/services/") && navActive)}
                  aria-haspopup="true"
                >
                  {t("services")}
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-200 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                          className={cn(
                            "block rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-sky-50 hover:text-sky-700",
                            pathname === `/services/${s.slug}` ? "font-semibold text-sky-700" : "text-neutral-700",
                          )}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="/realisations" aria-current={isActive("/realisations") ? "page" : undefined} className={cn(navLink, isActive("/realisations") && navActive)}>
                {t("portfolio")}
              </Link>
              <Link href="/blog" aria-current={isActive("/blog") ? "page" : undefined} className={cn(navLink, isActive("/blog") && navActive)}>
                {t("blog")}
              </Link>
              <Link href={contactHref} onClick={onContactClick} className={navLink}>{t("contact")}</Link>
              <LanguageSwitcher />
            </nav>

            <Link
              href={contactHref}
              onClick={onContactClick}
              className="hidden items-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-elegant transition hover:bg-neutral-800 active:scale-[0.98] md:inline-flex"
            >
              <Phone className="mr-2 h-4 w-4" />
              {t("freeQuote")}
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="-mr-2 rounded-md p-2 text-neutral-900 active:scale-95 md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" />
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
            <LanguageSwitcher variant="dark" />
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
