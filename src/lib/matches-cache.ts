import { unstable_cache } from 'next/cache';
import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { LeagueGroup } from '@/lib/types';

export const getCachedMatches = unstable_cache(
  async (date: string): Promise<LeagueGroup[]> => {
    const result = await getMatchesGroupedByLeague(date);
    if (result.length === 0) {
      throw new Error('No matches found, skip caching');
    }
    return result;
  },
  ['matches-v7'],
  { revalidate: 300 }
);
