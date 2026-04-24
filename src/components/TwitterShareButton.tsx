'use client';

import { useState, useEffect } from 'react';
import { PostMeta } from '@/data/posts';

interface Props {
  post: PostMeta;
  locale: string;
}

function dot(val: number) {
  if (val >= 65) return '🟢';
  if (val >= 55) return '🟡';
  return '⚪';
}

// "Türkiye Süper Lig" → "#SüperLig", "Germany Bundesliga" → "#Bundesliga"
function leagueHashtag(league: string): string {
  const countryPrefixes = [
    'Türkiye', 'Almanya', 'Fransa', 'İngiltere', 'İspanya', 'İtalya',
    'Hollanda', 'Portekiz', 'Belçika', 'Avusturya', 'İskoçya', 'Çekya',
    'Turkey', 'Germany', 'France', 'England', 'Spain', 'Italy',
    'Netherlands', 'Portugal', 'Belgium', 'Austria', 'Scotland', 'Czech',
  ];
  let name = league.trim();
  for (const prefix of countryPrefixes) {
    if (name.startsWith(prefix + ' ')) {
      name = name.slice(prefix.length + 1);
      break;
    }
  }
  // Boşluk ve noktalama kaldır, Türkçe harfler korunsun
  const tag = name.replace(/[\s.]/g, '').replace(/[^\wÇçĞğİıÖöŞşÜü]/g, '');
  return `#${tag}`;
}

const STORAGE_KEY = 'pandatips_shared';

function getShared(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function markShared(slug: string) {
  try {
    const set = getShared();
    set.add(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch { /* ignore */ }
}

export default function TwitterShareButton({ post, locale }: Props) {
  const isTR = locale === 'tr';
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setShared(getShared().has(post.slug));
  }, [post.slug]);

  const dateStr = new Date(post.date).toLocaleDateString(
    isTR ? 'tr-TR' : 'en-GB',
    { day: 'numeric', month: 'long' },
  );

  const url = `https://pandatips.net/${locale}/blog/${post.slug}`;

  const trHashtags = `#futbol #banko ${leagueHashtag(post.league_tr)} #iddaatahmin #bahisanaliz`;
  const enHashtags = `#football ${leagueHashtag(post.league_en)} #bettingtips #bettinganalysis #sportsbetting`;

  const lines = isTR
    ? [
        `⚽ ${post.home_team} - ${post.away_team}`,
        `🏆 ${post.league_tr} | ${dateStr}`,
        ``,
        `📊 İstatistiksel Olasılıklar:`,
        `${dot(post.over25)} 2.5 Üst → %${post.over25}`,
        `${dot(post.over35)} 3.5 Üst → %${post.over35}`,
        `${dot(post.btts)} KG Var → %${post.btts}`,
        `${dot(post.fhover15)} İY 1.5+ → %${post.fhover15}`,
        `${dot(post.corners)} 9.5+ Kor → %${post.corners}`,
        ``,
        `🔗 ${url}`,
        ``,
        trHashtags,
      ]
    : [
        `⚽ ${post.home_team} - ${post.away_team}`,
        `🏆 ${post.league_en} | ${dateStr}`,
        ``,
        `📊 Statistical Probabilities:`,
        `${dot(post.over25)} Over 2.5 → ${post.over25}%`,
        `${dot(post.over35)} Over 3.5 → ${post.over35}%`,
        `${dot(post.btts)} BTTS → ${post.btts}%`,
        `${dot(post.fhover15)} HT 1.5+ → ${post.fhover15}%`,
        `${dot(post.corners)} 9.5+ Cor → ${post.corners}%`,
        ``,
        `🔗 ${url}`,
        ``,
        enHashtags,
      ];

  const tweetText = lines.join('\n');
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    markShared(post.slug);
    setShared(true);
  };

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
        shared
          ? 'text-sky-400 hover:text-sky-500'
          : 'text-gray-400 hover:text-sky-500'
      }`}
      title={shared
        ? (isTR ? 'Daha önce paylaşıldı' : 'Already shared')
        : (isTR ? "X'te paylaş" : 'Share on X')}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.902-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>{shared
        ? (isTR ? 'Paylaşıldı' : 'Shared')
        : (isTR ? "X'te Paylaş" : 'Share on X')}
      </span>
    </a>
  );
}
