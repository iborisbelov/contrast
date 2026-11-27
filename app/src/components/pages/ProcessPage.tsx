/** #/process — how Folio was made: research, method, AI collaboration, decisions. */
import { DocShell } from './DocShell'

const BASE = import.meta.env.BASE_URL
const REPO = 'https://github.com/iborisbelov/contrast'

const INSIGHTS: [string, string, string][] = [
  ['Novices get lost in long wizards that ask for design choices before any content exists (Designrr asks for format and template first).', 'Nothing about design is asked up front. The book appears on the desk from the first answer.', 'Competitor teardown'],
  ['The loudest complaint after pricing: “it ignored what I asked” and “it says it changed things but didn’t”.', 'Every AI change is visible: highlighted, kept in versions, with Keep / Try another / Undo. The co-author can only make changes you can see.', 'Reviews (Trustpilot, AppSumo)'],
  ['Readers can tell an eBook is AI-made; authors are embarrassed by “AI smell”.', 'A question asks for a tip only the author knows (with sentence starters). The AI never invents the author’s experience: without a story it leaves a placeholder.', 'Reviews, Reddit (via secondary sources)'],
  ['Choosing a “tone” by label is abstract for non-writers.', 'Tone is chosen by reading three sample opening lines written about the user’s own topic.', 'Shape of AI: sample response'],
  ['Past ~10s, spinners kill confidence; showing the work raises perceived value (labour illusion).', 'Outline first, cover first, then chapters stream into a live contents page. Chapter 1 is readable while the rest is written.', 'NN/g, Buell & Norton'],
  ['Pride comes from a professional result, the cover above all. Template covers look amateur.', 'A cover system: topic-driven motif, palette and type, four composition archetypes, live text, contrast check.', 'Cover design practice, NYPL generative covers'],
]

const LOG: [string, string, string, string][] = [
  ['Understand the brief', 'Read the agency’s site in parallel and found Designrr (an AI eBook tool) among Contrast’s case studies.', 'Couldn’t read the JS submission form; proposed questions the brief already answered.', 'Cut 6 stakeholder questions to 2.'],
  ['Desk research', '4 research agents in parallel: competitors, reviews, AI UX patterns, covers. ~100 sources in minutes, findings kept apart from inferences.', 'G2, Capterra, Reddit blocked automated access; Designrr’s live UI not observed.', 'Prioritised which insights become decisions (table above).'],
  ['Flow exploration', 'Built 3 clickable flows in one file (wizard, chat, growing book) to compare by feel.', 'Chat needed scripted replies; any off-script message exposed it.', 'Merged them: steps + living book + a scoped co-author.'],
  ['Visual direction', 'I collected references on Dribbble and Behance (reading and library apps). AI extracted the traits shared by 2+ shots, wrote a theme statement and a 12-point audit.', 'Active step looked disabled; spread collapsed at 1024px; tabs overflowed.', 'Picked the direction; fixed by container queries.'],
  ['Brief UX', 'Built 4 variants of the “here’s what I’ll make” step side by side.', '—', 'Chose “one question at a time” and applied it to every decision.'],
  ['React build', 'Ported the spike into Vite + React + TS with a typed store, motion and autosave.', 'Exit animation crashed the app; screens could stall in background tabs.', 'Added an error boundary, autosave, and “never wait on animation”.'],
  ['Real AI', 'Groq (gpt-oss-120b) behind a PHP proxy: briefs, plans, chapters, rewrites for any topic.', 'First model name was retired (404).', 'Key server-side only, fixed task prompts, rate limit, offline fallbacks everywhere.'],
]

