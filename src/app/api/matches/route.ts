import { NextRequest, NextResponse } from 'next/server';
import { getMatchesGroupedByLeague, parseOdds } from '@/lib/api-football';

function spreadPercent(pct: number): number {
  const factor = 1.4;
  const normalized = (pct - 50) / 50;
  const spread = Math.sign(normalized) * Math.pow(Math.abs(normalized), 1 / factor);
  return Math.round(Math.min(99, Math.max(1, spread * 50 + 50)));
}

function oddsToNormalizedPercent(a: string, b: string): number {
  const o1 = parseFloat(a);
  const o2 = parseFloat(b);
  if (isNaN(o1) || isNaN(o2) || o1 <= 0 || o2 <= 0) return 0;
  const raw1 = 1 / o1;
  const raw2 = 1 / o2;
  return spreadPercent((raw1 / (raw1 + raw2)) * 100);
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date param required (YYYY-MM-DD)' }, { status: 400 });
  }

  const groups = await getMatchesGroupedByLeague(date);

  const matches = groups.flatMap(group =>
    group.matches.map(match => {
      const o = match.odds;
      const pcts = {
        over25:   o ? oddsToNormalizedPercent(o.overUnder25.over,   o.overUnder25.under)  : 0,
        over35:   o ? oddsToNormalizedPercent(o.overUnder35.over,   o.overUnder35.under)  : 0,
        fhover15: o ? oddsToNormalizedPercent(o.fhOverUnder15.over, o.fhOverUnder15.under): 0,
        btts:     o ? oddsToNormalizedPercent(o.btts.yes,           o.btts.no)            : 0,
        fhbtts:   o ? oddsToNormalizedPercent(o.fhBtts.yes,        o.fhBtts.no)          : 0,
        corners:  o ? oddsToNormalizedPercent(o.corners95.over,     o.corners95.under)    : 0,
      };
      const hasAny60 = Object.values(pcts).some(v => v >= 60);
      const d = new Date(match.fixture.fixture.date);
      return {
        fixtureId: match.fixture.fixture.id,
        home: match.fixture.teams.home.name,
        away: match.fixture.teams.away.name,
        league: match.fixture.league.name,
        country: match.fixture.league.country,
        date,
        time: `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`,
        status: match.fixture.fixture.status.short,
        pcts,
        hasAny60,
      };
    })
  );

  return NextResponse.json({ date, matches });
}
