import { Fixture, Prediction, OddsResponse, ParsedOdds, MatchData, LeagueGroup, CalculatedProbs } from './types';

const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY || '';

// Major league IDs to display (top leagues only)
const MAJOR_LEAGUE_IDS = new Set([
  // England
  39,   // Premier League
  40,   // Championship
  41,   // League One
  42,   // League Two
  43,   // National League
  45,   // FA Cup
  48,   // League Cup
  // Spain
  140,  // La Liga
  141,  // Segunda División
  143,  // Copa del Rey
  // Germany
  78,   // Bundesliga
  79,   // 2. Bundesliga
  81,   // DFB Pokal
  // Italy
  135,  // Serie A
  136,  // Serie B
  137,  // Coppa Italia
  // France
  61,   // Ligue 1
  62,   // Ligue 2
  66,   // Coupe de France
  // Turkey
  203,  // Süper Lig
  204,  // 1. Lig
  205,  // TFF 2. Lig
  206,  // Türkiye Kupası
  // Netherlands
  88,   // Eredivisie
  89,   // Eerste Divisie
  // Portugal
  94,   // Primeira Liga
  95,   // Segunda Liga
  // Belgium
  144,  // Pro League
  // Scotland
  179,  // Premiership
  180,  // Championship
  // Austria
  218,  // Bundesliga
  219,  // 2. Liga
  // Switzerland
  207,  // Super League
  208,  // Challenge League
  // Greece
  197,  // Super League
  // Russia
  235,  // Premier League
  // Ukraine
  333,  // Premier League
  // Poland
  106,  // Ekstraklasa
  // Czech Republic
  345,  // First League
  // Denmark
  119,  // Superliga
  // Sweden
  113,  // Allsvenskan
  // Finland
  244,  // Veikkausliiga
  // Norway
  103,  // Eliteserien
  // Croatia
  210,  // HNL
  // Serbia
  286,  // Super Liga
  // Romania
  283,  // Liga I
  // Hungary
  271,  // NB I
  // Bulgaria
  172,  // First League
  // Brazil
  71,   // Serie A
  72,   // Serie B
  73,   // Copa do Brasil
  // Argentina
  128,  // Liga Profesional
  130,  // Copa Argentina
  // Mexico
  262,  // Liga MX
  // USA
  253,  // MLS
  // Colombia
  239,  // Primera A
  // Chile
  265,  // Primera División
  // Uruguay
  268,  // Primera División
  // Paraguay
  157,  // División de Honor
  // Peru
  281,  // Liga 1
  // Japan
  98,   // J1 League
  // South Korea
  292,  // K League 1
  // Australia
  188,  // A-League
  // Saudi Arabia
  307,  // Saudi Pro League
  // UAE
  310,  // Pro League
  // Qatar
  305,  // Stars League
  // China
  169,  // Super League
  // India
  323,  // Indian Super League
  // Egypt
  233,  // Premier League
  // South Africa
  288,  // Premier Soccer League
  // Morocco
  200,  // Botola Pro
  // Tunisia
  202,  // Ligue 1
  // Wales
  110,  // Premier League
  // Ireland
  357,  // Premier Division
  // Cyprus
  318,  // 1. Division
  // Israel
  384,  // Ligat Ha'Al
  // UEFA
  2,    // Champions League
  3,    // Europa League
  848,  // Conference League
  531,  // UEFA Super Cup
  // FIFA / International
  1,    // World Cup
  4,    // Euro Championship
  9,    // Copa America
  29,   // World Cup Qualifiers - Europe
  30,   // World Cup Qualifiers - South America
  31,   // World Cup Qualifiers - Africa
  32,   // World Cup Qualifiers - Asia
  15,   // FIFA Club World Cup
  // Other
  10,   // Friendlies
]);

// In-memory cache to minimize API calls
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (fixtures, predictions, standings)
const ODDS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes (re-check for new fixtures not yet locked)

// Write-once odds lock: first fetched value for a fixture is never overwritten.
// Prevents displayed percentages from drifting when bookmakers move their lines —
// important for consistency with blog analysis posts written at a specific moment.
const lockedFixtureOdds = new Map<number, ParsedOdds>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Run promises in batches with delays to avoid hitting rate limits (300 req/min)
async function batchedPromiseAll<T>(tasks: (() => Promise<T>)[], batchSize = 25): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    if (i > 0) await delay(100); // 100ms pause between batches
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn => fn()));
    results.push(...batchResults);
  }
  return results;
}

