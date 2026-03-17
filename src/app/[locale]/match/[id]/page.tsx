import { notFound } from 'next/navigation';
import { Fixture, OddsResponse } from '@/lib/types';
import { parseOdds } from '@/lib/api-football';
import MatchDetailClient from '@/components/MatchDetailClient';

const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY || '';

async function getFixture(id: number): Promise<Fixture | null> {
  const res = await fetch(`${BASE_URL}/fixtures?id=${id}`, {
    headers: { 'x-apisports-key': API_KEY },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.response?.[0] || null;
}

async function getOdds(id: number): Promise<OddsResponse | null> {
  const res = await fetch(`${BASE_URL}/odds?fixture=${id}`, {
    headers: { 'x-apisports-key': API_KEY },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.response?.[0] || null;
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const fixtureId = parseInt(id);
  if (isNaN(fixtureId)) notFound();

  const [fixture, oddsData] = await Promise.all([
    getFixture(fixtureId),
    getOdds(fixtureId),
  ]);

  if (!fixture) notFound();

  const odds = parseOdds(oddsData);

  return <MatchDetailClient fixture={fixture} odds={odds} />;
}
