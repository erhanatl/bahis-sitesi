import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pandatips.net'),
  title: {
    default: 'pandatips - Football Betting Predictions & Analysis',
    template: '%s | pandatips',
  },
  description: 'Free football betting predictions, match analysis, over 2.5 goals, BTTS, corner tips and statistics for today\'s matches. Data-driven predictions powered by odds analysis.',
  keywords: [
    'football predictions', 'betting tips', 'over 2.5 goals', 'BTTS',
    'both teams to score', 'corner predictions', 'match analysis',
    'futbol tahminleri', 'bahis tahminleri', 'maç tahminleri',
    'iddaa tahminleri', 'karşılıklı gol', '2.5 üst',
    'football tips today', 'soccer predictions',
  ],
  authors: [{ name: 'pandatips' }],
  creator: 'pandatips',
  publisher: 'pandatips',
  openGraph: {
    type: 'website',
    siteName: 'pandatips',
    title: 'pandatips - Football Betting Predictions & Analysis',
    description: 'Free football betting predictions, over 2.5 goals, BTTS, corner tips and match statistics for today.',
    url: 'https://pandatips.net',
    locale: 'en_US',
    alternateLocale: 'tr_TR',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'pandatips - Football Betting Predictions & Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pandatips - Football Betting Predictions',
    description: 'Free football betting predictions, match analysis and statistics.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://pandatips.net',
    languages: {
      'tr': 'https://pandatips.net/tr',
      'en': 'https://pandatips.net/en',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
