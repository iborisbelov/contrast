/** #/system — the Folio design system, rendered from the same tokens and components the app uses. */
import { FONTS, LAYOUTS, MOTIFS, PALETTES, TITLES } from '../../lib/content'
import type { Book } from '../../lib/types'
import { Cover } from '../Cover'
import { Icon } from '../Icon'
import { DocShell } from './DocShell'

const COLORS: [string, string, string][] = [
  ['--canvas', '#F2EFE8', 'App canvas'], ['--panel', '#F5F2EB', 'Panels'], ['--desk', '#FAF8F3', 'Desk'], ['--paper', '#FCFAF5', 'Book pages'],
  ['--surface', '#FFFFFF', 'Cards'], ['--ink', '#1E1D1B', 'Text, primary buttons'], ['--muted', '#67635B', 'Secondary text (5.4:1)'], ['--line', '#E4DFD4', 'Borders'],
  ['--coral', '#E25C55', 'The one accent: active, AI'], ['--coral-ink', '#B8433D', 'Accent text (5.2:1)'], ['--hl', '#F6D4CF', 'Selection'], ['--green', '#3E7B57', 'Done'],
  ['--amber', '#9A6416', 'Needs attention'], ['--err', '#B3413A', 'Failed'],
]
const TYPE: [string, string, string, string][] = [
  ['Display', 'Gilda Display', '2.1rem / 1.15', 'Questions and page titles'],
  ['Heading', 'Gilda Display', '1.8rem / 1.2', 'Section titles'],
  ['Body', 'Manrope', '1.09rem / 1.55', 'Interface text'],
  ['Label', 'Manrope 600', '.86rem, +9% tracking, caps', 'Eyebrows and steps'],
  ['Book', 'Newsreader', '1.16rem / 1.65', 'Text inside the book'],
]
const SPACE: [string, number][] = [['s1', 4], ['s2', 8], ['s3', 12], ['s4', 16], ['s5', 24], ['s6', 32], ['s7', 48]]
const sample = (over: Partial<Book['cover']>): Book => ({
  title: TITLES[0].t, subtitle: TITLES[0].s, author: 'Alex Morgan', chapters: [], style: { theme: 'classic', dropcap: true },
  cover: { layout: 'object', pal: 0, font: 'editorial', motif: 'loaf', ...over },
})

