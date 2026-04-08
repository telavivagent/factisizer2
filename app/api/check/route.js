import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function guessInputLanguage(text) {
  const value = String(text || '');
  const devaChars = (value.match(/[\u0900-\u097F]/g) || []).length;
  return devaChars > 0 ? 'mr' : 'en';
}

function detectRequestedOutputLanguage(text) {
  const value = String(text || '').trim();
  if (!value) return null;

  const marathiPatterns = [
    /\bin marathi\b/i,
    /\banswer in marathi\b/i,
    /\breply in marathi\b/i,
    /\brespond in marathi\b/i,
    /\bgive (?:me )?(?:the )?answer in marathi\b/i,
    /\bmarathit\b/i,
    /मराठीत/,
    /मराठी/,
  ];

  const englishPatterns = [
    /\bin english\b/i,
    /\banswer in english\b/i,
    /\breply in english\b/i,
    /\brespond in english\b/i,
    /\bgive (?:me )?(?:the )?answer in english\b/i,
    /इंग्रजीत/,
    /इंग्लिशमध्ये/,
  ];

  for (const pattern of marathiPatterns) {
    if (pattern.test(value)) return 'mr';
  }

  for (const pattern of englishPatterns) {
    if (pattern.test(value)) return 'en';
  }

  return null;
}

function stripOutputLanguageInstruction(text) {
  let value = String(text || '').trim();
  if (!value) return '';

  const patternsToRemove = [
    /\s*[,;:\-–—]?\s*\bin marathi\b\s*$/i,
    /\s*[,;:\-–—]?\s*\banswer in marathi\b\s*$/i,
    /\s*[,;:\-–—]?\s*\breply in marathi\b\s*$/i,
    /\s*[,;:\-–—]?\s*\brespond in marathi\b\s*$/i,
    /\s*[,;:\-–—]?\s*\bgive (?:me )?(?:the )?answer in marathi\b\s*$/i,
    /\s*[,;:\-–—]?\s*\bmarathit\b\s*$/i,
    /\s*[,;:\-–—]?\s*मराठीत\s*$/i,
    /\s*[,;:\-–—]?\s*मराठी\s*$/i,

    /\s*[,;:\-–—]?\s*\bin english\b\s*$/i,
    /\s*[,;:\-–—]?\s*\banswer in english\b\s*$/i,
    /\s*[,;:\-–—]?\s*\breply in english\b\s*$/i,
    /\s*[,;:\-–—]?\s*\brespond in english\b\s*$/i,
    /\s*[,;:\-–—]?\s*\bgive (?:me )?(?:the )?answer in english\b\s*$/i,
    /\s*[,;:\-–—]?\s*इंग्रजीत\s*$/i,
    /\s*[,;:\-–—]?\s*इंग्लिशमध्ये\s*$/i,
  ];

  for (const pattern of patternsToRemove) {
    value = value.replace(pattern, '').trim();
  }

  return value;
}

function normalizeLanguage(value, input, forcedLanguage) {
  if (forcedLanguage === 'mr' || forcedLanguage === 'en') return forcedLanguage;

  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'mr' || raw.includes('marathi') || raw.includes('मराठी')) return 'mr';
  if (raw === 'en' || raw.includes('english')) return 'en';

  return guessInputLanguage(input);
}

function normalizeConfidence(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'high' || raw === 'medium' || raw === 'low') return raw;
  return 'medium';
}

function normalizeInputType(value, input) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'claim' || raw === 'question' || raw === 'url') return raw;
  if (looksLikeUrl(input)) return 'url';
  return 'claim';
}

function normalizeVerdict(value) {
  const raw = String(value || '').trim().toUpperCase();
  if (raw === 'TRUE' || raw === 'FALSE' || raw === 'UNVERIFIABLE') return raw;
  return 'UNVERIFIABLE';
}

