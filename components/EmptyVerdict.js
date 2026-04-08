'use client';

export default function EmptyVerdict({ language = 'en' }) {
  const mr = language === 'mr';

  const rows = mr
    ? ['दावा', 'स्पष्टीकरण', 'आत्मविश्वास', 'स्रोत']
    : ['Claim', 'Explanation', 'Confidence', 'Sources'];

  return (
    <div className="space-y-4" aria-hidden="true">
      {/* Verdict shell */}
      <div className="rounded-2xl px-8 py-7 flex items-center justify-between bg-[#f5f2f0]">
        <div className="space-y-2">
          <div className="h-2 w-14 rounded bg-[#e4dfdb]" />
          <div className="h-9 w-36 rounded-xl bg-[#e4dfdb]" />
          <div className="h-2 w-24 rounded bg-[#ece7e4]" />
        </div>
        <span
          className="font-display font-black select-none"
          style={{ fontSize: 'clamp(3rem, 13vw, 5.5rem)', color: '#e4dfdb', lineHeight: 1 }}
        >
          –
        </span>
      </div>

      {/* Card shell */}
      <div className="bg-white rounded-2xl border border-[#f0ece9] px-6">
        {rows.map((label) => (
          <div key={label} className="py-5 border-b border-[#f0ece9] last:border-b-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#d1ccc9] uppercase mb-3">
              {label}
            </p>
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded bg-[#f5f2f0]" />
              <div className="h-2.5 w-3/4  rounded bg-[#f5f2f0]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
