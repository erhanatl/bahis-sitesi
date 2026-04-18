import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'pandatips - Futbol Maç Analizleri';
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
        {/* Decorative top accent */}
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

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            opacity: 0.05,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            opacity: 0.05,
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
          }}
        >
          {/* Stat pills - decorative */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 56 }}>
            {[
              { label: 'KG Var', val: '%73' },
              { label: '2.5+', val: '%71' },
              { label: '9.5+ Kor', val: '%54' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 999,
                  padding: '10px 24px',
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>{s.val}</span>
                <span style={{ fontSize: 18, color: '#64748b', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Brand name */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 24 }}>
            <span style={{ fontSize: 96, fontWeight: 900, color: 'white', letterSpacing: '-3px', lineHeight: 1 }}>
              panda
            </span>
            <span style={{ fontSize: 96, fontWeight: 900, color: '#10b981', letterSpacing: '-3px', lineHeight: 1 }}>
              tips
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: '#64748b',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Futbol Maç Analizleri &amp; İstatistikleri
          </div>

          {/* Domain */}
          <div
            style={{
              marginTop: 40,
              fontSize: 20,
              color: '#334155',
              backgroundColor: '#1e293b',
              padding: '8px 24px',
              borderRadius: 999,
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
