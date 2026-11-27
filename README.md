# Folio — turn your know-how into a book

A desktop web tool that takes an expert with no writing or design background from a rough idea to a finished, designed eBook they're proud to share. Built as the Product Design Builder home assignment for Contrast.

**Live prototype:** https://borisbelov.com/dev/contrast/
**Process & research:** https://borisbelov.com/dev/contrast/#/process
**Design system:** https://borisbelov.com/dev/contrast/#/system

## What it does

1. **Idea, one question at a time** — what the book is about → who reads it → how it should sound (picked by reading sample lines) → length → a tip only you know → summary.
2. **Shape** — pick a title (the cover updates live), then check and edit the chapter plan.
3. **Write & refine** — the cover appears first, chapters stream into a live contents page, chapter 1 is readable while the rest is written. Click any paragraph to rewrite it (shorter, simpler, example, warmer, your own words) with Keep / Try another / Undo, rewrite whole chapters, restore versions, edit the cover and interior style, or ask the co-author.
4. **Publish** — download a real 6×9 in PDF, copy a share link that opens the book in a reader, post to LinkedIn, email, or save to your library and read it with 3D page turns.

Failure is designed in: vague ideas get clarifying options, a failed chapter can be retried on its own, every AI call has an offline fallback, work is autosaved, and an error screen replaces any crash.

## How the AI works

- Any idea about sourdough uses a hand-written demo book (instant and offline, with one chapter failing on purpose to show recovery).
- Every other topic goes to **Groq (openai/gpt-oss-120b)** through `app/public/api/ai.php`, a small PHP proxy on the same domain. The API key lives on the server outside the web root and is never in the browser or this repo. The proxy only accepts four fixed tasks (`brief`, `plan`, `chapter`, `rewrite`) and is rate-limited.

## Repository

| Path | What's inside |
|---|---|
| `app/` | The product: Vite + React + TypeScript, zustand + immer store, framer-motion, lucide-react |
| `app/src/lib/store.ts` | The whole flow: questions, generation, history/undo, co-author, library |
| `app/src/components/Cover.tsx` | Theme-driven cover generator (4 compositions × palettes × type × motifs) |
| `app/public/api/ai.php` | Groq proxy (key loaded from `~/folio-secrets/config.php` on the server) |
| `reports/` | Research report: insight → design decision for every requirement |
| `research_notes/` | Cited notes from the four research tracks |
| `research/interview-guide.md` | Guide for interviews with first-time authors |
| `process/ai-process-log.md` | Dated log of how AI was used, where it fell short, and my decisions |
| `spikes/` | Every HTML prototype along the way (also live under `/dev/contrast/spikes/`) |

## Run it

```bash
cd app
npm install
npm run dev        # AI calls are proxied to the deployed endpoint
npm run build
npm run deploy     # builds for /dev/contrast/ and uploads (needs the deploy SSH key)
```

Add `?static` to the URL to turn motion off (useful for tests and screenshots).
