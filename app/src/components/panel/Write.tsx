/** Step 3: live progress while writing, then the refine tools. */
import { useRef } from 'react'
import { CHAPTER_LABEL, FONTS, LAYOUTS, MOTIFS, PALETTES, THEMES } from '../../lib/content'
import { useStore } from '../../lib/store'
import { contrast } from '../../lib/text'
import type { Book, ChapterKind, RefineTab, Theme } from '../../lib/types'
import { Cover } from '../Cover'
import { Icon, type IconName } from '../Icon'
import { Stagger } from '../motion'
import { OutlineEditor } from './OutlineEditor'

const justDone = (doneAt?: number) => doneAt !== undefined && Date.now() - doneAt < 1400

export function WritingProgress() {
  const { book, gen, openChapter } = useStore()
  const done = book.chapters.filter((c) => c.status === 'done').length
  const pct = Math.round(((done + (book.chapters.some((c) => c.status === 'writing') ? 0.5 : 0)) / book.chapters.length) * 100)
  return (
    <Stagger>
      <span className="eyebrow">Step 3 of 4</span>
      <h1 style={{ marginTop: '.6rem' }}>Writing your book</h1>
      <p className="lead">About a minute. Nothing is final, you’ll review and change everything.</p>
      <p className="status-msg" aria-live="polite"><span className="pulse" />{gen.msg}…</p>
      <div className="progress live" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${pct}%` }} /></div>
      <ol className="gen-list">
        {book.chapters.map((c, i) => (
          <li key={c.id} className={`${c.status} ${justDone(c.doneAt) ? 'just' : ''}`} tabIndex={c.status === 'done' ? 0 : -1}
            onClick={() => c.status === 'done' && openChapter(i)} onKeyDown={(e) => e.key === 'Enter' && c.status === 'done' && openChapter(i)}>
            <span className="dot" />{c.title}
            <em>{c.status === 'done' ? <>Read <Icon name="arrow-right" /></> : c.status === 'failed' ? 'Didn’t finish' : c.status === 'writing' ? 'Writing' : 'Queued'}</em>
          </li>
        ))}
      </ol>
      <div className="hint" style={{ marginTop: '1.2rem' }}><Icon name="book-open-text" /><span>Finished chapters open right away. Start reading while the rest is written.</span></div>
    </Stagger>
  )
}

const CH_ICON: Record<ChapterKind, IconName> = { shorter: 'minimize-2', practical: 'list-checks', personal: 'heart', fresh: 'refresh-cw' }
const TABS: [RefineTab, string, IconName][] = [['text', 'Text', 'align-left'], ['chapters', 'Chapters', 'list-ordered'], ['cover', 'Cover', 'image'], ['style', 'Style', 'type']]

export function Refine() {
  const { book, view, setTab, retry } = useStore()
  const failed = book.chapters.find((c) => c.status === 'failed')
  return (
    <>
      <span className="eyebrow">Step 3 of 4</span>
      <h1 style={{ marginTop: '.6rem' }}>Make it yours</h1>
      {failed && (
        <div className="notice err" role="alert">
          <Icon name="triangle-alert" />
          <div><strong>“{failed.title}” didn’t finish.</strong> Your other chapters are safe.
            <div style={{ marginTop: '.75rem' }}><button className="btn primary sm" onClick={() => retry(failed.id)}><Icon name="refresh-cw" />Retry this chapter</button></div>
          </div>
        </div>
      )}
      <div className="tabbar" role="tablist">
        {TABS.map(([k, n, ic]) => <button key={k} role="tab" aria-selected={view.tab === k} className={view.tab === k ? 'on' : ''} onClick={() => setTab(k)}><Icon name={ic} />{n}</button>)}
      </div>
      {view.tab === 'text' && <TextTab />}
      {view.tab === 'chapters' && <><p className="muted" style={{ margin: '0 0 .9rem' }}>Reorder, rename, remove or add chapters. New chapters are written on the spot.</p><OutlineEditor /></>}
      {view.tab === 'cover' && <CoverTab />}
      {view.tab === 'style' && <StyleTab />}
    </>
  )
}

function TextTab() {
  const { book, view, rewriteChapter, restoreVersion } = useStore()
  const ch = book.chapters[view.chapter]
  if (!ch) return null
  const last = ch.versions.length - 1
  return (
    <>
      <div className="eyebrow">Chapter {view.chapter + 1} of {book.chapters.length}</div>
      <h2 style={{ margin: '.45rem 0 1.05rem' }}>{ch.title}</h2>
      <div className="hint"><Icon name="mouse-pointer-click" /><span>Click any paragraph in the book to rewrite or edit it. Or change the whole chapter:</span></div>
      <div className="chips">
        {(Object.keys(CHAPTER_LABEL) as ChapterKind[]).map((k) => (
          <button key={k} className="chip" disabled={ch.status !== 'done'} onClick={() => rewriteChapter(k)}><Icon name={CH_ICON[k]} />{CHAPTER_LABEL[k]}</button>
        ))}
      </div>
      <div className="section-t">Versions <small>every change is kept</small></div>
      {ch.versions.length ? (
        <ol className="versions">
          {ch.versions.map((v, i) => ({ v, i })).reverse().map(({ v, i }) => (
            <li key={i} className={i === last ? 'cur' : ''}>
              <Icon name={i === 0 ? 'file-text' : 'history'} /><span>{v.label}</span>
              {i === last ? <span className="muted" style={{ flex: 'none', fontSize: '.9rem' }}>Current</span> : <button className="btn ghost sm" onClick={() => restoreVersion(i)}>Restore</button>}
            </li>
          ))}
        </ol>
      ) : <p className="muted">Not written yet.</p>}
    </>
  )
}

/** Text fields that edit the book live and land in history as one undo step. */
function BookField({ field, label }: { field: 'title' | 'subtitle' | 'author'; label: string }) {
  const { book, setBookField, commitField } = useStore()
  const before = useRef<Book | null>(null)
  return (
    <div className="field" style={field === 'title' ? { marginTop: 0 } : undefined}>
      <label htmlFor={`f-${field}`}>{label}</label>
      <input id={`f-${field}`} className="input" value={book[field]}
        onFocus={() => { before.current = useStore.getState().book }}
        onChange={(e) => setBookField(field, e.target.value)}
        onBlur={() => { if (before.current && before.current[field] !== useStore.getState().book[field]) commitField(`Edit ${field}`, before.current); before.current = null }} />
    </div>
  )
}

function CoverTab() {
  const { book, setCover, shuffleCover } = useStore()
  const c = book.cover
  const p = PALETTES[c.pal]
  const cr = contrast(p.ink, p.bg)
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="eyebrow">Composition</div>
        <button className="btn ghost sm" onClick={shuffleCover}><Icon name="shuffle" />Shuffle</button>
      </div>
      <div className="opt-grid" style={{ marginTop: '.75rem' }}>
        {LAYOUTS.map(([k, n]) => (
          <button key={k} className={`opt ${c.layout === k ? 'on' : ''}`} onClick={() => setCover('layout', k)} aria-pressed={c.layout === k}>
            <span className="thumb"><Cover book={book} override={{ layout: k }} /></span>{n}
          </button>
        ))}
      </div>
      <div className="section-t">Colour</div>
      <div className="opt-grid">
        {PALETTES.map((pp, i) => (
          <button key={pp.name} className={`opt ${c.pal === i ? 'on' : ''}`} onClick={() => setCover('pal', i)} aria-pressed={c.pal === i}>
            <span className="sw" style={{ background: `linear-gradient(135deg, ${pp.bg} 58%, ${pp.motif} 58%)` }} />{pp.name}
          </button>
        ))}
      </div>
      <div className="section-t">Typeface</div>
      <div className="opt-grid three">
        {(Object.keys(FONTS) as (keyof typeof FONTS)[]).map((k) => (
          <button key={k} className={`opt ${c.font === k ? 'on' : ''}`} onClick={() => setCover('font', k)} aria-pressed={c.font === k}>
            <span className="aa" style={{ fontFamily: FONTS[k].fam, fontWeight: FONTS[k].w }}>Aa</span>{FONTS[k].name}
          </button>
        ))}
      </div>
      <div className="section-t">Motif</div>
      <div className="chips" style={{ margin: 0 }}>
        {MOTIFS.map(([k, n]) => <button key={k} className={`chip ${c.motif === k ? 'on' : ''}`} onClick={() => setCover('motif', k)}>{n}</button>)}
      </div>
      <div className="section-t">Text on the cover</div>
      <BookField field="title" label="Title" />
      <BookField field="subtitle" label="Subtitle" />
      <BookField field="author" label="Author" />
      <div className="check">
        <span className="mini"><Cover book={book} /></span>
        {cr >= 4.5
          ? <span><span className="ok-t">Readable as a thumbnail</span> <span className="muted">· contrast {cr.toFixed(1)}:1</span></span>
          : <span className="warn-t">Title may be hard to read small ({cr.toFixed(1)}:1)</span>}
      </div>
    </>
  )
}

function StyleTab() {
  const { book, setTheme, setDropcap } = useStore()
  return (
    <>
      <div className="eyebrow">Inside the book</div>
      <div className="opt-grid three" style={{ marginTop: '.75rem' }}>
        {(Object.keys(THEMES) as Theme[]).map((k) => (
          <button key={k} className={`opt ${book.style.theme === k ? 'on' : ''}`} onClick={() => setTheme(k)} aria-pressed={book.style.theme === k}>
            <span className="aa" style={{ fontFamily: THEMES[k].head }}>Ag</span>{THEMES[k].name}
          </button>
        ))}
      </div>
      <label className="toggle"><input type="checkbox" checked={book.style.dropcap} onChange={(e) => setDropcap(e.target.checked)} /> Drop cap at the start of each chapter</label>
      <div className="hint" style={{ marginTop: '1.35rem' }}><Icon name="file-down" /><span>The PDF uses the same style: 6×9 in pages, a comfortable line length, every chapter on a new page.</span></div>
    </>
  )
}
