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
  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Rail />
        {screen === 'library' ? <Library /> : <><Panel /><Desk /></>}
      </div>
      <RestartDialog />
      <Toast />
      <PrintBook />
    </MotionConfig>
  )
}
