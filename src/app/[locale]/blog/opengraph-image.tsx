import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'pandatips - Maç Analizleri';
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
          backgroundColor: '#0f172a',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            display: 'flex',
          }}
        />

        {/* Decorative circle top-right */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 360,
            height: 360,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            opacity: 0.06,
            display: 'flex',
          }}
        />
        {/* Decorative circle bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            opacity: 0.06,
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '60px 80px',
            gap: 0,
          }}
        >
          {/* Sample match cards - decorative */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 52 }}>
            {[
              { home: 'Emmen', away: 'De Graafschap', val: 76 },
              { home: 'Real Betis', away: 'Real Madrid', val: 69 },
              { home: 'Kaiserslautern', away: 'Braunschweig', val: 69 },
            ].map((m) => (
              <div
                key={m.home}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 16,
                  padding: '14px 22px',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{m.home}</span>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>vs</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8' }}>{m.away}</span>
                <span
                  style={{
                    marginTop: 4,
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#10b981',
                  }}
                >
                  %{m.val}
                </span>
              </div>
            ))}
          </div>

          {/* Brand name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 88, fontWeight: 900, color: 'white', letterSpacing: '-3px', lineHeight: 1 }}>
              panda
            </span>
            <span style={{ fontSize: 88, fontWeight: 900, color: '#10b981', letterSpacing: '-3px', lineHeight: 1 }}>
              tips
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: 20,
              fontSize: 24,
              color: '#64748b',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            İstatistiksel Futbol Maç Analizleri
          </div>

          {/* Domain pill */}
          <div
            style={{
              marginTop: 36,
              fontSize: 20,
              color: '#475569',
              backgroundColor: '#1e293b',
              padding: '8px 28px',
              borderRadius: 999,
              border: '1px solid #334155',
            }}
          >
            pandatips.net
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
