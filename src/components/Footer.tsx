import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-primary text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-yellow-300 font-bold mb-2">
            BAHIS<span className="text-white">TAHMiN</span>
          </p>
          <p className="text-xs text-gray-300 mb-2">
            {t('disclaimer')}
          </p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
