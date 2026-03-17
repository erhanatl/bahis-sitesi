'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { formatDate } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

const leagues = [
  { name: 'Premier League', id: 39 },
  { name: 'La Liga', id: 140 },
  { name: 'Serie A', id: 135 },
  { name: 'Bundesliga', id: 78 },
  { name: 'Ligue 1', id: 61 },
  { name: 'Süper Lig', id: 203 },
];

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }, []);

  const handleLeagueClick = (leagueId: number) => {
    window.dispatchEvent(new CustomEvent('filterLeague', { detail: { type: 'id', value: leagueId } }));
    setMobileOpen(false);
  };

  const handleAllLeagues = () => {
    window.dispatchEvent(new CustomEvent('filterLeague', { detail: { type: 'all' } }));
    setMobileOpen(false);
  };

  return (
    <header>
      {/* Top navbar */}
      <nav className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-xl font-bold tracking-wide text-yellow-300 hover:text-yellow-200">
              BAHIS<span className="text-white">TAHMiN</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/"
                className={`hover:text-yellow-300 transition-colors ${pathname === '/' ? 'text-yellow-300 font-semibold' : ''}`}
              >
                {t('predictionsToday')}
              </Link>
              <Link
                href={`/predictions/${tomorrowDate}`}
                className={`hover:text-yellow-300 transition-colors ${pathname === `/predictions/${tomorrowDate}` ? 'text-yellow-300 font-semibold' : ''}`}
              >
                {t('tomorrow')}
              </Link>
              <LanguageSwitcher />
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-primary-dark text-white">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 px-3 rounded text-sm hover:bg-white/10 ${pathname === '/' ? 'text-yellow-300 font-semibold bg-white/10' : ''}`}
            >
              {t('predictionsToday')}
            </Link>
            <Link
              href={`/predictions/${tomorrowDate}`}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 px-3 rounded text-sm hover:bg-white/10 ${pathname === `/predictions/${tomorrowDate}` ? 'text-yellow-300 font-semibold bg-white/10' : ''}`}
            >
              {t('tomorrow')}
            </Link>
            <div className="border-t border-white/20 pt-3">
              <p className="text-xs text-gray-400 px-3 mb-2 uppercase">{t('allLeagues')}</p>
              {leagues.map((league) => (
                <button
                  key={league.id}
                  onClick={() => handleLeagueClick(league.id)}
                  className="block w-full text-left py-2 px-3 rounded text-sm hover:bg-white/10 hover:text-yellow-300 transition-colors"
                >
                  {league.name}
                </button>
              ))}
              <button
                onClick={handleAllLeagues}
                className="block w-full text-left py-2 px-3 rounded text-sm font-semibold text-yellow-300 hover:bg-white/10 transition-colors"
              >
                {t('allLeagues')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* League bar (desktop) */}
      <div className="hidden md:block bg-primary-dark text-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-10 text-sm whitespace-nowrap">
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => handleLeagueClick(league.id)}
                className="hover:text-yellow-300 transition-colors"
              >
                {league.name}
              </button>
            ))}
            <button
              onClick={handleAllLeagues}
              className="hover:text-yellow-300 transition-colors font-semibold"
            >
              {t('allLeagues')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
