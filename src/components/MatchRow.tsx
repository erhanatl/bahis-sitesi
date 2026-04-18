'use client';

import { MatchData } from '@/lib/types';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Spread percentages to make differences more visible
// 50% stays at 50%, values above/below get pushed further apart
function spreadPercent(pct: number): number {
  const factor = 1.4; // spread strength (1 = no change, higher = more spread)
  const normalized = (pct - 50) / 50; // -1 to 1
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

function PercentCell({ pct }: { pct: number }) {
  if (pct === 0) return <td className="py-3 px-1 text-center" style={{ width: 72 }}><span className="text-xs text-gray-300">-</span></td>;
  const style = pct >= 65 ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
    : pct >= 55 ? 'bg-emerald-100 text-emerald-700'
    : pct >= 45 ? 'bg-amber-50 text-amber-700'
    : 'bg-gray-50 text-gray-500';
  return (
    <td className="py-3 px-1 text-center" style={{ width: 72 }}>
      <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-md ${style}`}>
        %{pct}
      </span>
    </td>
  );
}

interface MatchRowProps {
  match: MatchData;
}

export default function MatchRow({ match }: MatchRowProps) {
  const t = useTranslations('table');
  const router = useRouter();
  const { fixture } = match;
  const odds = match.odds;

  const d = new Date(fixture.fixture.date);
  const matchTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const status = fixture.fixture.status.short;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT'].includes(status);
  const isFinished = ['FT', 'AET', 'PEN'].includes(status);

  const pctOver25 = odds ? oddsToNormalizedPercent(odds.overUnder25.over, odds.overUnder25.under) : 0;
  const pctOver35 = odds ? oddsToNormalizedPercent(odds.overUnder35.over, odds.overUnder35.under) : 0;
  const pctBtts = odds ? oddsToNormalizedPercent(odds.btts.yes, odds.btts.no) : 0;
  const pctCorners = odds ? oddsToNormalizedPercent(odds.corners95.over, odds.corners95.under) : 0;
  const pctFhBtts = odds ? oddsToNormalizedPercent(odds.fhBtts.yes, odds.fhBtts.no) : 0;
  const pctFhOver15 = odds ? oddsToNormalizedPercent(odds.fhOverUnder15.over, odds.fhOverUnder15.under) : 0;

  const handleRowClick = (e: React.MouseEvent) => {
    // Link tıklamalarını çift tetiklememek için
    if ((e.target as HTMLElement).closest('a')) return;
    router.push(`/match/${fixture.fixture.id}`);
  };

  return (
    <tr
      className="match-row cursor-pointer hover:bg-emerald-50/50 transition-colors"
      onClick={handleRowClick}
    >
      {/* Time */}
      <td className="py-3 px-3 text-center whitespace-nowrap">
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            {fixture.fixture.status.elapsed}&apos;
          </span>
        ) : isFinished ? (
          <span className="text-xs font-bold text-gray-400">MS</span>
        ) : (
          <span className="text-xs font-bold text-slate-700">{matchTime}</span>
        )}
        {(isLive || isFinished) && fixture.goals.home !== null && (
          <div className="text-xs font-black text-gray-900 mt-0.5">
            {fixture.goals.home} - {fixture.goals.away}
          </div>
        )}
      </td>

      {/* League badge */}
      <td className="py-3 px-1 hidden md:table-cell">
        {fixture.league.logo && (
          <Image
            src={fixture.league.logo}
            alt={fixture.league.name}
            width={20}
            height={20}
            title={`${fixture.league.country} - ${fixture.league.name}`}
            className="opacity-70"
          />
        )}
      </td>

      {/* Teams */}
      <td className="py-3 px-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 truncate">
            <Image src={fixture.teams.home.logo} alt="" width={16} height={16} className="shrink-0" />
            <span className="text-[13px] font-semibold text-gray-900 truncate">{fixture.teams.home.name}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Image src={fixture.teams.away.logo} alt="" width={16} height={16} className="shrink-0" />
            <span className="text-[13px] font-semibold text-gray-900 truncate">{fixture.teams.away.name}</span>
          </div>
        </div>
      </td>

      {/* All category percentages */}
      <PercentCell pct={pctOver25} />
      <PercentCell pct={pctOver35} />
      <PercentCell pct={pctFhOver15} />
      <PercentCell pct={pctBtts} />
      <PercentCell pct={pctFhBtts} />
      <PercentCell pct={pctCorners} />

      {/* Detail link */}
      <td className="py-3 px-2 text-right">
        <Link
          href={`/match/${fixture.fixture.id}`}
          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-bold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
        >
          {t('more')}
        </Link>
      </td>
    </tr>
  );
}