export function SystemPage() {
  return (
    <DocShell eyebrow="Design system" title="Calm, tactile, library" lead="The book is the hero; the interface is quiet paper around it. One accent colour, a literary serif for questions, a clear sans for controls, and real objects (books, pages, shelves) instead of abstract UI.">
      <section>
        <h2>Principles</h2>
        <div className="doc-grid three">
          <div className="card"><b>One question per screen</b><p>Every decision is a single, plain question with visible answers. No forms, no jargon.</p></div>
          <div className="card"><b>Show the real thing</b><p>The book is on the desk from the first second and changes as you answer. Choices are made by looking, not by reading labels.</p></div>
          <div className="card"><b>Nothing is final</b><p>Every change is previewed, kept in history and undoable. Failures stay local: one chapter, never the whole book.</p></div>
        </div>
      </section>

      <section>
        <h2>Colour</h2>
        <div className="swatches">{COLORS.map(([v, hex, use]) => (
          <div key={v} className="swatch"><span style={{ background: `var(${v})` }} /><b>{v.slice(2)}</b><small>{hex}</small><small>{use}</small></div>
        ))}</div>
      </section>

      <section>
        <h2>Type</h2>
        <div className="type-rows">{TYPE.map(([role, font, size, use]) => (
          <div key={role} className="type-row">
            <span className={`ts ts-${role.toLowerCase()}`}>{role === 'Label' ? 'STEP 1 OF 4' : role === 'Book' ? 'Most people think sourdough needs a free weekend.' : 'What’s your book about?'}</span>
            <small><b>{role}</b> · {font} · {size}<br />{use}</small>
          </div>
        ))}</div>
        <p className="doc-note">Sizes are in rem on a fluid root: <code>font-size: clamp(13px, min(100vw / 120, 100vh / 60), 26px)</code>. A 1920×960 screen is the design canvas (16px); everything scales with width and height, with a 13px floor for legibility.</p>
      </section>

      <section>
        <h2>Space, radius, elevation</h2>
        <div className="space-rows">{SPACE.map(([k, px]) => <div key={k} className="space-row"><code>{k}</code><span style={{ width: px * 3 }} /><small>{px}px base</small></div>)}</div>
        <div className="doc-grid three" style={{ marginTop: '1.4rem' }}>
          <div className="card elev" style={{ boxShadow: 'var(--e1)' }}><b>e1</b><p>Cards, list rows</p></div>
          <div className="card elev" style={{ boxShadow: 'var(--e2)' }}><b>e2</b><p>Hover, popovers</p></div>
          <div className="card elev" style={{ boxShadow: 'var(--e3)' }}><b>e3</b><p>Dock, co-author, floating toolbars</p></div>
        </div>
      </section>

      <section>
        <h2>Components</h2>
        <div className="comp-grid">
          <div className="comp"><small>Buttons</small><div className="row-wrap"><button className="btn primary">Continue <Icon name="arrow-up-right" /></button><button className="btn ghost">Secondary</button><button className="btn quiet"><Icon name="arrow-left" />Back</button></div></div>
          <div className="comp"><small>Chips</small><div className="chips"><button className="chip"><Icon name="sparkles" />Suggestion</button><button className="chip on">Selected</button><span className="chip static">Static</span></div></div>
          <div className="comp"><small>Answer card (one question at a time)</small><button className="ans on"><span className="ic"><Icon name="clock" /></span><div><b>Busy beginners</b><span>Never baked bread, little free time</span></div><span className="tick"><Icon name="check" /></span></button></div>
          <div className="comp"><small>Notices</small><div className="notice err"><Icon name="triangle-alert" /><div><strong>A chapter didn’t finish.</strong> Your other chapters are safe.</div></div><div className="hint"><Icon name="shield-check" /><span>I never invent stories about you.</span></div></div>
          <div className="comp"><small>Floating paragraph toolbar</small><div className="ptools" style={{ position: 'static' }}><button><Icon name="minimize-2" />Shorter</button><button><Icon name="feather" />Simpler</button><button><Icon name="lightbulb" />Example</button><span className="sep" /><button className="ico accent"><Icon name="sparkles" /></button></div></div>
          <div className="comp"><small>Dock + co-author</small><div className="dock-pill" style={{ width: 'max-content' }}><span className="dock-note">Want a different cover?</span><button className="co-btn"><Icon name="sparkles" />Ask co-author</button></div></div>
        </div>
      </section>

      <section>
        <h2>Cover system</h2>
        <p className="doc-note" style={{ marginTop: 0 }}>The topic picks the motif, palette and type set the mood, four composition archetypes give real variety. Titles are always live text; contrast is checked for thumbnails.</p>
        <div className="cover-grid">{LAYOUTS.map(([k, n], i) => (
          <figure key={k}><div className="mini-cover"><Cover book={sample({ layout: k, pal: i, font: (Object.keys(FONTS) as Book['cover']['font'][])[i % 3] })} /></div><figcaption>{n}</figcaption></figure>
        ))}</div>
        <div className="cover-grid small">{MOTIFS.filter(([k]) => k !== 'none').map(([k, n], i) => (
          <figure key={k}><div className="mini-cover"><Cover book={sample({ motif: k, pal: i % PALETTES.length, layout: 'object' })} /></div><figcaption>{n}</figcaption></figure>
        ))}</div>
      </section>

      <section>
        <h2>Motion</h2>
        <div className="doc-grid three">
          <div className="card"><b>Enter once</b><p>Animations fire when something changes (a new question, a chapter, a cover), never on re-render while text streams.</p></div>
          <div className="card"><b>Objects move like objects</b><p>The book flies in and turns; covers swing open on the spine; pages turn as two-sided leaves.</p></div>
          <div className="card"><b>Never blocking</b><p>No screen waits on an animation. Reduced-motion is respected; <code>?static</code> turns motion off for tests.</p></div>
        </div>
      </section>
    </DocShell>
  )
}
