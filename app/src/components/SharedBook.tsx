/** Read-only page for a shared link (#/read/<data>): the reader, plus a way to make your own. */
import { useEffect, useState } from 'react'
import { decodeBook } from '../lib/share'
import type { Book } from '../lib/types'
import { Reader } from './library/Library'

export function SharedBook({ data }: { data: string }) {
  const [book, setBook] = useState<Book | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => { decodeBook(data).then(setBook).catch(() => setFailed(true)) }, [data])
  const home = () => { location.hash = ''; location.reload() }
  if (failed) return (
    <div className="crash"><div className="modal-card"><h2>This link looks incomplete</h2><p>Part of the address may have been cut off. Ask the author to copy the link again.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn primary" onClick={home}>Make your own book</button></div></div></div>
  )
  if (!book) return <div className="crash"><span className="pulse" /></div>
  return <Reader saved={{ book }} footer={<p className="shared-cta">Made with Folio · <button className="link" onClick={home}>Turn your know-how into a book</button></p>} />
}
