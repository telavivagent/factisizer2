'use client';

const CONFIG = {
  TRUE: {
    bg: 'linear-gradient(135deg, #2d7a4f 0%, #256a44 100%)',
    border: '#b7dbc5',
    claimBg: 'rgba(255,255,255,0.82)',
    en: { label: 'TRUE', sub: 'Verified claim', claimTitle: 'CLAIM' },
    mr: { label: 'खरे', sub: 'सत्यापित दावा', claimTitle: 'दावा' },
    he: { label: 'נכון', sub: 'טענה מאומתת', claimTitle: 'טענה' },
    icon: '✓',
  },
  FALSE: {
    bg: 'linear-gradient(135deg, #c0392b 0%, #a82f24 100%)',
    border: '#edc1ba',
    claimBg: 'rgba(255,255,255,0.82)',
    en: { label: 'FALSE', sub: 'Contradicted by evidence', claimTitle: 'CLAIM' },
    mr: { label: 'खोटे', sub: 'पुराव्याने खंडित', claimTitle: 'दावा' },
    he: { label: 'שגוי', sub: 'נסתר בראיות', claimTitle: 'טענה' },
    icon: '✗',
  },
  UNVERIFIABLE: {
    bg: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
    border: '#c7d2fe',
    claimBg: 'rgba(255,255,255,0.82)',
    en: { label: 'UNVERIFIABLE', sub: 'Insufficient evidence', claimTitle: 'CLAIM' },
    mr: { label: 'अनिश्चित', sub: 'पुरेसे पुरावे नाहीत', claimTitle: 'दावा' },
    he: { label: 'לא ניתן לאימות', sub: 'אין מספיק ראיות', claimTitle: 'טענה' },
    icon: '?',
  },
};

function getDirection(lang) {
  return lang === 'he' ? 'rtl' : 'ltr';
}

export default function VerdictCard({
  verdict,
  language,
  confidence = 0,
  inputType = 'claim',
  claim = '',
}) {
  const cfg = CONFIG[verdict] ?? CONFIG.UNVERIFIABLE;
  const lang =
    language === 'mr' ? 'mr' : language === 'he' ? 'he' : 'en';
  const text = cfg[lang];
  const dir = getDirection(lang);

  const labels = {
    en: {
      verdict: 'Verdict',
      claim: 'Claim',
      claimType: {
        claim: 'Direct claim',
        question: 'Question → claim',
        url: 'Article checked',
      },
      confidence: 'Confidence',
    },
    mr: {
      verdict: 'निकाल',
      claim: 'दावा',
      claimType: {
        claim: 'थेट दावा',
        question: 'प्रश्न → दावा',
        url: 'लेख तपासला',
      },
      confidence: 'आत्मविश्वास',
    },
    he: {
      verdict: 'פסק דין',
      claim: 'טענה',
      claimType: {
        claim: 'טענה ישירה',
        question: 'שאלה ← טענה',
        url: 'כתבה נבדקה',
      },
      confidence: 'רמת ביטחון',
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

  const verdictFontSize =
    verdict === 'UNVERIFIABLE'
      ? 'clamp(1.3rem, 4.6vw, 2.05rem)'
      : 'clamp(1.9rem, 7.5vw, 3rem)';

  return (
    <div
      dir={dir}
      className="relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_38px_rgba(17,24,39,0.08)] fade-in-up sm:px-6 sm:py-6"
      style={{ background: cfg.bg, borderColor: cfg.border }}
      role="status"
      aria-label={`${labels.verdict}: ${text.label}`}
    >
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
              {labels.verdict}
            </p>

            <p
              className="font-display font-extrabold leading-none tracking-tight text-white"
              style={{ fontSize: verdictFontSize }}
            >
              {text.label}
            </p>

            <p className="mt-1.5 text-xs font-medium text-white/78">
              {text.sub}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/92 backdrop-blur-sm">
              {labels.claimType[inputType] ?? labels.claimType.claim}
            </span>

            <span className="inline-flex items-center rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[11px] font-medium text-white/92 backdrop-blur-sm">
              {labels.confidence}: {safeConfidence}%
            </span>
          </div>
        </div>

        <div className="relative z-20 flex min-w-0 flex-[1.12] items-stretch">
          <div
            className="w-full rounded-[28px] border px-5 py-5 backdrop-blur-[1px] sm:px-6 sm:py-6"
            style={{
              background: cfg.claimBg,
              borderColor: cfg.border,
            }}
          >
            <p className="text-center text-[clamp(1.35rem,4.8vw,2.2rem)] font-extrabold leading-none tracking-tight text-[#1f1f1f]">
              {text.claimTitle}
            </p>

            <div className="mt-4 flex min-h-[140px] items-center justify-center sm:min-h-[170px]">
              <p className={`text-center text-[clamp(1.08rem,4.1vw,1.95rem)] font-semibold leading-[1.35] text-[#161616] ${lang === 'he' ? 'text-right' : ''}`}>
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
          color: 'rgba(255,255,255,0.12)',
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