# AI process log

A running log of how AI was used in this project: what I asked, what it produced, what I kept, and where my judgment took over. Kept from day 1 so the process write-up is based on real evidence, not memory.

**Format per entry:** date · phase · tool · what I asked · what AI did well · where it fell short · my decision

---

## 2026-11-26 · Understanding the brief · Claude Code (Opus)

- **Asked:** break down the assignment, the evaluation criteria and the stakeholder.
- **AI did well:** looked up the agency's site and careers page in parallel. Found that **Designrr (an AI eBook creator) is one of Contrast's case studies** — strong signal that the assignment comes from real client work and that reviewers know this domain deeply. Mapped each requirement to "what is really being tested".
- **Fell short:** couldn't read the submission form (rendered client-side). Proposed stakeholder questions that were already answered in the brief (repo access, process format).
- **My judgment:** cut the question list from 6 to 2 and kept only what the brief doesn't answer and what gives real context: target user, and why people give up on tools like this (Contrast has first-hand Designrr data). Other gaps become explicit, documented assumptions.

## 2026-11-26 · Research setup · Claude Code (deep-research)

- **Asked:** run desk research in parallel on 4 independent tracks: competitor teardown, voice of customer (reviews), AI UX patterns (waiting / control / errors), cover design + shareability.
- **Why this split:** each track maps directly to a hard requirement in the brief (engagement during generation, control without starting over, failure recovery, designed covers, sharing).
- **Also generated:** interview guide for 3–5 first-time creators (`research/interview-guide.md`). Interviews themselves are done by me — AI can't replace talking to real people.
- **Result:** 4 cited note files (`research_notes/`) synthesized into one report (`reports/AI eBook creator UX research.md`) with an insight → design decision table per requirement.
- **AI did well:** breadth and speed — ~100 sources across 4 tracks in under 10 minutes; kept sourced findings and inferences apart; dropped unverifiable stats (e.g. "8–36% lift", "40% faster streaming").
- **Fell short:** G2, Capterra and Reddit blocked automated access, so voice-of-customer leans on Trustpilot. Designrr's live UI was not seen — only help docs and reviews. No funnel / drop-off data anywhere.
- **Next step to close the gaps:** hands-on Designrr / Gamma trial with screenshots, and 3–5 real interviews using `research/interview-guide.md`.

## 2026-11-26 · Flow exploration · Claude Code (brainstorming → spike)

- **Decided (from research):** primary user = practitioner with expertise but no writing/design skills (coach, baker, teacher) making a short 5–8 chapter guide to share with their audience. Non-goals: fiction, kids' books, KDP print.
- **Asked:** propose ways to structure the flow, then build all three as a clickable throwaway spike to compare by feel, not by description: (1) compact wizard, (2) chat co-author, (3) "growing book" — guided steps on the left, the book itself on the right from second one.
- **AI did well:** one-file spike with shared demo content and a simulated generation, written in one pass; each variant clickable end to end (idea → unclear input → title/outline → generation → rewrite with keep/undo → publish).
- **Fell short / observed:** the chat variant needs scripted replies — any off-script message exposes the simulation, which confirms the research concern about chat for novices.
- **My decision:** none of the three alone — merge them. Keep the clear steps of (1), the always-visible growing book of (3), and turn the chat of (2) into a *scoped* co-author: a small command bar where every request maps to a visible, undoable change (fixes the "AI says it changed something but didn't" complaint from research).
- **Artifact:** `spikes/flow-options.html`

## 2026-11-26 · Merged flow + deep customization · Claude Code (spike)

- **Asked:** combine all three flows into one and push customization of text, chapters and cover.
- **Built (`spikes/merged-flow.html`):**
  - **Text:** click any paragraph → Shorter / Simpler / + Example / Warmer / Edit myself / Ask…; result highlighted with Keep · Try another · Undo. Chapter-level rewrites (shorter, more practical, more personal, fresh take) with a per-chapter version history and Restore. "More personal" inserts the author's own story from step 1, or a placeholder asking for one — the AI never invents the author's experience.
  - **Chapters:** drag to reorder, inline rename, remove (min 3), add from AI suggestions or by name — new chapters are written on the spot.
  - **Cover:** 4 composition layouts × 4 palettes × 3 typefaces × 3 motifs, editable title/subtitle/author, Shuffle, live thumbnail-contrast check.
  - **Style:** 3 interior themes + drop cap toggle, applied to the book preview and the PDF.
  - **Safety net:** global Undo (button + ⌘Z) for every change; chapter 5 fails on purpose to show partial-failure recovery (other chapters stay safe, Retry only that one).
  - **Publish:** pre-flight checklist, real PDF via print-to-PDF (6×9 in, cover first), share link, link-preview card, auto-written share description.
- **AI fell short:** first pass broke interior fonts (double quotes inside an inline `style` attribute) and clipped tall content on the publish screen; editing-mode logic was over-complicated. Found by clicking through in the browser, fixed by hand-directed edits.

## 2026-11-26 · Visual direction + UX/UI pass (v2) · Claude Code (creative-direction skill)

