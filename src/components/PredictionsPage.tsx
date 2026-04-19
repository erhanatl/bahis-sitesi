'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { LeagueGroup, MatchData } from '@/lib/types';
import DateSelector from './DateSelector';
import FilterBar, { PredictionCategory } from './FilterBar';
import MatchRow from './MatchRow';

interface PredictionsPageProps {
  leagueGroups: LeagueGroup[];
  selectedDate: string;
}

function spreadPercent(pct: number): number {
  const factor = 1.4;
  const normalized = (pct - 50) / 50;
  const spread = Math.sign(normalized) * Math.pow(Math.abs(normalized), 1 / factor);
  return Math.round(Math.min(99, Math.max(1, spread * 50 + 50)));
}

function oddsToNormalizedPercent(targetOdds: string, otherOdds: string): number {
  const o1 = parseFloat(targetOdds);
  const o2 = parseFloat(otherOdds);
  if (isNaN(o1) || isNaN(o2) || o1 <= 0 || o2 <= 0) return 0;
  const raw1 = 1 / o1;
  const raw2 = 1 / o2;
  const total = raw1 + raw2;
  const pct = (raw1 / total) * 100;
  return spreadPercent(pct);
}

function getSortValue(match: MatchData, category: PredictionCategory): number {
  const odds = match.odds;
  if (!odds) return 0;
  if (category === 'over25') return oddsToNormalizedPercent(odds.overUnder25.over, odds.overUnder25.under);
  if (category === 'over35') return oddsToNormalizedPercent(odds.overUnder35.over, odds.overUnder35.under);
  if (category === 'btts') return oddsToNormalizedPercent(odds.btts.yes, odds.btts.no);
  if (category === 'corners95') return oddsToNormalizedPercent(odds.corners95.over, odds.corners95.under);
  if (category === 'fhbtts') return oddsToNormalizedPercent(odds.fhBtts.yes, odds.fhBtts.no);
  if (category === 'fhover15') return oddsToNormalizedPercent(odds.fhOverUnder15.over, odds.fhOverUnder15.under);
  return 0;
}

const categoryKeys: { key: PredictionCategory; tKey: string }[] = [
  { key: 'over25', tKey: 'catOver25' },
  { key: 'over35', tKey: 'catOver35' },
  { key: 'fhover15', tKey: 'catFHOver15' },
  { key: 'btts', tKey: 'catBTTS' },
  { key: 'fhbtts', tKey: 'catFHBTTS' },
  { key: 'corners95', tKey: 'catCorners95' },
];

export default function PredictionsPage({ leagueGroups, selectedDate }: PredictionsPageProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<PredictionCategory | 'time' | null>(null);
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

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

  const allMatches = useMemo(() => {
    const matches: (MatchData & { leagueId: number })[] = [];
    for (const group of leagueGroups) {
      for (const match of group.matches) {
        matches.push({ ...match, leagueId: group.league.id });
      }
    }
    matches.sort((a, b) => new Date(a.fixture.fixture.date).getTime() - new Date(b.fixture.fixture.date).getTime());
    return matches;
  }, [leagueGroups]);

  const filteredMatches = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = allMatches.filter((match) => {
      if (selectedLeague !== 'all' && match.leagueId.toString() !== selectedLeague) return false;
      const status = match.fixture.fixture.status.short;
      if (['1H', '2H', 'HT', 'ET', 'P', 'BT', 'FT', 'AET', 'PEN'].includes(status)) return false;
      // Hide matches with no real data: odds values all '-' AND no Poisson fallback
      const hasOddsValues = categoryKeys.some(cat => getSortValue(match, cat.key) > 0);
      if (!hasOddsValues && !match.calculatedProbs) return false;
      // Search filter
      if (query) {
        const homeName = match.fixture.teams.home.name.toLowerCase();
        const awayName = match.fixture.teams.away.name.toLowerCase();
        const leagueName = match.fixture.league.name.toLowerCase();
        const country = match.fixture.league.country.toLowerCase();
        if (!homeName.includes(query) && !awayName.includes(query) && !leagueName.includes(query) && !country.includes(query)) {
          return false;
        }
      }
      return true;
    });
    if (sortColumn === 'time') {
      filtered.sort((a, b) => {
        const tA = new Date(a.fixture.fixture.date).getTime();
        const tB = new Date(b.fixture.fixture.date).getTime();
        return sortDir === 'desc' ? tB - tA : tA - tB;
      });
    } else if (sortColumn) {
      filtered.sort((a, b) => {
        const valA = getSortValue(a, sortColumn);
        const valB = getSortValue(b, sortColumn);
        return sortDir === 'desc' ? valB - valA : valA - valB;
      });
    }
    return filtered;
  }, [allMatches, selectedLeague, searchQuery, sortColumn, sortDir]);

  const handleColumnSort = (col: PredictionCategory | 'time') => {
    if (sortColumn === col) {
      if (col === 'time') {
        // time: asc → desc → clear
        if (sortDir === 'asc') setSortDir('desc');
        else { setSortColumn(null); setSortDir('desc'); }
      } else {
        // categories: desc → asc → clear
        if (sortDir === 'desc') setSortDir('asc');
        else { setSortColumn(null); setSortDir('desc'); }
      }
    } else {
      setSortColumn(col);
      setSortDir(col === 'time' ? 'asc' : 'desc');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-gradient hero-pattern text-white py-10 md:py-14 px-4">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight text-white">
            {t('hero.title')}
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-8">
            {t('hero.description')}
          </p>
          <DateSelector selectedDate={selectedDate} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <FilterBar
          leagues={leagues}
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Match count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-800">{filteredMatches.length}</span> {t('table.match').toLowerCase()}
          </p>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">{t('noMatches')}</p>
            <button
              onClick={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 1);
                const nextStr = next.toISOString().split('T')[0];
                router.push(`/predictions/${nextStr}`);
              }}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:from-emerald-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all"
            >
              {locale === 'tr' ? 'Sonraki Güne Bak' : 'Check Next Day'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-[10px] md:text-xs text-white uppercase">
                    <th
                      className={`py-3 px-3 text-center font-semibold cursor-pointer select-none whitespace-nowrap transition-colors ${
                        sortColumn === 'time' ? 'text-emerald-400' : 'hover:text-emerald-300'
                      }`}
                      style={{ width: 50 }}
                      onClick={() => handleColumnSort('time')}
                    >
                      <span className="inline-flex items-center gap-0.5">{t('table.time')} {sortColumn === 'time'
                        ? (sortDir === 'desc' ? '▼' : '▲')
                        : <span className="text-white/30">⇅</span>
                      }</span>
                    </th>
                    <th className="py-3 px-1 hidden md:table-cell" style={{ width: 28 }}></th>
                    <th className="py-3 px-3 font-semibold">{t('table.match')}</th>
                    {categoryKeys.map((cat) => (
                      <th
                        key={cat.key}
                        className={`py-3 px-1 text-center cursor-pointer select-none whitespace-nowrap transition-colors font-semibold ${
                          sortColumn === cat.key ? 'text-emerald-400' : 'hover:text-emerald-300'
                        }`}
                        style={{ width: 72 }}
                        onClick={() => handleColumnSort(cat.key)}
                      >
                        {t(`filters.${cat.tKey}`)}
                        {' '}
                        {sortColumn === cat.key
                          ? (sortDir === 'desc' ? '▼' : '▲')
                          : <span className="text-white/30">⇅</span>
                        }
                      </th>
                    ))}
                    <th className="py-3 px-2" style={{ width: 45 }}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMatches.map((match) => (
                    <MatchRow
                      key={match.fixture.fixture.id}
                      match={match}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
