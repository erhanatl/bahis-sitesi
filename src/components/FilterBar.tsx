'use client';

import { useTranslations } from 'next-intl';

export type PredictionCategory = 'over25' | 'over35' | 'btts' | 'corners95' | 'fhbtts' | 'fhover15';

interface FilterBarProps {
  leagues: { id: number; name: string }[];
  selectedLeague: string;
  onLeagueChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({
  leagues,
  selectedLeague,
  onLeagueChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const t = useTranslations('filters');

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* League select - left */}
      <div className="relative">
        <select
          value={selectedLeague}
          onChange={(e) => onLeagueChange(e.target.value)}
          className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="all">{t('allLeagues')}</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id.toString()}>
              {league.name}
            </option>
          ))}
        </select>
        <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search input - right */}
      <div className="relative min-w-[180px] max-w-xs">
        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm font-medium text-gray-700 placeholder-gray-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
