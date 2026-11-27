/** Step 4: one question first ("what do you want to do with it?"), then the ready check. */
import { useState } from 'react'
import { PALETTES } from '../../lib/content'
import { audienceLabel, useStore } from '../../lib/store'
import { contrast, pagesFor } from '../../lib/text'
import { shareUrl } from '../../lib/share'
import { Icon } from '../Icon'
import { Stagger } from '../motion'

export function Publish() {
  const s = useStore()
  const { book, showToast, goStep, openChapter } = s
  const failed = book.chapters.filter((c) => c.status !== 'done')
  const p = PALETTES[book.cover.pal]
  const cr = contrast(p.ink, p.bg)
  const [desc, setDesc] = useState(`${book.title}: ${book.subtitle}. A free ${book.chapters.length}-chapter guide by ${book.author} for ${audienceLabel(s).toLowerCase()}.`)
  const copy = (text: string, msg: string) => { navigator.clipboard?.writeText(text).catch(() => {}); showToast(msg) }

  return (
    <Stagger>
      <span className="eyebrow">Step 4 of 4</span>
      <h1 style={{ marginTop: '.6rem' }}>What do you want to do with it?</h1>
      <p className="lead">Pick one. You can come back for the others.</p>
      <div className="outcomes" style={{ marginTop: 0 }}>
        <button className="outcome primary" onClick={() => window.print()}><Icon name="file-down" /><strong>Download PDF</strong><span>Print-ready, 6×9 in</span></button>
        <button className="outcome" onClick={async () => copy(await shareUrl(book), 'Link copied. Anyone with it can read your book.')}><Icon name="link" /><strong>Copy share link</strong><span>A page anyone can read</span></button>
        <button className="outcome" onClick={async () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(await shareUrl(book))}`, '_blank', 'noopener')}><Icon name="linkedin" /><strong>Post on LinkedIn</strong><span>Share a link to read it</span></button>
        <button className="outcome" onClick={async () => { location.href = `mailto:?subject=${encodeURIComponent(book.title)}&body=${encodeURIComponent(`${desc}\n\nRead it here: ${await shareUrl(book)}`)}` }}><Icon name="mail" /><strong>Send by email</strong><span>To your list or clients</span></button>
      </div>
      <div className="section-t">Ready check</div>
      <ul className="checklist">
        <li><span className="ic"><Icon name="check" /></span><div>Title and author<small>{book.title} · {book.author}</small></div></li>
        <li className={failed.length ? 'warn' : ''}>
          <span className="ic"><Icon name={failed.length ? 'flag' : 'check'} /></span>
          <div>{failed.length ? `${failed.length} chapter needs attention` : `All ${book.chapters.length} chapters written`}
            <small>{failed.length
              ? <button className="link" onClick={() => { goStep('write'); openChapter(book.chapters.indexOf(failed[0])) }}>Fix “{failed[0].title}”</button>
              : `~${pagesFor(book.chapters.length)} pages, 6×9 in`}</small>
          </div>
        </li>
        <li className={cr < 4.5 ? 'warn' : ''}><span className="ic"><Icon name={cr < 4.5 ? 'flag' : 'check'} /></span><div>Cover readable as a thumbnail<small>Contrast {cr.toFixed(1)}:1</small></div></li>
      </ul>
      <div className="field">
        <label htmlFor="desc">Description for sharing <span>(written for you, edit freely)</span></label>
        <textarea id="desc" className="input" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <button className="btn ghost sm" style={{ marginTop: '.75rem' }} onClick={() => copy(desc, 'Description copied')}><Icon name="copy" />Copy description</button>
    </Stagger>
  )
}
