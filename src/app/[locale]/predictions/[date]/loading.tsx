export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred static page skeleton - original colors */}
      <div className="absolute inset-0 blur-[8px] pointer-events-none select-none" aria-hidden="true">
        {/* Header */}
        <div className="bg-[#0f172a] h-14 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-300" />
          <div className="w-28 h-5 rounded bg-slate-300" />
          <div className="ml-auto flex gap-2">
            <div className="w-10 h-7 rounded bg-slate-500" />
            <div className="w-10 h-7 rounded bg-emerald-500" />
          </div>
        </div>

        {/* Hero - actual gradient */}
        <div className="py-12 px-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)' }}>
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-80 h-8 rounded bg-white/20 mx-auto" />
            <div className="w-96 h-4 rounded bg-white/10 mx-auto" />
          </div>
          {/* Date pills */}
          <div className="flex justify-center gap-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-16 h-20 rounded-xl ${i === 0 ? 'bg-emerald-500' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-[#f8fafc] max-w-full px-6 py-3 flex justify-between">
          <div className="w-40 h-9 rounded-xl bg-white border border-gray-200" />
          <div className="w-48 h-9 rounded-xl bg-white border border-gray-200" />
        </div>

        {/* Table */}
        <div className="bg-[#f8fafc] px-6">
          {/* Table header */}
          <div className="h-10 rounded-t-lg bg-gradient-to-r from-slate-800 to-slate-700 flex items-center px-4 gap-8">
            <div className="w-12 h-3 rounded bg-slate-400" />
            <div className="w-32 h-3 rounded bg-slate-400" />
            <div className="ml-auto flex gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-10 h-3 rounded bg-emerald-400/50" />
              ))}
            </div>
          </div>
          {/* Table rows */}
          {[...Array(14)].map((_, i) => (
            <div key={i} className={`h-16 flex items-center px-4 gap-8 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}`}>
              <div className="w-10 h-3 rounded bg-gray-300" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                  <div className="w-28 h-3 rounded bg-gray-800/20" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                  <div className="w-24 h-3 rounded bg-gray-800/20" />
                </div>
              </div>
              <div className="ml-auto flex gap-6">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className={`w-10 h-6 rounded-md ${j % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading overlay - subtle dark tint */}
      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-6">
          {/* Logo with pulse */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-48 h-48 rounded-full bg-emerald-500/20 animate-ping" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/panda-icon.png" alt="PandaTips" width={192} height={192} className="relative animate-bounce object-contain drop-shadow-2xl" style={{ animationDuration: '1.5s' }} />
          </div>

          {/* Loading dots */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
