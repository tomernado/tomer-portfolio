import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * A premium digital energy floor — concentric curved "horizontal" arcs
 * plus radiating "vertical" spokes converging toward a single vanishing
 * point, with slow purple ripples pulsing outward from that point.
 * Pure SVG so it scales cleanly at any size; supportive background
 * texture only — thin lines, low opacity, violet/purple glow, no neon.
 */

const VIEW_W = 1000
const VIEW_H = 300
const VX = VIEW_W / 2   // vanishing point sits centered, just off the top edge
const VY = -30
const BOTTOM_Y = VIEW_H
const HALF_SPAN = 470

// Non-linear spacing — rings bunch up near the vanishing point, the way
// real perspective lines do, and spread out toward the viewer.
const RING_T = [0.18, 0.32, 0.48, 0.66, 0.84, 1]
const SPOKE_T = [-0.95, -0.68, -0.42, -0.18, 0, 0.18, 0.42, 0.68, 0.95]

function ringPath(t) {
  const y = VY + t * (BOTTOM_Y - VY)
  const w = t * HALF_SPAN
  const bow = 8 + t * 20
  return `M ${(VX - w).toFixed(1)} ${y.toFixed(1)} Q ${VX} ${(y - bow).toFixed(1)} ${(VX + w).toFixed(1)} ${y.toFixed(1)}`
}

const RINGS = RING_T.map((t, i) => ({ i, t, d: ringPath(t), blur: (1 - t) * 1.1 }))
const SPOKES = SPOKE_T.map((t) => ({ x2: VX + t * HALF_SPAN, y2: BOTTOM_Y }))

// A handful of fixed, varied paths for the occasional traveling light —
// staggered with long delays so at most one is ever visible at a time.
const TRAVELERS = [
  { path: ringPath(0.66), dur: 16, delay: 0 },
  { path: ringPath(0.84), dur: 19, delay: 9 },
  { path: `M ${VX} ${VY} L ${(VX + 0.42 * HALF_SPAN).toFixed(1)} ${BOTTOM_Y}`, dur: 15, delay: 5 },
]

// Ripple rings — slow "energy pulses" expanding outward from the same
// vanishing point the core sits above, so the floor reads as powered by
// it rather than an independent decoration. Several, staggered, so the
// floor always has a wave somewhere in flight rather than a single
// sweeping stripe.
const RIPPLES = [
  { delay: 0, dur: 10 },
  { delay: 2.5, dur: 10 },
  { delay: 5, dur: 10 },
  { delay: 7.5, dur: 10 },
]

export default function PerspectiveFloor({ className = '' }) {
  const reduceMotion = useReducedMotion()

  const rings = useMemo(() => RINGS, [])
  const spokes = useMemo(() => SPOKES, [])
  const travelers = useMemo(() => TRAVELERS, [])

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        maskImage: 'radial-gradient(ellipse 88% 92% at 50% 100%, black 22%, transparent 82%)',
        WebkitMaskImage: 'radial-gradient(ellipse 88% 92% at 50% 100%, black 22%, transparent 82%)',
      }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {spokes.map((s, i) => (
          <motion.line
            key={`spoke-${i}`}
            x1={VX} y1={VY} x2={s.x2} y2={s.y2}
            stroke="rgba(168,85,247,0.38)"
            strokeWidth="1"
            animate={reduceMotion ? { opacity: 0.28 } : { opacity: [0.14, 0.32, 0.14] }}
            transition={{ duration: 7.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
          />
        ))}

        {rings.map((r) => (
          <motion.path
            key={`ring-${r.i}`}
            d={r.d}
            fill="none"
            stroke="rgba(168,85,247,0.48)"
            strokeWidth="1"
            style={{ filter: r.blur > 0.15 ? `blur(${r.blur.toFixed(2)}px)` : undefined }}
            animate={reduceMotion ? { opacity: 0.24 } : { opacity: [0.12, 0.3, 0.12] }}
            transition={{ duration: 8 + r.i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: r.i * 0.5 }}
          />
        ))}

        {/* Ripples — expanding rings "pulsing" outward from the vanishing
            point beneath the core, tying the floor's energy back to it. */}
        {!reduceMotion && RIPPLES.map((r, i) => (
          <ellipse key={`ripple-${i}`} cx={VX} cy={VY} rx="4" ry="2" fill="none" stroke="rgba(196,181,253,0.5)" strokeWidth="1">
            <animate attributeName="rx" from="4" to={HALF_SPAN} dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="ry" from="2" to={HALF_SPAN * 0.3} dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
          </ellipse>
        ))}

        {!reduceMotion && travelers.map((t, i) => (
          <circle key={`traveler-${i}`} r="1.7" fill="rgba(216,180,254,0.9)">
            <animateMotion dur={`${t.dur}s`} repeatCount="indefinite" path={t.path} begin={`${t.delay}s`} />
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.05;0.5;0.95;1" dur={`${t.dur}s`} repeatCount="indefinite" begin={`${t.delay}s`} />
          </circle>
        ))}
      </svg>
    </div>
  )
}
