/**
 * Client for the Folio AI proxy (Groq behind a tiny PHP endpoint on the same domain).
 * The browser never sees the API key. Every call has a timeout, and every caller has an
 * offline fallback, so a failed request degrades the experience instead of breaking it.
 */
const ENDPOINT = `${import.meta.env.BASE_URL}api/ai.php`

export interface Brief {
  topic: string
  vague: boolean
  options?: string[]
  audiences: { t: string; d: string }[]
  tones: { t: string; sample: string }[]
}
export interface Plan {
  titles: { t: string; s: string }[]
  chapters: string[]
  cover: { motif: string; palette: number; font: string }
  topic: string
  suggestions: string[]
}
export interface BriefPayload { idea: string; audience?: string; tone?: string; story?: string }

export async function ai<T>(task: 'brief' | 'plan' | 'chapter' | 'rewrite', payload: object, timeoutMs = 35000): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task, payload }), signal: ctrl.signal })
    if (!res.ok) throw new Error(`ai ${task} ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}
