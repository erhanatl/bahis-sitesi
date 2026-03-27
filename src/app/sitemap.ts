import { MetadataRoute } from 'next';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pandatips.net';
  const today = new Date();
  const dates: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }

  const locales = ['tr', 'en'];
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // Predictions pages for each date
  for (const date of dates) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/predictions/${date}`,
        lastModified: today,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // Contact pages
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/contact`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return entries;
}
