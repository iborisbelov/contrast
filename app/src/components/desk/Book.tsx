/** The book on the desk: closed (cover) or open (contents + chapter). */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { PARA_LABEL, THEMES } from '../../lib/content'
import { useStore } from '../../lib/store'
import { isPlaceholder, pagesFor } from '../../lib/text'
import type { ParaKind } from '../../lib/types'
import { Cover, paletteFor } from '../Cover'
import { Icon, type IconName } from '../Icon'
import { EASE } from '../motion'

/** Closed book. Lifts and turns whenever the cover design changes. */
export function ClosedBook({ stage = 'final', large = false }: { stage?: 'empty' | 'sketch' | 'final'; large?: boolean }) {
  const { book, step } = useStore()
  const thick = step === 'idea' ? 5 : 8 + book.chapters.length * 2.5
  const coverKey = JSON.stringify(book.cover)
  const first = useRef(true)
  useEffect(() => { first.current = false }, [])
  return (
    <motion.div className="book-wrap"
      initial={{ opacity: 0, y: 40, rotateY: -24, scale: 0.94 }} animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: EASE }} style={{ transformPerspective: 1800 }}>
      <motion.div key={coverKey} style={{ transformPerspective: 1800 }}
        initial={first.current ? false : { y: -18, rotateY: -36, filter: 'brightness(.9)' }}
        animate={{ y: 0, rotateY: 0, filter: 'brightness(1)' }} transition={{ duration: 0.75, ease: EASE }}>
        <div className={`book3d ${large ? 'lg' : ''}`} style={{ ['--thick' as string]: `${(thick * 1.2) / 16}rem` }}>
          <div className="b-pages" />
          <div className="b-cover"><Cover book={book} stage={stage} /></div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function BookInfo({ children }: { children?: React.ReactNode }) {
  const { book, step } = useStore()
  return (
    <motion.div className="book-info" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}>
      <span className="eyebrow">{step === 'publish' ? 'Ready to share' : 'Your book'}</span>
      <h2>{book.title || 'Untitled'}</h2>
      <p className="sub">{book.subtitle}</p>
      <div className="meta"><span><b>{book.chapters.length}</b> chapters</span><span><b>~{pagesFor(book.chapters.length)}</b> pages</span></div>
      <div className="by">by {book.author}</div>
      {children}
    </motion.div>
  )
}

const TOOLS: [ParaKind, string, IconName][] = [['shorter', 'Shorter', 'minimize-2'], ['simpler', 'Simpler', 'feather'], ['example', 'Example', 'lightbulb'], ['warmer', 'Warmer', 'heart']]
const TAG: Record<string, string> = { writing: 'writing', failed: 'retry', queued: 'queued' }

export function Spread() {
  const s = useStore()
  const { book, view } = s
  const ci = view.chapter
  const ch = book.chapters[ci]
  const theme = THEMES[book.style.theme]
  const acc = book.style.theme === 'warm' ? paletteFor(book.cover).motif : book.style.theme === 'modern' ? '#1E1D1B' : '#B8433D'
  const prev = useRef(ci)
  const dir = ci >= prev.current ? 1 : -1
  useEffect(() => { prev.current = ci }, [ci])

  return (
    <motion.div className={`spread theme-${book.style.theme} ${book.style.dropcap ? 'dropcap' : ''}`}
      style={{ ['--body' as string]: theme.body, ['--head' as string]: theme.head, ['--acc' as string]: acc }}
      initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.75, ease: EASE }}>
      <div className="page left">
        <div className="eyebrow">Contents</div>
        <h4 style={{ fontSize: '1.725rem' }}>{book.title}</h4>
        <ol className="page-toc">
          {book.chapters.map((c, i) => {
            const clickable = c.status === 'done' || c.status === 'failed'
            const just = c.doneAt !== undefined && Date.now() - c.doneAt < 1400
            return (
              <li key={c.id} className={`${c.status} ${i === ci ? 'cur' : ''} ${just ? 'just' : ''}`} onClick={() => clickable && s.openChapter(i)}>
                <b>{i + 1}</b>{c.title}<i>{c.status === 'done' ? `p. ${5 + i * 5}` : TAG[c.status] ?? ''}</i>
              </li>
            )
          })}
        </ol>
      </div>
      <motion.div key={ch?.id ?? 'none'} className="page right"
          initial={{ opacity: 0, x: 28 * dir }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE }}>
          <div className="eyebrow">Chapter {ci + 1}</div>
          <h4>{ch?.title}</h4>
          <ChapterBody />
          <div className="page-num">{5 + ci * 5}</div>
      </motion.div>
    </motion.div>
  )
}

