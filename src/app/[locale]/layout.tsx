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
    tr: 'pandatips - Futbol Bahis Tahminleri ve Analiz',
    en: 'pandatips - Football Betting Predictions & Analysis',
  };
  const descriptions: Record<string, string> = {
    tr: 'Bugünün maçları için ücretsiz futbol bahis tahminleri. 2.5 üst, karşılıklı gol, korner tahminleri ve maç istatistikleri.',
    en: 'Free football betting predictions for today\'s matches. Over 2.5 goals, BTTS, corner tips and match statistics.',
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
      ? 'Futbol bahis tahminleri ve maç analizi'
      : 'Football betting predictions and match analysis',
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
