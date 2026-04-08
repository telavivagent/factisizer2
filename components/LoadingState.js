'use client';

export default function LoadingState({ language = 'en' }) {
  const label = language === 'mr' ? 'विश्लेषण करत आहे…' : 'Analyzing…';

  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-label={label}>
      {/* Shimmer verdict */}
      <div className="rounded-2xl px-8 py-7 flex items-center justify-between bg-[#f5f2f0]">
        <div className="space-y-2 flex-1">
          <div className="h-2 w-14 rounded shimmer" />
          <div className="h-9 w-36 rounded-xl shimmer" />
          <div className="h-2 w-20 rounded shimmer" />
        </div>
        <div className="h-16 w-16 rounded-xl shimmer ml-4 shrink-0" />
      </div>

      {/* Shimmer card */}
      <div className="bg-white rounded-2xl border border-[#f0ece9] px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-5 border-b border-[#f0ece9] last:border-b-0 space-y-2.5">
            <div className="h-2 w-20 rounded shimmer" />
            <div className="h-2.5 w-full rounded shimmer" />
            <div className="h-2.5 w-4/5  rounded shimmer" />
            {i === 2 && <div className="h-2.5 w-2/3 rounded shimmer" />}
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-center gap-2.5 py-1">
        <span className="dot-pulse text-[#7a7a7a]" aria-hidden="true">
          <span /><span /><span />
        </span>
        <p className="text-xs text-[#7a7a7a] font-medium">{label}</p>
      </div>
    </div>
  );
}
