import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { formatDate } from '@/lib/utils';
import { LeagueGroup } from '@/lib/types';
import PredictionsPage from '@/components/PredictionsPage';
import LatestAnalysis from '@/components/LatestAnalysis';
import { unstable_cache } from 'next/cache';
import { getLocale } from 'next-intl/server';

const getCachedMatches = unstable_cache(
  async (date: string) => {
    const result = await getMatchesGroupedByLeague(date);
    if (result.length === 0) {
      throw new Error('No matches found, skip caching');
    }
    return result;
  },
  ['matches-v4'],
  { revalidate: 600 }
);

export default async function HomePage() {
  const today = formatDate(new Date());
  const locale = await getLocale();

  let leagueGroups: LeagueGroup[];
  try {
    leagueGroups = await getCachedMatches(today);
  } catch {
    // If cached fetch fails (empty result or error), try direct fetch
    try {
      leagueGroups = await getMatchesGroupedByLeague(today);
    } catch {
      leagueGroups = [];
    }
  }

  return (
    <PredictionsPage leagueGroups={leagueGroups} selectedDate={today}>
      <LatestAnalysis locale={locale} limit={3} />
    </PredictionsPage>
  );
}
