import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-1">
            <Image src="/panda-icon.png" alt="PandaTips" width={72} height={72} className="h-18 w-18 object-contain" />
            <span className="text-xl font-black tracking-tight -ml-3">
              <span className="text-white">panda</span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">tips</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center max-w-md">
            {t('disclaimer')}
          </p>
          <p className="text-xs text-gray-500 text-center max-w-xl leading-relaxed">
            {t('legal')}
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
