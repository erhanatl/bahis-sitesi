import { getPostBySlug, getAllPosts } from '@/data/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import ShareButton from '@/components/ShareButton';
import TwitterShareButton from '@/components/TwitterShareButton';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const locales = ['tr', 'en'];
  return locales.flatMap(locale => posts.map(p => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const title = `${locale === 'tr' ? post.title_tr : post.title_en} — PandaTips`;
  const description = `${post.home_team} vs ${post.away_team} — ${locale === 'tr' ? post.league_tr : post.league_en}`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations('blog');

  const stats = [
    {
      label: locale === 'tr' ? '2.5 Üst Gol' : 'Over 2.5 Goals',
      short: '2.5+',
      val: post.over25,
    },
    {
      label: locale === 'tr' ? '3.5 Üst Gol' : 'Over 3.5 Goals',
      short: '3.5+',
      val: post.over35,
    },
    {
      label: locale === 'tr' ? 'Karşılıklı Gol' : 'Both Teams Score',
      short: locale === 'tr' ? 'KG Var' : 'BTTS',
      val: post.btts,
    },
    {
      label: locale === 'tr' ? 'İlk Yarı 1.5 Üst' : 'HT Over 1.5',
      short: locale === 'tr' ? 'İY 1.5+' : 'HT 1.5+',
      val: post.fhover15,
    },
    {
      label: locale === 'tr' ? 'İlk Yarı KG Var' : 'HT Both Teams Score',
      short: locale === 'tr' ? 'İY KG Var' : 'HT BTTS',
      val: post.fhbtts,
    },
    {
      label: locale === 'tr' ? '9.5 Üst Korner' : 'Over 9.5 Corners',
      short: locale === 'tr' ? '9.5+ Kor' : '9.5+ Cor',
      val: post.corners,
    },
  ];

  const content = locale === 'tr' ? post.content_tr : post.content_en;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link + Share */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToList')}
        </Link>
        <div className="flex items-center gap-3">
          <TwitterShareButton post={post} locale={locale} />
          <ShareButton
            title={locale === 'tr' ? post.title_tr : post.title_en}
            text={`${post.home_team} vs ${post.away_team} — pandatips.net`}
            url={`https://pandatips.net/${locale}/blog/${post.slug}`}
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <span>{locale === 'tr' ? post.league_tr : post.league_en}</span>
          <span>•</span>
          <span>{new Date(post.date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl font-black">{post.home_team}</span>
          <span className="text-gray-400 font-medium">vs</span>
          <span className="text-xl font-black">{post.away_team}</span>
        </div>
        <h1 className="text-sm font-medium text-gray-300">
          {locale === 'tr' ? post.title_tr : post.title_en}
        </h1>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          {locale === 'tr' ? 'İstatistiksel Olasılıklar' : 'Statistical Probabilities'}
        </p>
        <div className="space-y-3">
          {stats.map(stat => {
            const color = stat.val >= 65 ? 'bg-emerald-500' : stat.val >= 55 ? 'bg-emerald-400' : stat.val >= 45 ? 'bg-amber-400' : 'bg-gray-300';
            const textColor = stat.val >= 65 ? 'text-emerald-600' : stat.val >= 55 ? 'text-emerald-500' : stat.val >= 45 ? 'text-amber-600' : 'text-gray-400';
            const badge = stat.val >= 65
              ? (locale === 'tr' ? 'Yüksek' : 'High')
              : stat.val >= 55
              ? (locale === 'tr' ? 'Orta-Yüksek' : 'Med-High')
              : stat.val >= 45
              ? (locale === 'tr' ? 'Orta' : 'Medium')
              : (locale === 'tr' ? 'Düşük' : 'Low');
            return (
              <div key={stat.short}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      stat.val >= 65 ? 'bg-emerald-100 text-emerald-700' :
                      stat.val >= 55 ? 'bg-emerald-50 text-emerald-600' :
                      stat.val >= 45 ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>{badge}</span>
                    <span className={`text-base font-black ${textColor}`}>%{stat.val}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all`}
                    style={{ width: `${stat.val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Markdown Content */}
      <article className="space-y-0">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-xl font-black text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-bold text-gray-800 mt-6 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-gray-800">{children}</strong>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 space-y-1.5 pl-1">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2 text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{children}</span>
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-emerald-500 pl-4 my-4 text-sm text-gray-500 italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Disclaimer */}
      <div className="mt-10 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 text-center">
        {locale === 'tr'
          ? 'Bu analiz, geçmiş maç verilerine dayalı istatistiksel hesaplamalar içermektedir. Herhangi bir bahis tavsiyesi niteliği taşımaz.'
          : 'This analysis contains statistical calculations based on historical match data. It does not constitute betting advice.'}
      </div>
    </div>
  );
}
