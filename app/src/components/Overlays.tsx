import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { THEMES } from '../lib/content'
import { useStore } from '../lib/store'
import { isPlaceholder } from '../lib/text'
import { Cover } from './Cover'
import { EASE } from './motion'

export function Toast() {
  const toast = useStore((s) => s.toast)
  const [shown, setShown] = useState<typeof toast>(null)
  useEffect(() => {
    if (!toast) return
    setShown(toast)
    const t = setTimeout(() => setShown(null), 2000)
    return () => clearTimeout(t)
  }, [toast])
  return (
    <AnimatePresence>
      {shown && (
        <motion.div key={shown.id} id="toast" className="on" role="status"
          initial={{ opacity: 0, y: 10, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 6, x: '-50%' }} transition={{ duration: 0.25, ease: EASE }}>
          {shown.text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function RestartDialog() {
  const { confirmRestart, askRestart, restart } = useStore()
  return (
    <AnimatePresence>
      {confirmRestart && (
        <motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalT" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && askRestart(false)}>
          <motion.div className="modal-card" initial={{ y: 16, scale: 0.97 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.25, ease: EASE }}>
            <h2 id="modalT">Start over?</h2>
            <p>This clears your book, chapters and cover. You can’t undo it.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn ghost" autoFocus onClick={() => askRestart(false)}>Keep my book</button>
              <button className="btn primary" onClick={restart}>Start over</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Print-only version of the book: the browser's "Save as PDF" turns it into a real 6×9 in PDF. */
export function PrintBook() {
  const book = useStore((s) => s.book)
  const th = THEMES[book.style.theme]
  return (
    <div id="print" aria-hidden="true">
      <div className="p-cover"><Cover book={book} /></div>
      <div className="p-title"><h1 style={{ fontFamily: th.head, fontWeight: 400 }}>{book.title}</h1><p>{book.subtitle}</p><p style={{ marginTop: '1in' }}>{book.author}</p></div>
      <div className="p-toc"><h2 style={{ fontFamily: th.head, fontWeight: 400 }}>Contents</h2><ol>{book.chapters.map((c) => <li key={c.id}>{c.title}</li>)}</ol></div>
      {book.chapters.filter((c) => c.status === 'done').map((c, i) => (
        <section key={c.id} className="p-ch" style={{ fontFamily: th.body }}>
          <div className="eyebrow">CHAPTER {i + 1}</div>
          <h2 style={{ fontFamily: th.head, fontWeight: 400 }}>{c.title}</h2>
          {c.paras.filter((p) => !isPlaceholder(p)).map((p, j) => <p key={j}>{p}</p>)}
        </section>
      ))}
    </div>
  )
}
