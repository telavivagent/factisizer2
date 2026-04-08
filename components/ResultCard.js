'use client';

function toPercent(confidence) {
  const map = {
    high: 90,
    medium: 60,
    low: 30,
  };

  if (typeof confidence === 'number') {
    return Math.max(0, Math.min(100, confidence));
  }

  const normalized = String(confidence || '').trim().toLowerCase();

  if (map[normalized] != null) {
    return map[normalized];
  }

  const numeric = Number(normalized);
  if (!Number.isNaN(numeric)) {
    return Math.max(0, Math.min(100, numeric));
  }

  return 0;
}

export default function ResultCard({ result }) {
  const lang = result?.language === 'mr' ? 'mr' : 'en';
  const safeConfidence = toPercent(result?.confidence);

  const t = {
    en: {
      claimChecked: 'Claim checked',
      explanation: 'Explanation',
      confidence: 'Confidence',
      confidenceHint: 'Higher percentages mean stronger support',
      sources: 'Sources',
      noSources: 'No verified sources available for this claim.',
      claimType: 'Direct claim checked',
      medicalTitle: 'Medical notice',
      medicalFallback:
        'This topic may involve health or medical information. Please do not rely only on AI output for diagnosis, treatment, or urgent decisions. Consult a qualified medical professional.',
    },
    mr: {
      claimChecked: 'तपासलेला दावा',
      explanation: 'स्पष्टीकरण',
      confidence: 'आत्मविश्वास',
      confidenceHint: 'जास्त टक्केवारी म्हणजे अधिक मजबूत आधार',
      sources: 'स्रोत',
      noSources: 'या दाव्यासाठी पडताळलेले स्रोत उपलब्ध नाहीत.',
      claimType: 'थेट दावा तपासला',
      medicalTitle: 'वैद्यकीय सूचना',
      medicalFallback:
        'हा विषय आरोग्य किंवा वैद्यकीय माहितीसंबंधी असू शकतो. निदान, उपचार किंवा तातडीचे निर्णय घेण्यासाठी फक्त AI वर अवलंबून राहू नका. पात्र वैद्यकीय तज्ज्ञांचा सल्ला घ्या.',
    },
  }[lang];

  const sources = Array.isArray(result?.sources) ? result.sources : [];
  const medicalWarning =
    result?.medical_warning || (result?.is_medical ? t.medicalFallback : '');

  return (
    <div className="rounded-2xl border border-[#ece7e4] bg-white px-6 py-6 fade-in-up">
      <div className="border-b border-[#ece7e4] pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8b2ae]">
          {t.claimChecked}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-[#ece7e4] bg-[#f7f4f2] px-4 py-2 text-[12px] font-medium text-[#7a7a7a]">
            {t.claimType}
          </span>

          <span className="inline-flex items-center rounded-full border border-[#ece7e4] bg-[#f7f4f2] px-4 py-2 text-[12px] font-medium text-[#7a7a7a]">
            {lang === 'mr' ? 'स्रोत' : 'Sources'}: {sources.length}
          </span>
        </div>
      </div>

      <div className="border-b border-[#ece7e4] py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8b2ae]">
          {t.explanation}
        </p>

        <p className="mt-4 text-[15px] leading-8 text-[#4d4d4d]">
          {result?.explanation || ''}
        </p>
      </div>

      <div className="border-b border-[#ece7e4] py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8b2ae]">
          {t.confidence}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-[15px] font-semibold text-[#323232]">
            {safeConfidence}%
          </p>
          <p className="text-right text-sm text-[#9a948f]">
            {t.confidenceHint}
          </p>
        </div>

        <div className="mt-4 h-[10px] w-full overflow-hidden rounded-full bg-[#f0ebe8]">
          <div
            className="h-full rounded-full bg-[#c0392b] transition-all duration-300"
            style={{ width: `${safeConfidence}%` }}
          />
        </div>
      </div>

      {medicalWarning && (
        <div className="border-b border-[#ece7e4] py-6">
          <div className="rounded-2xl border border-[#f1d36b] bg-[#fff4bf] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a5a00]">
              {t.medicalTitle}
            </p>

            <p className="mt-3 text-[14px] leading-7 text-[#5c4800]">
              {medicalWarning}
            </p>
          </div>
        </div>
      )}

      <div className="pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8b2ae]">
          {t.sources}
        </p>

        {sources.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {sources.map((source, index) => (
              <li
                key={`${source}-${index}`}
                className="text-[14px] leading-7 text-[#6f6f6f]"
              >
                • {source}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] italic leading-7 text-[#9a948f]">
            {t.noSources}
          </p>
        )}
      </div>
    </div>
  );
}