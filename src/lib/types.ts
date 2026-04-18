export interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
  };
}

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface Prediction {
  predictions: {
    winner: {
      id: number;
      name: string;
      comment: string;
    };
    win_or_draw: boolean;
    under_over: string | null;
    goals: {
      home: string;
      away: string;
    };
    advice: string;
    percent: {
      home: string;
      draw: string;
      away: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
  };
  teams: {
    home: PredictionTeam;
    away: PredictionTeam;
  };
  comparison: {
    form: { home: string; away: string };
    att: { home: string; away: string };
    def: { home: string; away: string };
    poisson_distribution: { home: string; away: string };
    h2h: { home: string; away: string };
    goals: { home: string; away: string };
    total: { home: string; away: string };
  };
  h2h: Fixture[];
}

export interface PredictionTeam {
  id: number;
  name: string;
  logo: string;
  last_5: {
    form: string;
    att: string;
    def: string;
    goals: {
      for: { total: number; average: string };
      against: { total: number; average: string };
    };
  };
  league: {
    form: string;
    fixtures: {
      played: { home: number; away: number; total: number };
      wins: { home: number; away: number; total: number };
      draws: { home: number; away: number; total: number };
      loses: { home: number; away: number; total: number };
    };
    goals: {
      for: { total: { home: number; away: number; total: number }; average: { home: string; away: string; total: string } };
      against: { total: { home: number; away: number; total: number }; average: { home: string; away: string; total: string } };
    };
  };
}

export interface OddsResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
  };
  fixture: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  id: number;
  name: string;
  bets: Bet[];
}

export interface Bet {
  id: number;
  name: string;
  values: BetValue[];
}

export interface BetValue {
  value: string;
  odd: string;
}

export interface CalculatedProbs {
  over25: number;
  over35: number;
  btts: number;
  fhOver15: number;
  fhBtts: number;
  corners95: number;
}

export interface MatchData {
  fixture: Fixture;
  prediction: Prediction | null;
  odds: ParsedOdds | null;
  homeForm?: string;
  awayForm?: string;
  calculatedProbs?: CalculatedProbs;
}

export interface ParsedOdds {
  matchWinner: { home: string; draw: string; away: string };
  overUnder25: { over: string; under: string };
  overUnder35: { over: string; under: string };
  btts: { yes: string; no: string };
  corners95: { over: string; under: string };
  fhBtts: { yes: string; no: string };
  fhOverUnder15: { over: string; under: string };
}

// Match statistics from /fixtures/statistics
export interface FixtureStatistics {
  team: { id: number; name: string; logo: string };
  statistics: Array<{
    type: string;
    value: number | string | null;
  }>;
}

// Lineups from /fixtures/lineups
export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface FixtureLineup {
  team: { id: number; name: string; logo: string; colors: unknown };
  coach: { id: number; name: string; photo: string };
  formation: string | null;
  startXI: Array<{ player: LineupPlayer }>;
  substitutes: Array<{ player: LineupPlayer }>;
}

// H2H is just Fixture[]

export interface LeagueGroup {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
  };
  matches: MatchData[];
}
