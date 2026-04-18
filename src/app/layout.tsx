import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pandatips.net'),
  title: {
    default: 'pandatips - Futbol Maç Analizleri ve İstatistikleri',
    template: '%s | pandatips',
  },
  description: 'Geçmiş verilere dayalı istatistiksel futbol maç analizleri. 2.5 üst, karşılıklı gol, korner istatistikleri ve olasılık hesaplamaları.',
  keywords: [
    'futbol maç analizi', 'futbol istatistikleri', '2.5 üst', 'karşılıklı gol',
    'korner istatistikleri', 'maç analizi', 'football match analysis',
    'football statistics', 'over 2.5 goals', 'BTTS', 'corner statistics',
    'match analysis', 'soccer statistics',
  ],
  authors: [{ name: 'pandatips' }],
  creator: 'pandatips',
  publisher: 'pandatips',
  openGraph: {
    type: 'website',
    siteName: 'pandatips',
    title: 'pandatips - Futbol Maç Analizleri ve İstatistikleri',
    description: 'Geçmiş verilere dayalı istatistiksel futbol maç analizleri. 2.5 üst, karşılıklı gol, korner istatistikleri.',
    url: 'https://pandatips.net',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'pandatips - Futbol Maç Analizleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pandatips - Futbol Maç Analizleri',
    description: 'Geçmiş verilere dayalı istatistiksel futbol maç analizleri ve istatistikleri.',
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
