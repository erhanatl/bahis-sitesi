import { Fixture, Prediction, OddsResponse, ParsedOdds, MatchData, LeagueGroup } from './types';

const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY || '';

// Major league IDs to display (top leagues only)
const MAJOR_LEAGUE_IDS = new Set([
  // England
  39,   // Premier League
  40,   // Championship
  41,   // League One
  42,   // League Two
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
  // Austria
  218,  // Bundesliga
  // Switzerland
  207,  // Super League
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
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Run promises in batches with delays to avoid hitting rate limits (300 req/min)
async function batchedPromiseAll<T>(tasks: (() => Promise<T>)[], batchSize = 5): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    if (i > 0) await delay(500); // 500ms pause between batches
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
      cache: 'no-store',
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

// Fetch odds by individual league
async function fetchOddsByLeagues(date: string, leagues: Array<{ id: number; season: number }>): Promise<Map<number, ParsedOdds>> {
  const oddsMap = new Map<number, ParsedOdds>();
  const results = await batchedPromiseAll(
    leagues.map(l => () => apiFetch<OddsResponse>('/odds', {
      date,
      league: l.id.toString(),
      season: l.season.toString(),
    }))
  );
  for (const odds of results) {
    for (const odd of odds) {
      const parsed = parseOdds(odd);
      if (parsed) {
        oddsMap.set(odd.fixture.id, parsed);
      }
    }
  }
  return oddsMap;
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

  const bookmaker = oddsData.bookmakers[0];
  const result: ParsedOdds = {
    matchWinner: { home: '-', draw: '-', away: '-' },
    overUnder25: { over: '-', under: '-' },
    btts: { yes: '-', no: '-' },
  };

  for (const bet of bookmaker.bets) {
    if (bet.name === 'Match Winner') {
      for (const v of bet.values) {
        if (v.value === 'Home') result.matchWinner.home = v.odd;
        if (v.value === 'Draw') result.matchWinner.draw = v.odd;
        if (v.value === 'Away') result.matchWinner.away = v.odd;
      }
    }
    if (bet.name === 'Goals Over/Under' || bet.name === 'Over/Under 2.5') {
      for (const v of bet.values) {
        if (v.value === 'Over 2.5') result.overUnder25.over = v.odd;
        if (v.value === 'Under 2.5') result.overUnder25.under = v.odd;
      }
    }
    if (bet.name === 'Both Teams Score') {
      for (const v of bet.values) {
        if (v.value === 'Yes') result.btts.yes = v.odd;
        if (v.value === 'No') result.btts.no = v.odd;
      }
    }
  }

  return result;
}

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
  const majorFixtures = fixtures.filter(f => MAJOR_LEAGUE_IDS.has(f.league.id));
  const leagueMap = new Map<number, { league: Fixture['league']; fixtures: Fixture[] }>();

  for (const fixture of majorFixtures) {
    const leagueId = fixture.league.id;
    if (!leagueMap.has(leagueId)) {
      leagueMap.set(leagueId, { league: fixture.league, fixtures: [] });
    }
    leagueMap.get(leagueId)!.fixtures.push(fixture);
  }

  // Step 3: Fetch odds per league (1 API call per league, cached)
  const leagueEntries = Array.from(leagueMap.values()).map(e => ({
    id: e.league.id,
    season: e.league.season,
  }));
  const oddsMap = await fetchOddsByLeagues(date, leagueEntries);

  // Step 4: Determine which leagues have odds, then fetch forms for those
  const leaguesWithOdds: Array<{ league: Fixture['league']; fixtures: Fixture[] }> = [];
  for (const [, entry] of leagueMap) {
    if (entry.fixtures.some(f => oddsMap.has(f.fixture.id))) {
      leaguesWithOdds.push(entry);
    }
  }

  // Step 5: Fetch team forms (batched to avoid rate limits)
  const formMaps = await batchedPromiseAll(
    leaguesWithOdds.map(entry => () => fetchTeamForms(entry.league.id, entry.league.season))
  );
  const teamFormMap = new Map<number, string>();
  for (const fm of formMaps) {
    for (const [teamId, form] of fm) {
      teamFormMap.set(teamId, form);
    }
  }

  // Step 6: Build league groups
  const leagueGroups: LeagueGroup[] = [];

  for (const { league, fixtures: leagueFixtures } of leaguesWithOdds) {
    const matches: MatchData[] = leagueFixtures.map((fixture) => ({
      fixture,
      prediction: null,
      odds: oddsMap.get(fixture.fixture.id) || null,
      homeForm: teamFormMap.get(fixture.teams.home.id) || undefined,
      awayForm: teamFormMap.get(fixture.teams.away.id) || undefined,
    }));

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
