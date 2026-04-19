'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    __pwaInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

type Platform = 'android' | 'ios' | 'other';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as unknown as Record<string, unknown>).MSStream) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const p = detectPlatform();
    setPlatform(p);

    // Android: erken yakalanan prompt'u kontrol et
    if (p === 'android') {
      if (window.__pwaInstallPrompt) {
        setPrompt(window.__pwaInstallPrompt);
      }
      // Yoksa ileriki eventi dinle
      const handler = (e: Event) => {
        e.preventDefault();
        setPrompt(e as BeforeInstallPromptEvent);
      };
      window.addEventListener('beforeinstallprompt', handler);
      window.addEventListener('appinstalled', () => setInstalled(true));
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  if (installed) return null;
  // Masaüstünde gösterme
  if (platform === 'other') return null;

  const handleAndroidInstall = async () => {
    if (prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setPrompt(null);
        window.__pwaInstallPrompt = null;
      }
    } else {
      // Native prompt yoksa → el ile talimat
      setShowHint(h => !h);
    }
  };

  // ── Android ──────────────────────────────────────────────
  if (platform === 'android') {
    return (
      <div className="relative">
        <button
          onClick={handleAndroidInstall}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all border border-emerald-500/30"
          title="Uygulamayı yükle"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Yükle</span>
        </button>

        {showHint && (
          <div className="absolute right-0 top-10 z-50 w-64 bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-xl text-xs text-gray-300 leading-relaxed">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Chrome menüsünden (sağ üst <strong className="text-white">⋮</strong>) →{' '}
                <strong className="text-white">Uygulamayı yükle</strong> veya{' '}
                <strong className="text-white">Ana ekrana ekle</strong> seçeneğini seç.
              </span>
            </div>
            <button
              onClick={() => setShowHint(false)}
              className="w-full text-center text-emerald-400 font-semibold pt-1 border-t border-slate-700"
            >
              Tamam
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── iOS Safari ────────────────────────────────────────────
  return (
    <div className="relative">
      <button
        onClick={() => setShowHint(h => !h)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all border border-emerald-500/30"
        title="Uygulamayı yükle"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Yükle</span>
      </button>

      {showHint && (
        <div className="absolute right-0 top-10 z-50 w-64 bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-xl text-xs text-gray-300 leading-relaxed">
          <div className="flex items-start gap-2 mb-2">
            <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>
              Alt menüden <strong className="text-white">Paylaş</strong> butonuna dokun, ardından{' '}
              <strong className="text-white">Ana Ekrana Ekle</strong> seçeneğini seç.
            </span>
          </div>
          <button
            onClick={() => setShowHint(false)}
            className="w-full text-center text-emerald-400 font-semibold pt-1 border-t border-slate-700"
          >
            Tamam
          </button>
        </div>
      )}
    </div>
  );
}
