'use client';

import { useTranslations } from 'next-intl';

interface FilterBarProps {
  leagues: { id: number; name: string }[];
  selectedLeague: string;
  selectedStake: string;
  selectedPrediction: string;
  onLeagueChange: (value: string) => void;
  onStakeChange: (value: string) => void;
  onPredictionChange: (value: string) => void;
  onReset: () => void;
  hasPredictions: boolean;
}

export default function FilterBar({
  leagues,
  selectedLeague,
  selectedStake,
  selectedPrediction,
  onLeagueChange,
  onStakeChange,
  onPredictionChange,
  onReset,
  hasPredictions,
}: FilterBarProps) {
  const t = useTranslations('filters');

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4 px-4">
      <select
        value={selectedLeague}
        onChange={(e) => onLeagueChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="all">{t('allLeagues')}</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id.toString()}>
            {league.name}
          </option>
        ))}
      </select>

      {hasPredictions && (
        <>
          <select
            value={selectedStake}
            onChange={(e) => onStakeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t('allStakes')}</option>
            <option value="Small">{t('stakeSmall')}</option>
            <option value="Medium">{t('stakeMedium')}</option>
            <option value="Large">{t('stakeLarge')}</option>
          </select>

          <select
            value={selectedPrediction}
            onChange={(e) => onPredictionChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t('allPredictions')}</option>
            <option value="Home Win">{t('homeWin')}</option>
            <option value="Draw">{t('draw')}</option>
            <option value="Away Win">{t('awayWin')}</option>
          </select>
        </>
      )}

      <button
        onClick={onReset}
        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
      >
        {t('resetFilter')}
      </button>
    </div>
  );
}