function ChapterBody() {
  const s = useStore()
  const { book, view, gen, sel, pending, editing, flash, busyPara } = s
  const ci = view.chapter
  const ch = book.chapters[ci]
  const editRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = editRef.current
    if (!el) return
    el.focus()
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false)
    const sl = getSelection(); sl?.removeAllRanges(); sl?.addRange(r)
  }, [editing])

  if (!ch) return null
  if (ch.status === 'writing' && gen.streamId === ch.id) {
    if (!gen.streamed) return <p className="muted">Starting to write<span className="caret" /></p>
    const parts = gen.streamed.split('\n\n')
    return <>{parts.map((p, i) => <div key={i} className={`pwrap ${i === 0 ? 'first' : ''}`}><p className="para stream">{p}{i === parts.length - 1 && <span className="caret" />}</p></div>)}</>
  }
  if (ch.status === 'writing') return <div className="state-card wait"><span className="pulse" style={{ marginTop: 6 }} />Rewriting this chapter. The previous version stays in its history.</div>
  if (ch.status === 'queued') return <div className="state-card wait"><Icon name="clock" /><span>Waiting its turn. Meanwhile, read the chapters marked done.</span></div>
  if (ch.status === 'failed') return (
    <div className="state-card err" role="alert"><Icon name="triangle-alert" />
      <div><strong>This chapter didn’t finish.</strong><br />Something went wrong on our side. Your other chapters are safe.
        <div style={{ marginTop: '.9rem' }}><button className="btn primary sm" onClick={() => s.retry(ch.id)}><Icon name="refresh-cw" />Retry this chapter</button></div>
      </div>
    </div>
  )
  if (ch.status === 'planned') return null

  return (
    <motion.div key={flash === ch.id ? `flash-${ch.versions.length}` : 'body'} initial={flash === ch.id ? { opacity: 0.3 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      {ch.paras.map((p, i) => {
        const isSel = sel?.ci === ci && sel.p === i
        const isPend = pending?.ci === ci && pending.p === i
        const isEdit = editing?.ci === ci && editing.p === i
        const isBusy = busyPara?.ci === ci && busyPara.p === i
        const ph = isPlaceholder(p)
        const below = i === 0
        return (
          <div key={i} className={`pwrap ${i === 0 ? 'first' : ''}`}>
            <p ref={isEdit ? editRef : undefined}
              className={`para ${isBusy ? 'busy' : ''} ${isSel ? 'sel' : ''} ${isPend ? 'changed' : ''} ${ph ? 'placeholder' : ''} ${isEdit ? 'editing' : ''}`}
              tabIndex={0} contentEditable={isEdit} suppressContentEditableWarning
              aria-label={isEdit ? `Editing paragraph ${i + 1}` : `Paragraph ${i + 1}. Press Enter for options.`}
              onClick={() => !isEdit && !isBusy && s.selectPara(ci, i)}
              onKeyDown={(e) => {
                if (isEdit && e.key === 'Escape') s.finishEdit(null)
                else if (!isEdit && e.key === 'Enter') { e.preventDefault(); s.selectPara(ci, i) }
              }}>
              {ph && isEdit ? '' : p}
            </p>
            <AnimatePresence>
              {isEdit && (
                <motion.div className={`ptools ${below ? 'below' : ''}`} role="toolbar" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <button className="accent" onMouseDown={(e) => e.preventDefault()} onClick={() => s.finishEdit(editRef.current?.innerText ?? null)}><Icon name="check" />Done</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => s.finishEdit(null)}>Cancel</button>
                </motion.div>
              )}
              {isSel && (
                <motion.div className={`ptools ${below ? 'below' : ''}`} role="toolbar" aria-label="Rewrite paragraph"
                  initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18, ease: EASE }}>
                  {TOOLS.map(([k, label, icon]) => <button key={k} onClick={() => s.applyPara(k)}><Icon name={icon} />{label}</button>)}
                  <span className="sep" />
                  <button className="ico" aria-label="Edit myself" title="Edit myself" onClick={s.startEdit}><Icon name="pencil" /></button>
                  <button className="ico accent" aria-label="Ask co-author" title="Ask co-author" onClick={() => { s.toggleCo(true); window.dispatchEvent(new CustomEvent('folio:prefill', { detail: `Rewrite paragraph ${i + 1} of chapter ${ci + 1} to ` })) }}><Icon name="sparkles" /></button>
                </motion.div>
              )}
            </AnimatePresence>
            {isPend && pending && (
              <motion.div className="pend" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
                <span><Icon name="circle-check" />{PARA_LABEL[pending.kind]}</span>
                <button className="btn primary sm" onClick={s.keepPending}>Keep</button>
                <button className="btn ghost sm" onClick={s.tryAnother}>Try another</button>
                <button className="btn quiet sm" onClick={s.undo}>Undo</button>
              </motion.div>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}
