'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LeagueGroup } from '@/lib/types';
import MatchRow from './MatchRow';
import Image from 'next/image';

interface LeagueSectionProps {
  leagueGroup: LeagueGroup;
}

export default function LeagueSection({ leagueGroup }: LeagueSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const t = useTranslations('table');
  const { league, matches } = leagueGroup;

  return (
    <div className="mb-4 bg-white rounded-lg shadow overflow-hidden">
      {/* League Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-table-header text-white hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-3">
          {league.flag && (
            <Image
              src={league.flag}
              alt={league.country}
              width={24}
              height={16}
              className="rounded-sm"
            />
          )}
          {league.logo && (
            <Image
              src={league.logo}
              alt={league.name}
              width={20}
              height={20}
            />
          )}
          <span className="font-bold text-sm uppercase tracking-wide">
            {league.country} - {league.name}
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Match Table */}
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-xs text-gray-600 uppercase">
                <th className="py-2 px-2 text-center hidden lg:table-cell">{t('form')}</th>
                <th className="py-2 px-2 text-center">{t('match')}</th>
                <th className="py-2 px-2 text-center hidden lg:table-cell">{t('form')}</th>
                <th className="py-2 px-1 text-center hidden sm:table-cell" colSpan={3}>
                  {t('prediction')}
                </th>
                <th className="py-2 px-2"></th>
              </tr>
              <tr className="bg-gray-50 text-[10px] text-gray-500">
                <th className="hidden lg:table-cell"></th>
                <th></th>
                <th className="hidden lg:table-cell"></th>
                <th className="py-1 px-1 text-center hidden sm:table-cell">1</th>
                <th className="py-1 px-1 text-center hidden sm:table-cell">X</th>
                <th className="py-1 px-1 text-center hidden sm:table-cell">2</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <MatchRow key={match.fixture.fixture.id} match={match} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