export function ProcessPage() {
  return (
    <DocShell eyebrow="Process & research" title="From a rough idea to a book you’re proud to share"
      lead="Folio is a desktop tool for experts with no writing or design background. This page shows how it was made: the research behind it, how I worked with AI at every stage, and the decisions and cuts along the way.">
      <section>
        <h2>The problem, in one line</h2>
        <p className="big">A coach, a baker or a teacher knows a lot. Turning that into a book feels like two jobs they don’t have: writer and designer. The tool has to do both jobs while keeping the book theirs.</p>
        <div className="doc-grid three">
          <div className="card"><b>Who it’s for</b><p>Anyone with know-how to share: content creators, coaches, practitioners. The client confirmed users vary, so nothing is tied to one niche; the AI tailors readers, voice and chapters to any topic. Scope: short non-fiction guides (4–8 chapters), not fiction or print.</p></div>
          <div className="card"><b>What success looks like</b><p>Idea to a designed, readable book in about five minutes, with every AI choice visible and reversible.</p></div>
          <div className="card"><b>What would make it fail</b><p>Generic “AI-sounding” text, a template cover, losing work, or an AI that silently ignores requests.</p></div>
        </div>
      </section>

      <section>
        <h2>Talking to the client</h2>
        <div className="doc-grid two">
          <div className="card"><b>I asked: who is the user?</b><p>“It could be a content creator, a coach or just anybody who wants to create an eBook.” So I designed for the common ground: experts without writing or design skills, and made every question adapt to the topic instead of a fixed niche.</p></div>
          <div className="card"><b>I asked: why do people give up on tools like this?</b><p>The client asked me to research it. That question became the spine of the research below: reviews of Designrr, Gamma and other tools, and the decisions each finding led to.</p></div>
        </div>
      </section>

      <section>
        <h2>Research → decisions</h2>
        <p className="doc-note" style={{ marginTop: 0 }}>Visual research: a moodboard from Dribbble and Behance (reading and library apps), reduced to shared traits: warm paper, a light literary serif, one accent, real book objects. Four desk-research tracks ran in parallel; the full report (≈6,500 words, every claim cited) is in the repo: <a href={`${REPO}/blob/main/reports/AI%20eBook%20creator%20UX%20research.md`} target="_blank" rel="noreferrer">AI eBook creator UX research</a>.</p>
        <div className="table">
          <div className="tr th"><span>Insight</span><span>Design decision</span><span>Source</span></div>
          {INSIGHTS.map(([a, b, c]) => <div className="tr" key={a}><span>{a}</span><span>{b}</span><span className="muted">{c}</span></div>)}
        </div>
      </section>

      <section>
        <h2>How I worked with AI</h2>
        <p className="big">Claude Code was a pair from the first hour, not a polish step: researcher, prototyper, reviewer and builder. My job was to set direction, judge the results, and say no.</p>
        <div className="table four">
          <div className="tr th"><span>Stage</span><span>What AI did</span><span>Where it fell short</span><span>My call</span></div>
          {LOG.map(([a, b, c, d]) => <div className="tr" key={a}><span><b>{a}</b></span><span>{b}</span><span>{c}</span><span>{d}</span></div>)}
        </div>
        <p className="doc-note">Raw, dated log of every step: <a href={`${REPO}/blob/main/process/ai-process-log.md`} target="_blank" rel="noreferrer">process/ai-process-log.md</a>.</p>
      </section>

      <section>
        <h2>How it evolved</h2>
        <p className="doc-note" style={{ marginTop: 0 }}>Every stage is still clickable, so you can see the reasoning, not just the result.</p>
        <div className="evo">
          {[['1', 'Three flows', 'Wizard vs chat vs growing book', 'flow-options.html'], ['2', 'Merged flow', 'Steps + living book + co-author', 'merged-flow.html'], ['3', 'Visual pass', 'Reference-driven design system', 'folio-v2.html'], ['4', 'Fluid + motion', '1920×960 canvas that scales', 'folio-v3.html'], ['5', 'Brief variants', '4 ways to confirm the brief', 'brief-options.html']].map(([n, t, d, f]) => (
            <a key={f} className="card evo-item" href={`${BASE}spikes/${f}`} target="_blank" rel="noreferrer"><span className="evo-n">{n}</span><b>{t}</b><p>{d}</p></a>
          ))}
          <a className="card evo-item now" href={BASE}><span className="evo-n">6</span><b>React app</b><p>Real AI, autosave, library, sharing</p></a>
        </div>
      </section>

      <section>
        <h2>Key decisions and trade-offs</h2>
        <div className="doc-grid two">
          <div className="card"><b>One question at a time, everywhere</b><p>Slower for experts than a single form, but no first-timer gets lost. “Skip, use your best guess” keeps it fast.</p></div>
          <div className="card"><b>Scoped co-author instead of a chat app</b><p>Chat is a blank page for novices and hides what changed. Here the chat only triggers visible, undoable edits.</p></div>
          <div className="card"><b>Real AI with a safety net</b><p>The brief allowed simulation, but a demo that turns every topic into sourdough breaks trust. Groq writes for any topic; every call has an offline fallback, and the sourdough example stays instant.</p></div>
          <div className="card"><b>Sharing without a backend</b><p>The book is compressed into the link itself. No accounts, no database; links are long, which is the trade-off.</p></div>
          <div className="card"><b>Failure is designed in</b><p>In the sourdough demo chapter 5 fails once on purpose, so the recovery (retry one chapter, others safe) is always visible.</p></div>
          <div className="card"><b>Cut on purpose</b><p>Accounts, EPUB/Kindle export, real image generation, collaboration, analytics. PDF uses the browser’s print engine.</p></div>
        </div>
      </section>

      <section>
        <h2>What I’d do next</h2>
        <ul className="next">
          <li>Run 5 moderated sessions with first-time authors using the interview guide in the repo; measure time to first book and how often people undo AI changes.</li>
          <li>Stream chapters token by token from the model instead of revealing finished paragraphs.</li>
          <li>Short share URLs with a reader page that collects emails (the lead-magnet job Designrr admits it doesn’t do).</li>
          <li>EPUB export and AI-generated cover art layered on the cover system.</li>
        </ul>
      </section>
    </DocShell>
  )
}
