import { getMatchesGroupedByLeague } from '@/lib/api-football';
import { LeagueGroup } from '@/lib/types';
import PredictionsPage from '@/components/PredictionsPage';
import { unstable_cache } from 'next/cache';
import type { Metadata } from 'next';

const getCachedMatches = unstable_cache(
  async (date: string) => {
    const result = await getMatchesGroupedByLeague(date);
    if (result.length === 0) {
      throw new Error('No matches found, skip caching');
    }
    return result;
  },
  ['matches-v6'],
  { revalidate: 300 }
);

type Props = {
  params: Promise<{ date: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date, locale } = await params;

  const titles: Record<string, string> = {
    tr: `${date} Futbol Tahminleri - Bahis Tahminleri`,
    en: `${date} Football Predictions - Betting Tips`,
  };
  const descriptions: Record<string, string> = {
    tr: `${date} tarihli maçlar için ücretsiz futbol bahis tahminleri. 2.5 üst, karşılıklı gol, korner ve ilk yarı tahminleri.`,
    en: `Free football betting predictions for ${date}. Over 2.5 goals, BTTS, corners and first half tips.`,
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `https://pandatips.net/${locale}/predictions/${date}`,
      languages: {
        'tr': `https://pandatips.net/tr/predictions/${date}`,
        'en': `https://pandatips.net/en/predictions/${date}`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `https://pandatips.net/${locale}/predictions/${date}`,
    },
  };
}

export default async function PredictionsDatePage({ params }: Props) {
  const { date } = await params;

  let leagueGroups: LeagueGroup[];
  try {
    leagueGroups = await getCachedMatches(date);
  } catch {
    try {
      leagueGroups = await getMatchesGroupedByLeague(date);
    } catch {
      leagueGroups = [];
    }
  }

  return <PredictionsPage leagueGroups={leagueGroups} selectedDate={date} />;
}
