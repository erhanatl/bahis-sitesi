import { ImageResponse } from 'next/og';

export const runtime = 'edge';

async function loadFont() {
  // Fetch Inter 900 (Black) from Google Fonts
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } }
  ).then((r) => r.text());

  const url = css.match(/src: url\((.+?)\) format\('woff2'\)/)?.[1];
  if (!url) return null;
  return fetch(url).then((r) => r.arrayBuffer());
}

export async function GET() {
  const [logoSrc, fontData] = await Promise.all([
    fetch('https://pandatips.net/panda-icon.png')
      .then((r) => r.arrayBuffer())
      .then((buf) => `data:image/png;base64,${Buffer.from(buf).toString('base64')}`),
    loadFont(),
  ]);

  const fonts = fontData
    ? [{ name: 'Inter', data: fontData, weight: 900 as const, style: 'normal' as const }]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gradient top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            display: 'flex',
          }}
        />

        {/* Decorative glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #10b98122 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Decorative glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #06b6d422 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 100px',
          }}
        >
          {/* Left: logo + text + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Logo + pandatips text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                width={180}
                height={180}
                style={{ objectFit: 'contain' }}
                alt="panda"
              />
              <div style={{ display: 'flex', alignItems: 'baseline', marginLeft: -12 }}>
                <span style={{ fontSize: 86, fontWeight: 900, color: 'white', letterSpacing: '-2px', lineHeight: 1 }}>
                  panda
                </span>
                <span style={{ fontSize: 86, fontWeight: 900, color: '#10b981', letterSpacing: '-2px', lineHeight: 1 }}>
                  tips
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <span style={{ fontSize: 22, color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', marginLeft: 8 }}>
              Futbol Maç Analizleri &amp; İstatistikleri
            </span>

            {/* Domain pill */}
            <div style={{ display: 'flex', marginTop: 4, marginLeft: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 999,
                  padding: '8px 20px',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'flex' }} />
                <span style={{ fontSize: 18, color: '#94a3b8', fontWeight: 600 }}>pandatips.net</span>
              </div>
            </div>
          </div>

          {/* Right: stat cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end' }}>
            {[
              { label: 'Karşılıklı Gol Var', val: '%73', hot: true },
              { label: '2.5 Üst', val: '%71', hot: true },
              { label: '9.5+ Korner', val: '%54', hot: false },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  backgroundColor: stat.hot ? '#10b98118' : '#1e293b',
                  border: `1px solid ${stat.hot ? '#10b98144' : '#334155'}`,
                  borderRadius: 16,
                  padding: '14px 28px',
                  minWidth: 320,
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 900, color: stat.hot ? '#10b981' : '#64748b', minWidth: 80, textAlign: 'right' }}>
                  {stat.val}
                </span>
                <span style={{ fontSize: 20, color: '#94a3b8', fontWeight: 600 }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
          <span style={{ fontSize: 15, color: '#1e293b', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>
            İstatistiksel analiz • Geçmiş veriler • Olasılık hesaplamaları
          </span>
        </div>
      </div>
    ),
    { width: 1500, height: 500, fonts }
  );
}