async function apiFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T[]> {
  const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T[];
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  // Retry up to 3 times with backoff on rate limit
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': API_KEY,
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      throw new Error(`API Football error: ${res.status}`);
    }

    const data = await res.json();
    // errors can be [] (empty array) or {"rateLimit": "..."} (object)
    if (data.errors && !Array.isArray(data.errors) && data.errors.rateLimit) {
      console.warn(`[API] Rate limit hit (attempt ${attempt + 1}): ${data.errors.rateLimit}`);
      await delay(3000);
      continue;
    }
    // Log any other non-empty errors
    if (data.errors && !Array.isArray(data.errors) && Object.keys(data.errors).length > 0) {
      console.warn(`[API] Error for ${endpoint}:`, JSON.stringify(data.errors));
    }
    if (data.errors?.requests) {
      console.warn(`[API] Daily limit reached: ${data.errors.requests}`);
      return [];
    }
    const result = data.response || [];
    if (result.length > 0) {
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
    }
    return result;
  }

  console.warn(`[API] Rate limit persists after retries for ${endpoint}`);
  return [];
}

// Fetch all odds for a date in one call (with pagination)
async function fetchAllOddsForDate(date: string): Promise<Map<number, ParsedOdds>> {
  // Seed the result map with already-locked odds — these are never overwritten
  const oddsMap = new Map<number, ParsedOdds>(lockedFixtureOdds);

  let page = 1;
  const maxPages = 10; // safety limit

  while (page <= maxPages) {
    const cacheKey = `/odds?date=${date}&page=${page}`;
    const cached = cache.get(cacheKey);
    let oddsData: OddsResponse[];

    if (cached && Date.now() - cached.timestamp < ODDS_CACHE_TTL) {
      oddsData = cached.data as OddsResponse[];
    } else {
      const url = new URL(`${BASE_URL}/odds`);
      url.searchParams.append('date', date);
      url.searchParams.append('page', page.toString());

      let fetched = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch(url.toString(), {
          headers: { 'x-apisports-key': API_KEY },
          next: { revalidate: 600 },
        });
        if (!res.ok) break;
        const data = await res.json();

        if (data.errors && !Array.isArray(data.errors) && data.errors.rateLimit) {
          console.warn(`[API] Odds rate limit (page ${page}, attempt ${attempt + 1})`);
          await delay(3000);
          continue;
        }

        oddsData = data.response || [];
        if (oddsData.length > 0) {
          cache.set(cacheKey, { data: oddsData, timestamp: Date.now() });
        }

        // Check pagination
        const totalPages = data.paging?.total || 1;
        fetched = true;

        for (const odd of oddsData) {
          // Write-once: skip if this fixture's odds are already locked
          if (lockedFixtureOdds.has(odd.fixture.id)) continue;
          const parsed = parseOdds(odd);
          if (parsed) {
            lockedFixtureOdds.set(odd.fixture.id, parsed); // lock it in
            oddsMap.set(odd.fixture.id, parsed);
          }
        }

        if (page >= totalPages) return oddsMap;
        break;
      }

      if (!fetched) break; // API error, stop paginating
    }

    // For cached pages, also apply write-once logic
    if (cached) {
      for (const odd of (cached.data as OddsResponse[])) {
        if (lockedFixtureOdds.has(odd.fixture.id)) continue;
        const parsed = parseOdds(odd);
        if (parsed) {
          lockedFixtureOdds.set(odd.fixture.id, parsed);
          oddsMap.set(odd.fixture.id, parsed);
        }
      }
    }

    page++;
  }

  console.log(`[API] Fetched odds for ${oddsMap.size} fixtures in ${page - 1} page(s)`);
  return oddsMap;
}

async function fetchPredictionsForFixtures(fixtures: Fixture[]): Promise<Map<number, Prediction>> {
  const predMap = new Map<number, Prediction>();
  const results = await batchedPromiseAll(
    fixtures.map(f => () => apiFetch<Prediction>('/predictions', { fixture: f.fixture.id.toString() })),
    10 // larger batch size since these are small calls
  );
  for (let i = 0; i < fixtures.length; i++) {
    if (results[i].length > 0) {
      predMap.set(fixtures[i].fixture.id, results[i][0]);
    }
  }
  return predMap;
}

