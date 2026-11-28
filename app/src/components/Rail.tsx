import { motion } from 'framer-motion'
import { stepEnabled, useStore } from '../lib/store'
import type { Step } from '../lib/types'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'

const STEPS: [Step, string, IconName][] = [['idea', 'Idea', 'lightbulb'], ['shape', 'Shape', 'list-ordered'], ['write', 'Write', 'pen-line'], ['publish', 'Publish', 'send']]

export function Rail() {
  const s = useStore()
  const cur = STEPS.findIndex(([k]) => k === s.step)
  return (
    <nav className="rail" aria-label="Steps">
      <div className="rail-logo" title="Folio"><Logo size={42} /></div>
      <div className="rail-steps">
        {STEPS.map(([k, label, icon], i) => {
          const reachable = stepEnabled(s, k) || k === s.step
          const isHere = k === s.step && s.screen === 'create'
          const tip = s.gen.started && i < 2 ? 'Your book is written. Change things in Write.' : label
          return (
            <button key={k} className={`rstep ${k === s.step && s.screen === 'create' ? 'on' : ''} ${i < cur ? 'done' : ''}`} disabled={!reachable || isHere}
              aria-current={k === s.step ? 'step' : undefined} title={tip} onClick={() => { s.openLibrary(false); if (k !== s.step) s.goStep(k) }}>
              <motion.span className="ric" key={`${k}-${k === s.step}`}
                initial={k === s.step ? { scale: 0.72 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 15 }}>
                <Icon name={icon} />
              </motion.span>
              <span className="rlab">{label}</span>
            </button>
          )
        })}
      </div>
      <button className={`rstep rail-lib ${s.screen === 'library' ? 'on' : ''}`} onClick={() => s.openLibrary(true)} aria-current={s.screen === 'library' ? 'page' : undefined}>
        <span className="ric"><Icon name="library" /></span><span className="rlab">Library{s.library.length ? ` · ${s.library.length}` : ''}</span>
      </button>
    </nav>
  )
}
