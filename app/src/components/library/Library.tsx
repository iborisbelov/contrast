/** Library: a shelf of saved books, and a reader that opens them like a real book. */
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { THEMES } from '../../lib/content'
import { useStore, type SavedBook } from '../../lib/store'
import { isPlaceholder } from '../../lib/text'
import type { Book } from '../../lib/types'
import { Cover } from '../Cover'
import { Icon } from '../Icon'
import { EASE } from '../motion'

export function Library() {
  const { library, readingId, openBook, openLibrary, removeFromLibrary } = useStore()
  const reading = library.find((b) => b.id === readingId)
  return (
    <main className="library">
      <header className="lib-head">
        <div>
          <span className="eyebrow">Your library</span>
          <h1>{library.length ? `${library.length} book${library.length > 1 ? 's' : ''} on your shelf` : 'Your shelf is empty'}</h1>
          <p className="lead">{library.length ? 'Open any book to read it the way your readers will.' : 'Finish a book and choose “Save to library”. It will wait for you here.'}</p>
        </div>
        <button className="btn ghost" onClick={() => openLibrary(false)}><Icon name="arrow-left" />Back to my book</button>
      </header>

      <div className="shelf">
        <div className="shelf-row">
          {library.map((b, i) => (
            <motion.div key={b.id} className="shelf-book" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}>
              <button className="shelf-cover" onClick={() => openBook(b.id)} aria-label={`Open ${b.book.title}`}>
                <Cover book={b.book} />
              </button>
              <div className="shelf-meta">
                <b>{b.book.title}</b>
                <span>{b.book.chapters.length} chapters · saved {new Date(b.savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
              </div>
              <button className="shelf-remove" onClick={() => removeFromLibrary(b.id)} aria-label={`Remove ${b.book.title}`} title="Remove from library"><Icon name="trash" /></button>
            </motion.div>
          ))}
          <motion.button className="shelf-new" onClick={() => openLibrary(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: library.length * 0.08 + 0.2 }}>
            <Icon name="plus" /><span>{library.length ? 'Back to writing' : 'Make your first book'}</span>
          </motion.button>
        </div>
        <div className="plank" aria-hidden="true" />
      </div>

      <AnimatePresence>{reading && <Reader key={reading.id} saved={reading} onClose={() => openBook(null)} />}</AnimatePresence>
    </main>
  )
}

/* ---------- pagination: the book as a sequence of printed pages ---------- */
type Page = { kind: 'title' } | { kind: 'toc' } | { kind: 'text'; chapter: number; title?: string; paras: string[] } | { kind: 'end' }
const PAGE_CHARS = 1250

function paginate(book: Book): Page[] {
  const pages: Page[] = [{ kind: 'title' }, { kind: 'toc' }]
  book.chapters.filter((c) => c.status === 'done').forEach((c, ci) => {
    let cur: Page & { kind: 'text' } = { kind: 'text', chapter: ci, title: c.title, paras: [] }
    let used = 220 // the chapter opener takes room
    c.paras.filter((p) => !isPlaceholder(p)).forEach((p) => {
      if (used + p.length > PAGE_CHARS && cur.paras.length) { pages.push(cur); cur = { kind: 'text', chapter: ci, paras: [] }; used = 0 }
      cur.paras.push(p); used += p.length + 60
    })
    pages.push(cur)
  })
  pages.push({ kind: 'end' })
  if (pages.length % 2) pages.push({ kind: 'end' })
  return pages
}

function PageView({ page, book, n }: { page?: Page; book: Book; n: number }) {
  if (!page) return <div className="rpage blank" />
  const th = THEMES[book.style.theme]
  let body: ReactNode = null
  if (page.kind === 'title') body = <div className="r-title"><h2>{book.title}</h2><p>{book.subtitle}</p><span>{book.author}</span></div>
  if (page.kind === 'toc') body = <><div className="eyebrow">Contents</div><ol className="r-toc">{book.chapters.filter((c) => c.status === 'done').map((c, i) => <li key={c.id}><b>{i + 1}</b>{c.title}</li>)}</ol></>
  if (page.kind === 'end') body = n > 2 ? <div className="r-end">· · ·</div> : null
  if (page.kind === 'text') body = <>
    {page.title && <><div className="eyebrow">Chapter {page.chapter + 1}</div><h3>{page.title}</h3></>}
    {page.paras.map((p, i) => <p key={i} className={page.title && i === 0 && book.style.dropcap ? 'first' : ''}>{p}</p>)}
  </>
  return (
    <div className="rpage" style={{ ['--body' as string]: th.body, ['--head' as string]: th.head }}>
      <div className="rpage-in">{body}</div>
      {page.kind !== 'title' && body && <div className="rnum">{n}</div>}
    </div>
  )
}

const FLIP_MS = 700

export function Reader({ saved, onClose, footer }: { saved: Pick<SavedBook, 'book'>; onClose?: () => void; footer?: ReactNode }) {
  const { book } = saved
  const pages = useMemo(() => paginate(book), [book])
  const spreads = pages.length / 2
  const [spread, setSpread] = useState(0)
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [turn, setTurn] = useState<{ from: number; to: number } | null>(null)

  useEffect(() => {
    const a = setTimeout(() => setPhase('opening'), 450)
    const b = setTimeout(() => setPhase('open'), 450 + 1100)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  const go = useCallback((dir: 1 | -1) => {
    if (turn || phase !== 'open') return
    const to = spread + dir
    if (to < 0 || to >= spreads) return
    setTurn({ from: spread, to })
    setTimeout(() => { setSpread(to); setTurn(null) }, FLIP_MS)
  }, [turn, phase, spread, spreads])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Escape' && onClose) { e.stopPropagation(); close() }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [go, onClose, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const p = (i: number) => <PageView page={pages[i]} book={book} n={i} />
  // What lies under the turning leaf: the destination pages on the side the leaf uncovers.
  const leftIdx = turn ? (turn.to > turn.from ? turn.from * 2 : turn.to * 2) : spread * 2
  const rightIdx = turn ? (turn.to > turn.from ? turn.to * 2 + 1 : turn.from * 2 + 1) : spread * 2 + 1
  const closed = phase === 'closed' || phase === 'closing'
  /** Close like a book: back to the first spread, swing the cover shut, then leave. */
  function close() {
    if (!onClose || phase === 'closing') return
    if (phase !== 'open') return onClose()
    setTurn(null); setSpread(0); setPhase('closing')
    setTimeout(onClose, 1050)
  }

  return (
    <motion.div className={`reader ${onClose ? 'closable' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) close() }} role="dialog" aria-modal="true" aria-label={`Reading ${book.title}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      {onClose && <button className="reader-close btn ghost sm" onClick={close}><Icon name="x" />Close</button>}

      <motion.div className="rbook" onClick={close} title={onClose ? 'Click to close' : undefined} initial={{ scale: 0.7, y: 60, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1, x: closed ? '-25%' : '0%' }}
        transition={{ duration: phase === 'closed' ? 0.5 : 1.1, ease: EASE }}>
        <div className="rhalf left" style={{ opacity: phase === 'closing' ? 0 : 1, transition: 'opacity .5s .45s' }}>{phase !== 'closed' && p(leftIdx)}</div>
        <div className="rhalf right">{!closed && p(rightIdx)}</div>

        {/* The cover: a leaf that swings open on the left edge of the right half. */}
        {phase !== 'open' && (
          <motion.div className="leaf cover-leaf" initial={{ rotateY: phase === 'closing' ? -180 : 0 }} animate={{ rotateY: phase === 'opening' ? -180 : 0 }} transition={{ duration: 1.1, ease: [0.45, 0, 0.2, 1] }}>
            <div className="face front"><Cover book={book} /></div>
            <div className="face back">{p(0)}</div>
          </motion.div>
        )}

        {/* A page turning forward (right → left) or back (left → right). */}
        {turn && (turn.to > turn.from ? (
          <motion.div key={`f${turn.from}`} className="leaf" initial={{ rotateY: 0 }} animate={{ rotateY: -180 }} transition={{ duration: FLIP_MS / 1000, ease: [0.45, 0, 0.2, 1] }}>
            <div className="face front">{p(turn.from * 2 + 1)}</div>
            <div className="face back">{p(turn.to * 2)}</div>
          </motion.div>
        ) : (
          <motion.div key={`b${turn.from}`} className="leaf from-left" initial={{ rotateY: 0 }} animate={{ rotateY: 180 }} transition={{ duration: FLIP_MS / 1000, ease: [0.45, 0, 0.2, 1] }}>
            <div className="face front">{p(turn.from * 2)}</div>
            <div className="face back">{p(turn.to * 2 + 1)}</div>
          </motion.div>
        ))}
        <div className="gutter" aria-hidden="true" />
      </motion.div>

      <motion.div className="reader-nav" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: phase === 'open' ? 1 : 0, y: phase === 'open' ? 0 : 10 }}>
        <button className="navbtn" onClick={() => go(-1)} disabled={spread === 0 || !!turn} aria-label="Previous page"><Icon name="chevron-left" /></button>
        <span className="navlabel">Pages {spread * 2 + 1}–{spread * 2 + 2} of {pages.length}</span>
        <button className="navbtn" onClick={() => go(1)} disabled={spread >= spreads - 1 || !!turn} aria-label="Next page"><Icon name="chevron-right" /></button>
      </motion.div>
      {footer}
    </motion.div>
  )
}
