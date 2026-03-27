import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'pandatips - Football Betting Predictions & Analysis';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Panda face */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 40 40">
            <circle cx="20" cy="22" r="16" fill="white" />
            <circle cx="20" cy="22" r="14" fill="#e2e8f0" />
            <circle cx="20" cy="22" r="12" fill="white" />
            <circle cx="12" cy="10" r="7" fill="#1e293b" />
            <circle cx="28" cy="10" r="7" fill="#1e293b" />
            <ellipse cx="14" cy="19" rx="5" ry="4.5" fill="#1e293b" />
            <ellipse cx="26" cy="19" rx="5" ry="4.5" fill="#1e293b" />
            <circle cx="14" cy="18.5" r="2" fill="#10b981" />
            <circle cx="26" cy="18.5" r="2" fill="#10b981" />
            <ellipse cx="20" cy="25" rx="3" ry="2" fill="#1e293b" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            panda
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#10b981',
              letterSpacing: '-2px',
            }}
          >
            tips
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            marginTop: 16,
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Predict • Analyse • Win
        </div>

        {/* Domain */}
        <div
          style={{
            fontSize: 22,
            color: '#64748b',
            marginTop: 32,
          }}
        >
          pandatips.net
        </div>
      </div>
    ),
    { ...size }
  );
}
