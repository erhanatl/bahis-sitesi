import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { formatDate } from '@/lib/utils';
import { LeagueGroup } from '@/lib/types';
import PredictionsPage from '@/components/PredictionsPage';

export default async function HomePage() {
  const today = formatDate(new Date());

  let leagueGroups: LeagueGroup[];
  try {
    leagueGroups = await getMatchesGroupedByLeague(today);
  } catch {
    leagueGroups = [];
  }

  return <PredictionsPage leagueGroups={leagueGroups} selectedDate={today} />;
}
