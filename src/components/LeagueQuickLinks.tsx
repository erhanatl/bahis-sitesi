'use client';

import { useTranslations } from 'next-intl';
import { LeagueGroup } from '@/lib/types';
import Image from 'next/image';

interface LeagueQuickLinksProps {
  leagueGroups: LeagueGroup[];
}

export default function LeagueQuickLinks({ leagueGroups }: LeagueQuickLinksProps) {
  const t = useTranslations('quickLinks');

  const scrollToLeague = (leagueId: number) => {
    const el = document.getElementById(`league-${leagueId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (leagueGroups.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 italic">
        {t('jumpTo')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {leagueGroups.map((group) => (
          <div
            key={group.league.id}
            className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              {group.league.flag && (
                <Image
                  src={group.league.flag}
                  alt={group.league.country}
                  width={20}
                  height={14}
                  className="rounded-sm"
                />
              )}
              <span className="text-sm text-gray-700">
                {group.league.country} {group.league.name} {t('tips')}
              </span>
            </div>
            <button
              onClick={() => scrollToLeague(group.league.id)}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded font-semibold hover:bg-green-600 transition-colors"
            >
              {t('goToTips', { count: group.matches.length })}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
