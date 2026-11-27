# UX/UI audit of the merged spike (v1) → fixes in v2

Design read: AI eBook creator · first-time experts with no writing/design skills · calm, warm, editorial · literary-library aesthetic (user references: book-reading app shots).
Dials: Creativity = Balanced · Density = Airy · Variance = Uniform · Motion = Balanced.
Theme statement: **calm, tactile, library**. The book is the hero; the interface is quiet paper around it.

## What the references bring

| Trait (appears in ≥2 refs) | How v2 uses it |
|---|---|
| Warm cream paper canvas, lighter right column | Cream panel on the left, lighter "desk" on the right where the book lives |
| Light, high-contrast display serif + geometric sans | Gilda Display for headings, Manrope for UI, Newsreader for the book interior |
| Coral as the single active colour | Active step in the rail, selected paragraph, co-author button, key highlights only |
| Dark pill buttons with ↗ arrow | Primary actions |
| Left icon rail | Steps of the flow (Idea, Shape, Write, Publish) with labels |
| Realistic books with soft cast shadows, open-book hero | Closed book with spine shading and page block; open spread with gutter and page stack |
| Book info next to the book (title, pages, blurb) | Desk shows the book plus a short info column in Shape and Publish |
| Floating pill toolbar over selected text, pink highlight | Paragraph toolbar becomes a floating pill; selection highlighted pink |
| Floating bottom pill nav (reader) | Desk controls: Cover/Pages, chapter navigation, co-author |
| Chat that answers with book cards (playful ref) | Co-author replies can include a mini cover card |

## Issues found in v1

| # | Issue | Severity | Fix in v2 |
|---|---|---|---|
| 1 | Co-author block permanently takes ~35% of the left panel, pushing step controls and primary actions out of view on laptop heights | High | Move co-author into a floating pill on the desk that opens a popover next to the book it edits; short "whisper" bubble when it has news |
| 2 | Primary action scrolls away when the chapter list is long | High | Sticky panel footer with the step's primary action |
| 3 | Three navigation zones (top stepper, panel, desk controls) | Medium | Left rail for steps; desk controls in one floating pill; top bar removed |
| 4 | Paragraph toolbar is a dark strip inserted into the text, which shifts the page while reading | Medium | Floating white pill anchored to the paragraph, no layout shift |
| 5 | Glyphs as icons (↻ ⠇ ✎ ✨ ↑) | Medium | One icon family (Lucide), every icon-only button has a label |
| 6 | Paragraphs are mouse-only | Medium | Paragraphs are focusable; Enter opens the toolbar, Esc closes |
| 7 | Heavy 600-weight serif everywhere reads loud, not literary | Medium | Light display serif for headings only; UI in a geometric sans |
| 8 | Book looks flat (one gradient strip for pages) | Medium | Spine shading, gloss, page block, cast shadow; open spread with gutter and page stack |
| 9 | "Restart" uses the browser's native confirm dialog | Low | In-app confirmation dialog |
| 10 | Typing a custom title doesn't update the selected state | Low | Live selection state |
| 11 | Decorative em dashes in UI copy | Low | Plain sentences in UI copy (prose inside the book keeps them) |
| 12 | Muted text on cream close to the 4.5:1 limit | Low | Muted text darkened to #67635B |
