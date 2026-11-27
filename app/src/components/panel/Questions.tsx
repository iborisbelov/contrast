/** Steps 1–2: one question per screen. */
import { useRef, useState } from 'react'
import { DEMO_IDEA, LENGTHS, STORY_STARTERS } from '../../lib/content'
import { QUESTIONS, summaryRows, useStore } from '../../lib/store'
import { pagesFor } from '../../lib/text'
import type { Question } from '../../lib/types'
import { Icon, type IconName } from '../Icon'
import { Rise, Stagger } from '../motion'
import { OutlineEditor } from './OutlineEditor'

export function QuestionHead({ title, lead }: { title: string; lead?: string }) {
  // Freeze at mount: while this screen animates out, the store already points at the next step.
  const { step, q } = useRef(useStore.getState() as { step: 'idea' | 'shape'; q: Question }).current
  const list = QUESTIONS[step] ?? []
  const i = list.indexOf(q)
  return (
    <div>
      <div className="qtop"><span className="eyebrow">Step {step === 'idea' ? 1 : 2} of 4</span><span className="qcount">{i + 1} / {list.length}</span></div>
      <div className="qdots" aria-hidden="true">{list.map((_, j) => <i key={j} className={j <= i ? 'on' : ''} />)}</div>
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}

function Answer({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`ans ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on}>
      {children}
      {on && <span className="tick"><Icon name="check" /></span>}
    </button>
  )
}

export function IdeaQuestion() {
  const { idea, clarify, clarifyOptions, thinking, setIdea, useExample, useVague, clarifyIdea, analyzeIdea } = useStore()
  return (
    <Stagger>
      <div className="intro">
        <b>Turn what you know into a finished, designed eBook.</b>
        <ol><li>Answer a few quick questions</li><li>I write it while you watch</li><li>Change anything, then share</li></ol>
      </div>
      <QuestionHead title="What’s your book about?" lead="One sentence is enough. This is your idea, not the title. You’ll pick a title later." />
      <textarea className="input big" rows={3} value={idea} placeholder={`e.g. ${DEMO_IDEA}`} aria-label="Your book idea" autoFocus
        disabled={thinking === 'brief'} onChange={(e) => setIdea(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) analyzeIdea() }} />
      <div className="chips" style={{ marginTop: '.75rem' }}>
        <span className="muted" style={{ fontSize: '.975rem', alignSelf: 'center' }}>Try</span>
        <button className="chip" onClick={useExample}><Icon name="sparkles" />Sourdough for busy people</button>
        <button className="chip" onClick={() => { setIdea('A 30-day plan for coaching clients to build daily confidence'); setTimeout(() => void analyzeIdea(), 0) }}>A coach’s 30-day plan</button>
        <button className="chip" onClick={() => { setIdea('How small creators can grow on Instagram without paid ads'); setTimeout(() => void analyzeIdea(), 0) }}>Grow on Instagram</button>
        <button className="chip" onClick={useVague}>“bread”</button>
      </div>
      {thinking === 'brief' && <Rise className="hint thinking"><span className="pulse" /><span>Reading your idea and preparing a few questions…</span></Rise>}
      {clarify && (
        <Rise className="notice">
          <Icon name="message-circle-question" />
          <div><strong>Tell me a bit more.</strong> “{idea}” could become many different books. Which one?
            <div className="chips" style={{ marginBottom: 0 }}>{clarifyOptions.map((o) => <button key={o} className="chip" onClick={() => clarifyIdea(o)}>{o}</button>)}</div>
          </div>
        </Rise>
      )}
    </Stagger>
  )
}

export function AudienceQuestion() {
  const { choice, answered, audienceText, audiences, answer, answerAudienceText } = useStore()
  const [other, setOther] = useState(audienceText)
  return (
    <Stagger>
      <QuestionHead title="Who’s going to read it?" lead="I’ll pitch the words and examples at them." />
      {audiences.map((a, i) => (
        <Answer key={a.t} on={answered.audience && !audienceText && choice.audience === i} onClick={() => answer('audience', i)}>
          <span className="ic"><Icon name={a.icon as IconName} /></span><div><b>{a.t}</b><span>{a.d}</span></div>
        </Answer>
      ))}
      <label className={`ans other ${audienceText ? 'on' : ''}`}>
        <span className="ic"><Icon name="user-pen" /></span>
        <input className="plain" value={other} placeholder="Someone else… (press Enter)" aria-label="Describe your reader"
          onChange={(e) => setOther(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && other.trim()) answerAudienceText(other) }} />
      </label>
    </Stagger>
  )
}

export function ToneQuestion() {
  const { choice, answered, tones, answer } = useStore()
  return (
    <Stagger>
      <QuestionHead title="How should it sound?" lead="Pick the one that sounds like you." />
      {tones.map((t, i) => (
        <Answer key={t.t} on={answered.tone && choice.tone === i} onClick={() => answer('tone', i)}>
          <div><q>{t.sample}</q><span className="tag">{t.t}</span></div>
        </Answer>
      ))}
    </Stagger>
  )
}

export function LengthQuestion() {
  const { choice, answered, answer } = useStore()
  return (
    <Stagger>
      <QuestionHead title="How long should it be?" lead="You can add or cut chapters later." />
      {LENGTHS.map((l, i) => (
        <Answer key={l.t} on={answered.length && choice.length === i} onClick={() => answer('length', i)}>
          <span className="ic"><Icon name="book-open" /></span><div><b>{l.t}</b><span>{l.ch} chapters · {l.pg} · {l.rd}</span></div>
        </Answer>
      ))}
    </Stagger>
  )
}

export function StoryQuestion() {
  const { story, setStory } = useStore()
  const field = useRef<HTMLTextAreaElement>(null)
  const addStarter = (starter: string) => {
    const base = story.trimEnd()
    const next = base ? `${base}${/[.!?:…]$/.test(base) ? ' ' : '. '}${starter} ` : `${starter} `
    setStory(next)
    requestAnimationFrame(() => { const el = field.current; if (!el) return; el.focus(); el.setSelectionRange(next.length, next.length) })
  }
  return (
    <Stagger>
      <QuestionHead title="Anything only you know?" lead="A tip, a habit or a short story. I’ll weave it in so the book sounds like you." />
      <textarea ref={field} className="input" rows={4} value={story} autoFocus onChange={(e) => setStory(e.target.value)}
        placeholder="e.g. I bake before my 8am commute. The trick is an overnight rise in the fridge." />
      <div className="starters">
        <span className="starters-l">Not sure where to start? Pick one and finish the sentence:</span>
        <div className="chips">
          {STORY_STARTERS.map((t) => (
            <button key={t} className={`chip ${story.includes(t) ? 'used' : ''}`} onClick={() => addStarter(t)}><Icon name="plus" />{t}</button>
          ))}
        </div>
      </div>
      <div className="hint" style={{ marginTop: '.4rem' }}><Icon name="shield-check" /><span>I never invent stories about you. Without one, I’ll leave a spot for you to fill in.</span></div>
    </Stagger>
  )
}

export function SummaryQuestion() {
  const s = useStore()
  return (
    <Stagger>
      <QuestionHead title="Here’s what I’ll write" lead="Change anything before I plan the chapters." />
      <div className="card">
        <p className="restate" style={{ marginTop: 0 }}>{s.idea}</p>
        {summaryRows(s).map((r) => (
          <div className="sumrow" key={r.label}><span>{r.label}</span><b className={r.empty ? 'muted' : ''}>{r.value}</b><button onClick={() => s.gotoQ(r.q)}>Change</button></div>
        ))}
      </div>
    </Stagger>
  )
}

export function TitleQuestion() {
  const { book, titles, thinking, pickTitle, setBookField } = useStore()
  const isPreset = titles.some((t) => t.t === book.title)
  return (
    <Stagger>
      <QuestionHead title="What should we call it?" lead="The cover updates as you choose. You can change it later." />
      <div className="titles">
        {thinking === 'plan' ? <TitleSkeleton /> : titles.map((t, i) => (
          <button key={t.t} className={`title-opt ${book.title === t.t ? 'on' : ''}`} onClick={() => pickTitle(i)} aria-pressed={book.title === t.t}>
            <strong>{t.t}</strong><span>{t.s}</span>
          </button>
        ))}
        <div className={`title-opt custom ${isPreset ? '' : 'on'}`}>
          <input className="input" placeholder="Or write your own title" aria-label="Your own title" value={isPreset ? '' : book.title}
            onChange={(e) => { if (e.target.value.trim()) setBookField('title', e.target.value); else pickTitle(0) }} />
        </div>
      </div>
    </Stagger>
  )
}

function TitleSkeleton() {
  return <>{[0, 1, 2].map((i) => <div key={i} className="title-opt skeleton" aria-hidden="true"><i /><i /></div>)}<div className="hint thinking"><span className="pulse" /><span>Finding titles and a chapter plan for your book…</span></div></>
}

export function PlanQuestion() {
  const n = useStore((s) => s.book.chapters.length)
  const thinking = useStore((s) => s.thinking)
  return (
    <Stagger>
      <QuestionHead title="Does this plan look right?" lead="Nothing is written yet, so changes here are free." />
      <div className="section-t" style={{ marginTop: 0 }}>Chapters <small>{n} chapters · ~{pagesFor(n)} pages</small></div>
      {thinking === 'plan' ? <TitleSkeleton /> : <OutlineEditor />}
    </Stagger>
  )
}
