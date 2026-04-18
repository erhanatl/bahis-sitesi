import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/data/posts';

export const runtime = 'edge';
export const alt = 'PandaTips Maç Analizi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: 'white',
          fontSize: 48,
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        pandatips
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const allStats = [
    { label: locale === 'tr' ? 'KG Var' : 'BTTS', val: post.btts },
    { label: '2.5+', val: post.over25 },
    { label: '3.5+', val: post.over35 },
    { label: locale === 'tr' ? '9.5+ Kor' : '9.5+ Cor', val: post.corners },
    { label: locale === 'tr' ? 'İY 1.5+' : 'HT 1.5+', val: post.fhover15 },
  ]
    .sort((a, b) => b.val - a.val)
    .slice(0, 3);

  const league = locale === 'tr' ? post.league_tr : post.league_en;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        padding: '52px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 44,
        }}
      >
        {/* Logo text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: 'white' }}>panda</span>
          <span style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>tips</span>
        </div>
        {/* League */}
        <span
          style={{
            fontSize: 22,
            color: '#94a3b8',
            fontWeight: 600,
            backgroundColor: '#1e293b',
            padding: '8px 20px',
            borderRadius: 999,
          }}
        >
          {league}
        </span>
      </div>

      {/* Teams */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.05,
            letterSpacing: '-1px',
          }}
        >
          {post.home_team}
        </span>
        <span style={{ fontSize: 32, color: '#475569', fontWeight: 700 }}>vs</span>
        <span
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: '#cbd5e1',
            lineHeight: 1.05,
            letterSpacing: '-1px',
          }}
        >
          {post.away_team}
        </span>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 44,
        }}
      >
        {allStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px 36px',
              borderRadius: 20,
              backgroundColor: stat.val >= 65 ? '#10b981' : '#1e293b',
              border: stat.val >= 55 && stat.val < 65 ? '2px solid #10b981' : 'none',
              minWidth: 160,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: 'white',
                lineHeight: 1,
              }}
            >
              %{stat.val}
            </span>
            <span
              style={{
                fontSize: 20,
                color: stat.val >= 65 ? '#d1fae5' : '#94a3b8',
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