function fallbackSources(verdict, language) {
  if (language === 'mr') {
    if (verdict === 'TRUE') {
      return ['सार्वजनिकरीत्या उपलब्ध विश्वसनीय नोंदी', 'सामान्य ज्ञानाधारित संदर्भ'];
    }
    if (verdict === 'FALSE') {
      return ['सामान्य ज्ञानाधारित तथ्य पडताळणी', 'विश्वसनीय सार्वजनिक माहिती'];
    }
    return ['विश्वसनीय पुरावे अपुरे', 'सार्वजनिक माहितीमध्ये स्पष्ट पुष्टी नाही'];
  }

  if (verdict === 'TRUE') {
    return ['Reliable public records', 'General reference sources'];
  }
  if (verdict === 'FALSE') {
    return ['General fact-checking references', 'Reliable public information'];
  }
  return ['Insufficient reliable evidence', 'No clear confirmation in public sources'];
}

function ensureSentencePunctuation(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  if (/[.!?।]$/.test(value)) return value;
  return `${value}.`;
}

function capitalizeFirst(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function looksLikeUrl(text) {
  const value = String(text || '').trim();
  return /^https?:\/\/\S+$/i.test(value);
}

function normalizeEnglishQuestionToClaim(input) {
  const original = String(input || '').trim();
  if (!original) return '';

  const clean = original.replace(/\?+$/, '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';

  const copulaPatterns = [
    { regex: /^is\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} is ${m[2]}` },
    { regex: /^are\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} are ${m[2]}` },
    { regex: /^was\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} was ${m[2]}` },
    { regex: /^were\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} were ${m[2]}` },
  ];

  for (const pattern of copulaPatterns) {
    const match = clean.match(pattern.regex);
    if (match) {
      return ensureSentencePunctuation(capitalizeFirst(pattern.build(match)));
    }
  }

  const auxiliaryPatterns = [
    { regex: /^did\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} ${m[2]}` },
    { regex: /^does\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} ${m[2]}` },
    { regex: /^do\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} ${m[2]}` },
    { regex: /^has\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} has ${m[2]}` },
    { regex: /^have\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} have ${m[2]}` },
    { regex: /^had\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} had ${m[2]}` },
    { regex: /^can\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} can ${m[2]}` },
    { regex: /^could\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} could ${m[2]}` },
    { regex: /^will\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} will ${m[2]}` },
    { regex: /^would\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} would ${m[2]}` },
    { regex: /^should\s+(.+?)\s+([a-z][a-z\s'-]*)$/i, build: (m) => `${m[1]} should ${m[2]}` },
  ];

  for (const pattern of auxiliaryPatterns) {
    const match = clean.match(pattern.regex);
    if (match) {
      return ensureSentencePunctuation(capitalizeFirst(pattern.build(match)));
    }
  }

  return ensureSentencePunctuation(capitalizeFirst(clean));
}

function normalizeQuestionToClaim(input, language) {
  const text = String(input || '').trim();
  if (!text) return '';

  if (language === 'mr') {
    return ensureSentencePunctuation(text.replace(/\?+$/, '').trim());
  }

  return normalizeEnglishQuestionToClaim(text);
}

function cleanHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|article|section|br)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function extractBetween(html, regex) {
  const match = String(html || '').match(regex);
  return match ? String(match[1] || '').trim() : '';
}

function trimToLength(text, maxLength) {
  const value = String(text || '').trim();
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength);
}

