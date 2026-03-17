'use client';

import { useTranslations } from 'next-intl';

interface PredictionBadgeProps {
  winner: string;
  score: string;
  stake: string;
}

export default function PredictionBadge({ winner, score, stake }: PredictionBadgeProps) {
  const tPredictions = useTranslations('predictions');
  const tStakes = useTranslations('stakes');

  const getStakeColor = (s: string) => {
    switch (s) {
      case 'Large': return 'text-green-700 font-bold';
      case 'Medium': return 'text-yellow-700 font-semibold';
      default: return 'text-gray-600';
    }
  };

  const getWinnerColor = (w: string) => {
    if (w.includes('Home')) return 'text-blue-700';
    if (w.includes('Away')) return 'text-red-700';
    return 'text-yellow-700';
  };

  const translateStake = (s: string) => {
    switch (s) {
      case 'Large': return tStakes('large');
      case 'Medium': return tStakes('medium');
      case 'Small': return tStakes('small');
      default: return s;
    }
  };

  const translateWinner = (w: string) => {
    switch (w) {
      case 'Home Win': return tPredictions('homeWin');
      case 'Away Win': return tPredictions('awayWin');
      case 'Draw': return tPredictions('draw');
      default: return w;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs ${getStakeColor(stake)}`}>{translateStake(stake)}</span>
      <span className={`text-xs font-semibold ${getWinnerColor(winner)}`}>{translateWinner(winner)}</span>
      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
        {score}
      </span>
    </div>
  );
}
