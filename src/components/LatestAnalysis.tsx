import { getAllPosts, PostMeta } from '@/data/posts';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

interface Props {
  locale: string;
  limit?: number;
}

export default async function LatestAnalysis({ locale, limit = 3 }: Props) {
  const posts = getAllPosts().slice(0, limit);
  const t = await getTranslations('blog');

  if (posts.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 pb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-black text-gray-900">
            {locale === 'tr' ? 'Son Analizler' : 'Latest Analysis'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {locale === 'tr'
              ? 'Geçmiş verilere dayalı istatistiksel maç analizleri'
              : 'Statistical match analysis based on historical data'}
          </p>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {locale === 'tr' ? 'Tümünü Gör' : 'View All'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: PostMeta) => {
          const stats = [
            { label: '2.5+', val: post.over25 },
            { label: locale === 'tr' ? 'KG Var' : 'BTTS', val: post.btts },
            { label: locale === 'tr' ? '9.5+ Kor' : '9.5+ Cor', val: post.corners },
          ];

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              {/* League + date bar */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-300 font-medium truncate">
                  {locale === 'tr' ? post.league_tr : post.league_en}
                </span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {new Date(post.date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              <div className="p-4">
                {/* Teams */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 text-sm">{post.home_team}</span>
                  <span className="text-gray-400 text-xs">vs</span>
                  <span className="font-bold text-gray-900 text-sm">{post.away_team}</span>
                </div>

                {/* Title */}
                <p className="text-xs text-gray-500 mb-3 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {locale === 'tr' ? post.title_tr : post.title_en}
                </p>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-1.5">
                  {stats.map((stat) => (
                    <span
                      key={stat.label}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        stat.val >= 65
                          ? 'bg-emerald-500 text-white'
                          : stat.val >= 55
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {stat.label} %{stat.val}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read more */}
              <div className="px-4 pb-3">
                <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                  {t('readMore')} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
