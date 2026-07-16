import { useId } from 'react'

/**
 * Soft gradient dissolve at a section boundary. Sits absolutely at the
 * bottom of the section it's placed in, fading to the next section's color.
 *
 * `accentColor` (optional): adds a soft radial glow at the base of the fade
 * zone — useful on light→dark seams to hint at the dark section's ambient
 * light bleeding upward, making the transition feel like one continuous
 * environment rather than two stacked blocks.
 *
 * Keep out of any `overflow-hidden` ancestor of `position: sticky` elements
 * (see Web4You) — SectionDissolve doesn't need clipping itself.
 */
export default function SectionDissolve({ toColor, height = 160, accentColor }) {
  const uid = useId().replace(/[^a-z0-9]/gi, '')
  const gradId  = `dissolve${uid}`
  const glowId  = `glow${uid}`

  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      style={{ height }}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* S-curve: slow start, accelerates through the middle, full
            coverage by the last 15% — avoids the abrupt "wall" of a
            simple linear gradient. */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={toColor} stopOpacity="0"    />
          <stop offset="35%"  stopColor={toColor} stopOpacity="0.12" />
          <stop offset="62%"  stopColor={toColor} stopOpacity="0.55" />
          <stop offset="82%"  stopColor={toColor} stopOpacity="0.88" />
          <stop offset="100%" stopColor={toColor} stopOpacity="1"    />
        </linearGradient>

        {accentColor && (
          /* Radial glow centred at the bottom edge — the "ambient light
             from the next section seeping through the seam". */
          <radialGradient id={glowId} cx="50%" cy="100%" r="65%" fx="50%" fy="100%">
            <stop offset="0%"   stopColor={accentColor} stopOpacity="1"   />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0"   />
          </radialGradient>
        )}
      </defs>

      {accentColor && (
        <rect x="0" y="0" width="1000" height={height} fill={`url(#${glowId})`} />
      )}
      <rect x="0" y="0" width="1000" height={height} fill={`url(#${gradId})`} />
    </svg>
  )
}
