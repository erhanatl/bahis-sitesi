'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { formatDate } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import InstallPWA from './InstallPWA';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-1 group">
              <Image
                src="/panda-icon.png"
                alt="PandaTips"
                width={96}
                height={96}
                className="h-24 w-24 object-contain group-hover:scale-105 transition-transform shrink-0"
                priority
              />
              <span className="text-2xl font-black tracking-tight -ml-4">
                <span className="text-white">panda</span>
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">tips</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('predictionsToday')}
              </Link>
              <Link
                href={`/predictions/${tomorrowDate}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === `/predictions/${tomorrowDate}`
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('tomorrow')}
              </Link>
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/blog'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('blog')}
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/contact'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('contact')}
              </Link>
              <div className="ml-3 pl-3 border-l border-white/10 flex items-center gap-2">
                <InstallPWA />
                <LanguageSwitcher />
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary-dark/95 backdrop-blur-md border-b border-white/10">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                pathname === '/'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {t('predictionsToday')}
            </Link>
            <Link
              href={`/predictions/${tomorrowDate}`}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                pathname === `/predictions/${tomorrowDate}`
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {t('tomorrow')}
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                pathname === '/blog'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {t('blog')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                pathname === '/contact'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
