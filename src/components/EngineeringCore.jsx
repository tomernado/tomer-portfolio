import { motion, useReducedMotion } from 'framer-motion'

/**
 * The Hero's visual centerpiece — a living AI energy source, not a
 * glossy 3D sphere. Everything here is built to read as light being
 * EMITTED (screen-blended glows, rays, arcs, drifting sparks) rather
 * than light being REFLECTED off a surface. Purple/violet-led palette
 * with only a faint cyan sliver kept as a secondary accent. Every layer
 * animates on its own independent timer so nothing pulses in lockstep.
 */

const CORE = '168,85,247'    // purple-500 — the dominant hue
const CORE_SOFT = '196,181,253' // violet-300 — lighter wash
const CORE_BRIGHT = '216,180,254' // fuchsia-200-ish — hottest highlights
const RIM_BLUE = '103,232,249'  // cyan-300 — kept faint, secondary only

const ARCS = [
  { d: 'M 30 62 Q 45 48 38 30 Q 33 18 48 12', dur: 6.5, delay: 0 },
  { d: 'M 150 40 Q 138 55 148 68 Q 155 78 142 88', dur: 7.5, delay: 3.2 },
]

const SPARKS = [
  { angle: 20, radius: 0.56, size: 2.2, dur: 9, delay: 0 },
  { angle: 140, radius: 0.6, size: 1.8, dur: 11, delay: 2 },
  { angle: 250, radius: 0.58, size: 2, dur: 10, delay: 4.5 },
  { angle: 320, radius: 0.62, size: 1.6, dur: 8, delay: 1 },
]

