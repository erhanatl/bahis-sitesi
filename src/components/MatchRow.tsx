'use client';

import { MatchData } from '@/lib/types';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import TeamForm from './TeamForm';
import OddsDisplay from './OddsDisplay';

interface MatchRowProps {
  match: MatchData;
}

export default function MatchRow({ match }: MatchRowProps) {
  const t = useTranslations('table');
  const { fixture, odds, homeForm, awayForm } = match;

  const d = new Date(fixture.fixture.date);
  const matchTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const status = fixture.fixture.status.short;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT'].includes(status);
  const isFinished = ['FT', 'AET', 'PEN'].includes(status);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Home Form */}
      <td className="py-2 px-2 hidden lg:table-cell align-middle whitespace-nowrap" style={{ width: 110 }}>
        {homeForm && <TeamForm form={homeForm} />}
      </td>

      {/* Teams */}
      <td className="py-2 px-2 overflow-hidden" style={{ width: 260 }}>
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-12 text-center">
            {isLive ? (
              <span className="text-xs font-bold text-red-600 animate-pulse">
                {fixture.fixture.status.elapsed}&apos;
              </span>
            ) : isFinished ? (
              <span className="text-xs font-bold text-gray-500">MS</span>
            ) : (
              <span className="text-xs font-semibold text-green-700">{matchTime}</span>
            )}
            {(isLive || isFinished) && fixture.goals.home !== null && (
              <div className="text-xs font-bold text-gray-900">
                {fixture.goals.home} - {fixture.goals.away}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-medium text-gray-900">
              {fixture.teams.home.name}
            </span>
            <span className="text-xs text-gray-400 mx-1">v</span>
            <span className="text-sm text-gray-700">
              {fixture.teams.away.name}
            </span>
          </div>
        </div>
        {/* Mobile form */}
        {(homeForm || awayForm) && (
          <div className="flex gap-2 mt-1 lg:hidden ml-14">
            {homeForm && <TeamForm form={homeForm} />}
            {awayForm && <TeamForm form={awayForm} />}
          </div>
        )}
      </td>

      {/* Away Form */}
      <td className="py-2 px-2 hidden lg:table-cell align-middle whitespace-nowrap" style={{ width: 110 }}>
        {awayForm && <TeamForm form={awayForm} />}
      </td>

      {/* Match Odds: 1 X 2 */}
      <td className="py-2 px-1 text-center hidden sm:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.matchWinner.home || '-'} />
      </td>
      <td className="py-2 px-1 text-center hidden sm:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.matchWinner.draw || '-'} />
      </td>
      <td className="py-2 px-1 text-center hidden sm:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.matchWinner.away || '-'} />
      </td>

      {/* O/U 2.5 */}
      <td className="py-2 px-1 text-center hidden md:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.overUnder25.over || '-'} />
      </td>
      <td className="py-2 px-1 text-center hidden md:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.overUnder25.under || '-'} />
      </td>

      {/* BTTS */}
      <td className="py-2 px-1 text-center hidden md:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.btts.yes || '-'} />
      </td>
      <td className="py-2 px-1 text-center hidden md:table-cell whitespace-nowrap" style={{ width: 55 }}>
        <OddsDisplay value={odds?.btts.no || '-'} />
      </td>

      {/* Detail link */}
      <td className="py-2 px-2" style={{ width: 55 }}>
        <Link
          href={`/match/${fixture.fixture.id}`}
          className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          {t('more')}
        </Link>
      </td>
    </tr>
  );
}
