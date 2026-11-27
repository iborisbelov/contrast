/** Simulated AI text operations + small helpers. */
import { CONTENT } from './content'
import type { Chapter, ParaKind } from './types'

const GENERIC_EXAMPLES = [
  'For example, start with one small change this week and notice what happens.',
  'For example, write down what you did today so next week is easier.',
]
const WARM_OPENERS = ['Here’s the good news: ', 'Don’t worry, ', 'Honestly, ']
const SIMPLER_WORDS: [string, string][] = [
  ['Fermentation', 'Rising'], ['fermentation', 'rising'], ['structure', 'shape'], ['temperatures', 'temps'],
  ['technique', 'skill'], ['deepens', 'improves'], ['pleasantly', 'nicely'], ['forgives', 'survives'], ['quietly building', 'building'],
]

export const PLACEHOLDER_PREFIX = '['
export const isPlaceholder = (p: string) => p.startsWith(PLACEHOLDER_PREFIX)

const sentences = (t: string) => (t.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [t]).map((s) => s.trim())

/** `variant` lets "Try another" produce a different result for the same request. */
export function transform(kind: ParaKind, text: string, chapter: Pick<Chapter, 'key'>, variant = 0): string {
  switch (kind) {
    case 'shorter': {
      const s = sentences(text)
      if (s.length > 1) return s.slice(0, variant % 2 === 0 ? Math.ceil(s.length / 2) : 1).join(' ')
      const i = text.search(/ — |, /)
      return i > 20 ? text.slice(0, i).trim() + '.' : text
    }
    case 'simpler': {
      let r = text
      SIMPLER_WORDS.forEach(([a, b]) => { r = r.split(a).join(b) })
      return sentences(r)
        .map((x) => (x.length > 105 ? x.split(/, | — /)[0].replace(/[.!?]?$/, '.') : x))
        .slice(0, variant % 2 ? 1 : 2)
        .join(' ')
    }
    case 'example': {
      const own = CONTENT[chapter.key]?.ex
      return `${text} ${own && variant === 0 ? own : GENERIC_EXAMPLES[variant % GENERIC_EXAMPLES.length]}`
    }
    case 'warmer': {
      const opener = WARM_OPENERS[variant % WARM_OPENERS.length]
      return opener + text.charAt(0).toLowerCase() + text.slice(1)
    }
  }
}

export function draftFor(chapter: Pick<Chapter, 'key' | 'title'>): string[] {
  const known = CONTENT[chapter.key]
  if (known) return [...known.paras]
  return [
    `This chapter covers ${chapter.title.toLowerCase()}: what it is, why it matters for a busy baker, and the simplest way to start.`,
    'As with everything in this book, the goal is a small habit that fits your week, not a project that takes over your weekend.',
  ]
}

export const pagesFor = (chapters: number) => chapters * 5 + 4

function luminance(hex: string) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
}
export function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
