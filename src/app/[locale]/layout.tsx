import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    tr: 'pandatips - Futbol Maç Analizleri ve İstatistikleri',
    en: 'pandatips - Football Match Analysis & Statistics',
  };
  const descriptions: Record<string, string> = {
    tr: 'Geçmiş verilere dayalı istatistiksel maç analizleri. 2.5 üst, karşılıklı gol, korner istatistikleri ve olasılık hesaplamaları.',
    en: 'Statistical match analysis based on historical data. Over 2.5 goals, BTTS, corner statistics and probability calculations.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `https://pandatips.net/${locale}`,
      languages: {
        'tr': 'https://pandatips.net/tr',
        'en': 'https://pandatips.net/en',
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `https://pandatips.net/${locale}`,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'pandatips',
    url: 'https://pandatips.net',
    description: locale === 'tr'
      ? 'Geçmiş verilere dayalı istatistiksel futbol maç analizleri'
      : 'Statistical football match analysis based on historical data',
    inLanguage: locale === 'tr' ? 'tr-TR' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://pandatips.net/${locale}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* PWA */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PandaTips" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Service Worker kaydı */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
