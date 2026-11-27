/**
 * Demo content. The prototype has no backend: "AI" output is simulated from
 * this file so every flow (generation, rewrites, failures) is deterministic.
 */
import type { ChapterKind, FontKey, Layout, Motif, ParaKind, Theme } from './types'

export const DEMO_IDEA = 'A simple sourdough guide for people with full-time jobs'

export const TITLES = [
  { t: 'Sourdough for Busy People', s: 'Real bread on a weeknight schedule' },
  { t: 'The 20-Minute Loaf', s: 'Sourdough in the gaps of a full day' },
  { t: 'Bread Without the Fuss', s: 'A calm beginner’s guide to sourdough' },
]

interface ChapterContent { title: string; paras: string[]; ex: string }

export const CONTENT: Record<string, ChapterContent> = {
  why: { title: 'Why Sourdough Fits a Busy Life', paras: [
    'Most people think sourdough needs a free weekend and a baker’s patience. It doesn’t. What it needs is a rhythm — a few minutes here and there that fit around the life you already have.',
    'The secret is that sourdough does most of its work while you’re away. Fermentation is slow on purpose. While you sleep, commute or sit in meetings, wild yeast is quietly building the flavour and structure you could never rush.',
    'This guide gives you a schedule built around a nine-to-five day: ten minutes in the morning, fifteen in the evening, and a bake that’s done before dinner. No special equipment beyond a pot with a lid. No guilt if you miss a feed.'],
    ex: 'Take Dana, a nurse on rotating shifts: she feeds her starter while the kettle boils and bakes twice a week without planning around it.' },
  starter: { title: 'Your Starter in Five Minutes a Day', paras: [
    'A starter is just flour and water that has caught wild yeast from the air and your hands. It sounds fragile. It isn’t. A healthy starter forgives late feeds, cold kitchens and the odd forgotten weekend.',
    'Keep it in a clear jar with a rubber band marking the level. Feed it once a day: a spoonful of the old starter, equal weights of flour and water, a quick stir. That’s the whole routine — about the time it takes to make coffee.',
    'When it doubles within six hours of a feed and smells pleasantly sour, it’s ready to bake with. If life gets busy, put it in the fridge. It will wait for you.'],
    ex: 'For example, if you feed it at 8am, it’s usually ready to use by early afternoon.' },
  schedule: { title: 'The Weeknight Bake Schedule', paras: [
    'The trick to baking on a work day is splitting the job into short moments. Mix in the evening, let the dough rise overnight, and shape it before you leave in the morning.',
    'Your shaped loaf rests in the fridge all day, where the cold slows everything down and deepens the flavour. When you get home, heat the oven, bake for forty minutes, and dinner comes with bread.'],
    ex: 'For example: mix at 9pm, shape at 7am, bake at 6:30pm.' },
  shaping: { title: 'Shaping Without the Stress', paras: [
    'Shaping is where most beginners panic, because sticky dough feels out of control. Wet hands and a light touch fix most of it. You’re not kneading — you’re folding the dough into a tight, round parcel.',
    'Don’t chase a perfect shape on your first loaves. A slightly lopsided loaf still bakes into good bread, and your hands will learn faster than any instructions can teach them.'],
    ex: 'For example, try shaping on a dry counter with just a dusting of flour — the slight grip helps you build tension.' },
  fixing: { title: 'Fixing Flat, Dense and Sour Loaves', paras: [
    'Every baker gets a flat loaf sooner or later. It usually means the dough rose too long or the starter wasn’t quite ready. The fix is almost always time, not technique.',
    'Dense crumb points the other way: too little rise. Very sour bread means a long, warm wait. Keep a simple note of times and temperatures, and patterns will show up within a few bakes.'],
    ex: 'For example, if your loaf spread flat after an eleven-hour rise, try nine hours next time.' },
  beyond: { title: 'Beyond the Basic Loaf', paras: [
    'Once your weeknight loaf feels routine, small changes open up a lot of new bread. Swap a fifth of the flour for whole wheat or rye. Fold in olives, seeds or cheese before the overnight rise.',
    'The same rhythm works for pizza dough, focaccia and soft sandwich loaves. You’ve already done the hard part: building a habit that fits your life.'],
    ex: 'For example, a handful of toasted sunflower seeds and a spoon of honey turns the basic loaf into a breakfast bread.' },
  tools: { title: 'The Tools You Actually Need', paras: [
    'You need less than the internet suggests. A kitchen scale, a large bowl, a jar for your starter and a heavy pot with a lid will carry you through every recipe in this book.',
    'Everything else — bannetons, lames, proofing boxes — is nice to have. Buy it later, once you know you’ll keep baking.'],
    ex: 'For example, a cheap digital scale makes your loaves more consistent than any fancy gadget.' },
  kids: { title: 'Baking with Kids', paras: [
    'Sourdough is a slow, forgiving project, which makes it a good one to share. Kids love feeding the starter, watching it bubble and naming it.',
    'Give them the jobs that can’t go wrong: weighing flour, stirring, dusting the counter. Save the hot oven for yourself.'],
    ex: 'For example, let them draw a line on the jar each morning to see how much the starter grew.' },
  leftover: { title: 'Recipes for Leftover Starter', paras: [
    'Every feed leaves you with spare starter. Instead of throwing it away, keep a “discard” jar in the fridge and use it within the week.',
    'Pancakes, crackers and flatbreads all welcome a few spoonfuls. They add flavour without any extra waiting.'],
    ex: 'For example, mix a cup of discard with an egg and a pinch of salt for weekend pancakes.' },
}

