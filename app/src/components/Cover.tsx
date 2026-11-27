/**
 * Theme-driven cover generator. The book's topic picks the motif, the palette
 * and type pairing set the mood, and four composition archetypes give real
 * variety (not a template with the title swapped in).
 */
import type { ReactNode } from 'react'
import { FONTS, PALETTES, type Palette } from '../lib/content'
import type { Book, CoverSpec, Motif } from '../lib/types'

type Stage = 'empty' | 'sketch' | 'final'
const SKETCH = '#B9B0A2'

function wrap(text: string, max: number) {
  const out: string[] = []
  let cur = ''
  for (const w of text.split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w } else cur = cur ? `${cur} ${w}` : w
  }
  if (cur) out.push(cur)
  return out.slice(0, 4)
}

function MotifShape({ kind, cx, cy, r, p, sketch = false }: { kind: Motif; cx: number; cy: number; r: number; p: Pick<Palette, 'motif' | 'score'>; sketch?: boolean }) {
  if (kind === 'none') return null
  const dash = sketch ? '5 7' : undefined
  const fill = sketch ? 'none' : p.motif
  const stroke = sketch ? SKETCH : 'none'
  if (kind === 'wheat') {
    return (
      <g>
        <line x1={cx} y1={cy + r} x2={cx} y2={cy - r * 0.9} stroke={sketch ? SKETCH : p.motif} strokeWidth={Math.max(2, r * 0.05)} strokeLinecap="round" strokeDasharray={dash} />
        {[0, 1, 2, 3, 4].map((i) => {
          const y = cy - r * 0.75 + i * r * 0.3
          return [-1, 1].map((side) => (
            <ellipse key={`${i}${side}`} cx={cx + side * r * 0.16} cy={y} rx={r * 0.12} ry={r * 0.26} fill={fill} stroke={stroke} strokeDasharray={dash}
              transform={`rotate(${side * 30} ${cx + side * r * 0.16} ${y})`} />
          ))
        })}
      </g>
    )
  }
  const lineW = Math.max(2, r * 0.09)
  const line = sketch ? SKETCH : p.motif
  if (kind === 'leaf') return (
    <g>
      <path d={`M${cx} ${cy - r} Q${cx + r * 0.95} ${cy} ${cx} ${cy + r} Q${cx - r * 0.95} ${cy} ${cx} ${cy - r}Z`} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />
      <path d={`M${cx} ${cy - r * 0.8} L${cx} ${cy + r * 0.85}`} stroke={sketch ? SKETCH : p.score} strokeWidth={Math.max(2, r * 0.04)} strokeDasharray={dash} />
      {[-0.4, 0, 0.4].map((k) => <path key={k} d={`M${cx} ${cy + k * r} L${cx + r * 0.38} ${cy + (k - 0.28) * r} M${cx} ${cy + (k + 0.15) * r} L${cx - r * 0.38} ${cy + (k - 0.13) * r}`} stroke={sketch ? SKETCH : p.score} strokeWidth={Math.max(1.5, r * 0.03)} strokeDasharray={dash} />)}
    </g>
  )
  if (kind === 'wave') return (
    <g fill="none" stroke={line} strokeWidth={lineW} strokeLinecap="round" strokeDasharray={dash}>
      {[-0.45, 0, 0.45].map((k) => <path key={k} d={`M${cx - r} ${cy + k * r} Q${cx - r / 2} ${cy + (k - 0.28) * r} ${cx} ${cy + k * r} T${cx + r} ${cy + k * r}`} />)}
    </g>
  )
  if (kind === 'sun') return (
    <g>
      <circle cx={cx} cy={cy} r={r * 0.5} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={cx + Math.cos(a) * r * 0.66} y1={cy + Math.sin(a) * r * 0.66} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={line} strokeWidth={lineW * 0.7} strokeLinecap="round" strokeDasharray={dash} /> })}
    </g>
  )
  if (kind === 'peak') return (
    <g strokeDasharray={dash}>
      <polygon points={`${cx - r * 0.3},${cy + r * 0.7} ${cx + r * 0.35},${cy - r * 0.35} ${cx + r},${cy + r * 0.7}`} fill={fill} stroke={stroke} strokeWidth={2} opacity={sketch ? 1 : 0.55} />
      <polygon points={`${cx - r},${cy + r * 0.7} ${cx - r * 0.25},${cy - r * 0.75} ${cx + r * 0.5},${cy + r * 0.7}`} fill={fill} stroke={stroke} strokeWidth={2} />
    </g>
  )
  if (kind === 'star') {
    const pts = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 - Math.PI / 2; const rr = i % 2 ? r * 0.42 : r; return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}` }).join(' ')
    return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />
  }
  if (kind === 'circle') return (
    <g fill="none" stroke={line} strokeWidth={lineW * 0.6} strokeDasharray={dash}>{[1, 0.72, 0.44].map((k) => <circle key={k} cx={cx} cy={cy} r={r * k} />)}<circle cx={cx} cy={cy} r={r * 0.16} fill={sketch ? 'none' : p.motif} /></g>
  )
  const sw = Math.max(2, r * 0.066)
  const score = (dy: number, w: number) => (
    <path d={`M${cx - w * r} ${cy + dy * r} Q${cx} ${cy + (dy - 0.3) * r} ${cx + w * r} ${cy + dy * r}`}
      stroke={sketch ? SKETCH : p.score} strokeWidth={sw} fill="none" strokeLinecap="round" strokeDasharray={dash} />
  )
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray={dash} />
      {score(-0.3, 0.55)}{score(0, 0.66)}{score(0.3, 0.55)}
    </g>
  )
}

export function Cover({ book, stage = 'final', override }: { book: Book; stage?: Stage; override?: Partial<CoverSpec> }) {
  if (stage === 'empty') {
    return (
      <svg viewBox="0 0 300 450" className="cover-svg" role="img" aria-label="Empty cover">
        <rect width="300" height="450" fill="#F7F4EE" />
        <rect x="14" y="14" width="272" height="422" rx="3" fill="none" stroke="#D8D1C4" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="150" y="222" textAnchor="middle" fontFamily="Gilda Display" fontSize="20" fill="#A39E94">Your book</text>
        <text x="150" y="246" textAnchor="middle" fontFamily="Manrope" fontSize="11.5" fill="#B5AFA4">takes shape as you describe it</text>
      </svg>
    )
  }
  const c = { ...book.cover, ...override }
  const author = book.author.toUpperCase()

  if (stage === 'sketch') {
    return (
      <svg viewBox="0 0 300 450" className="cover-svg" role="img" aria-label="Cover sketch">
        <rect width="300" height="450" fill="#F3EFE8" />
        <rect x="26" y="50" width="190" height="22" rx="4" fill="#E1DACE" />
        <rect x="26" y="84" width="130" height="22" rx="4" fill="#E1DACE" />
        <MotifShape kind={c.motif === 'none' ? 'loaf' : c.motif} cx={150} cy={318} r={88} p={{ motif: SKETCH, score: SKETCH }} sketch />
        <text x="26" y="432" fontFamily="Manrope" fontSize="10" letterSpacing="2" fill="#A79F92">{author}</text>
      </svg>
    )
  }

  const p = PALETTES[c.pal]
  const f = FONTS[c.font]
  const title = book.title || 'Untitled'
  const sub = book.subtitle
  const T = (txt: string, x: number, y: number, size: number, anchor: 'start' | 'middle' = 'start', ls?: number) => (
    <text key={`t${y}${txt}`} x={x} y={y} textAnchor={anchor} fontFamily={f.fam} fontWeight={f.w} fontSize={size} fill={p.ink} letterSpacing={ls}>{txt}</text>
  )
  const U = (txt: string, x: number, y: number, size: number, anchor: 'start' | 'middle' = 'start', opacity = 0.82, ls = 0) => (
    <text x={x} y={y} textAnchor={anchor} fontFamily="Manrope" fontSize={size} fill={p.ink} opacity={opacity} letterSpacing={ls}>{txt}</text>
  )

  let art: ReactNode
  if (c.layout === 'object') {
    const L = wrap(title, 12)
    art = <>{L.map((l, i) => T(l, 26, 76 + i * 38, 33))}{U(sub, 26, 76 + Math.max(L.length, 2) * 38 - 6, 12)}<MotifShape kind={c.motif} cx={150} cy={326} r={86} p={p} />{U(author, 26, 432, 10, 'start', 0.85, 2)}</>
  } else if (c.layout === 'type') {
    const L = wrap(title, 9)
    const y = 104 + (L.length - 1) * 50 + 28
    art = <>{L.map((l, i) => T(l, 22, 104 + i * 50, 48, 'start', -1))}<rect x="24" y={y} width="60" height="3" fill={p.motif} />{U(sub, 24, y + 26, 12)}<MotifShape kind={c.motif} cx={244} cy={378} r={32} p={p} />{U(author, 24, 432, 10, 'start', 0.85, 2)}</>
  } else if (c.layout === 'pattern') {
    const L = wrap(title, 14)
    const top = 190 - (L.length - 1) * 16
    const tiles: ReactNode[] = []
    if (c.motif !== 'none') for (let r = 0; r < 9; r++) for (let col = 0; col < 6; col++) {
      tiles.push(<g key={`${r}-${col}`} opacity={0.28}><MotifShape kind={c.motif} cx={25 + col * 50 + (r % 2 ? 25 : 0)} cy={25 + r * 50} r={15} p={p} /></g>)
    }
    art = <>{tiles}<rect x="34" y="130" width="232" height="200" fill={p.panel} />{L.map((l, i) => T(l, 150, top + i * 33, 28, 'middle'))}{U(sub, 150, top + L.length * 33 + 4, 11, 'middle')}{U(author, 150, 310, 10, 'middle', 0.75, 2)}</>
  } else {
    const L = wrap(title, 13)
    art = <>
      <rect x="16" y="16" width="268" height="418" fill="none" stroke={p.ink} strokeWidth="1.5" opacity=".7" />
      <rect x="22" y="22" width="256" height="406" fill="none" stroke={p.ink} strokeWidth=".6" opacity=".5" />
      {L.map((l, i) => T(l, 150, 104 + i * 37, 31, 'middle'))}{U(sub, 150, 104 + L.length * 37 + 2, 11.5, 'middle')}
      <MotifShape kind={c.motif} cx={150} cy={300} r={50} p={p} />{U(author, 150, 404, 10, 'middle', 0.85, 3)}
    </>
  }

  return (
    <svg viewBox="0 0 300 450" className="cover-svg" role="img" aria-label={`Cover: ${title}`}>
      <rect width="300" height="450" fill={p.bg} />
      {art}
    </svg>
  )
}
