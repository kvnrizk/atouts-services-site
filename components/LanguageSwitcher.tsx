"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'fr' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  const button = (active: boolean) =>
    cn(
      'rounded px-2 py-1 transition-colors active:scale-95',
      variant === 'dark'
        ? active ? 'bg-white font-semibold text-neutral-950' : 'text-neutral-400 hover:text-white'
        : active ? 'bg-neutral-950 font-semibold text-white' : 'text-neutral-500 hover:text-neutral-950',
    );

  return (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label="Langue">
      <button type="button" onClick={() => switchLocale('fr')} aria-pressed={locale === 'fr'} className={button(locale === 'fr')}>
        FR
      </button>
      <span className={variant === 'dark' ? 'text-neutral-700' : 'text-neutral-300'}>|</span>
      <button type="button" onClick={() => switchLocale('en')} aria-pressed={locale === 'en'} className={button(locale === 'en')}>
        EN
      </button>
    </div>
  );
}