export const BASE_KEYS = ['why', 'starter', 'schedule', 'shaping', 'fixing', 'beyond']
export const ADD_SUGGEST = ['tools', 'kids', 'leftover']
export const CLARIFY_OPTIONS = ['Sourdough for people with full-time jobs', 'Sourdough for complete beginners', 'Sourdough to bake with kids']

/** Sentence starters for the "only you know" question: they help people remember, they never invent. */
export const STORY_STARTERS = [
  'My first attempt went…',
  'The mistake I made early on was…',
  'My routine looks like this:',
  'The one thing I wish I’d known:',
  'What surprised me most:',
  'Someone once asked me…',
]

/** Fallback reader groups for any topic, used when the AI can't be reached. */
export const GENERIC_AUDIENCES = [
  { t: 'Complete beginners', d: 'New to the topic, short on time', icon: 'sprout' },
  { t: 'Getting better', d: 'Know the basics, want the next step', icon: 'users' },
  { t: 'Busy professionals', d: 'Want results in small, steady steps', icon: 'briefcase' },
] as const

export const AUDIENCES = [
  { t: 'Busy beginners', d: 'Never baked bread, little free time', icon: 'clock' },
  { t: 'Home bakers', d: 'Bake already, new to sourdough', icon: 'chef-hat' },
  { t: 'Parents with little time', d: 'Want to bake with their kids', icon: 'baby' },
] as const

export const TONES = [
  { t: 'Warm & practical', sample: 'Most people think sourdough needs a free weekend. It doesn’t. It needs a rhythm.' },
  { t: 'Playful', sample: 'Good news: a sourdough starter is basically a very low-maintenance pet.' },
  { t: 'Straight to the point', sample: 'Sourdough fits a 9-to-5. Ten minutes in the morning, fifteen at night. Here’s how.' },
]

export const LENGTHS = [
  { t: 'Short guide', ch: 6, pg: '~34 pages', rd: '30 min read' },
  { t: 'Mini guide', ch: 4, pg: '~18 pages', rd: '15 min read' },
  { t: 'Full guide', ch: 8, pg: '~44 pages', rd: '45 min read' },
]

export const PALETTES = [
  { name: 'Flour & crust', bg: '#E8D9C0', ink: '#2A1C12', motif: '#B8692F', score: '#F3E6CF', panel: '#F4EADA' },
  { name: 'Forest', bg: '#1F3A2E', ink: '#F1E8D6', motif: '#D9A55B', score: '#1F3A2E', panel: '#173026' },
  { name: 'Night bake', bg: '#1B1F33', ink: '#F2D48A', motif: '#E1B562', score: '#1B1F33', panel: '#13162A' },
  { name: 'Rye & blush', bg: '#F2D6CF', ink: '#3B1F2B', motif: '#8C3B4A', score: '#F2D6CF', panel: '#F9E9E4' },
  { name: 'Ocean', bg: '#DCE6E8', ink: '#0F2E37', motif: '#2E7486', score: '#DCE6E8', panel: '#EAF1F2' },
  { name: 'Sage', bg: '#E2E7D8', ink: '#23301F', motif: '#6B8758', score: '#E2E7D8', panel: '#EEF1E7' },
]
export type Palette = (typeof PALETTES)[number]

export const LAYOUTS: [Layout, string][] = [['object', 'Object'], ['type', 'Type-led'], ['pattern', 'Pattern'], ['frame', 'Classic']]
export const FONTS: Record<FontKey, { name: string; fam: string; w: number }> = {
  editorial: { name: 'Editorial', fam: 'Fraunces, serif', w: 600 },
  modern: { name: 'Modern', fam: 'Manrope, sans-serif', w: 700 },
  classic: { name: 'Classic', fam: 'DM Serif Display, serif', w: 400 },
}
export const MOTIFS: [Motif, string][] = [['loaf', 'Loaf'], ['wheat', 'Wheat'], ['leaf', 'Leaf'], ['wave', 'Wave'], ['sun', 'Sun'], ['peak', 'Peak'], ['star', 'Star'], ['circle', 'Rings'], ['none', 'None']]
export const MOTIF_KEYS = MOTIFS.map(([k]) => k)
export const THEMES: Record<Theme, { name: string; body: string; head: string }> = {
  classic: { name: 'Classic', body: "'Newsreader', serif", head: "'Gilda Display', serif" },
  modern: { name: 'Modern', body: "'Manrope', sans-serif", head: "'Manrope', sans-serif" },
  warm: { name: 'Warm', body: "'Newsreader', serif", head: "'DM Serif Display', serif" },
}

export const PARA_LABEL: Record<ParaKind | 'edit', string> = { shorter: 'Shorter', simpler: 'Simpler', example: 'Example added', warmer: 'Warmer', edit: 'Edited by you' }
export const CHAPTER_LABEL: Record<ChapterKind, string> = { shorter: 'Shorter', practical: 'More practical', personal: 'More personal', fresh: 'Fresh take' }
