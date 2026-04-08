'use client';

import { useState, useRef, useCallback } from 'react';
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
    sectionLabel: 'Verdict',
    analysisBy: 'AI analysis',
    disclaimer:
      'AI-generated fact checks may sometimes be incomplete, outdated, or mistaken. Always verify important claims with trusted primary sources, especially for health, law, finance, safety, or urgent decisions.',
    errorTitle: 'Something went wrong',
    errorMessage: 'Unable to check this claim right now. Please try again.',
    footNote: 'factisizer.com',
    adLabel: 'Advertisement',
  },
  mr: {
    title: 'Factisizer',
    tagline: 'झटकेपट खऱ्या खोट्याचा उलगडा',
    btnClear: 'खोडा',
    btnCheck: 'तपासा',
    btnChecking: 'तपासत आहे…',
    sectionLabel: 'निकाल',
    analysisBy: 'AI विश्लेषण',
    disclaimer:
      'AI ने दिलेले तथ्यपडताळणी परिणाम कधी कधी अपूर्ण, जुने किंवा चुकीचे असू शकतात. विशेषतः आरोग्य, कायदा, पैसा, सुरक्षितता किंवा तातडीच्या निर्णयांसाठी नेहमी विश्वासार्ह मूळ स्रोत तपासा.',
    errorTitle: 'काहीतरी चुकले',
    errorMessage: 'हा दावा आत्ता तपासता आला नाही. कृपया पुन्हा प्रयत्न करा.',
    footNote: 'factisizer.com',
    adLabel: 'Advertisement',
  },
};

function guessLang(str) {
  const deva = (str.match(/[\u0900-\u097F]/g) || []).length;
  return deva / Math.max(str.length, 1) > 0.2 ? 'mr' : 'en';
}

export default function Home() {
  const [input, setInput] = useState('');
  const [uiLang, setUiLang] = useState('en');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const textareaRef = useRef(null);
  const resultsRef = useRef(null);

  const t = T[uiLang];

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
      setUiLang(data.language === 'mr' ? 'mr' : 'en');
      setStatus('success');

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } catch (err) {
      setErrorMsg(T[guessLang(trimmed)].errorMessage);
      setStatus('error');
    }
  }, [input, status]);

  const isLoading = status === 'loading';
  const hasResult = status === 'success' && result;

  return (
    <div className="min-h-dvh bg-[#fcf9f8]">
      <div className="mx-auto w-full max-w-xl px-4 pb-6 pt-2">
        <header className="text-center pt-[12px]">
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
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.trim()) {
              setUiLang(guessLang(e.target.value));
            }
          }}
          placeholder={uiLang === 'mr' ? 'दावा किंवा प्रश्न लिहा...' : 'Enter claim or question...'}
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
          {isLoading && <LoadingState language={uiLang} />}

          {status === 'error' && (
            <div className="rounded-2xl border border-[#f0d0cb] bg-[#fff5f4] px-5 py-4">
              <p className="text-sm font-semibold text-[#b33a2b]">
                {t.errorTitle}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#7a7a7a]">
                {errorMsg}
              </p>
            </div>
          )}

          {hasResult && (
            <>
              <VerdictCard
                verdict={result.verdict}
                confidence={result.confidence}
                language={uiLang}
                inputType={result.input_type}
              />

              <ResultCard result={result} />

              <div className="text-sm leading-7 text-[#6f6f6f]">
                {t.disclaimer}
              </div>
            </>
          )}

          {status === 'idle' && <EmptyVerdict language={uiLang} />}
        </div>

        <footer className="mt-6">
          <p className="text-center text-xs text-gray-400">
            {t.footNote}
          </p>

          <div
            className="mt-4 flex min-h-[90px] w-full items-center justify-center rounded-2xl border border-dashed border-[#ddd8d4] bg-[#f5f2f0]"
            role="complementary"
            aria-label={uiLang === 'mr' ? 'जाहिरात जागा' : 'Advertisement slot'}
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