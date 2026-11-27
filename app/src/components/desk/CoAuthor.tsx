/** Scoped co-author: chat that only ever makes visible, undoable changes. */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { LAYOUTS, PALETTES } from '../../lib/content'
import { coSuggestions, useStore } from '../../lib/store'
import { Cover } from '../Cover'
import { Icon } from '../Icon'
import { EASE } from '../motion'

export function CoAuthor() {
  const s = useStore()
  const { coOpen, co, typing, book, history } = s
  const [text, setText] = useState('')
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }) }, [co.length, typing, coOpen])
  useEffect(() => { if (coOpen) input.current?.focus() }, [coOpen])
  useEffect(() => {
    const prefill = (e: Event) => { setText((e as CustomEvent<string>).detail); setTimeout(() => input.current?.focus(), 50) }
    window.addEventListener('folio:prefill', prefill)
    return () => window.removeEventListener('folio:prefill', prefill)
  }, [])

  const send = (v: string) => { if (!v.trim()) return; s.ask(v.trim()); setText('') }

  return (
    <AnimatePresence>
      {coOpen && (
        <motion.section className="co-pop" aria-label="Co-author"
          initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.28, ease: EASE }}>
          <div className="co-head">
            <span className="av"><Icon name="sparkles" /></span>
            <div><b>Co-author</b><small>Ask for any change. Everything can be undone.</small></div>
            <button className="x" onClick={() => s.toggleCo(false)} aria-label="Close co-author"><Icon name="x" /></button>
          </div>
          <div id="coLog" ref={log} aria-live="polite">
            {co.slice(-10).map((m) => (
              <motion.div key={`${m.at}-${m.text}`} className={`msg ${m.from}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                {m.text}
                {m.undo && history.length > 0 && <> <button className="link" onClick={s.undo}>Undo</button></>}
                {m.card && (
                  <div className="msg-card"><span className="mini"><Cover book={book} /></span>
                    <div><b>{book.title}</b><span>{PALETTES[book.cover.pal].name} · {LAYOUTS.find((l) => l[0] === book.cover.layout)?.[1]}</span></div>
                  </div>
                )}
              </motion.div>
            ))}
            {typing && <div className="typing" aria-label="Co-author is typing"><i /><i /><i /></div>}
          </div>
          <div id="coChips">{coSuggestions(s).map((t) => <button key={t} className="chip" onClick={() => s.ask(t)}>{t}</button>)}</div>
          <form className="co-form" onSubmit={(e) => { e.preventDefault(); send(text) }}>
            <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. make chapter 2 more practical" aria-label="Message to co-author" />
            <button aria-label="Send"><Icon name="arrow-up" /></button>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

/** Short bubble above the dock when the co-author has news and the chat is closed. */
export function Whisper() {
  const whisper = useStore((s) => s.whisper)
  const [shown, setShown] = useState<typeof whisper>(null)
  useEffect(() => {
    if (!whisper) return setShown(null)
    setShown(whisper)
    const t = setTimeout(() => setShown(null), 4200)
    return () => clearTimeout(t)
  }, [whisper])
  return (
    <AnimatePresence>
      {shown && (
        <motion.div key={shown.id} className="whisper on" role="status"
          initial={{ opacity: 0, y: 10, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 6, x: '-50%' }} transition={{ duration: 0.3, ease: EASE }}>
          {shown.text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
