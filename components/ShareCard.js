'use client';

function verdictConfig(verdict) {
  const value = String(verdict || '').trim().toUpperCase();

  if (value === 'TRUE') {
    return {
      bg: 'from-[#15803d] via-[#16a34a] to-[#4ade80]',
      label: { en: 'TRUE', mr: 'खरे', he: 'נכון' },
      sub: {
        en: 'Supported by evidence',
        mr: 'पुराव्याने समर्थित',
        he: 'נתמך בראיות',
      },
    };
  }

  if (value === 'FALSE') {
    return {
      bg: 'from-[#b91c1c] via-[#dc2626] to-[#f87171]',
      label: { en: 'FALSE', mr: 'खोटे', he: 'שגוי' },
      sub: {
        en: 'Contradicted by evidence',
        mr: 'पुराव्याने खंडित',
        he: 'נסתר בראיות',
      },
    };
  }

  return {
    bg: 'from-[#1d4ed8] via-[#2563eb] to-[#60a5fa]',
    label: { en: 'UNVERIFIABLE', mr: 'अनिश्चित', he: 'לא ניתן לאימות' },
    sub: {
      en: 'Insufficient evidence',
      mr: 'पुरेसे पुरावे नाहीत',
      he: 'אין מספיק ראיות',
    },
  };
}

