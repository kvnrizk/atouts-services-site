"use client";

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TrackedPhoneLink } from '@/components/TrackedPhoneLink';
import { cn } from '@/lib/utils';

/**
 * Mobile-only quote/call bar. It slides in once the visitor has scrolled past the hero
 * (so it never covers the hero's figures) and steps aside while the #contact form is on screen.
 */
export function StickyMobileCTA() {
  const t = useTranslations('mobileCTA');
  const [pastHero, setPastHero] = useState(false);
  const [formOnScreen, setFormOnScreen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setPastHero(window.scrollY > window.innerHeight * 0.7);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const form = document.getElementById('contact');
    const observer = form
      ? new IntersectionObserver(([entry]) => setFormOnScreen(entry.isIntersecting), { threshold: 0.1 })
      : null;
    if (form && observer) observer.observe(form);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !formOnScreen;

  const handleClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-950/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition duration-300 ease-out md:hidden motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClick}
          tabIndex={visible ? 0 : -1}
          className="flex-1 rounded-md bg-sky-400 px-4 py-3 font-semibold text-neutral-950 active:scale-[0.98]"
        >
          {t('freeQuote')}
        </button>
        <TrackedPhoneLink
          location="sticky-mobile-cta"
          aria-label="Appeler"
          tabIndex={visible ? 0 : -1}
          className="flex w-12 shrink-0 items-center justify-center rounded-md border border-white/25 text-white active:scale-95"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </TrackedPhoneLink>
      </div>
    </div>
  );
}
