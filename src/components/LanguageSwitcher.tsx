'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLocale('tr')}
        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
          locale === 'tr'
            ? 'bg-yellow-400 text-green-900'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        TR
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
          locale === 'en'
            ? 'bg-yellow-400 text-green-900'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        EN
      </button>
    </div>
  );
}
