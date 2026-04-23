'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Fixture, FixtureStatistics, FixtureLineup, Prediction } from '@/lib/types';
import { formatDate, isToday } from '@/lib/utils';

interface MatchDetailClientProps {
  fixture: Fixture;
  statistics: FixtureStatistics[];
  lineups: FixtureLineup[];
  h2h: Fixture[];
  prediction: Prediction | null;
}

export default function MatchDetailClient({ fixture, statistics, lineups, h2h, prediction }: MatchDetailClientProps) {
  const t = useTranslations('matchDetail');
  const locale = useLocale();

  const tz = locale === 'tr' ? 'Europe/Istanbul' : 'UTC';
  const matchDate = new Date(fixture.fixture.date);
  const matchDateStr = formatDate(matchDate); // YYYY-MM-DD (UTC)
  const backHref = isToday(matchDate) ? '/' : `/predictions/${matchDateStr}`;
  const dateStr = matchDate.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz,
  });
  const timeStr = matchDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: tz,
  });

  const status = fixture.fixture.status;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT'].includes(status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(status.short);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-900 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('backToList')}
      </Link>

      {/* League header */}
      <div className="flex items-center gap-3 mb-6">
        {fixture.league.flag && (
          <Image src={fixture.league.flag} alt={fixture.league.country} width={28} height={20} className="rounded-sm" />
        )}
        {fixture.league.logo && (
          <Image src={fixture.league.logo} alt={fixture.league.name} width={28} height={28} />
        )}
        <div>
          <p className="text-sm font-bold text-gray-800">{fixture.league.country} - {fixture.league.name}</p>
          <p className="text-xs text-gray-500">{fixture.league.round}</p>
        </div>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="bg-primary text-white py-3 px-4 text-center text-sm">
          {isLive ? (
            <span className="font-bold text-yellow-300 animate-pulse">{status.elapsed}&apos; - CANLI</span>
          ) : isFinished ? (
            <span className="font-semibold">{status.long}</span>
          ) : (
            <span>{dateStr} - {timeStr}</span>
          )}
        </div>
        <div className="flex items-center justify-center py-8 px-4 gap-6">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <Image
              src={fixture.teams.home.logo}
              alt={fixture.teams.home.name}
              width={64}
              height={64}
            />
            <span className="text-sm font-bold text-gray-900 text-center">
              {fixture.teams.home.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex-shrink-0 text-center">
            {(isLive || isFinished) && fixture.goals.home !== null ? (
              <div className="text-4xl font-black text-gray-900">
                {fixture.goals.home} - {fixture.goals.away}
              </div>
            ) : (
              <div className="text-3xl font-bold text-gray-400">vs</div>
            )}
            {isFinished && fixture.score.halftime.home !== null && (
              <p className="text-xs text-gray-500 mt-1">
                HT: {fixture.score.halftime.home} - {fixture.score.halftime.away}
              </p>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <Image
              src={fixture.teams.away.logo}
              alt={fixture.teams.away.name}
              width={64}
              height={64}
            />
            <span className="text-sm font-bold text-gray-900 text-center">
              {fixture.teams.away.name}
            </span>
          </div>
        </div>
      </div>

      {/* Match info */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase">{t('matchInfo')}</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-gray-500">{t('date')}</div>
          <div className="text-gray-900 font-medium">{dateStr}</div>
          <div className="text-gray-500">{t('time')}</div>
          <div className="text-gray-900 font-medium">{timeStr}</div>
          <div className="text-gray-500">{t('league')}</div>
          <div className="text-gray-900 font-medium">{fixture.league.name}</div>
          <div className="text-gray-500">{t('round')}</div>
          <div className="text-gray-900 font-medium">{fixture.league.round}</div>
          {fixture.fixture.referee && (
            <>
              <div className="text-gray-500">{t('referee')}</div>
              <div className="text-gray-900 font-medium">{fixture.fixture.referee}</div>
            </>
          )}
          <div className="text-gray-500">{t('status')}</div>
          <div className="text-gray-900 font-medium">{fixture.fixture.status.long}</div>
        </div>
      </div>



      {/* Team Comparison */}
      {prediction?.comparison && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('comparison')}</h3>
          <div className="flex justify-between text-xs font-bold text-gray-700 mb-3 px-1">
            <span>{fixture.teams.home.name}</span>
            <span>{fixture.teams.away.name}</span>
          </div>
          <div className="space-y-3">
            <ComparisonBar label={t('form')} home={prediction.comparison.form.home} away={prediction.comparison.form.away} />
            <ComparisonBar label={t('attack')} home={prediction.comparison.att.home} away={prediction.comparison.att.away} />
            <ComparisonBar label={t('defense')} home={prediction.comparison.def.home} away={prediction.comparison.def.away} />
            <ComparisonBar label={t('poissonDist')} home={prediction.comparison.poisson_distribution.home} away={prediction.comparison.poisson_distribution.away} />
            <ComparisonBar label={t('h2hComparison')} home={prediction.comparison.h2h.home} away={prediction.comparison.h2h.away} />
            <ComparisonBar label={t('goalsComparison')} home={prediction.comparison.goals.home} away={prediction.comparison.goals.away} />
            <ComparisonBar label={t('totalComparison')} home={prediction.comparison.total.home} away={prediction.comparison.total.away} />
          </div>
        </div>
      )}

      {/* Team Form (Last 5) */}
      {prediction?.teams && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('teamForm')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamFormCard
              teamName={fixture.teams.home.name}
              teamLogo={fixture.teams.home.logo}
              team={prediction.teams.home}
              t={t}
              color="green"
            />
            <TeamFormCard
              teamName={fixture.teams.away.name}
              teamLogo={fixture.teams.away.logo}
              team={prediction.teams.away}
              t={t}
              color="blue"
            />
          </div>
        </div>
      )}

      {/* League Statistics */}
      {prediction?.teams && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('leagueStats')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left"></th>
                  <th className="py-2 text-center" colSpan={2}>{fixture.teams.home.name}</th>
                  <th className="py-2 text-center" colSpan={2}>{fixture.teams.away.name}</th>
                </tr>
                <tr className="border-b text-gray-400 text-[10px]">
                  <th className="py-1 text-left"></th>
                  <th className="py-1 text-center">{t('home')}</th>
                  <th className="py-1 text-center">{t('away')}</th>
                  <th className="py-1 text-center">{t('home')}</th>
                  <th className="py-1 text-center">{t('away')}</th>
                </tr>
              </thead>
              <tbody>
                <LeagueStatRow label={t('played')} h={prediction.teams.home.league.fixtures.played} a={prediction.teams.away.league.fixtures.played} />
                <LeagueStatRow label={t('wins')} h={prediction.teams.home.league.fixtures.wins} a={prediction.teams.away.league.fixtures.wins} />
                <LeagueStatRow label={t('draws')} h={prediction.teams.home.league.fixtures.draws} a={prediction.teams.away.league.fixtures.draws} />
                <LeagueStatRow label={t('losses')} h={prediction.teams.home.league.fixtures.loses} a={prediction.teams.away.league.fixtures.loses} />
                <tr className="border-b">
                  <td className="py-2 text-gray-500 font-medium">{t('goalsFor')}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.home.league.goals.for.total.home}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.home.league.goals.for.total.away}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.away.league.goals.for.total.home}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.away.league.goals.for.total.away}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500 font-medium">{t('goalsAgainst')}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.home.league.goals.against.total.home}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.home.league.goals.against.total.away}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.away.league.goals.against.total.home}</td>
                  <td className="py-2 text-center font-semibold text-gray-800">{prediction.teams.away.league.goals.against.total.away}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-500 font-medium">{t('avgGoalsFor')}</td>
                  <td className="py-2 text-center font-semibold text-green-700">{prediction.teams.home.league.goals.for.average.home}</td>
                  <td className="py-2 text-center font-semibold text-green-700">{prediction.teams.home.league.goals.for.average.away}</td>
                  <td className="py-2 text-center font-semibold text-blue-700">{prediction.teams.away.league.goals.for.average.home}</td>
                  <td className="py-2 text-center font-semibold text-blue-700">{prediction.teams.away.league.goals.for.average.away}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500 font-medium">{t('avgGoalsAgainst')}</td>
                  <td className="py-2 text-center font-semibold text-red-600">{prediction.teams.home.league.goals.against.average.home}</td>
                  <td className="py-2 text-center font-semibold text-red-600">{prediction.teams.home.league.goals.against.average.away}</td>
                  <td className="py-2 text-center font-semibold text-red-600">{prediction.teams.away.league.goals.against.average.home}</td>
                  <td className="py-2 text-center font-semibold text-red-600">{prediction.teams.away.league.goals.against.average.away}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics section */}
      {statistics.length === 2 && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('statistics')}</h3>
          <StatisticsSection
            homeTeam={fixture.teams.home.name}
            awayTeam={fixture.teams.away.name}
            homeStats={statistics[0]}
            awayStats={statistics[1]}
            t={t}
          />
        </div>
      )}

      {/* Lineups section */}
      {lineups.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('lineups')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lineups.map((lineup, idx) => (
              <LineupCard key={idx} lineup={lineup} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* H2H section */}
      {h2h.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('h2h')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b">
                  <th className="py-2 text-left">{t('date')}</th>
                  <th className="py-2 text-left">{t('home')}</th>
                  <th className="py-2 text-center"></th>
                  <th className="py-2 text-right">{t('away')}</th>
                </tr>
              </thead>
              <tbody>
                {h2h.map((match) => {
                  const mDate = new Date(match.fixture.date);
                  const mDateStr = mDate.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz,
                  });
                  const homeWin = match.teams.home.winner === true;
                  const awayWin = match.teams.away.winner === true;
                  return (
                    <tr key={match.fixture.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 text-xs text-gray-500">{mDateStr}</td>
                      <td className={`py-2 text-left ${homeWin ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                        {match.teams.home.name}
                      </td>
                      <td className="py-2 text-center font-bold text-gray-900">
                        {match.goals.home !== null ? `${match.goals.home} - ${match.goals.away}` : '-'}
                      </td>
                      <td className={`py-2 text-right ${awayWin ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                        {match.teams.away.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ProbabilityBar({ label, value, color }: { label: string; value: string; color: string }) {
  const num = parseInt(value) || 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="font-bold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${num}%` }}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatisticsSection({ homeTeam, awayTeam, homeStats, awayStats, t }: { homeTeam: string; awayTeam: string; homeStats: FixtureStatistics; awayStats: FixtureStatistics; t: any }) {
  const statKeyMap: Record<string, string> = {
    'Ball Possession': 'possession',
    'Total Shots': 'shots',
    'Shots on Goal': 'shotsOnTarget',
    'Corner Kicks': 'corners',
    'Fouls': 'fouls',
    'Yellow Cards': 'yellowCards',
    'Red Cards': 'redCards',
    'Goalkeeper Saves': 'goals',
  };

  const displayOrder = ['Ball Possession', 'Total Shots', 'Shots on Goal', 'Corner Kicks', 'Fouls', 'Yellow Cards', 'Red Cards'];

  function getStatValue(stats: FixtureStatistics, type: string): string {
    const stat = stats.statistics.find(s => s.type === type);
    if (!stat || stat.value === null) return '0';
    return String(stat.value);
  }

  return (
    <div>
      {/* Team names header */}
      <div className="flex justify-between text-xs font-bold text-gray-700 mb-3 px-1">
        <span>{homeTeam}</span>
        <span>{awayTeam}</span>
      </div>
      <div className="space-y-3">
        {displayOrder.map((statType) => {
          const homeVal = getStatValue(homeStats, statType);
          const awayVal = getStatValue(awayStats, statType);
          const homeNum = parseInt(homeVal) || 0;
          const awayNum = parseInt(awayVal) || 0;
          const total = homeNum + awayNum || 1;
          const homePercent = (homeNum / total) * 100;
          const awayPercent = (awayNum / total) * 100;
          const translationKey = statKeyMap[statType] || statType;

          return (
            <div key={statType}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-900">{homeVal}</span>
                <span className="text-gray-500">{t(translationKey)}</span>
                <span className="font-semibold text-gray-900">{awayVal}</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="flex-1 bg-gray-100 rounded-full overflow-hidden flex justify-end">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${homePercent}%` }}
                  />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${awayPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LineupCard({ lineup, t }: { lineup: FixtureLineup; t: any }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Team header */}
      <div className="flex items-center gap-2 mb-3">
        <Image src={lineup.team.logo} alt={lineup.team.name} width={24} height={24} />
        <span className="text-sm font-bold text-gray-900">{lineup.team.name}</span>
      </div>

      {/* Formation */}
      {lineup.formation && (
        <div className="mb-3">
          <span className="text-xs text-gray-500">{t('formation')}: </span>
          <span className="text-xs font-bold text-gray-800">{lineup.formation}</span>
        </div>
      )}

      {/* Coach */}
      {lineup.coach && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <Image src={lineup.coach.photo} alt={lineup.coach.name} width={28} height={28} className="rounded-full" />
          <div>
            <span className="text-[10px] text-gray-400 uppercase">{t('coach')}</span>
            <p className="text-xs font-medium text-gray-800">{lineup.coach.name}</p>
          </div>
        </div>
      )}

      {/* Starting XI */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-2">{t('startXI')}</p>
        <div className="space-y-1">
          {lineup.startXI.map((p) => (
            <div key={p.player.id} className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 flex items-center justify-center bg-green-100 text-green-800 font-bold rounded text-[10px]">
                {p.player.number}
              </span>
              <span className="text-gray-800">{p.player.name}</span>
              <span className="text-[10px] text-gray-400 ml-auto">{p.player.pos}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Substitutes */}
      {lineup.substitutes.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-semibold mb-2">{t('substitutes')}</p>
          <div className="space-y-1">
            {lineup.substitutes.map((p) => (
              <div key={p.player.id} className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-600 font-bold rounded text-[10px]">
                  {p.player.number}
                </span>
                <span className="text-gray-600">{p.player.name}</span>
                <span className="text-[10px] text-gray-400 ml-auto">{p.player.pos}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonBar({ label, home, away }: { label: string; home: string; away: string }) {
  const homeNum = parseInt(home) || 0;
  const awayNum = parseInt(away) || 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-gray-900">{home}</span>
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{away}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden flex justify-end">
          <div className="bg-green-500 h-full rounded-full" style={{ width: `${homeNum}%` }} />
        </div>
        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${awayNum}%` }} />
        </div>
      </div>
    </div>
  );
}

function FormBadge({ char }: { char: string }) {
  const bg = char === 'W' ? 'bg-green-500 text-white'
    : char === 'D' ? 'bg-yellow-400 text-white'
    : char === 'L' ? 'bg-red-500 text-white'
    : 'bg-gray-200 text-gray-500';
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold ${bg}`}>
      {char}
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TeamFormCard({ teamName, teamLogo, team, t, color }: { teamName: string; teamLogo: string; team: import('@/lib/types').PredictionTeam; t: any; color: 'green' | 'blue' }) {
  const formChars = team.league.form ? team.league.form.split('').slice(-5) : [];
  const last5 = team.last_5;
  const colorClass = color === 'green' ? 'text-green-700' : 'text-blue-700';

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Image src={teamLogo} alt={teamName} width={24} height={24} />
        <span className={`text-sm font-bold ${colorClass}`}>{teamName}</span>
      </div>

      {/* Form badges */}
      {formChars.length > 0 && (
        <div className="flex gap-1 mb-3">
          {formChars.map((c, i) => <FormBadge key={i} char={c} />)}
        </div>
      )}

      {/* Last 5 stats */}
      {last5 && (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">{t('attack')}</div>
            <div className="font-semibold text-gray-800">{last5.att}%</div>
            <div className="text-gray-500">{t('defense')}</div>
            <div className="font-semibold text-gray-800">{last5.def}%</div>
          </div>
          <div className="border-t pt-2 mt-2">
            <p className="text-[10px] text-gray-400 uppercase mb-1">{t('last5Goals')}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">{t('last5GoalsFor')}</div>
              <div className="font-semibold text-green-700">{last5.goals.for.total} ({t('last5Avg')}: {last5.goals.for.average})</div>
              <div className="text-gray-500">{t('last5GoalsAgainst')}</div>
              <div className="font-semibold text-red-600">{last5.goals.against.total} ({t('last5Avg')}: {last5.goals.against.average})</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeagueStatRow({ label, h, a }: { label: string; h: { home: number; away: number; total: number }; a: { home: number; away: number; total: number } }) {
  return (
    <tr className="border-b">
      <td className="py-2 text-gray-500 font-medium">{label}</td>
      <td className="py-2 text-center font-semibold text-gray-800">{h.home}</td>
      <td className="py-2 text-center font-semibold text-gray-800">{h.away}</td>
      <td className="py-2 text-center font-semibold text-gray-800">{a.home}</td>
      <td className="py-2 text-center font-semibold text-gray-800">{a.away}</td>
    </tr>
  );
}