import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import { Logo } from '../Logo'

const BASE = import.meta.env.BASE_URL

/** Shared layout for the documentation pages (#/process, #/system). */
export function DocShell({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <div className="doc">
      <nav className="doc-nav">
        <a className="doc-logo" href={BASE}><Logo size={34} />Folio</a>
        <div>
          <a href={`${BASE}#/process`} className={location.hash === '#/process' ? 'on' : ''}>Process & research</a>
          <a href={`${BASE}#/system`} className={location.hash === '#/system' ? 'on' : ''}>Design system</a>
          <a href="https://github.com/iborisbelov/contrast" target="_blank" rel="noreferrer">Code</a>
          <a className="btn primary sm" href={BASE}>Open the prototype <Icon name="arrow-up-right" /></a>
        </div>
      </nav>
      <header className="doc-head"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lead">{lead}</p></header>
      <main className="doc-body">{children}</main>
    </div>
  )
}
