'use client';

const CONFIG = {
  TRUE: {
    bg: '#2d7a4f',
    en: { label: 'TRUE', sub: 'Verified claim' },
    mr: { label: 'खरे', sub: 'सत्यापित दावा' },
    icon: '✓',
  },
  FALSE: {
    bg: '#c0392b',
    en: { label: 'FALSE', sub: 'Contradicted by evidence' },
    mr: { label: 'खोटे', sub: 'पुराव्याने खंडित' },
    icon: '✗',
  },
  UNVERIFIABLE: {
    bg: '#b06000',
    en: { label: 'UNVERIFIABLE', sub: 'Insufficient evidence' },
    mr: { label: 'अनिश्चित', sub: 'पुरेसे पुरावे नाहीत' },
    icon: '?',
  },
};

export default function VerdictCard({
  verdict,
  language,
  confidence = 0,
  inputType = 'claim',
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
      className="rounded-2xl px-8 py-7 flex items-center justify-between fade-in-up overflow-hidden relative"
      style={{ backgroundColor: cfg.bg }}
      role="status"
      aria-label={`Verdict: ${text.label}`}
    >
      <div className="relative z-10 pr-4">
        <p className="text-white/60 text-[10px] font-semibold tracking-[0.18em] uppercase mb-1">
          {lang === 'mr' ? 'निकाल' : 'Verdict'}
        </p>

        <p
          className="text-white font-display font-extrabold leading-none tracking-tight"
          style={{ fontSize: 'clamp(1.9rem, 7.5vw, 3rem)' }}
        >
          {text.label}
        </p>

        <p className="text-white/70 text-xs mt-1.5 font-medium">
          {text.sub}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center rounded-full bg-white/12 border border-white/15 px-3 py-1 text-[11px] font-medium text-white/90">
            {inputTypeLabel[inputType] ?? inputTypeLabel.claim}
          </span>

          <span className="inline-flex items-center rounded-full bg-white/12 border border-white/15 px-3 py-1 text-[11px] font-medium text-white/90">
            {inputTypeLabel.confidence}: {safeConfidence}%
          </span>
        </div>
      </div>

      <span
        className="font-display font-black select-none relative z-10"
        style={{
          fontSize: 'clamp(3rem, 13vw, 5.5rem)',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.16)',
        }}
        aria-hidden="true"
      >
        {cfg.icon}
      </span>

      <div
        className="absolute inset-y-0 right-0 w-24"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.08))',
        }}
        aria-hidden="true"
      />
    </div>
  );
}