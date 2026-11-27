/** Left panel: the current question / tool, with its primary action pinned to the footer. */
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useStore } from '../../lib/store'
import { Icon } from '../Icon'
import { EASE } from '../motion'
import { Publish } from './Publish'
import { AudienceQuestion, IdeaQuestion, LengthQuestion, PlanQuestion, StoryQuestion, SummaryQuestion, TitleQuestion, ToneQuestion } from './Questions'
import { Refine, WritingProgress } from './Write'

const SCREENS: Record<string, () => ReactNode> = {
  'idea/idea': IdeaQuestion, 'idea/aud': AudienceQuestion, 'idea/tone': ToneQuestion, 'idea/len': LengthQuestion,
  'idea/story': StoryQuestion, 'idea/summary': SummaryQuestion, 'shape/title': TitleQuestion, 'shape/plan': PlanQuestion,
}

export function Panel() {
  const { step, q, gen, view } = useStore()
  const key = step === 'idea' || step === 'shape' ? `${step}/${q}` : step === 'write' ? `write/${gen.running ? 'run' : view.tab}` : 'publish'
  const Screen = SCREENS[key]
  return (
    <aside className="panel" aria-label="Book settings">
      <div className="panel-scroll">
        {/* Keyed so each new question mounts fresh and staggers in. No exit wait: the next screen never depends on an animation finishing. */}
        <div key={key}>
          {Screen ? <Screen /> : step === 'write' ? (gen.running ? <WritingProgress /> : <Refine />) : <Publish />}
        </div>
      </div>
      <Footer />
    </aside>
  )
}

function Footer() {
  const s = useStore()
  const back = <button className="btn quiet" onClick={s.backQ}><Icon name="arrow-left" />Back</button>
  const go = (label: string, onClick: () => void) => <button className="btn primary" onClick={onClick}>{label} <Icon name="arrow-up-right" /></button>
  let content: ReactNode = null

  if (s.step === 'idea') {
    if (s.q === 'idea') content = <><span className="spacer" />{s.thinking === 'brief' ? <button className="btn primary" disabled><span className="pulse" />Reading…</button> : go('Continue', () => void s.analyzeIdea())}</>
    else if (s.q === 'aud' || s.q === 'tone' || s.q === 'len') content = <>{back}<span className="spacer" /><button className="btn quiet" onClick={s.skipQs}>Skip, use your best guess</button></>
    else if (s.q === 'story') content = <>{back}<span className="spacer" />{!s.story.trim() && <button className="btn quiet" onClick={s.nextQ}>Skip</button>}{go('Continue', s.nextQ)}</>
    else content = <>{back}<span className="spacer" />{go('Looks right', () => void s.confirmBrief())}</>
  }
  if (s.step === 'shape') content = s.thinking === 'plan' ? <>{back}<span className="spacer" /><button className="btn primary" disabled><span className="pulse" />Planning…</button></> : s.q === 'title' ? <>{back}<span className="spacer" />{go('Next: the plan', s.nextQ)}</> : <>{back}<span className="spacer" />{go('Write my book', s.startWriting)}</>
  if (s.step === 'write' && !s.gen.running) {
    const ready = s.book.chapters.filter((c) => c.status === 'done').length
    content = <><span className="note">{ready} of {s.book.chapters.length} chapters ready</span><span className="spacer" />{go('Finish book', () => s.goStep('publish'))}</>
  }
  if (s.step === 'publish') {
    const saved = s.library.some((b) => b.id === s.bookId)
    content = <>
      <button className="btn quiet" onClick={() => s.goStep('write')}><Icon name="arrow-left" />Back to editing</button>
      <span className="spacer" />
      <button className="btn primary" onClick={() => { s.saveToLibrary(); s.openLibrary(true) }}><Icon name="bookmark-plus" />{saved ? 'Update in library' : 'Save to library'}</button>
    </>
  }
  if (!content) return null
  return (
    <motion.div className="panel-foot" key={`${s.step}/${s.q}/${s.gen.running}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE, delay: 0.1 }}>
      {content}
    </motion.div>
  )
}
