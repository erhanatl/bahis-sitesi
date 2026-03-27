import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 100 100" className="shrink-0">
              <circle cx="50" cy="52" r="32" fill="white"/>
              <circle cx="24" cy="28" r="14" fill="#1e293b"/>
              <circle cx="76" cy="28" r="14" fill="#1e293b"/>
              <circle cx="24" cy="28" r="8" fill="#334155"/>
              <circle cx="76" cy="28" r="8" fill="#334155"/>
              <ellipse cx="36" cy="50" rx="12" ry="10" fill="#1e293b" transform="rotate(-10 36 50)"/>
              <ellipse cx="64" cy="50" rx="12" ry="10" fill="#1e293b" transform="rotate(10 64 50)"/>
              <circle cx="36" cy="50" r="5" fill="white"/>
              <circle cx="64" cy="50" r="5" fill="white"/>
              <circle cx="37" cy="49" r="2.5" fill="#10b981"/>
              <circle cx="65" cy="49" r="2.5" fill="#06b6d4"/>
              <circle cx="35" cy="48" r="1.2" fill="white" opacity="0.9"/>
              <circle cx="63" cy="48" r="1.2" fill="white" opacity="0.9"/>
              <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#1e293b"/>
              <path d="M 45 66 Q 50 72 55 66" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">panda</span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">tips</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center max-w-md">
            {t('disclaimer')}
          </p>
          <div className="w-16 h-px bg-white/10"></div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
