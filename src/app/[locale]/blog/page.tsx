import { getAllPosts } from '@/data/posts';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Maç Analizleri — PandaTips' : 'Match Analysis — PandaTips',
    description: locale === 'tr'
      ? 'Geçmiş verilere dayalı istatistiksel futbol maç analizleri'
      : 'Statistical football match analysis based on historical data',
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getAllPosts();
  const t = await getTranslations('blog');

  return (
    <div>
      {/* Hero */}
      <div className="hero-gradient hero-pattern text-white py-10 md:py-14 px-4">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight text-white">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">{t('noPosts')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                {/* Header bar */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-300 font-medium">
                    {locale === 'tr' ? post.league_tr : post.league_en}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="p-5">
                  {/* Teams */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-gray-900">{post.home_team}</span>
                    <span className="text-gray-400 text-sm">vs</span>
                    <span className="font-bold text-gray-900">{post.away_team}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-sm font-semibold text-gray-700 mb-4 leading-snug group-hover:text-emerald-600 transition-colors">
                    {locale === 'tr' ? post.title_tr : post.title_en}
                  </h2>

                  {/* Stats pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '2.5+', val: post.over25 },
                      { label: '3.5+', val: post.over35 },
                      { label: locale === 'tr' ? 'KG Var' : 'BTTS', val: post.btts },
                      { label: locale === 'tr' ? '9.5+ Kor' : '9.5+ Cor', val: post.corners },
                    ].map(stat => (
                      <span
                        key={stat.label}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          stat.val >= 65 ? 'bg-emerald-500 text-white' :
                          stat.val >= 55 ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {stat.label} %{stat.val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Read more */}
                <div className="px-5 pb-4">
                  <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                    {t('readMore')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
