"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
] as const;

/** Round FR / EN toggle in a pill-shaped track; the active language is filled. */
export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dark = variant === 'dark';

  return (
    <div
      role="group"
      aria-label="Langue"
      className={cn('flex items-center gap-0.5 rounded-full p-1', dark ? 'bg-white/10' : 'border border-neutral-200 bg-neutral-100/80')}
    >
      {LOCALES.map((l) => {
        const active = locale === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => router.replace(pathname, { locale: l.code })}
            aria-pressed={active}
            title={l.name}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold tracking-wide transition active:scale-95',
              active
                ? dark ? 'bg-white text-neutral-950 shadow-sm' : 'bg-neutral-950 text-white shadow-sm'
                : dark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-950',
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