function extractArticleDataFromHtml(html, url) {
  const title =
    extractBetween(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"]+)["'][^>]*>/i) ||
    extractBetween(html, /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"]+)["'][^>]*>/i) ||
    extractBetween(html, /<title[^>]*>([\s\S]*?)<\/title>/i);

  const description =
    extractBetween(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"]+)["'][^>]*>/i) ||
    extractBetween(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"]+)["'][^>]*>/i);

  const articleBody =
    extractBetween(html, /<article[\s\S]*?>([\s\S]*?)<\/article>/i) ||
    extractBetween(html, /<main[\s\S]*?>([\s\S]*?)<\/main>/i) ||
    html;

  const text = cleanHtml(articleBody);
  const domain = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  const combined = [title, description, trimToLength(text, 12000)]
    .filter(Boolean)
    .join('\n\n')
    .trim();

  return {
    domain,
    title: title || '',
    description: description || '',
    text: combined,
  };
}

async function fetchUrlHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    if (!/text\/html|application\/xhtml\+xml|text\/plain/i.test(contentType)) {
      throw new Error('Unsupported content type');
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function getUrlContext(url) {
  const html = await fetchUrlHtml(url);
  const articleData = extractArticleDataFromHtml(html, url);

  if (!articleData.text || articleData.text.length < 200) {
    throw new Error('Could not extract enough article text');
  }

  return articleData;
}

async function rewriteExplanationStrict({
  input,
  claim,
  verdict,
  explanation,
  language,
}) {
  const targetLanguage = language === 'mr' ? 'Marathi' : 'English';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `
You rewrite fact-check explanations.

STRICT RULES:
- Keep the same meaning and verdict.
- Write only in ${targetLanguage}.
- Explanation MUST be between 120 and 150 words.
- Never go below 120 words.
- Never exceed 150 words.
- Be clear, simple, and informative.
- No fluff, no repetition.
- Return only valid JSON.
        `.trim(),
      },
      {
        role: 'user',
        content: `
Input: "${input}"
Claim: "${claim}"
Verdict: "${verdict}"
Current explanation: "${explanation}"

Rewrite it so it strictly follows all rules.

Return JSON:
{
  "explanation": ""
}
        `.trim(),
      },
    ],
    temperature: 0.2,
  });

  const text = response.choices[0].message.content;
  const data = JSON.parse(text);

  return data.explanation || explanation;
}

export async function POST(req) {
  try {
    const { input } = await req.json();

    const rawInput = String(input || '').trim();
    const forcedOutputLanguage = detectRequestedOutputLanguage(rawInput);
    const cleanedInput = stripOutputLanguageInstruction(rawInput) || rawInput;
    const isUrlInput = looksLikeUrl(cleanedInput);

    let urlContext = null;
    let sourceDomain = '';

    if (isUrlInput) {
      try {
        urlContext = await getUrlContext(cleanedInput);
        sourceDomain = urlContext.domain || '';
      } catch (error) {
        console.error('URL FETCH ERROR:', error);
      }
    }

    const detectedInputLanguage =
      forcedOutputLanguage ||
      (urlContext?.text ? guessInputLanguage(urlContext.text) : guessInputLanguage(cleanedInput));

    const targetLanguageName = detectedInputLanguage === 'mr' ? 'Marathi' : 'English';

    const effectiveFactInput = isUrlInput
      ? cleanedInput
      : cleanedInput;

    const articleContextBlock =
      isUrlInput && urlContext
        ? `
URL: ${cleanedInput}
Domain: ${urlContext.domain || ''}
Article title: ${urlContext.title || ''}
Article description: ${urlContext.description || ''}

ARTICLE TEXT:
${urlContext.text}
          `.trim()
        : '';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `
You are a strict fact-checking AI.

LANGUAGE RULES:
- Detect whether the user's text is English or Marathi.
- Also detect whether the user explicitly requested the answer language.
- If the user asks for the answer in Marathi, the ENTIRE output MUST be in Marathi.
- If the user asks for the answer in English, the ENTIRE output MUST be in English.
- Otherwise, use the natural language of the input or article.
- Do not mix languages.
- The required output language for this request is ${targetLanguageName}.

GENERAL FACT-CHECK RULES:
- Verdict must be only one of: TRUE, FALSE, UNVERIFIABLE.
- TRUE means the claim itself is factually correct.
- FALSE means the claim itself is factually incorrect.
- UNVERIFIABLE means reliable evidence is insufficient or unclear.
- Explanation MUST be between 120 and 150 words.
- Never go below 120 words.
- Never exceed 150 words.
- Confidence must be only one of: high, medium, low.
- input_type must be only one of: claim, question, url.
- Sources must be short labels, not full URLs.
- Always return at least 2 short source labels.

QUESTION RULES:
- If the input is a question, first convert it into a clear factual claim.
- For yes/no questions, the claim MUST represent the positive factual assertion being tested.
- The verdict MUST be based ONLY on that claim.
- Do NOT answer the question directly.
- Do NOT reverse the logic.
- The generated claim MUST be grammatically correct and end with proper punctuation.

URL RULES:
- If input_type is "url", you MUST use the provided article text.
- Do NOT say the content is inaccessible if article text has been provided.
- Read the article text, identify one main factual claim that best represents the article's core checkable assertion.
- Then evaluate whether that extracted claim is TRUE, FALSE, or UNVERIFIABLE based on the article text and general knowledge.
- Do not use vague claims like "The article is accurate."
- Instead produce a specific claim from the article itself.

MEDICAL RULES:
- If the topic is medical, health, disease, treatment, cure, diagnosis, drugs, supplements, hospitals, symptoms, therapy, cancer, diabetes, heart disease, pregnancy, mental health, digestion, stomach issues, or anything health-related:
  - set "is_medical": true
  - provide a short but clear "medical_warning" in the same language as the final output
- Otherwise:
  - set "is_medical": false
  - set "medical_warning": ""

Return ONLY valid JSON.
          `.trim(),
        },
        {
          role: 'user',
          content: isUrlInput
            ? `
Original input: "${rawInput}"
Fact-check content: "${effectiveFactInput}"
Required output language: "${detectedInputLanguage}"

${articleContextBlock}

Return JSON exactly in this shape:
{
  "claim": "",
  "verdict": "",
  "explanation": "",
  "confidence": "",
  "language": "${detectedInputLanguage}",
  "input_type": "url",
  "sources": ["", ""],
  "is_medical": false,
  "medical_warning": ""
}
              `.trim()
            : `
Original input: "${rawInput}"
Fact-check content: "${effectiveFactInput}"
Required output language: "${detectedInputLanguage}"

Return JSON exactly in this shape:
{
  "claim": "",
  "verdict": "",
  "explanation": "",
  "confidence": "",
  "language": "${detectedInputLanguage}",
  "input_type": "",
  "sources": ["", ""],
  "is_medical": false,
  "medical_warning": ""
}
              `.trim(),
        },
      ],
      temperature: 0.2,
    });

    const text = response.choices[0].message.content;
    const data = JSON.parse(text);

    const normalizedLanguage = normalizeLanguage(
      data.language,
      urlContext?.text || cleanedInput,
      forcedOutputLanguage
    );
    const normalizedInputType = normalizeInputType(data.input_type, cleanedInput);
    const normalizedVerdictValue = normalizeVerdict(data.verdict);

    let claim = String(data.claim || '').trim();

    if (normalizedInputType === 'question') {
      const fallbackClaim = normalizeQuestionToClaim(cleanedInput, normalizedLanguage);
      const claimLooksBad =
        !claim ||
        /\?$/.test(claim) ||
        /\bin marathi\b/i.test(claim) ||
        /\bin english\b/i.test(claim) ||
        /मराठीत/.test(claim) ||
        /इंग्रजीत/.test(claim);

      if (claimLooksBad) {
        claim = fallbackClaim;
      } else {
        claim = ensureSentencePunctuation(capitalizeFirst(claim));
      }
    } else {
      claim = ensureSentencePunctuation(capitalizeFirst(claim || cleanedInput));
    }

    if (normalizedInputType === 'url' && (!claim || /article.*accurate/i.test(claim))) {
      claim =
        normalizedLanguage === 'mr'
          ? 'दिलेल्या लेखातील मुख्य दावा पडताळण्यात आला.'
          : 'The main factual claim in the provided article was checked.';
    }

    let explanation = String(data.explanation || '').trim();
    let wordCount = countWords(explanation);
    let attempts = 0;

    while ((wordCount < 120 || wordCount > 150) && attempts < 2) {
      explanation = await rewriteExplanationStrict({
        input: urlContext?.title || cleanedInput,
        claim,
        verdict: normalizedVerdictValue,
        explanation,
        language: normalizedLanguage,
      });

      wordCount = countWords(explanation);
      attempts++;
    }

    let sources = Array.isArray(data.sources)
      ? data.sources.map((item) => String(item || '').trim()).filter(Boolean)
      : [];

    if (sourceDomain) {
      const domainLabel =
        normalizedLanguage === 'mr'
          ? `मूळ लेख: ${sourceDomain}`
          : `Source article: ${sourceDomain}`;
      sources = [domainLabel, ...sources].filter(Boolean);
    }

    if (sources.length < 2) {
      sources = [
        ...sources,
        ...fallbackSources(normalizedVerdictValue, normalizedLanguage),
      ];
    }

    sources = sources.filter(Boolean).slice(0, 4);

    const normalizedResult = {
      claim,
      verdict: normalizedVerdictValue,
      explanation,
      confidence: normalizeConfidence(data.confidence),
      language: normalizedLanguage,
      input_type: normalizedInputType,
      sources,
      is_medical: Boolean(data.is_medical),
      medical_warning: String(data.medical_warning || '').trim(),
    };

    if (normalizedResult.is_medical && !normalizedResult.medical_warning) {
      normalizedResult.medical_warning =
        normalizedLanguage === 'mr'
          ? 'आरोग्यविषयक प्रश्नांसाठी कृपया पात्र वैद्यकीय तज्ज्ञांचा सल्ला घ्या. फक्त AI उत्तरावर अवलंबून राहू नका.'
          : 'For health-related questions, please consult a qualified medical professional. Do not rely only on AI output.';
    }

    if (isUrlInput && !urlContext) {
      normalizedResult.verdict = 'UNVERIFIABLE';
      normalizedResult.claim =
        normalizedLanguage === 'mr'
          ? 'दिलेल्या दुव्यातील मजकूर विश्वसनीयरीत्या वाचता आला नाही.'
          : 'The content at the provided URL could not be reliably read.';
      normalizedResult.explanation =
        normalizedLanguage === 'mr'
          ? 'दिलेला दुवा ओळखला गेला, पण त्या पानातील लेखाचा पुरेसा मजकूर सुरक्षितपणे काढता आला नाही. त्यामुळे लेखातील मुख्य दावा अचूकपणे ओळखून त्याची तथ्य पडताळणी करणे शक्य झाले नाही. हे अनेकदा वेबसाइट रचना, स्क्रिप्ट-आधारित सामग्री, संरक्षण मर्यादा, किंवा अपुरी मजकूर उपलब्धता यामुळे होते. म्हणून हा निकाल सध्या UNVERIFIABLE ठेवला आहे. विश्वसनीय निकालासाठी कृपया लेखातील मुख्य परिच्छेद, स्क्रीनशॉट, किंवा संपूर्ण मजकूर थेट पेस्ट करा. तेव्हा अॅप विशिष्ट दावा काढून त्यावर TRUE, FALSE किंवा UNVERIFIABLE असा अधिक योग्य निर्णय देऊ शकेल.'
          : 'The link was recognized, but the app could not reliably extract enough article text from that page to identify the main claim and fact-check it properly. This can happen because of site structure, script-heavy pages, access protections, or insufficient readable content in the fetched response. For that reason, the result is currently marked UNVERIFIABLE. To get a dependable verdict, please paste the key paragraph, a screenshot, or the article text directly. Then the app can extract a specific claim from the content itself and judge it more accurately as TRUE, FALSE, or UNVERIFIABLE.';
      normalizedResult.confidence = 'low';
      normalizedResult.input_type = 'url';
      normalizedResult.sources = fallbackSources('UNVERIFIABLE', normalizedLanguage);
    }

    return Response.json(normalizedResult);
  } catch (error) {
    console.error('API CHECK ERROR:', error);
    return Response.json({ error: 'AI error' }, { status: 500 });
  }
}