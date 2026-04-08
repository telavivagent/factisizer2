# Factisizer

Minimal, premium AI-powered fact-checking app.
Supports **English** and **Marathi**. Built with Next.js 14 App Router.

## Setup

```bash
# 1. Install
npm install

# 2. Add your OpenAI key
cp .env.example .env.local
# edit .env.local → OPENAI_API_KEY=sk-...

# 3. Run
npm run dev        # → http://localhost:3000
npm run build && npm start   # production
```

## Project structure

```
factisizer/
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── manifest.js
│   ├── page.js
│   └── api/check/route.js
├── components/
│   ├── VerdictCard.js
│   ├── ResultCard.js
│   ├── EmptyVerdict.js
│   └── LoadingState.js
├── public/
│   ├── header.png
│   ├── icon-192.png
│   └── icon-512.png
├── .env.example
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tailwind.config.js
```

## Key decisions

| # | Decision |
|---|---|
| No `lint` script | ESLint not configured; script removed to keep `package.json` consistent. Add `eslint` + `eslint-config-next` and restore `"lint": "next lint"` if you want linting. |
| Title always shown | `<h1>Factisizer</h1>` renders below the logo image unconditionally. The image is decorative (`aria-hidden`). |
| Device-neutral hint | "Ctrl + Enter to submit" — works on all platforms. Ctrl+Enter and ⌘+Enter both trigger submit in code. |
| Next.js 14.2.29 | Latest patched 14.x release. |
| No hallucinated sources | Model is strictly instructed never to invent URLs. Empty `sources: []` is returned when no confident source exists. An `evidence_note` gives an honest plain-language sourcing assessment. |
