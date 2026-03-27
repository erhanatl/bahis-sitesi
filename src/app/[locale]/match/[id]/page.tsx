import { notFound } from 'next/navigation';
import { Fixture, Prediction, FixtureStatistics, FixtureLineup } from '@/lib/types';
import MatchDetailClient from '@/components/MatchDetailClient';
import type { Metadata } from 'next';

const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY || '';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function apiFetch<T>(endpoint: string, params: Record<string, string>): Promise<T[]> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url.toString(), {
      headers: { 'x-apisports-key': API_KEY },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.warn(`[Detail] HTTP ${res.status} for ${endpoint} (attempt ${attempt + 1})`);
      await delay(1500);
      continue;
    }
    const data = await res.json();

    // Handle rate limit
    if (data.errors && !Array.isArray(data.errors) && data.errors.rateLimit) {
      console.warn(`[Detail] Rate limit hit (attempt ${attempt + 1}): ${data.errors.rateLimit}`);
      await delay(3000);
      continue;
    }

    return data.response || [];
  }

  console.warn(`[Detail] All retries exhausted for ${endpoint}`);
  return [];
}

async function getFixture(id: number): Promise<Fixture | null> {
  const results = await apiFetch<Fixture>('/fixtures', { id: id.toString() });
  return results[0] || null;
}

async function getStatistics(id: number): Promise<FixtureStatistics[]> {
  return apiFetch<FixtureStatistics>('/fixtures/statistics', { fixture: id.toString() });
}

async function getLineups(id: number): Promise<FixtureLineup[]> {
  return apiFetch<FixtureLineup>('/fixtures/lineups', { fixture: id.toString() });
}

async function getH2H(homeId: number, awayId: number): Promise<Fixture[]> {
  return apiFetch<Fixture>('/fixtures/headtohead', {
    h2h: `${homeId}-${awayId}`,
    last: '10',
  });
}

async function getPrediction(fixtureId: number): Promise<Prediction | null> {
  const results = await apiFetch<Prediction>('/predictions', { fixture: fixtureId.toString() });
  return results[0] || null;
}

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const fixtureId = parseInt(id);
  if (isNaN(fixtureId)) return {};

  const fixture = await getFixture(fixtureId);
  if (!fixture) return {};

  const home = fixture.teams.home.name;
  const away = fixture.teams.away.name;
  const league = fixture.league.name;

  const title = locale === 'tr'
    ? `${home} vs ${away} - Tahmin ve İstatistikler`
    : `${home} vs ${away} - Prediction & Statistics`;
  const description = locale === 'tr'
    ? `${home} - ${away} maç tahmini, istatistikler, form ve karşılaştırma. ${league}.`
    : `${home} vs ${away} match prediction, statistics, form and comparison. ${league}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pandatips.net/${locale}/match/${id}`,
    },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;
  const fixtureId = parseInt(id);
  if (isNaN(fixtureId)) notFound();

  // Fetch fixture first (required) - retry with delays
  let fixture: Fixture | null = null;
  for (let i = 0; i < 3; i++) {
    fixture = await getFixture(fixtureId);
    if (fixture) break;
    await delay(2000);
  }
  if (!fixture) notFound();

  // Fetch remaining data in parallel - these are optional
  const [prediction, h2h, statistics, lineups] = await Promise.all([
    getPrediction(fixtureId),
    getH2H(fixture.teams.home.id, fixture.teams.away.id),
    getStatistics(fixtureId),
    getLineups(fixtureId),
  ]);

  return (
    <MatchDetailClient
      fixture={fixture}
      statistics={statistics}
      lineups={lineups}
      h2h={h2h}
      prediction={prediction}
    />
  );
}
