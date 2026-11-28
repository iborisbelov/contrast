/** Folio mark: a wine tile with a blush open book (Rye & blush cover palette). */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Folio">
      <rect width="40" height="40" rx="11" fill="#8C3B4A" />
      <g transform="translate(8 8)" fill="none" stroke="#F2D6CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </g>
    </svg>
  )
}

/** Mark + wordmark (Bricolage Grotesque). */
export function LogoLockup({ size = 34 }: { size?: number }) {
  return <span className="lockup"><Logo size={size} /><span className="wordmark">Folio</span></span>
}