- **Input:** 6 reference shots from me (book-reading app UI: cream paper, light display serif, coral accent, icon rail, realistic books, floating pill toolbars; one playful bookstore with chat + book cards).
- **AI did well:** extracted the traits shared by ≥2 references instead of copying one shot; wrote a theme statement (**calm, tactile, library**) and an audit of v1 with 12 issues ranked by severity (`spikes/ux-audit-v1.md`), then rebuilt the spike as `spikes/folio-v2.html` with tokens for colour, type, space, radius and elevation.
- **Key UX decisions (mine, from the audit):**
  - Co-author moved out of the left panel into a floating pill next to the book it edits; short "whisper" bubbles for news; replies can carry a mini cover card (from the playful reference).
  - Steps moved to a left icon rail (from the references); every step's primary action sits in a sticky panel footer.
  - Paragraph toolbar became a floating pill (no layout shift while reading); paragraphs are keyboard-focusable.
  - One icon family (Lucide) instead of glyphs; in-app confirm dialog instead of the browser's.
- **AI fell short (caught in browser testing):** the active step looked disabled (opacity on the current step's button); at 1024 px the open spread squeezed to one word per line and the dock wrapped; the panel tab bar overflowed. Fixed with container queries (single page + compact dock on narrow desks) and a narrow-panel rule.
- **Not done yet:** formal design system page, dark mode (not planned), real interviews.

## 2026-11-26 · Fluid scaling + motion (v3) · Claude Code

- **Asked:** layout in viewport units so everything fits a 1920×960 screen and scales from there; smooth appearance animations.
- **Approach:** one root unit instead of hundreds of vw values: `html{font-size:clamp(13px, min(100vw/120, 100vh/60), 26px)}` → exactly 16px on a 1920×960 canvas, every size in rem, so the whole layout scales with **both** width and height. A script converted all CSS/inline px to rem (×1.2 so 1920 is the design canvas); hairlines ≤2px stay in px. Floor of 13px keeps body text readable on laptops (my call: legibility beats a perfect fit).
- **Motion rules:** enter once, never on every re-render (the UI re-renders up to 25×/s while text streams). Animations are keyed to *what changed*: step → staggered panel rise + book flies in; chapter → page turn left/right; cover → book lifts and turns; finished chapter → green flash that survives re-renders (negative animation-delay from a timestamp); co-author opens from its button; `prefers-reduced-motion` turns everything off.
- **AI fell short:** root size came out 17.4px, not 16px, because a shared `html,body{font-size}` rule overrode the root; cover flip rotated only the cover so the page block detached mid-animation. Both found in the browser and fixed.
- **Checked:** 1920×960 (root 16px), 1440×900 and 1024×768 (root 13px, single-page spread), no horizontal overflow, no console errors.

## 2026-11-26 · Brief confirmation ("Here's what I'll make") · 4 variants

- **Trigger (my own test):** I typed "A simple sourdough guide for people with full-time jobs" and thought I had chosen the **title**. The idea field reads like a title field; the confirmation card below it had unlabeled chips, hidden options behind ↕, a non-clickable chip styled like clickable ones, and a broken generated sentence ("A straight to the point short guide").
- **Built:** `spikes/brief-options.html`, four clickable variants with the same inputs: A editable sentence, B labelled choices, C taste test (pick the voice by reading sample lines), D one question at a time. All four fix the idea/title confusion with a label: "Not the title. You'll pick a title in the next step."
- **Decision:** _(pending)_

## 2026-11-26 · Decision: one question at a time, everywhere · React build

- **Decision (mine):** variant D, "one question at a time", becomes the rule for every decision in the product: Idea (about → reader → voice by sample → length → your own tip → summary with Change links), Shape (title → plan), Publish ("What do you want to do with it?" first, ready check second). Editing in Write stays a toolset, because it isn't a question. Also: question headings sized so "What's your book about?" fits on one line.
- **Build:** moved from HTML spikes to the real app in `app/` (Vite + React + TypeScript, zustand + immer store, framer-motion, lucide-react). Design tokens and CSS carried over from the spikes; logic ported into one store with typed actions.
- **AI fell short, caught by clicking through:**
  1. The leaving screen read the *next* step during its exit animation and crashed the app. Fixed by freezing each screen's question at mount, then added an **error boundary** (friendly recovery screen) because the crash showed a blank page.
  2. `AnimatePresence mode="wait"` made the next screen wait for the old one's exit animation; in a background tab animations pause, so the flow could stall. Fixed: screens never wait on animations.
  3. Also added **autosave** (book survives reload; a generation interrupted by a reload turns into "retry this chapter") and a `?static` URL flag that switches motion off for automated checks and screenshots.
- **Checked:** full flow at 1920×960 via scripted clicks, typecheck clean, production build 116 kB gzipped JS.

## 2026-11-26 · Library: shelf + reader

- **Asked:** save the finished book to a library with a shelf, open it with an animation, read and turn pages.
- **Built:** "Save to my library" as the first outcome on Publish; Library in the rail (with a count) showing covers on a shelf; reader that flies the book in, swings the cover open on its spine and turns pages as real 3D leaves (front/back faces, arrows or ← → keys, Esc to close). The book is paginated into printed pages (title, contents, chapters starting on a new page). Library is autosaved and survives "Start over".
- **Why it matters for the brief:** "a finished eBook they're proud to share" — reading it as a book, not as an editor, is the moment of pride; it's also how readers will see it.
- **Fell short / fixed:** shelf plank was hidden behind the page background (z-index); first pagination left pages half empty.
