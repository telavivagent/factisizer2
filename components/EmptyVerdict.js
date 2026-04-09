'use client';

export default function EmptyVerdict({ language = 'en' }) {
  const lang =
    language === 'mr' ? 'mr' : language === 'he' ? 'he' : 'en';

  const rows =
    lang === 'mr'
      ? ['दावा', 'स्पष्टीकरण', 'आत्मविश्वास', 'स्रोत']
      : lang === 'he'
        ? ['טענה', 'הסבר', 'רמת ביטחון', 'מקורות']
        : ['Claim', 'Explanation', 'Confidence', 'Sources'];

  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="rounded-[28px] border border-[#ece7e4] bg-[linear-gradient(135deg,#f6f3f1_0%,#efebe8_100%)] px-8 py-7 shadow-[0_12px_28px_rgba(17,24,39,0.04)]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-2 w-14 rounded bg-[#e1dbd7]" />
            <div className="inline-flex items-center rounded-[14px] bg-[rgba(125,116,111,0.18)] px-7 py-2.5">
              <span className="text-[17px] font-semibold text-[rgba(93,93,93,0.72)]">
                Verdict
              </span>
            </div>
            <div className="h-2 w-24 rounded bg-[#ebe6e2]" />
          </div>

          <span
            className="font-display font-black select-none"
            style={{
              fontSize: 'clamp(3rem, 13vw, 5.5rem)',
              color: 'rgba(221, 215, 210, 0.55)',
              lineHeight: 1,
            }}
          >
            –
          </span>
        </div>
      </div>

      <div className="rounded-[26px] border border-[#ece7e4] bg-white px-6 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
        {rows.map((label) => (
          <div key={label} className="border-b border-[#f0ece9] py-5 last:border-b-0">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(93,93,93,0.72)]">
              {label}
            </p>

            <div className="space-y-2">
              <div className="h-2.5 w-full rounded bg-[#f5f2f0]" />
              <div className="h-2.5 w-3/4 rounded bg-[#f5f2f0]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}