import { NextResponse } from 'next/server';
import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { formatDate } from '@/lib/utils';

export async function GET() {
  const today = formatDate(new Date());
  const hasKey = !!process.env.API_FOOTBALL_KEY;
  const keyPrefix = process.env.API_FOOTBALL_KEY?.slice(0, 4) || 'NONE';

  try {
    const groups = await getMatchesGroupedByLeague(today);
    return NextResponse.json({
      hasKey,
      keyPrefix,
      date: today,
      leagueCount: groups.length,
      leagues: groups.map(g => ({
        name: g.league.name,
        matches: g.matches.length,
        sampleOdds: g.matches[0]?.odds || null,
      })),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ hasKey, keyPrefix, date: today, error: message }, { status: 500 });
  }
}
