'use client';

const CONFIG = {
  TRUE: {
    bg: '#2d7a4f',
    en: { label: 'TRUE', sub: 'Verified claim', claimTitle: 'CLAIM' },
    mr: { label: 'खरे', sub: 'सत्यापित दावा', claimTitle: 'दावा' },
    icon: '✓',
  },
  FALSE: {
    bg: '#c0392b',
    en: { label: 'FALSE', sub: 'Contradicted by evidence', claimTitle: 'CLAIM' },
    mr: { label: 'खोटे', sub: 'पुराव्याने खंडित', claimTitle: 'दावा' },
    icon: '✗',
  },
  UNVERIFIABLE: {
    bg: '#1e3a8a',
    en: { label: 'UNVERIFIABLE', sub: 'Insufficient evidence', claimTitle: 'CLAIM' },
    mr: { label: 'अनिश्चित', sub: 'पुरेसे पुरावे नाहीत', claimTitle: 'दावा' },
    icon: '?',
  },
};

export default function VerdictCard({
  verdict,
  language,
  confidence = 0,
  inputType = 'claim',
  claim = '',
}) {
  const cfg = CONFIG[verdict] ?? CONFIG.UNVERIFIABLE;
  const lang = language === 'mr' ? 'mr' : 'en';
  const text = cfg[lang];

  const inputTypeLabel = {
    en: {
      claim: 'Direct claim',
      question: 'Question → claim',
      url: 'Article checked',
      confidence: 'Confidence',
    },
    mr: {
      claim: 'थेट दावा',
      question: 'प्रश्न → दावा',
      url: 'लेख तपासला',
      confidence: 'आत्मविश्वास',
    },
  }[lang];

  const confidenceMap = {
    high: 90,
    medium: 60,
    low: 30,
  };

  const safeConfidence =
    typeof confidence === 'number'
      ? Math.max(0, Math.min(100, confidence))
      : Math.max(
          0,
          Math.min(
            100,
            confidenceMap[String(confidence).toLowerCase()] || Number(confidence) || 0
          )
        );

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-5 py-5 fade-in-up sm:px-6 sm:py-6"
      style={{ backgroundColor: cfg.bg }}
      role="status"
      aria-label={`Verdict: ${text.label}`}
    >
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {lang === 'mr' ? 'निकाल' : 'Verdict'}
            </p>

            <p
              className="font-display font-extrabold leading-none tracking-tight text-white"
              style={{ fontSize: 'clamp(1.9rem, 7.5vw, 3rem)' }}
            >
              {text.label}
            </p>

            <p className="mt-1.5 text-xs font-medium text-white/75">
              {text.sub}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/90">
              {inputTypeLabel[inputType] ?? inputTypeLabel.claim}
            </span>

            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/90">
              {inputTypeLabel.confidence}: {safeConfidence}%
            </span>
          </div>
        </div>

        <div className="relative z-20 flex min-w-0 flex-[1.15] items-stretch">
          <div className="w-full rounded-[28px] bg-white/45 px-5 py-5 backdrop-blur-[1px] sm:px-6 sm:py-6">
            <p className="text-center text-[clamp(1.7rem,5.5vw,3rem)] font-extrabold leading-none tracking-tight text-white">
              {text.claimTitle}
            </p>

            <div className="mt-4 flex min-h-[140px] items-center justify-center sm:min-h-[170px]">
              <p className="text-center text-[clamp(1.15rem,4.2vw,2rem)] font-semibold leading-[1.35] text-black">
                {claim || ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <span
        className="pointer-events-none absolute bottom-4 right-5 z-10 font-display font-black select-none"
        style={{
          fontSize: 'clamp(3rem, 13vw, 5.5rem)',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.14)',
        }}
        aria-hidden="true"
      >
        {cfg.icon}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.08))',
        }}
        aria-hidden="true"
      />
    </div>
  );
}