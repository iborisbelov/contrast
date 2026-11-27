import { useState } from 'react'
import { suggestedChapters, useStore } from '../../lib/store'
import type { Status } from '../../lib/types'
import { Icon, type IconName } from '../Icon'
import { Rise } from '../motion'

const STATUS: Record<Status, [IconName, string] | null> = {
  done: ['circle-check', 'Done'], failed: ['triangle-alert', 'Failed'], writing: ['loader', 'Writing'], queued: ['clock', 'Queued'], planned: null,
}

export function OutlineEditor() {
  const s = useStore()
  const { book, gen, view, adding, renameChapter, removeChapter, moveChapter, setAdding, addChapter, openChapter, showToast } = useStore()
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const [custom, setCustom] = useState('')
  const written = gen.started

  return (
    <>
      <ol className="outline">
        {book.chapters.map((c, i) => {
          const st = written ? STATUS[c.status] : null
          return (
            <li key={c.id} draggable className={`${written && view.chapter === i ? 'cur' : ''} ${dragFrom === i ? 'dragging' : ''} ${over === i && dragFrom !== i ? 'over' : ''}`}
              onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move' }}
              onDragOver={(e) => { e.preventDefault(); setOver(i) }}
              onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) moveChapter(dragFrom, i); setDragFrom(null); setOver(null) }}
              onDragEnd={() => { setDragFrom(null); setOver(null) }}>
              <span className="handle" title="Drag to reorder"><Icon name="grip-vertical" /></span>
              <span className="num">{i + 1}</span>
              <input key={c.title} className="rename" defaultValue={c.title} aria-label={`Chapter ${i + 1} title`}
                onBlur={(e) => renameChapter(i, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} />
              {st && <span className={`st ${c.status}`}><Icon name={st[0]} />{st[1]}</span>}
              <span className="tools">
                {written && c.status === 'done' && <button onClick={() => openChapter(i)} aria-label={`Open chapter ${i + 1}`} title="Open in book"><Icon name="arrow-right" /></button>}
                <button onClick={() => removeChapter(i)} aria-label={`Remove chapter ${i + 1}`} title="Remove"><Icon name="x" /></button>
              </span>
            </li>
          )
        })}
      </ol>
      {adding ? (
        <Rise className="card" >
          <div style={{ marginTop: 10 }} className="eyebrow">Suggested chapters</div>
          <div className="chips">{suggestedChapters(s).map((c) => <button key={c.title} className="chip" onClick={() => addChapter(c.key, c.title)}><Icon name="plus" />{c.title}</button>)}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="input" placeholder="Or name your own chapter" value={custom} style={{ padding: '.7rem .9rem' }}
              onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && custom.trim()) { addChapter(null, custom.trim()); setCustom('') } }} />
            <button className="btn primary sm" onClick={() => { if (!custom.trim()) return showToast('Name the chapter first'); addChapter(null, custom.trim()); setCustom('') }}>Add</button>
          </div>
          <button className="btn quiet sm" style={{ marginTop: 8 }} onClick={() => setAdding(false)}>Cancel</button>
        </Rise>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginTop: '.75rem' }}>
          <button className="btn ghost sm" onClick={() => setAdding(true)}><Icon name="plus" />Add a chapter</button>
          <span className="muted" style={{ fontSize: '.94rem' }}>Drag to reorder, click a title to rename</span>
        </div>
      )}
    </>
  )
}
