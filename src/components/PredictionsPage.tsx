'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LeagueGroup } from '@/lib/types';
import { determinePrediction } from '@/lib/api-football';
import DateSelector from './DateSelector';
import FilterBar from './FilterBar';
import LeagueSection from './LeagueSection';

interface PredictionsPageProps {
  leagueGroups: LeagueGroup[];
  selectedDate: string;
}

export default function PredictionsPage({ leagueGroups, selectedDate }: PredictionsPageProps) {
  const t = useTranslations();
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedStake, setSelectedStake] = useState('all');
  const [selectedPrediction, setSelectedPrediction] = useState('all');

  // Listen for league filter events from Header
  useEffect(() => {
    const handler = (e: Event) => {
      const { type, value } = (e as CustomEvent).detail;
      if (type === 'all') {
        setSelectedLeague('all');
      } else if (type === 'id') {
        setSelectedLeague(value.toString());
      }
    };
    window.addEventListener('filterLeague', handler);
    return () => window.removeEventListener('filterLeague', handler);
  }, []);

  const leagues = useMemo(
    () => leagueGroups.map((g) => ({ id: g.league.id, name: `${g.league.country} - ${g.league.name}` })),
    [leagueGroups]
  );

  const hasPredictions = useMemo(
    () => leagueGroups.some((g) => g.matches.some((m) => m.prediction !== null)),
    [leagueGroups]
  );

  const filteredGroups = useMemo(() => {
    return leagueGroups
      .filter((group) => {
        if (selectedLeague !== 'all' && group.league.id.toString() !== selectedLeague) return false;
        return true;
      })
      .map((group) => ({
        ...group,
        matches: group.matches.filter((match) => {
          if (!hasPredictions) return true;
          const { winner, stake } = determinePrediction(match.prediction);
          if (selectedStake !== 'all' && stake !== selectedStake) return false;
          if (selectedPrediction !== 'all' && winner !== selectedPrediction) return false;
          return true;
        }),
      }))
      .filter((group) => group.matches.length > 0);
  }, [leagueGroups, selectedLeague, selectedStake, selectedPrediction, hasPredictions]);

  const resetFilters = () => {
    setSelectedLeague('all');
    setSelectedStake('all');
    setSelectedPrediction('all');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-hero-bg text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
            {t('hero.title')}
          </h1>
          <p className="text-sm text-gray-200 max-w-2xl mx-auto mb-6">
            {t('hero.description')}
          </p>
          <DateSelector selectedDate={selectedDate} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FilterBar
          leagues={leagues}
          selectedLeague={selectedLeague}
          selectedStake={selectedStake}
          selectedPrediction={selectedPrediction}
          onLeagueChange={setSelectedLeague}
          onStakeChange={setSelectedStake}
          onPredictionChange={setSelectedPrediction}
          onReset={resetFilters}
          hasPredictions={hasPredictions}
        />

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('noMatches')}</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.league.id} id={`league-${group.league.id}`}>
              <LeagueSection leagueGroup={group} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