// compact=true: skips the outermost heavy blur layers (corona, rays, sparks)
// and makes the remaining bloom layers static. Used on mobile where the full
// set of animated filter:blur() divs is too expensive to composite.
export default function EngineeringCore({ size = 188, className = 'relative', compact = false }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={className} style={{ width: size, height: size }}>
      {/* Widest, softest ambient corona — sells "light source" before the
          eye even reaches the shell. Skipped in compact mode (largest blur,
          most expensive layer on mobile). */}
      {!compact && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -size * 0.42,
            background: `radial-gradient(circle, rgba(${CORE},0.11) 0%, transparent 70%)`,
            filter: `blur(${(size * 0.24).toFixed(1)}px)`,
          }}
          animate={reduceMotion ? {} : { scale: [1, 1.07, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* Outer bloom — animated on desktop, static in compact/mobile mode */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.3,
          background: `radial-gradient(circle, rgba(${CORE},0.24) 0%, transparent 68%)`,
          filter: `blur(${(size * 0.17).toFixed(1)}px)`,
          ...(compact ? { opacity: 0.55 } : {}),
        }}
        animate={(!compact && !reduceMotion) ? { scale: [1, 1.11, 1], opacity: [0.55, 0.8, 0.55] } : {}}
        transition={(!compact && !reduceMotion) ? { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.2,
          background: `radial-gradient(circle, rgba(${CORE_SOFT},0.17) 0%, transparent 70%)`,
          filter: `blur(${(size * 0.13).toFixed(1)}px)`,
          ...(compact ? { opacity: 0.5 } : {}),
        }}
        animate={(!compact && !reduceMotion) ? { scale: [1.06, 1, 1.06], opacity: [0.4, 0.65, 0.4] } : {}}
        transition={(!compact && !reduceMotion) ? { duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 } : {}}
      />

      {/* Light rays — desktop only, skipped in compact mode */}
      {!compact && !reduceMotion && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -size * 0.3,
            background: `conic-gradient(from 0deg,
              transparent 0deg, rgba(${CORE_SOFT},0.14) 4deg, transparent 14deg,
              transparent 70deg, rgba(${CORE_SOFT},0.1) 74deg, transparent 84deg,
              transparent 160deg, rgba(${CORE_SOFT},0.16) 165deg, transparent 176deg,
              transparent 240deg, rgba(${CORE_SOFT},0.1) 244deg, transparent 254deg,
              transparent 300deg, rgba(${CORE_SOFT},0.13) 305deg, transparent 316deg)`,
            filter: `blur(${(size * 0.02).toFixed(1)}px)`,
            mixBlendMode: 'screen',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 130, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Outer shell — fixed anchor: border + volumetric inset shadow for depth */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          border: `1px solid rgba(${CORE_SOFT},0.36)`,
          boxShadow: `inset -16px -12px 30px rgba(0,0,0,0.55), inset 10px 10px 22px rgba(${CORE_SOFT},0.12), 0 0 44px rgba(${CORE},0.3)`,
        }}
      >
        {/* Very slow continuous rotation of the shell's own shading + rim light */}
        <motion.div
          className="absolute inset-0"
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
        >
          {/* Base volumetric shading — deep-space glass, not a lit rock */}
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 35% 30%, rgba(${CORE_SOFT},0.34) 0%, rgba(88,28,135,0.82) 46%, rgba(9,6,16,0.98) 85%)` }}
          />
          {/* Rim light — a faint cyan sliver kept only as a secondary accent,
              opposite the ambient sheen. */}
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 80% 76%, rgba(${RIM_BLUE},0.16), transparent 45%)`, mixBlendMode: 'screen' }}
          />
          {/* Soft ambient sheen — a wide, faint wash rather than a hard
              glossy highlight, so the surface reads as energy-lit, not
              plastic. */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 46% 30% at 28% 24%, rgba(255,255,255,0.2), transparent 72%)',
              mixBlendMode: 'screen',
              filter: 'blur(4px)',
            }}
          />
        </motion.div>

        {/* Inner energy glow — reads as light existing inside the core, with a
            gentle non-uniform breathing so it feels like fluctuating energy
            rather than a mechanical pulse. */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: '26%',
            background: `radial-gradient(circle, rgba(${CORE_BRIGHT},0.9) 0%, rgba(${CORE},0.45) 45%, transparent 75%)`,
            filter: `blur(${(size * 0.05).toFixed(1)}px)`,
            mixBlendMode: 'screen',
          }}
          animate={reduceMotion ? {} : { opacity: [0.75, 0.95, 0.8, 1, 0.75], scale: [1, 1.05, 1.02, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* A small bright energy point drifting slowly inside the core —
            distinct from the inner glow's breathing and the shell's own
            rotation, so something always reads as genuinely moving within
            the light source rather than just pulsing in place. */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.22, height: size * 0.22,
            left: '38%', top: '34%',
            background: `radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(${CORE_SOFT},0.4) 55%, transparent 75%)`,
            filter: `blur(${(size * 0.04).toFixed(1)}px)`,
            mixBlendMode: 'screen',
          }}
          animate={reduceMotion ? {} : { x: [0, size * 0.09, -size * 0.05, 0], y: [0, -size * 0.06, size * 0.08, 0], opacity: [0.5, 0.85, 0.6, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Electric arcs — thin jagged filaments that flicker across the
            surface irregularly, like static discharge, never constant. */}
        {!reduceMotion && (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 188 188" aria-hidden="true">
            {ARCS.map((arc, i) => (
              <motion.path
                key={i}
                d={arc.d}
                fill="none"
                stroke={`rgba(${CORE_BRIGHT},0.8)`}
                strokeWidth="0.8"
                strokeLinecap="round"
                style={{ filter: 'blur(0.3px)', mixBlendMode: 'screen' }}
                animate={{ opacity: [0, 0, 0.9, 0.2, 0.7, 0, 0] }}
                transition={{ duration: arc.dur, repeat: Infinity, ease: 'easeInOut', delay: arc.delay, times: [0, 0.55, 0.6, 0.66, 0.7, 0.78, 1] }}
              />
            ))}
          </svg>
        )}

        {/* Moving internal highlight — an independently-timed sweep, distinct
            from the shell's own slow rotation, for a subtle parallax of light. */}
        <motion.div
          className="absolute inset-0"
          style={{ background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.15) 5%, transparent 18%, transparent 100%)` }}
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating sparks — skipped in compact mode to reduce concurrent
            animations on mobile; desktop keeps all four. */}
        {!compact && !reduceMotion && SPARKS.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180
          const cx = 50 + Math.cos(rad) * s.radius * 50
          const cy = 50 + Math.sin(rad) * s.radius * 50
          return (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: s.size, height: s.size,
                left: `${cx}%`, top: `${cy}%`,
                background: `rgba(${CORE_BRIGHT},0.95)`,
                boxShadow: `0 0 6px 1.5px rgba(${CORE_BRIGHT},0.8)`,
                mixBlendMode: 'screen',
              }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1, 0.6] }}
              transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
            />
          )
        })}
      </div>
    </div>
  )
}