export async function fetchFixturesByDate(date: string): Promise<Fixture[]> {
  return apiFetch<Fixture>('/fixtures', { date });
}

export async function fetchPredictions(fixtureId: number): Promise<Prediction | null> {
  const results = await apiFetch<Prediction>('/predictions', { fixture: fixtureId.toString() });
  return results[0] || null;
}

export async function fetchOdds(fixtureId: number): Promise<OddsResponse | null> {
  const results = await apiFetch<OddsResponse>('/odds', { fixture: fixtureId.toString() });
  return results[0] || null;
}

export function parseOdds(oddsData: OddsResponse | null): ParsedOdds | null {
  if (!oddsData || !oddsData.bookmakers?.length) return null;

  const result: ParsedOdds = {
    matchWinner: { home: '-', draw: '-', away: '-' },
    overUnder25: { over: '-', under: '-' },
    overUnder35: { over: '-', under: '-' },
    btts: { yes: '-', no: '-' },
    corners95: { over: '-', under: '-' },
    fhBtts: { yes: '-', no: '-' },
    fhOverUnder15: { over: '-', under: '-' },
  };

  // Collect all bets from all bookmakers (use first found for each type)
  const allBets: typeof oddsData.bookmakers[0]['bets'] = [];
  for (const bookmaker of oddsData.bookmakers) {
    allBets.push(...bookmaker.bets);
  }

  for (const bet of allBets) {
    if (bet.name === 'Match Winner' && result.matchWinner.home === '-') {
      for (const v of bet.values) {
        if (v.value === 'Home') result.matchWinner.home = v.odd;
        if (v.value === 'Draw') result.matchWinner.draw = v.odd;
        if (v.value === 'Away') result.matchWinner.away = v.odd;
      }
    }
    if ((bet.name === 'Goals Over/Under' || bet.name === 'Over/Under 2.5') && result.overUnder25.over === '-') {
      for (const v of bet.values) {
        if (v.value === 'Over 2.5') result.overUnder25.over = v.odd;
        if (v.value === 'Under 2.5') result.overUnder25.under = v.odd;
        if (v.value === 'Over 3.5') result.overUnder35.over = v.odd;
        if (v.value === 'Under 3.5') result.overUnder35.under = v.odd;
      }
    }
    if (bet.name === 'Both Teams Score' && result.btts.yes === '-') {
      for (const v of bet.values) {
        if (v.value === 'Yes') result.btts.yes = v.odd;
        if (v.value === 'No') result.btts.no = v.odd;
      }
    }
    // Corners Over/Under - pick the main line (first over/under pair)
    if ((bet.name === 'Corners Over Under' || bet.name === 'Total Corners' || bet.name === 'Corners Over/Under') && result.corners95.over === '-') {
      const overValues = bet.values.filter(v => v.value.startsWith('Over'));
      const underValues = bet.values.filter(v => v.value.startsWith('Under'));
      if (overValues.length > 0 && underValues.length > 0) {
        // Try 9.5 first, then take the first available pair
        const over95 = bet.values.find(v => v.value === 'Over 9.5');
        const under95 = bet.values.find(v => v.value === 'Under 9.5');
        if (over95 && under95) {
          result.corners95.over = over95.odd;
          result.corners95.under = under95.odd;
        } else {
          result.corners95.over = overValues[0].odd;
          result.corners95.under = underValues[0].odd;
        }
      }
    }
    // First Half BTTS
    if ((bet.name === 'Both Teams Score - First Half' || bet.name === 'Both Teams Score - 1st Half' || bet.name === 'Both Teams To Score - First Half') && result.fhBtts.yes === '-') {
      for (const v of bet.values) {
        if (v.value === 'Yes') result.fhBtts.yes = v.odd;
        if (v.value === 'No') result.fhBtts.no = v.odd;
      }
    }
    // First Half Over/Under
    if ((bet.name === 'Goals Over/Under First Half' || bet.name === 'Goals Over/Under - First Half' || bet.name === 'Over/Under 1.5 - First Half') && result.fhOverUnder15.over === '-') {
      for (const v of bet.values) {
        if (v.value === 'Over 1.5') result.fhOverUnder15.over = v.odd;
        if (v.value === 'Under 1.5') result.fhOverUnder15.under = v.odd;
      }
    }
  }

  return result;
}

