/** Right side: the living book, desk controls and the co-author. */
import { AnimatePresence, motion } from 'framer-motion'
import { FONTS, LAYOUTS, LENGTHS } from '../../lib/content'
import { useStore } from '../../lib/store'
import { Cover, paletteFor } from '../Cover'
import { Icon } from '../Icon'
import { EASE } from '../motion'
import { BookInfo, ClosedBook, Spread } from './Book'
import { CoAuthor, Whisper } from './CoAuthor'
import { Reader } from '../library/Library'
import { useState } from 'react'

export function Desk() {
  return (
    <main className="desk" aria-label="Your book">
      <DeskActions />
      <Stage />
      <Whisper />
      <CoAuthor />
      <Dock />
    </main>
  )
}

function DeskActions() {
  const { history, undo, askRestart } = useStore()
  const last = history[history.length - 1]
  return (
    <div className="desk-actions">
      <button className="btn quiet sm" onClick={undo} disabled={!last} title={last ? `Undo: ${last.label} (⌘Z)` : 'Nothing to undo'}><Icon name="undo-2" />Undo</button>
      <button className="btn quiet sm" onClick={() => askRestart(true)} title="Start over"><Icon name="rotate-ccw" />Start over</button>
    </div>
  )
}

function IdeaTrail() {
  const s = useStore()
  const bits: string[] = []
  if (s.understood) bits.push(s.topic)
  if (s.answered.audience) bits.push(`for ${(s.audienceText || s.audiences[s.choice.audience]?.t || '').toLowerCase()}`)
  if (s.answered.tone) bits.push((s.tones[s.choice.tone]?.t ?? '').toLowerCase())
  if (s.answered.length) bits.push(`${LENGTHS[s.choice.length].ch} chapters`)
  return (
    <div className="trail">
      <AnimatePresence initial={false}>
        {bits.map((b) => <motion.span key={b} initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{b}</motion.span>)}
      </AnimatePresence>
    </div>
  )
}

function Stage() {
  const { step, understood, view, book } = useStore()
  const [reading, setReading] = useState(false)
  const open = () => setReading(true)
  let key: string = step
  let scene: React.ReactNode
  if (step === 'idea') {
    key = `idea-${understood}`
    scene = (
      <div className="scene col">
        <ClosedBook stage={understood ? 'sketch' : 'empty'} />
        <motion.div className="caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {understood ? <><IdeaTrail />The cover becomes real when you pick a title.</> : 'Describe your idea on the left. Your book takes shape here.'}
        </motion.div>
      </div>
    )
  } else if (step === 'shape') {
    scene = <div className="scene"><ClosedBook large onOpen={open} /><BookInfo><p className="caption" style={{ marginTop: '1.35rem' }}>The cover updates as you choose a title and plan the chapters.</p></BookInfo></div>
  } else if (step === 'publish') {
    const p = paletteFor(book.cover)
    scene = (
      <div className="scene"><ClosedBook large onOpen={open} />
        <BookInfo>
          <div className="eyebrow" style={{ marginTop: '1.95rem' }}>Link preview</div>
          <div className="og" style={{ background: p.bg }}>
            <div className="ogc"><div><Cover book={book} /></div></div>
            <div className="ogt"><strong>{book.title}</strong><span>{book.subtitle}</span><em>FOLIO · FREE EBOOK</em></div>
          </div>
        </BookInfo>
      </div>
    )
  } else if (view.mode === 'cover') {
    key = 'write-cover'
    scene = (
      <div className="scene"><ClosedBook large onOpen={open} />
        <BookInfo><p className="caption" style={{ marginTop: '1.35rem' }}>
          {paletteFor(book.cover).name} · {LAYOUTS.find((l) => l[0] === book.cover.layout)?.[1]} · {FONTS[book.cover.font].name}
        </p></BookInfo>
      </div>
    )
  } else {
    key = 'write-pages'
    scene = <Spread />
  }
  return (
    <div className="stage">
      <div key={key} className="stage-inner">{scene}</div>
      <AnimatePresence>{reading && <Reader key="desk-reader" saved={{ book }} onClose={() => setReading(false)} />}</AnimatePresence>
    </div>
  )
}

function Dock() {
  const s = useStore()
  const { step, view, gen, book, coOpen, unread } = s
  const co = (
    <button className="co-btn" onClick={() => s.toggleCo()} aria-expanded={coOpen}>
      <Icon name={coOpen ? 'x' : 'sparkles'} />{coOpen ? 'Close' : 'Ask co-author'}{unread && !coOpen && <span className="dot" />}
    </button>
  )
  // Phones (book view): the next step's action, since the editor with its footer is hidden.
  const next = step === 'write' ? (gen.running ? null : { label: 'Finish book', run: () => { s.goStep('publish'); s.setMobileView('edit') } })
    : step === 'publish' ? { label: 'Save to library', run: () => { s.saveToLibrary(); s.openLibrary(true) } }
    : { label: 'Back to questions', run: () => s.setMobileView('edit') }
  const nextBtn = next && <button className="m-next btn primary" onClick={next.run}>{next.label} <Icon name="arrow-up-right" /></button>
  const note = step === 'idea' ? 'Stuck? Just tell me what you want.' : step === 'shape' ? 'Want a different title or chapter?' : 'Want a different cover?'
  return (
    <div className="dock">
      <motion.div className="dock-pill" layout transition={{ duration: 0.35, ease: EASE }}>
        {step === 'write' ? (
          <>
            <div className="seg">
              <button className={view.mode === 'cover' ? 'on' : ''} onClick={() => s.setMode('cover')}><Icon name="image" />Cover</button>
              <button className={view.mode === 'pages' ? 'on' : ''} onClick={() => s.setMode('pages')}><Icon name="book-open" />Pages</button>
            </div>
            {view.mode === 'pages' && (
              <>
                <span className="div" />
                <button className="navbtn" onClick={() => s.navChapter(-1)} disabled={view.chapter === 0} aria-label="Previous chapter"><Icon name="chevron-left" /></button>
                <span className="navlabel"><span className="long">Chapter {view.chapter + 1} of {book.chapters.length}</span><span className="short">{view.chapter + 1} / {book.chapters.length}</span></span>
                <button className="navbtn" onClick={() => s.navChapter(1)} disabled={view.chapter >= book.chapters.length - 1} aria-label="Next chapter"><Icon name="chevron-right" /></button>
              </>
            )}
            <span className="div" />
            {gen.running && <span className="dock-note"><span className="pulse" />Writing {Math.min(book.chapters.filter((c) => c.status === 'done').length + 1, book.chapters.length)} of {book.chapters.length}</span>}
            {co}{nextBtn}
          </>
        ) : <><span className="dock-note">{note}</span>{co}{nextBtn}</>}
      </motion.div>
    </div>
  )
}