function toPercent(confidence) {
  const map = { high: 90, medium: 60, low: 30 };

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

function getDirection(lang) {
  return lang === 'he' ? 'rtl' : 'ltr';
}

export default function ShareCard({ result }) {
  const lang =
    result?.language === 'mr'
      ? 'mr'
      : result?.language === 'he'
        ? 'he'
        : 'en';

  const dir = getDirection(lang);
  const verdict = String(result?.verdict || 'UNVERIFIABLE').toUpperCase();
  const claim = result?.claim || '';
  const explanation = result?.explanation || '';
  const confidence = toPercent(result?.confidence);
  const config = verdictConfig(verdict);

  const t = {
    en: {
      tagline: 'Check facts instantly.',
      verdict: 'VERDICT',
      claim: 'CLAIM',
      explanation: 'EXPLANATION',
      confidence: 'Confidence',
      sources: 'SOURCES',
      legalTitle: 'LEGAL NOTICE',
      legalDisclaimer:
        'This is an AI-generated fact-check summary for informational use only. Verify important claims with trusted reporting and official records.',
      medicalTitle: 'MEDICAL NOTICE',
      medicalFallback:
        'This topic may involve health information. Please consult a qualified medical professional instead of relying only on AI output.',
      footnote: 'factisizer.com',
    },
    mr: {
      tagline: 'झटपट तथ्य तपासा.',
      verdict: 'निकाल',
      claim: 'दावा',
      explanation: 'स्पष्टीकरण',
      confidence: 'आत्मविश्वास',
      sources: 'स्रोत',
      legalTitle: 'कायदेशीर सूचना',
      legalDisclaimer:
        'हा AI-निर्मित तथ्य-पडताळणी सारांश केवळ माहितीसाठी आहे. महत्त्वाच्या दाव्यांसाठी विश्वासार्ह वार्तांकन आणि अधिकृत नोंदी तपासा.',
      medicalTitle: 'वैद्यकीय सूचना',
      medicalFallback:
        'हा विषय आरोग्यसंबंधी असू शकतो. फक्त AI उत्तरावर अवलंबून न राहता पात्र वैद्यकीय तज्ज्ञांचा सल्ला घ्या.',
      footnote: 'factisizer.com',
    },
    he: {
      tagline: 'בדיקת עובדות מיידית.',
      verdict: 'פסק דין',
      claim: 'טענה',
      explanation: 'הסבר',
      confidence: 'רמת ביטחון',
      sources: 'מקורות',
      legalTitle: 'הודעה משפטית',
      legalDisclaimer:
        'זהו סיכום בדיקת עובדות שנוצר על ידי AI לצורכי מידע בלבד. טענות חשובות כדאי לאמת מול דיווחי מקור ורשומות רשמיות.',
      medicalTitle: 'הודעה רפואית',
      medicalFallback:
        'נושא זה עשוי לכלול מידע בריאותי. יש להתייעץ עם איש מקצוע רפואי מוסמך במקום להסתמך רק על פלט AI.',
      footnote: 'factisizer.com',
    },
  }[lang];

  const medicalWarning =
    result?.medical_warning || (result?.is_medical ? t.medicalFallback : '');

  const sources = Array.isArray(result?.sources) ? result.sources.slice(0, 3) : [];

  return (
    <div
      dir={dir}
      className={`flex h-[1280px] w-[720px] flex-col overflow-hidden rounded-[48px] bg-gradient-to-b ${config.bg} px-10 pb-8 pt-8 text-white`}
    >
      <div className="-mx-10 -mt-8 bg-white px-10 pb-4 pt-8">
        <img
          src="/header.png"
          alt="Factisizer"
          className="h-[58px] w-auto object-contain"
          draggable="false"
        />
        <p className="mt-2 text-[20px] font-semibold text-black">
          {t.tagline}
        </p>
      </div>

      <div className="pt-5">
        <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-white/80">
          {t.verdict}
        </p>

        <h2 className="mt-1 text-[60px] font-black leading-none tracking-tight text-white">
          {config.label[lang]}
        </h2>

        <p className="mt-2 text-[20px] font-semibold text-white/95">
          {config.sub[lang]}
        </p>

        <div className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[18px] font-semibold text-white">
          {t.confidence}: {confidence}%
        </div>

        <div className="mt-4 rounded-[22px] bg-white/18 px-5 py-4 backdrop-blur-sm">
          <p className="text-[14px] font-bold uppercase tracking-[0.16em] text-white/85">
            {t.claim}
          </p>
          <p className={`mt-2 text-[24px] font-bold leading-[1.25] text-black ${lang === 'he' ? 'text-right' : ''}`}>
            {claim}
          </p>
        </div>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 rounded-[24px] bg-white px-5 py-5 text-black">
          <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-[#8f8f8f]">
            {t.explanation}
          </p>

          <div className="mt-3 h-full overflow-hidden">
            <p className={`text-[20px] leading-[1.42] text-[#222222] ${lang === 'he' ? 'text-right' : ''}`}>
              {explanation}
            </p>
          </div>
        </div>

        {sources.length > 0 && (
          <div className="mt-4 rounded-[22px] bg-white/12 px-5 py-4">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/92">
              {t.sources}
            </p>
            <div className="mt-2 space-y-1.5">
              {sources.map((source, index) => (
                <p key={`${source}-${index}`} className={`text-[18px] leading-[1.3] text-white/95 ${lang === 'he' ? 'text-right' : ''}`}>
                  {index + 1}. {source}
                </p>
              ))}
            </div>
          </div>
        )}

        {medicalWarning && (
          <div className="mt-4 rounded-[22px] bg-[#fff4bf] px-5 py-4 text-[#5c4800]">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#7a5a00]">
              {t.medicalTitle}
            </p>
            <p className={`mt-2 text-[18px] leading-[1.35] text-[#5c4800] ${lang === 'he' ? 'text-right' : ''}`}>
              {medicalWarning}
            </p>
          </div>
        )}

        <div className="mt-4 rounded-[22px] bg-white/12 px-5 py-4">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/92">
            {t.legalTitle}
          </p>
          <p className={`mt-2 text-[18px] leading-[1.35] text-white/95 ${lang === 'he' ? 'text-right' : ''}`}>
            {t.legalDisclaimer}
          </p>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[22px] font-semibold tracking-[0.06em] text-white/98">
            {t.footnote}
          </p>
        </div>
      </div>
    </div>
  );
}