// ─── Poisson distribution helpers ────────────────────────────────────────────

function poissonPMF(lambda: number, k: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  // Use log-space to avoid overflow
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 1; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function poissonCDF(lambda: number, n: number): number {
  let p = 0;
  for (let k = 0; k <= n; k++) p += poissonPMF(lambda, k);
  return Math.min(1, p);
}

/**
 * Calculate statistical probabilities from expected goals using Poisson distribution.
 * Used as a fallback when bookmaker odds are unavailable for a specific market.
 */
export function calcPoissonProbs(homeXG: number, awayXG: number): CalculatedProbs {
  const hxg = Math.max(0.1, homeXG);
  const axg = Math.max(0.1, awayXG);
  const totalXG = hxg + axg;

  // Full-match markets
  const over25 = Math.round((1 - poissonCDF(totalXG, 2)) * 100);
  const over35 = Math.round((1 - poissonCDF(totalXG, 3)) * 100);
  const btts = Math.round((1 - Math.exp(-hxg)) * (1 - Math.exp(-axg)) * 100);

  // First-half markets — typically ~42 % of goals occur in the first half
  const fhFactor = 0.42;
  const fhHome = hxg * fhFactor;
  const fhAway = axg * fhFactor;
  const fhTotal = fhHome + fhAway;
  const fhOver15 = Math.round((1 - poissonCDF(fhTotal, 1)) * 100);
  const fhBtts = Math.round((1 - Math.exp(-fhHome)) * (1 - Math.exp(-fhAway)) * 100);

  // Corners — rough model: avg ~4 corners per expected goal + base 5
  const expectedCorners = 5 + totalXG * 4;
  const corners95 = Math.round((1 - poissonCDF(expectedCorners, 9)) * 100);

  return { over25, over35, btts, fhOver15, fhBtts, corners95 };
}

// ─────────────────────────────────────────────────────────────────────────────

export function determinePrediction(prediction: Prediction | null): {
  winner: string;
  score: string;
  stake: string;
} {
  if (!prediction) return { winner: '-', score: '-', stake: 'Small' };

  const { percent, goals } = prediction.predictions;
  const homePercent = parseInt(percent.home) || 0;
  const drawPercent = parseInt(percent.draw) || 0;
  const awayPercent = parseInt(percent.away) || 0;

  let winner = 'Draw';
  let maxPercent = drawPercent;

  if (homePercent > maxPercent) {
    winner = 'Home Win';
    maxPercent = homePercent;
  }
  if (awayPercent > maxPercent) {
    winner = 'Away Win';
    maxPercent = awayPercent;
  }

  const homeGoals = goals.home ? Math.round(parseFloat(goals.home)) : 1;
  const awayGoals = goals.away ? Math.round(parseFloat(goals.away)) : 1;
  const score = `${homeGoals}-${awayGoals}`;

  let stake: string;
  if (maxPercent >= 60) stake = 'Large';
  else if (maxPercent >= 45) stake = 'Medium';
  else stake = 'Small';

  return { winner, score, stake };
}

export function getTeamForm(prediction: Prediction | null, team: 'home' | 'away'): string {
  if (!prediction?.teams?.[team]?.last_5?.form) return '-----';
  return prediction.teams[team].last_5.form.slice(0, 5).padEnd(5, '-');
}

// Fetch team form from standings (1 API call per league)
interface StandingsTeam {
  team: { id: number; name: string };
  form: string | null;
}
interface StandingsResponse {
  league: { standings: StandingsTeam[][] };
}

async function fetchTeamFormsFromStandings(leagueId: number, season: number): Promise<Map<number, string>> {
  const formMap = new Map<number, string>();
  try {
    const seasonsToTry = [season, season - 1];
    for (const s of seasonsToTry) {
      const results = await apiFetch<StandingsResponse>('/standings', { league: leagueId.toString(), season: s.toString() });
      if (results.length > 0 && results[0].league?.standings) {
        for (const group of results[0].league.standings) {
          for (const entry of group) {
            if (entry.form) {
              formMap.set(entry.team.id, entry.form.slice(-5));
            }
          }
        }
        break;
      }
    }
  } catch {
    // Standings not available
  }
  return formMap;
}

// Fallback: compute form from recent finished fixtures
async function computeFormFromFixtures(leagueId: number, season: number): Promise<Map<number, string>> {
  const formMap = new Map<number, string>();
  try {
    const seasonsToTry = [season, season - 1, season + 1];
    for (const s of seasonsToTry) {
      const fixtures = await apiFetch<Fixture>('/fixtures', {
        league: leagueId.toString(),
        season: s.toString(),
        last: '50',
      });

      if (fixtures.length === 0) continue;

      // Filter to finished matches only and sort by date descending
      const finishedStatuses = new Set(['FT', 'AET', 'PEN']);
      const finished = fixtures.filter(f => finishedStatuses.has(f.fixture.status.short));
      if (finished.length === 0) continue;

      // Sort by date descending (newest first)
      finished.sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime());

      const teamResults = new Map<number, string[]>();

      for (const f of finished) {
        const homeId = f.teams.home.id;
        const awayId = f.teams.away.id;

        if (!teamResults.has(homeId)) teamResults.set(homeId, []);
        if (!teamResults.has(awayId)) teamResults.set(awayId, []);

        const homeArr = teamResults.get(homeId)!;
        const awayArr = teamResults.get(awayId)!;

        if (homeArr.length < 5) {
          if (f.teams.home.winner === true) homeArr.push('W');
          else if (f.teams.home.winner === false) homeArr.push('L');
          else homeArr.push('D');
        }

        if (awayArr.length < 5) {
          if (f.teams.away.winner === true) awayArr.push('W');
          else if (f.teams.away.winner === false) awayArr.push('L');
          else awayArr.push('D');
        }
      }

      for (const [teamId, results] of teamResults) {
        if (results.length > 0) {
          formMap.set(teamId, results.join(''));
        }
      }
      break; // Found fixtures, stop trying
    }
  } catch {
    // ignore
  }
  return formMap;
}

