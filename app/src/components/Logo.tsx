/** Folio mark: a tiny "Classic" cover in Rye & blush — double frame and rings, the same system the app uses for covers. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Folio">
      <rect x="6" y="2" width="28" height="36" rx="3" fill="#F2D6CF" />
      <rect x="6" y="2" width="3" height="36" rx="1.5" fill="#3B1F2B" opacity=".12" />
      <rect x="9.5" y="5" width="21.5" height="30" rx="1" fill="none" stroke="#3B1F2B" strokeWidth="1" opacity=".75" />
      <rect x="11" y="6.5" width="18.5" height="27" rx=".5" fill="none" stroke="#3B1F2B" strokeWidth=".5" opacity=".5" />
      <circle cx="20.25" cy="20" r="6.2" fill="none" stroke="#8C3B4A" strokeWidth="1.3" />
      <circle cx="20.25" cy="20" r="3.8" fill="none" stroke="#8C3B4A" strokeWidth="1.3" />
      <circle cx="20.25" cy="20" r="1.6" fill="#8C3B4A" />
    </svg>
  )
}
