"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'fr' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale('fr')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'fr'
            ? 'bg-blue-600 text-white font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        FR
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
