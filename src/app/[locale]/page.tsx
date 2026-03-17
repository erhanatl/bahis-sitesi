import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { formatDate } from '@/lib/utils';
import { LeagueGroup } from '@/lib/types';
import PredictionsPage from '@/components/PredictionsPage';
import { unstable_cache } from 'next/cache';

const getCachedMatches = unstable_cache(
  async (date: string) => {
    const result = await getMatchesGroupedByLeague(date);
    if (result.length === 0) {
      throw new Error('No matches found, skip caching');
    }
    return result;
  },
  ['matches-by-date'],
  { revalidate: 3600 }
);

export default async function HomePage() {
  const today = formatDate(new Date());

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

  return <PredictionsPage leagueGroups={leagueGroups} selectedDate={today} />;
}