async function fetchTeamForms(leagueId: number, season: number): Promise<Map<number, string>> {
  // Use standings API only (1 call per league, cheapest option)
  return fetchTeamFormsFromStandings(leagueId, season);
}

export async function getMatchesGroupedByLeague(date: string): Promise<LeagueGroup[]> {
  // Step 1: Fetch all fixtures for the date (1 API call)
  const fixtures = await fetchFixturesByDate(date);

  // Step 2: Filter to major leagues and group by league
  console.log(`[API] Total fixtures: ${fixtures.length}`);

  // Remove postponed, cancelled, abandoned fixtures
  const INVALID_STATUSES = new Set(['PST', 'CANC', 'ABD', 'WO', 'AWD']);
  const activeFixtures = fixtures.filter(f => !INVALID_STATUSES.has(f.fixture.status.short));
  console.log(`[API] Active fixtures (non-postponed): ${activeFixtures.length}`);

  // Detect duplicate team appearances on the same day:
  // If a team appears in 2+ fixtures, remove the ones where BOTH teams appear elsewhere
  // (i.e. league match postponed because of European game — keep the European/cup game)
  const teamFixtureCount = new Map<number, number>();
  for (const f of activeFixtures) {
    teamFixtureCount.set(f.teams.home.id, (teamFixtureCount.get(f.teams.home.id) ?? 0) + 1);
    teamFixtureCount.set(f.teams.away.id, (teamFixtureCount.get(f.teams.away.id) ?? 0) + 1);
  }
  // A fixture is "duplicate-conflicted" if both its teams also appear in another fixture.
  // In that case, prefer the fixture with the higher-priority league (lower league ID = bigger competition typically).
  // Simple approach: if a team plays twice, mark both fixtures; then keep the one from the bigger league (UEFA > domestic).
  const UEFA_IDS = new Set([2, 3, 848, 531, 1, 4, 9, 15]);
  const deduplicatedFixtures = activeFixtures.filter(f => {
    const homeCount = teamFixtureCount.get(f.teams.home.id) ?? 1;
    const awayCount = teamFixtureCount.get(f.teams.away.id) ?? 1;
    if (homeCount <= 1 && awayCount <= 1) return true; // no conflict
    // Both teams appear more than once — this fixture is part of a conflict
    // Keep it only if it's a UEFA/international competition; otherwise drop it
    // (the assumption: league match is ertelenmiş, European match is the real one)
    return UEFA_IDS.has(f.league.id);
  });
  console.log(`[API] After deduplication: ${deduplicatedFixtures.length}`);

  const majorFixtures = deduplicatedFixtures.filter(f => MAJOR_LEAGUE_IDS.has(f.league.id));
  console.log(`[API] Major fixtures: ${majorFixtures.length}`);
  const leagueMap = new Map<number, { league: Fixture['league']; fixtures: Fixture[] }>();

  for (const fixture of majorFixtures) {
    const leagueId = fixture.league.id;
    if (!leagueMap.has(leagueId)) {
      leagueMap.set(leagueId, { league: fixture.league, fixtures: [] });
    }
    leagueMap.get(leagueId)!.fixtures.push(fixture);
  }

  // Step 3: Fetch all odds for the date in bulk (1-2 API calls instead of 30-50)
  console.log(`[API] Fetching all odds for ${date}...`);
  const oddsMap = await fetchAllOddsForDate(date);
  console.log(`[API] Got ${oddsMap.size} odds`);

  // Step 4: Only include leagues where at least one fixture has bookmaker odds
  const leaguesWithData: Array<{ league: Fixture['league']; fixtures: Fixture[] }> = [];
  for (const [, entry] of leagueMap) {
    if (entry.fixtures.some(f => oddsMap.has(f.fixture.id))) {
      leaguesWithData.push(entry);
    }
  }
  console.log(`[API] Leagues with data: ${leaguesWithData.length}`);

  // Step 5: Identify fixtures that are missing at least one odds market —
  //         we'll fetch predictions for those to compute Poisson fallback values.
  const allMajorFixtures = leaguesWithData.flatMap(e => e.fixtures);

  function isMissingAnyMarket(odds: ParsedOdds | undefined): boolean {
    if (!odds) return true;
    return (
      odds.overUnder35.over === '-' ||
      odds.btts.yes === '-' ||
      odds.fhBtts.yes === '-' ||
      odds.fhOverUnder15.over === '-' ||
      odds.corners95.over === '-'
    );
  }

  const fixturesNeedingPrediction = allMajorFixtures.filter(f =>
    isMissingAnyMarket(oddsMap.get(f.fixture.id))
  );

  console.log(`[API] Fetching predictions for ${fixturesNeedingPrediction.length} fixtures with missing markets...`);
  const predMap = await fetchPredictionsForFixtures(fixturesNeedingPrediction);
  console.log(`[API] Got ${predMap.size} predictions`);

  // Step 6: Build league groups with odds + Poisson fallback
  const leagueGroups: LeagueGroup[] = [];

  for (const { league, fixtures: leagueFixtures } of leaguesWithData) {
    const matches: MatchData[] = leagueFixtures.map((fixture) => {
      const odds = oddsMap.get(fixture.fixture.id) || null;
      const pred = predMap.get(fixture.fixture.id) || null;

      // Compute Poisson-based probabilities when prediction data is available
      let calculatedProbs: MatchData['calculatedProbs'];
      if (pred) {
        const homeXG = parseFloat(pred.predictions.goals.home) || 1.3;
        const awayXG = parseFloat(pred.predictions.goals.away) || 1.1;
        calculatedProbs = calcPoissonProbs(homeXG, awayXG);
      }

      return {
        fixture: {
          fixture: {
            id: fixture.fixture.id,
            referee: null,
            timezone: 'UTC',
            date: fixture.fixture.date,
            timestamp: fixture.fixture.timestamp,
            status: { long: fixture.fixture.status.long, short: fixture.fixture.status.short, elapsed: null },
          },
          league: { id: league.id, name: league.name, country: league.country, logo: league.logo, flag: league.flag, season: fixture.league.season, round: '' },
          teams: fixture.teams,
          goals: fixture.goals,
          score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
        } as Fixture,
        prediction: null,
        odds,
        calculatedProbs,
      };
    });

    leagueGroups.push({
      league: {
        id: league.id,
        name: league.name,
        country: league.country,
        logo: league.logo,
        flag: league.flag,
      },
      matches,
    });
  }

  return leagueGroups;
}
