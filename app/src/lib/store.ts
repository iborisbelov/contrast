/**
 * App state + every action. One store keeps the flow readable end to end:
 * questions → plan → simulated generation → refinement → publish.
 *
 * Rules the store enforces:
 *  - every change to the book is undoable (global history of book snapshots)
 *  - the AI never overwrites without showing the change (pending / versions)
 *  - a failed chapter never takes the others down (retry just that one)
 */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { current, type Draft } from 'immer'
import { ADD_SUGGEST, AUDIENCES, BASE_KEYS, CHAPTER_LABEL, CLARIFY_OPTIONS, CONTENT, DEMO_IDEA, FONTS, GENERIC_AUDIENCES, LAYOUTS, LENGTHS, MOTIF_KEYS, PALETTES, PARA_LABEL, TITLES, TONES } from './content'
import { ai, type Brief, type Plan } from './ai'
import { draftFor, isPlaceholder, transform } from './text'
import type { Book, Chapter, ChapterKind, CoverSpec, FontKey, Message, Motif, ParaKind, Question, RefineTab, Step, Theme } from './types'

type Audience = { t: string; d: string; icon: string }
type Tone = { t: string; sample: string }
/** Any idea about sourdough uses the hand-written demo book (instant, offline). Everything else goes to the AI. */
export const isDemoIdea = (idea: string) => idea === DEMO_IDEA || CLARIFY_OPTIONS.includes(idea) || /sourdough/i.test(idea)

export const QUESTIONS: Record<'idea' | 'shape', Question[]> = {
  idea: ['idea', 'aud', 'tone', 'len', 'story', 'summary'],
  shape: ['title', 'plan'],
}
const STREAM_STEP = 7          // characters per tick while chapter 1 streams in
const TICK_MS = 40
const CHAPTER_MS = 1100
const FAIL_INDEX = 4           // chapter 5 fails once, on purpose, to demo recovery

let uid = 0
const newChapter = (key: string, title?: string): Chapter =>
  ({ id: ++uid, key, title: title ?? CONTENT[key]?.title ?? key, status: 'planned', paras: [], versions: [], failedOnce: false })

const freshBook = (): Book => ({
  title: TITLES[0].t, subtitle: TITLES[0].s, author: 'Alex Morgan',
  chapters: BASE_KEYS.map((k) => newChapter(k)),
  cover: { layout: 'object', pal: 0, font: 'editorial', motif: 'loaf' },
  style: { theme: 'classic', dropcap: true },
})

const initial = () => ({
  bookId: Date.now().toString(36),
  screen: 'create' as 'create' | 'library',
  readingId: null as string | null,
  library: [] as SavedBook[],
  step: 'idea' as Step,
  q: 'idea' as Question,
  returnTo: null as Question | null,
  idea: '',
  mode: 'demo' as 'demo' | 'ai',
  topic: 'Sourdough',
  audiences: [...AUDIENCES] as Audience[],
  tones: [...TONES] as Tone[],
  titles: [...TITLES],
  suggestions: [] as string[],
  clarifyOptions: [...CLARIFY_OPTIONS],
  thinking: '' as '' | 'brief' | 'plan',
  busyPara: null as { ci: number; p: number } | null,
  clarify: false,
  understood: false,
  briefDone: false,
  answered: { audience: false, tone: false, length: false },
  audienceText: '',
  choice: { audience: 0, tone: 0, length: 0 },
  story: '',
  book: freshBook(),
  gen: { running: false, started: false, streamId: null as number | null, streamed: '', msg: '' },
  view: { mode: 'cover' as 'cover' | 'pages', chapter: 0, tab: 'text' as RefineTab },
  sel: null as { ci: number; p: number } | null,
  pending: null as { ci: number; p: number; kind: ParaKind; v: number } | null,
  editing: null as { ci: number; p: number } | null,
  adding: false,
  flash: null as number | null,
  coOpen: false,
  unread: false,
  typing: false,
  co: [{ from: 'ai', text: 'Hi, I’m your co-author. Describe your book on the left, or just tell me here.', at: 0 }] as Message[],
  history: [] as { label: string; book: Book }[],
  toast: null as { text: string; id: number } | null,
  whisper: null as { text: string; id: number } | null,
  confirmRestart: false,
  epoch: 0,
})

export interface SavedBook { id: string; book: Book; savedAt: number }
type State = ReturnType<typeof initial>
type D = Draft<State>

export const audienceLabel = (s: Pick<State, 'audienceText' | 'choice' | 'audiences'>) => s.audienceText || s.audiences[s.choice.audience]?.t || ''
const briefOf = (s: State) => ({ idea: s.idea, audience: audienceLabel(s), tone: s.tones[s.choice.tone]?.t, story: s.story })
const cap = (w: string) => w.replace(/^\w/, (c) => c.toUpperCase())

