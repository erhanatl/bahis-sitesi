import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { formatDate } from '@/lib/utils';
import { LeagueGroup } from '@/lib/types';
import PredictionsPage from '@/components/PredictionsPage';
import LatestAnalysis from '@/components/LatestAnalysis';
import { getCachedMatches } from '@/lib/matches-cache';
import { getLocale } from 'next-intl/server';

export default async function HomePage() {
  const today = formatDate(new Date());
  const locale = await getLocale();

  let leagueGroups: LeagueGroup[];
  try {
    leagueGroups = await getCachedMatches(today);
  } catch {
    try {
      leagueGroups = await getMatchesGroupedByLeague(today);
    } catch {
      leagueGroups = [];
    }
  }

  return (
    <>
      <PredictionsPage leagueGroups={leagueGroups} selectedDate={today} />
      <LatestAnalysis locale={locale} limit={3} />
    </>
  );
}
