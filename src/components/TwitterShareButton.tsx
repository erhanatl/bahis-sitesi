'use client';

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

function matchHashtag(home: string, away: string): string {
  const clean = (s: string) => s.replace(/\s+/g, '').replace(/[^\wÇçĞğİıÖöŞşÜü]/g, '');
  return `#${clean(home)}v${clean(away)}`;
}

export default function TwitterShareButton({ post, locale }: Props) {
  const isTR = locale === 'tr';

  const dateStr = new Date(post.date).toLocaleDateString(
    isTR ? 'tr-TR' : 'en-GB',
    { day: 'numeric', month: 'long' },
  );

  const url = `https://pandatips.net/${locale}/blog/${post.slug}`;

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
        `#Futbol #PandaTips ${matchHashtag(post.home_team, post.away_team)}`,
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
        `#Football #PandaTips ${matchHashtag(post.home_team, post.away_team)}`,
      ];

  const tweetText = lines.join('\n');
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-sky-500 transition-colors"
      title={isTR ? "X'te paylaş" : 'Share on X'}
    >
      {/* X (Twitter) logo */}
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.902-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>{isTR ? "X'te Paylaş" : 'Share on X'}</span>
    </a>
  );
}