/** Offline fallbacks: used when the AI can't be reached, so the flow never dead-ends. */
function fallbackBrief(idea: string): Brief {
  const topic = cap(idea.replace(/^(a|an|the)\s+/i, '').split(/\s+/).slice(0, 3).join(' ').replace(/[^\w\s'-]/g, ''))
  const low = topic.toLowerCase()
  return { topic, vague: false, audiences: GENERIC_AUDIENCES.map(({ t, d }) => ({ t, d })), tones: [
    { t: 'Warm & practical', sample: `Most people think ${low} is complicated. It isn’t. It needs a small, steady habit.` },
    { t: 'Playful', sample: `Good news: ${low} is a lot more fun than it looks from the outside.` },
    { t: 'Straight to the point', sample: `${topic}, in plain steps. No fluff. Here’s where to start.` }] }
}
function fallbackPlan(s: State, n: number): Plan {
  const T = s.topic || 'Your Topic'
  const base = ['Why This Matters', 'Getting Started', 'The Core Method', 'Common Mistakes and Fixes', 'Making It a Habit', 'Going Further', 'Real-Life Examples', 'Your Next Steps']
  return { topic: T, titles: [{ t: `${T}, Simply`, s: `A practical guide for ${audienceLabel(s).toLowerCase()}` }, { t: `The ${T} Handbook`, s: 'Everything you need, nothing you don’t' }, { t: `${T} in Small Steps`, s: 'Results that fit a busy life' }],
    chapters: base.slice(0, n), cover: { motif: 'circle', palette: 4, font: 'editorial' }, suggestions: ['Tools You Actually Need', 'Frequently Asked Questions', 'A 7-Day Starter Plan'] }
}

interface Actions {
  setIdea(v: string): void; setStory(v: string): void; useExample(): void; useVague(): void; analyzeIdea(): void; clarifyIdea(v: string): void
  answer(k: 'audience' | 'tone' | 'length', i: number): void; answerAudienceText(v: string): void
  nextQ(): void; backQ(): void; skipQs(): void; gotoQ(q: Question): void; confirmBrief(): void
  goStep(s: Step): void
  pickTitle(i: number): void; setBookField(f: 'title' | 'subtitle' | 'author', v: string): void; commitField(label: string, before: Book): void
  renameChapter(i: number, v: string): void; removeChapter(i: number): void; moveChapter(from: number, to: number): void
  setAdding(v: boolean): void; addChapter(key: string | null, title?: string): void
  startWriting(): void; retry(id: number): void
  openChapter(i: number): void; navChapter(d: number): void; setMode(m: 'cover' | 'pages'): void; setTab(t: RefineTab): void
  selectPara(ci: number, p: number): void; clearSelection(): void
  applyPara(kind: ParaKind): void; keepPending(): void; tryAnother(): void
  startEdit(): void; finishEdit(text: string | null): void
  rewriteChapter(kind: ChapterKind): void; restoreVersion(i: number): void
  setCover<K extends keyof CoverSpec>(k: K, v: CoverSpec[K]): void; shuffleCover(): void
  setTheme(t: Theme): void; setDropcap(v: boolean): void
  undo(): void; askRestart(v: boolean): void; restart(): void
  saveToLibrary(): void; openLibrary(open: boolean): void; openBook(id: string | null): void; removeFromLibrary(id: string): void
  toggleCo(open?: boolean): void; ask(text: string): void; showToast(text: string): void
}

export const useStore = create<State & Actions>()(persist(immer((set, get) => {
  /* ---------- helpers that run inside a draft ---------- */
  const say = (d: D, text: string, opts: { undo?: boolean; card?: boolean } = {}) => {
    d.co.push({ from: 'ai', text, ...opts, at: Date.now() })
    if (!d.coOpen) { d.unread = true; d.whisper = { text, id: Date.now() } }
  }
  let lastMemo = { label: '', at: 0 }
  const remember = (d: D, label: string) => {
    const now = Date.now()
    if (label === lastMemo.label && now - lastMemo.at < 1500) { lastMemo.at = now; return }
    lastMemo = { label, at: now }
    d.history.push({ label, book: current(d.book) as Book })
    if (d.history.length > 60) d.history.shift()
  }
  const toast = (d: D, text: string) => { d.toast = { text, id: Date.now() } }
  const chapter = (d: D, id: number) => d.book.chapters.find((c) => c.id === id)
  const next = (d: D) => {
    if (d.returnTo) { d.q = d.returnTo; d.returnTo = null; return }
    const list = QUESTIONS[d.step as 'idea' | 'shape']
    d.q = list[Math.min(list.indexOf(d.q) + 1, list.length - 1)]
  }
  const alive = (epoch: number) => get().epoch === epoch
  const setDemo = (d: D) => {
    d.mode = 'demo'; d.topic = 'Sourdough'; d.audiences = [...AUDIENCES]; d.tones = [...TONES]; d.titles = [...TITLES]
    d.book.title = TITLES[0].t; d.book.subtitle = TITLES[0].s; d.book.chapters = BASE_KEYS.map((k) => newChapter(k)) as Draft<Chapter>[]; d.book.cover.motif = 'loaf'
  }
  const applyBrief = (d: D, b: Brief) => {
    d.mode = 'ai'; d.topic = b.topic || d.topic
    const icons = ['sprout', 'users', 'briefcase']
    const aud = (b.audiences ?? []).filter((a) => a?.t).slice(0, 3)
    d.audiences = (aud.length === 3 ? aud : fallbackBrief(d.idea).audiences).map((a, i) => ({ t: a.t, d: a.d ?? '', icon: icons[i] }))
    const tones = (b.tones ?? []).filter((t) => t?.sample).slice(0, 3)
    d.tones = tones.length === 3 ? tones : fallbackBrief(d.idea).tones
    d.book.cover.motif = 'circle'
  }
  const applyPlan = (d: D, p: Plan) => {
    const titles = (p.titles ?? []).filter((t) => t?.t).slice(0, 3)
    if (titles.length) d.titles = titles.map((t) => ({ t: t.t, s: t.s ?? '' }))
    d.book.title = d.titles[0].t; d.book.subtitle = d.titles[0].s
    const chs = (p.chapters ?? []).filter((c) => typeof c === 'string' && c.trim()).slice(0, 8)
    if (chs.length >= 3) d.book.chapters = chs.map((t) => newChapter('ai', t)) as Draft<Chapter>[]
    const c = p.cover ?? ({} as Plan['cover'])
    d.book.cover.motif = (MOTIF_KEYS.includes(c.motif as Motif) ? c.motif : 'circle') as Motif
    d.book.cover.pal = Number.isInteger(c.palette) && c.palette >= 0 && c.palette < PALETTES.length ? c.palette : 0
    d.book.cover.font = (['editorial', 'modern', 'classic'].includes(c.font) ? c.font : 'editorial') as FontKey
    d.suggestions = (p.suggestions ?? []).filter((x) => typeof x === 'string').slice(0, 3)
    if (p.topic) d.topic = p.topic
  }
  /** Rewrite one paragraph with the AI, or fall back to the local rewrite. */
  const rewriteText = async (kind: string, text: string, ch: Chapter, variant = 0, instruction?: string): Promise<{ text: string; offline: boolean }> => {
    const s = get()
    if (s.mode === 'ai') {
      try {
        const r = await ai<{ text: string }>('rewrite', { ...briefOf(s), kind, text, variant, instruction }, 25000)
        if (r.text?.trim()) return { text: r.text.trim(), offline: false }
      } catch { /* fall through to the local rewrite */ }
    }
    const local = kind === 'practical' ? 'example' : kind === 'custom' ? 'warmer' : kind
    return { text: transform(local as ParaKind, text, ch, variant), offline: s.mode === 'ai' }
  }
  const rewriteParagraph = async (ci: number, p: number, kind: string, variant: number, label: string, instruction?: string) => {
    const s = get(); const ch = s.book.chapters[ci]; if (!ch) return
    const epoch = s.epoch
    set((d) => { d.busyPara = { ci, p }; d.sel = null; d.pending = null })
    const r = await rewriteText(kind, ch.paras[p], ch, variant, instruction)
    if (!alive(epoch)) return
    set((d) => {
      d.busyPara = null
      const c = d.book.chapters[ci]; if (!c) return
      remember(d, `Paragraph ${p + 1} · ${label}`)
      c.paras[p] = r.text
      c.versions.push({ label: `Paragraph ${p + 1} · ${label}`, paras: [...c.paras] })
      d.pending = { ci, p, kind: (kind in PARA_LABEL ? kind : 'warmer') as ParaKind, v: variant }
      if (r.offline) toast(d, 'The writer is offline, so I used a quick rewrite')
    })
  }

  /* ---------- simulated generation ---------- */
  const writeChapter = (id: number, opts: { stream?: boolean; failOnce?: boolean }, done?: () => void) => {
    const epoch = get().epoch
    set((d) => { const c = chapter(d, id); if (c) { c.status = 'writing'; d.gen.msg = `Writing “${c.title}”` } })
    const ch = get().book.chapters.find((c) => c.id === id)
    if (!ch) return done?.()
    const s0 = get()
    if (s0.mode === 'ai' && !CONTENT[ch.key]) {
      const index = s0.book.chapters.findIndex((c) => c.id === id)
      ai<{ paras: string[] }>('chapter', { ...briefOf(s0), title: s0.book.title, chapters: s0.book.chapters.map((c) => c.title), chapter: ch.title, index })
        .then((r) => {
          if (!alive(epoch)) return
          const paras = (r.paras ?? []).filter((x) => typeof x === 'string' && x.trim())
          if (!paras.length) throw new Error('empty')
          reveal(paras)
        })
        .catch(() => {
          if (!alive(epoch)) return
          set((d) => { const c = chapter(d, id); if (c) c.status = 'failed' })
          done?.()
        })
      return
    }
    reveal(draftFor(ch))
    function reveal(paras: string[]) {
    const finish = () => {
      set((d) => {
        const c = chapter(d, id); if (!c) return
        c.paras = [...paras]; c.versions = [{ label: 'First draft', paras: [...paras] }]; c.status = 'done'; c.doneAt = Date.now()
      })
      done?.()
    }
    if (opts.stream) {
      const full = paras.join('\n\n')
      let n = 0
      set((d) => { d.gen.streamId = id; d.gen.streamed = '' })
      const t = setInterval(() => {
        if (!alive(epoch)) return clearInterval(t)
        n += STREAM_STEP
        set((d) => { d.gen.streamed = full.slice(0, n) })
        if (n >= full.length) { clearInterval(t); set((d) => { d.gen.streamId = null }); finish() }
      }, TICK_MS)
      return
    }
    if (s0.mode === 'ai') return finish()
    setTimeout(() => {
      if (!alive(epoch)) return
      if (opts.failOnce && !get().book.chapters.find((c) => c.id === id)?.failedOnce) {
        set((d) => { const c = chapter(d, id); if (c) { c.failedOnce = true; c.status = 'failed' } })
        return done?.()
      }
      finish()
    }, CHAPTER_MS)
    }
  }

  /* ---------- co-author: free text → one visible, undoable change ---------- */
  const interpret = (d: D, text: string): (() => void) | void => {
    const t = text.toLowerCase()
    const m = t.match(/chapter (\d+)/)
    const ci = m ? Math.min(+m[1] - 1, d.book.chapters.length - 1) : d.view.chapter
    const written = d.gen.started && !d.gen.running

    if (d.step === 'idea') {
      if (!d.understood) {
        d.idea = text.length > 15 ? text : d.idea || text
        if (text.split(/\s+/).length < 4) { d.clarify = true; return say(d, 'Happy to help. Which book do you mean? Pick one on the left.') }
        d.understood = true; d.clarify = false; d.q = 'aud'
        return say(d, 'Got it. A few quick questions on the left.')
      }
      if (/playful|fun/.test(t)) { d.choice.tone = 1; d.answered.tone = true; return say(d, 'Switched the tone to playful.') }
      if (/beginner/.test(t)) { d.choice.audience = 0; d.answered.audience = true; d.audienceText = ''; return say(d, 'Writing for complete beginners.') }
      if (/mini|short/.test(t)) { d.choice.length = 1; d.answered.length = true; return say(d, 'Making it a mini guide with 4 chapters.') }
    }
    if (/title/.test(t)) {
      remember(d, 'Change title')
      const i = (d.titles.findIndex((x) => x.t === d.book.title) + 1) % d.titles.length
      d.book.title = d.titles[i].t; d.book.subtitle = d.titles[i].s
      return say(d, `How about “${d.titles[i].t}”? It’s on the cover now.`, { undo: true, card: true })
    }
    const para = t.match(/paragraph (\d+) of chapter (\d+) to (.+)$/)
    if (para && written) {
      const pc = Math.min(+para[2] - 1, d.book.chapters.length - 1), pp = +para[1] - 1
      if (d.book.chapters[pc]?.paras[pp] !== undefined) {
        d.view.chapter = pc; d.view.mode = 'pages'
        say(d, `Rewriting paragraph ${pp + 1}. You can keep it, try another or undo.`, { undo: true })
        return () => { void rewriteParagraph(pc, pp, 'custom', 0, 'Your request', para[3]) }
      }
    }
    if (/add|about/.test(t) && /chapter/.test(t)) {
      const key = /tool/.test(t) ? 'tools' : /kid|child/.test(t) ? 'kids' : /leftover|discard/.test(t) ? 'leftover' : null
      const about = t.match(/about (.+)$/)
      if ((key && !d.book.chapters.some((c) => c.key === key)) || about) {
        const ch = key ? newChapter(key) : newChapter('custom', about![1].replace(/^\w/, (c) => c.toUpperCase()))
        remember(d, 'Add chapter')
        d.book.chapters.push(ch)
        say(d, `Added “${ch.title}”${written ? '. Writing it now.' : '.'}`, { undo: true })
        if (d.gen.started) { ch.status = 'queued'; d.view.chapter = d.book.chapters.length - 1; d.view.mode = 'pages'; return () => writeChapter(ch.id, {}) }
        return
      }
    }
    if (/remove|delete/.test(t) && /chapter/.test(t)) {
      if (d.book.chapters.length <= 3) return say(d, 'A book needs at least 3 chapters, so I kept them all.')
      const i = /last/.test(t) ? d.book.chapters.length - 1 : ci
      const title = d.book.chapters[i].title
      remember(d, 'Remove chapter'); d.book.chapters.splice(i, 1)
      d.view.chapter = Math.min(d.view.chapter, d.book.chapters.length - 1)
      return say(d, `Removed “${title}”.`, { undo: true })
    }
    if (/cover|dark|colou?r/.test(t)) {
      remember(d, 'Cover change')
      if (/dark|night/.test(t)) d.book.cover.pal = 2
      else if (/green|forest/.test(t)) d.book.cover.pal = 1
      else if (/pink|blush|light/.test(t)) d.book.cover.pal = 3
      else d.book.cover = randomCover(d.book.cover)
      if (d.step === 'write') d.view.mode = 'cover'
      return say(d, 'Here’s the new cover.', { undo: true, card: true })
    }
    if (written) {
      const kind: ChapterKind | null = /short|concise|trim/.test(t) ? 'shorter' : /example|practical/.test(t) ? 'practical'
        : /personal|story|warm|friend/.test(t) ? 'personal' : /fresh|again|rewrite|different/.test(t) ? 'fresh' : null
      if (kind) {
        d.view.chapter = ci; d.view.mode = 'pages'; d.view.tab = 'text'
        say(d, `Rewriting chapter ${ci + 1}: ${CHAPTER_LABEL[kind].toLowerCase()}. The old version stays in its history.`, { undo: true })
        return () => get().rewriteChapter(kind)
      }
    } else if (/short|example|personal|rewrite/.test(t)) {
      return say(d, 'I can do that once the book is written. For now, shape the title and chapters.')
    }
    say(d, 'I’m not sure what to change there. Try something specific, like “make chapter 2 shorter” or “a darker cover”.')
  }

  return {
    ...initial(),

    /* ---------- step 1: idea, one question at a time ---------- */
    setIdea: (v) => set((d) => { d.idea = v }),
    setStory: (v) => set((d) => { d.story = v }),
    useExample: () => set((d) => { d.idea = DEMO_IDEA; setDemo(d); d.clarify = false; d.understood = true; next(d) }),
    useVague: () => set((d) => { d.idea = 'bread'; d.clarifyOptions = [...CLARIFY_OPTIONS]; d.clarify = true; d.understood = false }),
    analyzeIdea: async () => {
      const s = get(); const idea = s.idea.trim(); const words = idea.split(/\s+/).filter(Boolean).length
      if (!words) return set((d) => toast(d, 'Type a sentence about your book, or try the example'))
      if (s.thinking) return
      if (isDemoIdea(idea)) return set((d) => { setDemo(d); d.clarify = false; d.understood = true; next(d) })
      const epoch = s.epoch
      set((d) => { d.thinking = 'brief' })
      try {
        const b = await ai<Brief>('brief', { idea }, 20000)
        if (!alive(epoch)) return
        set((d) => {
          d.thinking = ''
          if (b.vague && b.options?.length) { d.clarifyOptions = b.options.slice(0, 3); d.clarify = true; d.understood = false; return }
          applyBrief(d, b); d.clarify = false; d.understood = true; next(d)
        })
      } catch {
        if (!alive(epoch)) return
        set((d) => {
          d.thinking = ''
          if (words < 3) { d.clarifyOptions = [`A beginner’s guide to ${idea}`, `${cap(idea)} for busy people`, `Common ${idea} mistakes and how to fix them`]; d.clarify = true; return }
          applyBrief(d, fallbackBrief(idea)); d.understood = true; next(d)
          toast(d, 'The writer is offline. I’ll keep going with simpler suggestions.')
        })
      }
    },
    clarifyIdea: (v) => { set((d) => { d.idea = v; d.clarify = false }); void get().analyzeIdea() },
    answer: (k, i) => set((d) => { d.choice[k] = i; d.answered[k] = true; if (k === 'audience') d.audienceText = ''; next(d) }),
    answerAudienceText: (v) => set((d) => { d.audienceText = v.trim(); d.answered.audience = true; next(d) }),
    nextQ: () => set((d) => {
      if (d.q === 'title' && !d.book.title.trim()) return toast(d, 'Give your book a title first')
      next(d)
    }),
    backQ: () => set((d) => {
      const list = QUESTIONS[d.step as 'idea' | 'shape']
      const i = list.indexOf(d.q)
      if (i > 0) d.q = list[i - 1]
      else if (d.step === 'shape') { d.step = 'idea'; d.q = 'summary' }
      d.returnTo = null
    }),
    skipQs: () => set((d) => { d.answered = { audience: true, tone: true, length: true }; d.q = 'summary'; d.returnTo = null }),
    gotoQ: (q) => set((d) => { d.q = q; d.returnTo = 'summary' }),
    confirmBrief: async () => {
      const s = get()
      set((d) => { d.briefDone = true; d.step = 'shape'; d.q = 'title'; if (d.mode === 'ai') d.thinking = 'plan'; say(d, 'Now the fun part: pick a title and watch the cover.') })
      if (s.mode !== 'ai') return
      const n = LENGTHS[s.choice.length].ch
      const epoch = s.epoch
      try {
        const p = await ai<Plan>('plan', { ...briefOf(s), chapters: n }, 25000)
        if (alive(epoch)) set((d) => { applyPlan(d, p); d.thinking = '' })
      } catch {
        if (alive(epoch)) set((d) => { applyPlan(d, fallbackPlan(current(d) as State, n)); d.thinking = ''; toast(d, 'The writer is offline, so here’s a starter plan you can edit') })
      }
    },

    goStep: (s) => set((d) => {
      d.step = s; d.sel = null; d.pending = null
      if (s === 'write') d.view.mode = 'pages'
      if (s === 'idea') d.q = d.briefDone ? 'summary' : 'idea'
      if (s === 'shape') d.q = 'title'
    }),

    /* ---------- step 2: title + plan ---------- */
    pickTitle: (i) => set((d) => { remember(d, 'Change title'); d.book.title = d.titles[i].t; d.book.subtitle = d.titles[i].s }),
    setBookField: (f, v) => set((d) => { d.book[f] = v }),
    commitField: (label, before) => set((d) => { d.history.push({ label, book: before }) }),
    renameChapter: (i, v) => set((d) => {
      const c = d.book.chapters[i]; const val = v.trim()
      if (!c || !val || val === c.title) return
      remember(d, 'Rename chapter'); c.title = val
    }),
    removeChapter: (i) => set((d) => {
      if (d.book.chapters.length <= 3) return toast(d, 'A book needs at least 3 chapters')
      remember(d, 'Remove chapter'); d.book.chapters.splice(i, 1)
      d.view.chapter = Math.min(d.view.chapter, d.book.chapters.length - 1)
    }),
    moveChapter: (from, to) => set((d) => {
      if (from === to) return
      remember(d, 'Reorder chapters')
      const curId = d.book.chapters[d.view.chapter]?.id
      const [m] = d.book.chapters.splice(from, 1); d.book.chapters.splice(to, 0, m)
      const ni = d.book.chapters.findIndex((c) => c.id === curId); if (ni >= 0) d.view.chapter = ni
    }),
    setAdding: (v) => set((d) => { d.adding = v }),
    addChapter: (key, title) => {
      let created: number | null = null
      set((d) => {
        const ch = key && CONTENT[key] ? newChapter(key) : newChapter('custom', title)
        remember(d, 'Add chapter'); d.book.chapters.push(ch); d.adding = false
        if (d.gen.started) { ch.status = 'queued'; d.view.chapter = d.book.chapters.length - 1; d.view.mode = 'pages'; created = ch.id }
      })
      if (created !== null) writeChapter(created, {}, () => set((d) => { d.gen.msg = 'All chapters written' }))
    },

    /* ---------- step 3: writing ---------- */
    startWriting: () => {
      set((d) => {
        d.step = 'write'; d.view = { mode: 'pages', chapter: 0, tab: 'text' }
        d.gen = { running: true, started: true, streamId: null, streamed: '', msg: 'Planning how the chapters connect' }
        d.book.chapters.forEach((c) => { c.status = 'queued'; c.paras = []; c.versions = [] })
        say(d, 'Writing now. Chapter 1 appears first, so you can start reading while I write the rest.')
      })
      const epoch = get().epoch
      const queue = get().book.chapters.map((c) => c.id)
      let k = 0
      const step = () => {
        if (!alive(epoch)) return
        if (k >= queue.length) {
          set((d) => {
            d.gen.running = false
            const failed = d.book.chapters.filter((c) => c.status === 'failed').length
            d.gen.msg = failed ? `${d.book.chapters.length - failed} of ${d.book.chapters.length} chapters written` : 'All chapters written'
            say(d, failed ? 'Almost there. One chapter didn’t finish, but your other chapters are safe. Retry just that one.' : 'Done! Click any paragraph to change it, or ask me.')
          })
          return
        }
        const idx = k++
        writeChapter(queue[idx], { stream: idx === 0, failOnce: idx === FAIL_INDEX && get().mode === 'demo' }, step)
      }
      setTimeout(step, CHAPTER_MS)
    },
    retry: (id) => {
      set((d) => { const i = d.book.chapters.findIndex((c) => c.id === id); if (i >= 0) { d.view.chapter = i; d.view.mode = 'pages' } })
      writeChapter(id, {}, () => set((d) => {
        d.gen.msg = 'All chapters written'
        say(d, `Fixed. “${chapter(d, id)?.title}” is written now.`)
      }))
    },

    /* ---------- reading + refining ---------- */
    openChapter: (i) => set((d) => { d.view.chapter = i; d.view.mode = 'pages'; d.sel = null; d.pending = null; if (!d.gen.running) d.view.tab = 'text' }),
    navChapter: (delta) => set((d) => { d.view.chapter = Math.max(0, Math.min(d.book.chapters.length - 1, d.view.chapter + delta)); d.sel = null; d.pending = null }),
    setMode: (m) => set((d) => { d.view.mode = m }),
    setTab: (t) => set((d) => { d.view.tab = t; d.view.mode = t === 'cover' ? 'cover' : 'pages' }),
    selectPara: (ci, p) => set((d) => {
      const c = d.book.chapters[ci]
      if (!c || c.status !== 'done') return
      if (isPlaceholder(c.paras[p])) { d.editing = { ci, p }; d.sel = null; return }
      d.pending = null
      d.sel = d.sel && d.sel.ci === ci && d.sel.p === p ? null : { ci, p }
    }),
    clearSelection: () => set((d) => { d.sel = null; d.editing = null }),
    applyPara: (kind) => {
      const s = get()
      if (s.mode === 'ai' && s.sel) return void rewriteParagraph(s.sel.ci, s.sel.p, kind, 0, PARA_LABEL[kind])
      set((d) => {
      if (!d.sel) return
      const { ci, p } = d.sel; const c = d.book.chapters[ci]
      remember(d, `Paragraph ${p + 1} · ${PARA_LABEL[kind]}`)
      c.paras[p] = transform(kind, c.paras[p], c, 0)
      c.versions.push({ label: `Paragraph ${p + 1} · ${PARA_LABEL[kind]}`, paras: [...c.paras] })
      d.pending = { ci, p, kind, v: 0 }; d.sel = null
    })
    },
    keepPending: () => set((d) => { d.pending = null; toast(d, 'Kept') }),
    tryAnother: () => {
      const s = get()
      if (s.mode === 'ai' && s.pending) {
        const pd = s.pending
        set((d) => { const h = d.history.pop(); if (h) d.book = h.book as Draft<Book> })
        return void rewriteParagraph(pd.ci, pd.p, pd.kind, pd.v + 1, PARA_LABEL[pd.kind])
      }
      set((d) => {
      const pd = d.pending; const h = d.history.pop()
      if (!pd || !h) return
      d.book = h.book as Draft<Book>
      const c = d.book.chapters[pd.ci]
      remember(d, `Paragraph ${pd.p + 1} · ${PARA_LABEL[pd.kind]}`)
      c.paras[pd.p] = transform(pd.kind, c.paras[pd.p], c, pd.v + 1)
      c.versions.push({ label: `Paragraph ${pd.p + 1} · ${PARA_LABEL[pd.kind]}`, paras: [...c.paras] })
      d.pending = { ...pd, v: pd.v + 1 }
    })
    },
    startEdit: () => set((d) => { if (d.sel) { d.editing = { ...d.sel }; d.sel = null } }),
    finishEdit: (text) => set((d) => {
      const ed = d.editing; d.editing = null
      if (!ed || text === null) return
      const c = d.book.chapters[ed.ci]; const val = text.trim()
      if (!val || val === c.paras[ed.p]) return
      remember(d, `Paragraph ${ed.p + 1} · ${PARA_LABEL.edit}`)
      c.paras[ed.p] = val
      c.versions.push({ label: `Paragraph ${ed.p + 1} · ${PARA_LABEL.edit}`, paras: [...c.paras] })
      toast(d, 'Saved your edit')
    }),
    rewriteChapter: (kind) => {
      const { view, book, epoch } = get()
      const id = book.chapters[view.chapter]?.id
      if (id === undefined || book.chapters[view.chapter].status !== 'done') return
      set((d) => { const c = chapter(d, id)!; remember(d, `“${c.title}” · ${CHAPTER_LABEL[kind]}`); c.status = 'writing'; d.pending = null; d.sel = null })
      if (get().mode === 'ai') {
        const ch = get().book.chapters.find((c) => c.id === id)!
        const paras = ch.paras.filter((x) => !isPlaceholder(x))
        const ops = paras.map((x, j): [string, string] | null =>
          kind === 'shorter' ? ['shorter', x] : kind === 'fresh' ? [j % 2 ? 'warmer' : 'simpler', x]
          : kind === 'practical' && j === paras.length - 1 ? ['practical', x] : kind === 'personal' && j === 0 ? ['warmer', x] : null)
        void Promise.all(ops.map((o, j) => (o ? rewriteText(o[0], o[1], ch, 1) : Promise.resolve({ text: paras[j], offline: false })))).then((res) => {
          if (!alive(epoch)) return
          set((d) => {
            const c = chapter(d, id); if (!c) return
            const p = res.map((r) => r.text)
            if (kind === 'personal') p.splice(1, 0, d.story.trim() ? d.story.trim() : '[Add a short story of your own here. Readers trust real experience. Click to write it.]')
            c.paras = p; c.versions.push({ label: CHAPTER_LABEL[kind], paras: [...p] }); c.status = 'done'; c.doneAt = Date.now(); d.flash = id
            if (res.some((r) => r.offline)) toast(d, 'The writer is offline, so I used a quick rewrite')
          })
        })
        return
      }
      setTimeout(() => {
        if (!alive(epoch)) return
        set((d) => {
          const c = chapter(d, id); if (!c) return
          let p = c.paras.filter((x) => !isPlaceholder(x))
          if (kind === 'shorter') p = p.map((x) => transform('shorter', x, c))
          if (kind === 'practical') p[p.length - 1] = transform('example', p[p.length - 1], c)
          if (kind === 'personal') {
            p[0] = transform('warmer', p[0], c)
            p.splice(1, 0, d.story.trim() ? `From my own kitchen: ${d.story.trim()}` : '[Add a short story of your own here. Readers trust real experience. Click to write it.]')
          }
          if (kind === 'fresh') p = p.map((x, j) => (j % 2 ? transform('warmer', x, c, 1) : transform('simpler', x, c)))
          c.paras = p; c.versions.push({ label: CHAPTER_LABEL[kind], paras: [...p] }); c.status = 'done'; c.doneAt = Date.now(); d.flash = id
        })
      }, 1300)
    },
    restoreVersion: (i) => set((d) => {
      const c = d.book.chapters[d.view.chapter]
      remember(d, 'Restore version')
      c.paras = [...c.versions[i].paras]
      c.versions.push({ label: `Restored: ${c.versions[i].label}`, paras: [...c.paras] })
      d.pending = null; toast(d, 'Version restored')
    }),
    setCover: (k, v) => set((d) => { remember(d, `Cover · ${k}`); d.book.cover[k] = v; if (k === 'pal') d.book.cover.bg = undefined }),
    shuffleCover: () => set((d) => { remember(d, 'Shuffle cover'); d.book.cover = randomCover(d.book.cover) }),
    setTheme: (t) => set((d) => { remember(d, 'Interior style'); d.book.style.theme = t }),
    setDropcap: (v) => set((d) => { remember(d, 'Drop cap'); d.book.style.dropcap = v }),

    /* ---------- safety net ---------- */
    undo: () => set((d) => {
      const h = d.history.pop()
      if (!h) return toast(d, 'Nothing to undo')
      d.book = h.book as Draft<Book>; d.pending = null; d.sel = null; d.editing = null
      d.view.chapter = Math.min(d.view.chapter, d.book.chapters.length - 1)
      toast(d, `Undone: ${h.label}`)
    }),
    askRestart: (v) => set((d) => { d.confirmRestart = v }),
    restart: () => set((d) => { Object.assign(d, initial(), { epoch: get().epoch + 1, library: current(d.library) }) }),

    /* ---------- library ---------- */
    saveToLibrary: () => set((d) => {
      const entry = { id: d.bookId, book: current(d.book) as Book, savedAt: Date.now() }
      const i = d.library.findIndex((b) => b.id === d.bookId)
      if (i >= 0) d.library[i] = entry as Draft<SavedBook>; else d.library.unshift(entry as Draft<SavedBook>)
      toast(d, i >= 0 ? 'Library copy updated' : 'Saved to your library')
    }),
    openLibrary: (open) => set((d) => { d.screen = open ? 'library' : 'create'; if (!open) d.readingId = null; d.coOpen = false }),
    openBook: (id) => set((d) => { d.readingId = id }),
    removeFromLibrary: (id) => set((d) => { d.library = d.library.filter((b) => b.id !== id); toast(d, 'Removed from your library') }),

    /* ---------- co-author ---------- */
    toggleCo: (open) => set((d) => { d.coOpen = open ?? !d.coOpen; if (d.coOpen) { d.unread = false; d.whisper = null } }),
    ask: (text) => {
      const epoch = get().epoch
      set((d) => { d.co.push({ from: 'me', text, at: Date.now() }); d.typing = true })
      setTimeout(() => {
        if (!alive(epoch)) return
        const effect: { run?: () => void } = {}
        set((d) => { d.typing = false; effect.run = interpret(d, text) || undefined })
        effect.run?.()
      }, 700)
    },
    showToast: (text) => set((d) => toast(d, text)),
  }
}), {
  // Autosave: a reload or a closed tab never loses the book.
  name: 'folio-book-v1',
  version: 1,
  partialize: (s) => ({
    step: s.step, q: s.q, idea: s.idea, understood: s.understood, briefDone: s.briefDone, answered: s.answered,
    audienceText: s.audienceText, choice: s.choice, story: s.story, book: s.book, gen: s.gen, view: s.view,
    history: s.history.slice(-20), co: s.co.slice(-12), library: s.library, bookId: s.bookId,
    mode: s.mode, topic: s.topic, audiences: s.audiences, tones: s.tones, titles: s.titles, suggestions: s.suggestions, clarifyOptions: s.clarifyOptions,
  }),
  merge: (saved, live) => {
    const s = { ...live, ...(saved as Partial<State>), thinking: '' as const, busyPara: null }
    // Generation can't survive a reload: anything unfinished becomes "retry this chapter".
    if (s.gen.running) {
      s.gen = { ...s.gen, running: false, streamId: null, streamed: '', msg: 'Writing was interrupted' }
      s.book = { ...s.book, chapters: s.book.chapters.map((c) => (c.status === 'writing' || c.status === 'queued' ? { ...c, status: 'failed' as const, failedOnce: true } : c)) }
    }
    uid = Math.max(uid, ...s.book.chapters.map((c) => c.id))
    return s
  },
}))

function randomCover(cur: CoverSpec): CoverSpec {
  const fonts = Object.keys(FONTS) as CoverSpec['font'][]
  let n: CoverSpec
  do {
    n = { layout: LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)][0], pal: Math.floor(Math.random() * PALETTES.length), font: fonts[Math.floor(Math.random() * fonts.length)], motif: cur.motif }
  } while (n.layout === cur.layout && n.pal === cur.pal && n.font === cur.font)
  return n
}

/* ---------- derived values ---------- */
export function stepEnabled(s: State, k: Step) {
  if (s.gen.started && (k === 'idea' || k === 'shape')) return false
  if (k === 'write') return s.gen.started
  if (k === 'publish') return s.gen.started && !s.gen.running
  if (k === 'shape') return s.briefDone
  return true
}
export const coSuggestions = (s: State): string[] => {
  if (s.step === 'idea') return s.understood ? ['Make it more playful', 'For complete beginners', 'Make it a mini guide'] : ['A sourdough guide for busy people']
  if (s.step === 'shape') return s.q === 'title' ? ['Suggest a punchier title'] : ['Add a chapter about common mistakes', 'Remove the last chapter']
  if (s.step === 'write' && !s.gen.running) return ['Make chapter 1 shorter', 'Add an example to chapter 3', 'Make it more personal', 'Try a darker cover', 'Add a chapter about common mistakes']
  if (s.step === 'publish') return ['Try a darker cover']
  return []
}
export const suggestedChapters = (s: State): { key: string | null; title: string }[] =>
  s.mode === 'demo'
    ? ADD_SUGGEST.filter((k) => !s.book.chapters.some((c) => c.key === k)).map((k) => ({ key: k, title: CONTENT[k].title }))
    : s.suggestions.filter((t) => !s.book.chapters.some((c) => c.title === t)).map((t) => ({ key: null, title: t }))
export const summaryRows = (s: State) => [
  { label: 'For', value: audienceLabel(s), q: 'aud' as Question },
  { label: 'Sounds', value: s.tones[s.choice.tone]?.t ?? '', q: 'tone' as Question },
  { label: 'Length', value: `${LENGTHS[s.choice.length].t} · ${LENGTHS[s.choice.length].ch} chapters`, q: 'len' as Question },
  { label: 'Your tip', value: s.story.trim() ? `“${s.story.trim()}”` : 'None yet', q: 'story' as Question, empty: !s.story.trim() },
]
export type AppState = State & Actions
