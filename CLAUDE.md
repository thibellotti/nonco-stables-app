# Nonco Stables App

Institutional stablecoin settlement PWA for Nonco.

## Stack
Next.js 16.2 · React 19 · TailwindCSS v4 · Framer Motion

## Dev
```bash
npm run dev     # localhost:3000
npm run build   # production build
npm run lint    # eslint
```

## Design Tokens
All in `src/app/globals.css`. NEVER hardcode hex — always use CSS variables.

Key tokens:
- `--bg-card: #141414` — card/sidebar backgrounds
- `--border: #18181b` — default borders
- `--border-outline: #3b494c` — hover borders
- `--cyan: #05E0F8` — primary accent (Nonco Stables blue)

## Rules
- `font-mono` (JetBrains Mono) ONLY for numbers, prices, timestamps, codes
- `font-sans` (Space Grotesk) for ALL labels, descriptions, UI text
- Cards: `bg-[var(--bg-card)] border border-[var(--border)] rounded-lg` — flat, no shadows
- Section headers: use `<SectionLabel>` component
- Page transitions: use `<PageTransition>` wrapper
- Tables: `px-6 py-3` headers, `px-6 py-4` body cells

## Deploy
```bash
vercel build --prod && vercel deploy --prebuilt --prod
```

## Services
Mock data in `src/lib/mock-data.ts`. Service abstraction in `src/services/`.
When connecting real API, update service files — pages don't need to change.
