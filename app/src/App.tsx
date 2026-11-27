import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { useStore } from './lib/store'
import { Desk } from './components/desk/Desk'
import { PrintBook, RestartDialog, Toast } from './components/Overlays'
import { Panel } from './components/panel/Panel'
import { Rail } from './components/Rail'
import { Library } from './components/library/Library'
import { SharedBook } from './components/SharedBook'
import { SystemPage } from './components/pages/SystemPage'
import { ProcessPage } from './components/pages/ProcessPage'
import { useEffect as useHashEffect, useState } from 'react'
import { Icon } from './components/Icon'

function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement as HTMLElement | null
      const typing = !!a && (/INPUT|TEXTAREA/.test(a.tagName) || a.isContentEditable)
      const s = useStore.getState()
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); s.undo() }
      if (e.key === 'Escape') {
        if (s.confirmRestart) s.askRestart(false)
        else if (s.coOpen) s.toggleCo(false)
        else if (s.sel) s.clearSelection()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

function useHash() {
  const [hash, setHash] = useState(location.hash)
  useHashEffect(() => { const on = () => setHash(location.hash); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on) }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  if (hash.startsWith('#/read/')) return <SharedBook data={hash.slice(7)} />
  if (hash === '#/system') return <SystemPage />
  if (hash === '#/process') return <ProcessPage />
  return <Studio />
}

function Studio() {
  useShortcuts()
  const screen = useStore((s) => s.screen)
  const mobileView = useStore((s) => s.mobileView)
  return (
    <MotionConfig reducedMotion="user">
      <div className={`app ${mobileView === 'book' ? 'm-book' : 'm-edit'}`}>
        {screen !== 'library' && <MobileToggle />}
        {screen !== 'library' && <MobileInfo />}
        <Rail />
        {screen === 'library' ? <Library /> : <><Panel /><Desk /></>}
      </div>
      <RestartDialog />
      <Toast />
      <PrintBook />
    </MotionConfig>
  )
}

/** Phones only (hidden by CSS on desktop): switch between the editor and the book. */
function MobileToggle() {
  const { mobileView, setMobileView, gen, book } = useStore()
  const writing = gen.running ? book.chapters.filter((c) => c.status === 'done').length : null
  return (
    <div className="m-toggle seg" role="tablist" aria-label="View">
      <button role="tab" aria-selected={mobileView === 'edit'} className={mobileView === 'edit' ? 'on' : ''} onClick={() => setMobileView('edit')}>Editor</button>
      <button role="tab" aria-selected={mobileView === 'book'} className={mobileView === 'book' ? 'on' : ''} onClick={() => setMobileView('book')}>
        Book{writing !== null && <span className="m-badge">{writing}/{book.chapters.length}</span>}
      </button>
    </div>
  )
}

/** Phones only: the intro lives behind an info button instead of taking the first screen. */
function MobileInfo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="m-info" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="What is Folio?"><Icon name={open ? 'x' : 'info'} /></button>
      {open && (
        <div className="m-info-pop" role="dialog" aria-label="What is Folio?" onClick={() => setOpen(false)}>
          <b>Turn what you know into a finished, designed eBook.</b>
          <ol><li>Answer a few quick questions</li><li>I write it while you watch</li><li>Change anything, then share</li></ol>
        </div>
      )}
    </>
  )
}
