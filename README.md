# PortfolioLPN

Personal portfolio website for **Lê Phương Nam** — first-year UEH student, ENFP, looking for an Account Intern role at an Event Agency.

> **GO BIG OR GO HOME.**

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** + `@theme` directive
- **Framer Motion** — section reveals, scroll-driven animations, sticky studio in Work section
- **GSAP** — installed for future motion expansion
- **Lenis** — silky smooth scroll
- **react-zoom-pan-pinch** — wheel/pinch zoom inside image lightbox
- **Web Audio API** + MP3 fallback — background music with master gain and fade

## Sections (proof-first flow)

1. **Hero** — GO BIG / OR / GO HOME headline, portrait, identity line, tagline
2. **Work** — sticky cinematic studio with 4 contest case studies
3. **Process** — Travelgroup UEH, Margroup UEH, Sintech
4. **About** — DNA chips, story blocks, GO BIG philosophy panel, signed pledge closer
5. **Services** — Hard / Soft / Tools skill tabs
6. **Contact** — info cards, CV download, mailto + tel CTAs, socials

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

This repo is set up for **Vercel** deploy out of the box:

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set `metadataBase` in `src/app/layout.tsx` to the final domain after the first deploy.

## Credits

- Background music: ["Joyful Rhythm Walk Funk" by LightBeatsMusic](https://pixabay.com/music/funk-joyful-rhythm-walk-funk-513936/) — Pixabay CC0
- Hero portrait, contest posters, and case-study assets are property of Lê Phương Nam.
