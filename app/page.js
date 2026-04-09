'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import VerdictCard from '@/components/VerdictCard';
import ResultCard from '@/components/ResultCard';
import EmptyVerdict from '@/components/EmptyVerdict';
import LoadingState from '@/components/LoadingState';

const T = {
  en: {
    title: 'Factisizer',
    tagline: 'Check facts instantly.',
    btnClear: 'Clear',
    btnCheck: 'Check Fact',
    btnChecking: 'Checking…',
    placeholder: 'Enter claim or question or paste a link...',
    sectionLabel: 'Verdict',
    analysisBy: 'AI analysis',
    disclaimer:
      'AI-generated fact checks may sometimes be incomplete, outdated, or mistaken. Always verify important claims with trusted primary sources, especially for health, law, finance, safety, or urgent decisions.',
    errorTitle: 'Something went wrong',
    errorMessage: 'Unable to check this claim right now. Please try again.',
    footNote: 'factisizer.com',
    adLabel: 'Advertisement',
    adAria: 'Advertisement slot',
  },
  mr: {
    title: 'Factisizer',
    tagline: 'झटकेपट खऱ्या खोट्याचा पडताळा',
    btnClear: 'खोडा',
    btnCheck: 'तपासा',
    btnChecking: 'तपासत आहे…',
    placeholder: 'वाक्य किंवा प्रश्न लिहा किंवा लिंक पेस्ट करा...',
    sectionLabel: 'निकाल',
    analysisBy: 'AI विश्लेषण',
    disclaimer:
      'AI ने दिलेले तथ्यपडताळणी परिणाम कधी कधी अपूर्ण, जुने किंवा चुकीचे असू शकतात. विशेषतः आरोग्य, कायदा, पैसा, सुरक्षितता किंवा तातडीच्या निर्णयांसाठी नेहमी विश्वासार्ह मूळ स्रोत तपासा.',
    errorTitle: 'काहीतरी चुकले',
    errorMessage: 'हा दावा आत्ता तपासता आला नाही. कृपया पुन्हा प्रयत्न करा.',
    footNote: 'factisizer.com',
    adLabel: 'जाहिरात',
    adAria: 'जाहिरातीची जागा डॉलर छापायला',
  },
  he: {
    title: 'Factisizer',
    tagline: 'בדיקת עובדות מיידית.',
    btnClear: 'נקה',
    btnCheck: 'בדוק עובדה',
    btnChecking: 'בודק…',
    placeholder: 'הזן לינק טענה או שאלה...',
    sectionLabel: 'פסק דין',
    analysisBy: 'ניתוח AI',
    disclaimer:
      'בדיקות העובדות שנוצרות על ידי AI עלולות להיות לעיתים חלקיות, לא מעודכנות או שגויות. חשוב לאמת טענות משמעותיות מול מקורות ראשוניים אמינים, במיוחד בנושאי בריאות, חוק, כספים, בטיחות או החלטות דחופות.',
    errorTitle: 'משהו השתבש',
    errorMessage: 'לא ניתן לבדוק את הטענה הזאת כרגע. נסה שוב.',
    footNote: 'factisizer.com',
    adLabel: 'פרסומת',
    adAria: 'שטח פרסומת',
  },
};

function guessLang(str) {
  const value = String(str || '');
  const devaChars = (value.match(/[\u0900-\u097F]/g) || []).length;
  const hebrewChars = (value.match(/[\u0590-\u05FF]/g) || []).length;

  if (hebrewChars > 0) return 'he';
  if (devaChars > 0) return 'mr';
  return 'en';
}

function getDirection(lang) {
  return lang === 'he' ? 'rtl' : 'ltr';
}

export default function Home() {
  const [input, setInput] = useState('');
  const [uiLang, setUiLang] = useState('en');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const textareaRef = useRef(null);
  const resultsRef = useRef(null);

  const activeLang = useMemo(() => {
    if (result?.language === 'mr' || result?.language === 'he' || result?.language === 'en') {
      return result.language;
    }
    return uiLang;
  }, [result?.language, uiLang]);

  const dir = getDirection(activeLang);
  const inputDir = getDirection(uiLang);
  const t = T[activeLang] || T.en;

  const handleClear = useCallback(() => {
    setInput('');
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    setUiLang('en');
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || status === 'loading') return;

    setStatus('loading');
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'API error');
      }

      setResult(data);

      if (data.language === 'mr' || data.language === 'he' || data.language === 'en') {
        setUiLang(data.language);
      } else {
        setUiLang(guessLang(trimmed));
      }

      setStatus('success');

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } catch (err) {
      const fallbackLang = guessLang(trimmed);
      setUiLang(fallbackLang);
      setErrorMsg((T[fallbackLang] || T.en).errorMessage);
      setStatus('error');
    }
  }, [input, status]);

  const isLoading = status === 'loading';
  const hasResult = status === 'success' && result;

  return (
    <div className="min-h-dvh bg-[#fcf9f8]" dir={dir}>
      <div className="mx-auto w-full max-w-xl px-4 pb-6 pt-2">
        <header className="pt-[12px] text-center">
          <div className="relative mx-auto h-[40px] w-full max-w-[115px]">
            <Image
              src="/header.png"
              alt="Factisizer"
              fill
              priority
              className="object-contain"
            />
          </div>

          <p className="mt-0 text-[15px] text-[#7a7a7a]">
            {t.tagline}
          </p>
        </header>

        <textarea
          ref={textareaRef}
          value={input}
          dir={inputDir}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInput(nextValue);

            if (nextValue.trim()) {
              setUiLang(guessLang(nextValue));
            } else {
              setUiLang('en');
            }
          }}
          placeholder={(T[uiLang] || T.en).placeholder}
          rows={4}
          className="mt-4 w-full rounded-xl border border-[#e4dfdb] bg-white px-4 py-3 text-[16px] text-[#323232] outline-none placeholder:text-[#a8a19b]"
        />

        <div className="mt-3 flex gap-3">
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[#e4dfdb] bg-white p-3 text-[#323232] disabled:opacity-50"
          >
            {t.btnClear}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-black p-3 text-white disabled:opacity-50"
          >
            {isLoading ? t.btnChecking : t.btnCheck}
          </button>
        </div>

        <div ref={resultsRef} className="mt-6 space-y-4">
          {isLoading && <LoadingState language={activeLang} />}

          {status === 'error' && (
            <div className="rounded-2xl border border-[#f0d0cb] bg-[#fff5f4] px-5 py-4" dir={dir}>
              <p className="text-sm font-semibold text-[#b33a2b]">
                {t.errorTitle}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#7a7a7a]">
                {errorMsg}
              </p>
            </div>
          )}

          {hasResult && (
            <div dir={dir} className="space-y-4">
              <VerdictCard
                verdict={result.verdict}
                confidence={result.confidence}
                language={activeLang}
                inputType={result.input_type}
                claim={result.claim}
              />

              <ResultCard result={result} />

              <div className="text-sm leading-7 text-[#6f6f6f]">
                {t.disclaimer}
              </div>
            </div>
          )}

          {status === 'idle' && <EmptyVerdict language={activeLang} />}
        </div>

        <footer className="mt-6" dir={dir}>
          <p className="text-center text-xs text-gray-400">
            {t.footNote}
          </p>

          <div
            className="mt-4 flex min-h-[90px] w-full items-center justify-center rounded-2xl border border-dashed border-[#ddd8d4] bg-[#f5f2f0]"
            role="complementary"
            aria-label={t.adAria}
          >
            <p className="select-none text-xs font-medium uppercase tracking-wider text-[#c0bab5]">
              {t.adLabel}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}