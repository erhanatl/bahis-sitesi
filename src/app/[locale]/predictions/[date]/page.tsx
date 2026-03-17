import { getMatchesGroupedByLeague } from '@/lib/api-football';
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

export default async function PredictionsDatePage({
  params,
}: {
  params: Promise<{ date: string; locale: string }>;
}) {
  const { date } = await params;

  let leagueGroups: LeagueGroup[];
  try {
    leagueGroups = await getCachedMatches(date);
  } catch {
    try {
      leagueGroups = await getMatchesGroupedByLeague(date);
    } catch {
      leagueGroups = [];
    }
  }

  return <PredictionsPage leagueGroups={leagueGroups} selectedDate={date} />;
}
