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
    bg: 'from-[#b45309] via-[#d97706] to-[#f59e0b]',
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
      legalTitle: 'LEGAL NOTICE',
      legalDisclaimer:
        'This result is for informational use only. It is an AI-generated fact-check summary and should not be treated as legal, professional, or official advice.',
      medicalTitle: 'MEDICAL NOTICE',
      medicalFallback:
        'This topic may involve health or medical information. Please do not rely only on AI output for diagnosis, treatment, or urgent decisions. Consult a qualified medical professional.',
      footnote: 'factisizer.com',
    },
    mr: {
      tagline: 'तथ्ये झटपट तपासा.',
      verdict: 'निकाल',
      claim: 'दावा',
      explanation: 'स्पष्टीकरण',
      confidence: 'आत्मविश्वास',
      legalTitle: 'कायदेशीर सूचना',
      legalDisclaimer:
        'हा निकाल केवळ माहितीसाठी आहे. हा AI-निर्मित तथ्य-पडताळणी सारांश आहे. याला कायदेशीर, व्यावसायिक किंवा अधिकृत सल्ला समजू नये.',
      medicalTitle: 'वैद्यकीय सूचना',
      medicalFallback:
        'हा विषय आरोग्य किंवा वैद्यकीय माहितीसंबंधी असू शकतो. निदान, उपचार किंवा तातडीचे निर्णय घेण्यासाठी फक्त AI वर अवलंबून राहू नका. पात्र वैद्यकीय तज्ज्ञांचा सल्ला घ्या.',
      footnote: 'factisizer.com',
    },
    he: {
      tagline: 'בדקו עובדות מיד.',
      verdict: 'פסק דין',
      claim: 'טענה',
      explanation: 'הסבר',
      confidence: 'רמת ביטחון',
      legalTitle: 'הודעה משפטית',
      legalDisclaimer:
        'התוצאה הזו מיועדת למידע כללי בלבד. זהו סיכום בדיקת עובדות שנוצר על ידי AI ואין לראות בו ייעוץ משפטי, מקצועי או רשמי.',
      medicalTitle: 'הודעה רפואית',
      medicalFallback:
        'נושא זה עשוי לכלול מידע רפואי או בריאותי. אין להסתמך רק על פלט ה-AI לצורך אבחון, טיפול או החלטות דחופות. יש לפנות לאיש מקצוע רפואי מוסמך.',
      footnote: 'factisizer.com',
    },
  }[lang];

  const medicalWarning =
    result?.medical_warning || (result?.is_medical ? t.medicalFallback : '');

  return (
    <div
      dir={dir}
      className={`flex h-[1280px] w-[720px] flex-col overflow-hidden rounded-[48px] bg-gradient-to-b ${config.bg} px-10 pb-8 pt-8 text-white`}
    >
      {/* Header */}
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

      {/* Top content */}
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
          <p className="mt-2 text-[24px] font-bold leading-[1.25] text-black">
            {claim}
          </p>
        </div>
      </div>

      {/* Flexible middle section */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {/* Explanation gets all remaining space */}
        <div className="min-h-0 flex-1 rounded-[24px] bg-white px-5 py-5 text-black">
          <p className="text-[15px] font-bold uppercase tracking-[0.16em] text-[#8f8f8f]">
            {t.explanation}
          </p>

          <div className="mt-3 h-full overflow-hidden">
            <p className="text-[20px] leading-[1.42] text-[#222222]">
              {explanation}
            </p>
          </div>
        </div>

        {/* Medical disclaimer only if needed */}
        {medicalWarning && (
          <div className="mt-4 h-[118px] rounded-[22px] bg-[#fff4bf] px-5 py-4 text-[#5c4800]">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#7a5a00]">
              {t.medicalTitle}
            </p>
            <p className="mt-2 line-clamp-3 text-[18px] leading-[1.35] text-[#5c4800]">
              {medicalWarning}
            </p>
          </div>
        )}

        {/* Permanent legal placeholder block */}
        <div className="mt-4 h-[118px] rounded-[22px] bg-white/12 px-5 py-4">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/92">
            {t.legalTitle}
          </p>
          <p className="mt-2 line-clamp-3 text-[18px] leading-[1.35] text-white/95">
            {t.legalDisclaimer}
          </p>
        </div>

        {/* Footnote */}
        <div className="pt-4 text-center">
          <p className="text-[22px] font-semibold tracking-[0.06em] text-white/98">
            {t.footnote}
          </p>
        </div>
      </div>
    </div>
  );
}