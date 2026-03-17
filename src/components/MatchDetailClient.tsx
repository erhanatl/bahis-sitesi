'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Fixture, ParsedOdds } from '@/lib/types';

interface MatchDetailClientProps {
  fixture: Fixture;
  odds: ParsedOdds | null;
}

export default function MatchDetailClient({ fixture, odds }: MatchDetailClientProps) {
  const t = useTranslations('matchDetail');

  const matchDate = new Date(fixture.fixture.date);
  const dateStr = `${matchDate.getDate().toString().padStart(2, '0')}.${(matchDate.getMonth() + 1).toString().padStart(2, '0')}.${matchDate.getFullYear()}`;
  const timeStr = `${String(matchDate.getHours()).padStart(2, '0')}:${String(matchDate.getMinutes()).padStart(2, '0')}`;

  const status = fixture.fixture.status;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT'].includes(status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(status.short);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href="/"
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

      {/* Odds section */}
      {odds && (
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">{t('odds')}</h3>
          <div className="space-y-4">
            {/* Match Winner */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">{t('matchResult')}</p>
              <div className="grid grid-cols-3 gap-2">
                <OddBox label={t('home')} value={odds.matchWinner.home} />
                <OddBox label={t('draw')} value={odds.matchWinner.draw} />
                <OddBox label={t('away')} value={odds.matchWinner.away} />
              </div>
            </div>
            {/* O/U 2.5 */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">{t('overUnder')}</p>
              <div className="grid grid-cols-2 gap-2">
                <OddBox label={t('over')} value={odds.overUnder25.over} />
                <OddBox label={t('under')} value={odds.overUnder25.under} />
              </div>
            </div>
            {/* BTTS */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">{t('btts')}</p>
              <div className="grid grid-cols-2 gap-2">
                <OddBox label={t('yes')} value={odds.btts.yes} />
                <OddBox label={t('no')} value={odds.btts.no} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OddBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-odds-bg rounded-lg py-3 px-2 text-center">
      <p className="text-[10px] text-gray-500 uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value !== '-' ? value : '-'}</p>
    </div>
  );
}
