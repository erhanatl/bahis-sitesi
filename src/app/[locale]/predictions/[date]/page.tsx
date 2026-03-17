import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { LeagueGroup } from '@/lib/types';
import PredictionsPage from '@/components/PredictionsPage';

export default async function PredictionsDatePage({
  params,
}: {
  params: Promise<{ date: string; locale: string }>;
}) {
  const { date } = await params;

  let leagueGroups: LeagueGroup[];
  try {
    leagueGroups = await getMatchesGroupedByLeague(date);
  } catch {
    leagueGroups = [];
  }

  return <PredictionsPage leagueGroups={leagueGroups} selectedDate={date} />;
}
