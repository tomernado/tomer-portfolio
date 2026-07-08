import { useId } from 'react'

/**
 * Soft gradient "dissolve" at a section boundary — the same handoff
 * treatment Hero already uses into About, generalized so every section
 * seam gets the same quiet blend instead of a hard color cut. Sits
 * absolutely at the bottom of the section it's rendered in, fading from
 * transparent (revealing that section's own background) down to the
 * next section's color.
 *
 * Plain static gradient only — no animated threads. They read as visible
 * stripes when crossing a light→dark blend (their fixed color doesn't
 * track the gradient underneath), so the smooth blend alone is both the
 * cleaner look and the lighter one for mobile.
 *
 * Keep it out of any `overflow-hidden` ancestor of a `position: sticky`
 * element (see Web4You) — it doesn't need one itself since it's sized to
 * stay within the section's own box.
 */
export default function SectionDissolve({ toColor, height = 140 }) {
  const uid = useId().replace(/[^a-z0-9]/gi, '')
  const gradId = `dissolve${uid}`

  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      style={{ height }}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={toColor} stopOpacity="0" />
          <stop offset="70%" stopColor={toColor} stopOpacity="0.85" />
          <stop offset="100%" stopColor={toColor} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height={height} fill={`url(#${gradId})`} />
    </svg>
  )
}
