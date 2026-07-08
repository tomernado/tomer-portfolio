import { motion, useReducedMotion } from 'framer-motion'

/**
 * The energy field surrounding the Engineering Core — three
 * independent elliptical rings (different size/tilt/color/speed),
 * each slowly precessing on its own axis, each carrying a handful of
 * small light nodes that travel the ring at their own independent
 * pace, trailing a short comet-tail behind them. Deliberately
 * asymmetric (irregular node counts/angles, uneven spacing) so the
 * composition reads as organic rather than a neat geometric diagram.
 * Violet/purple-led palette. Self-contained; sized to match the
 * Engineering Core's existing 220px reference box via `size`.
 *
 * Composition note: each ring nests rotate(precession) → scaleY(squash)
 * → rotate(node angle) → translateX(radius). Because CSS transforms
 * compose inner-to-outer, a node's own fixed-radius point becomes a
 * clean ellipse once the ancestor scaleY is applied, and that whole
 * ellipse then precesses with the ring — so the ring line and every
 * node on it always agree on the same (slowly rotating) path.
 */

const RINGS = [
  {
    key: 'outer', inset: -95, tilt: 11, scaleY: 0.3, radius: 206,
    color: '196,181,253', lineAlpha: 0.15, glowAlpha: 0.2,
    precessDur: 150, precessReverse: false,
    breatheDur: 9, breatheDelay: 0,
    nodes: [
      { angle: 15, size: 3.2, dur: 34, reverse: false },
      { angle: 140, size: 2.6, dur: 42, reverse: false },
      { angle: 285, size: 3, dur: 38, reverse: true },
    ],
  },
  {
    key: 'mid', inset: -54, tilt: -14, scaleY: 0.4, radius: 163,
    color: '168,85,247', lineAlpha: 0.26, glowAlpha: 0.3,
    precessDur: 110, precessReverse: true,
    breatheDur: 7, breatheDelay: 1.5,
    nodes: [
      { angle: 50, size: 5, dur: 23, reverse: true },
      { angle: 160, size: 3.6, dur: 29, reverse: true },
      { angle: 320, size: 4.2, dur: 26, reverse: false },
    ],
  },
  {
    key: 'inner', inset: -19, tilt: 6, scaleY: 0.47, radius: 129,
    color: '216,180,254', lineAlpha: 0.32, glowAlpha: 0.36,
    precessDur: 80, precessReverse: false,
    breatheDur: 6, breatheDelay: 0.7,
    nodes: [
      { angle: 80, size: 4.6, dur: 16, reverse: false },
      { angle: 300, size: 3.2, dur: 20, reverse: true },
    ],
  },
]

function OrbitNode({ node, radius, color, reduceMotion }) {
  const haloSize = node.size * 2.6
  // Trail sits behind the direction of travel — a fixed angular offset in
  // the node's own (pre-rotation) space, so it always reads as trailing
  // regardless of which way this ring spins.
  const trailOffset = node.reverse ? 16 : -16

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ rotate: node.angle }}
      animate={reduceMotion ? { rotate: node.angle } : { rotate: node.reverse ? [node.angle, node.angle - 360] : [node.angle, node.angle + 360] }}
      transition={{ duration: node.dur, repeat: Infinity, ease: 'linear' }}
    >
      {/* Comet trail — a faint, elongated ghost sitting a few degrees
          behind the node on the same path. */}
      <span
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: node.size * 0.8, height: node.size * 0.8,
          marginLeft: -(node.size * 0.4), marginTop: -(node.size * 0.4),
          transform: `rotate(${trailOffset}deg) translateX(${radius}px)`,
          background: `rgba(${color},0.35)`,
          filter: 'blur(1.5px)',
        }}
      />
      {/* Soft bloom halo */}
      <span
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: haloSize, height: haloSize,
          marginLeft: -haloSize / 2, marginTop: -haloSize / 2,
          transform: `translateX(${radius}px)`,
          background: `radial-gradient(circle, rgba(${color},0.55) 0%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
      />
      {/* Bright core */}
      <span
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: node.size, height: node.size,
          marginLeft: -node.size / 2, marginTop: -node.size / 2,
          transform: `translateX(${radius}px)`,
          background: `rgb(${color})`,
          boxShadow: `0 0 8px 2px rgba(${color},0.7)`,
        }}
      />
    </motion.div>
  )
}

function Ring({ ring, reduceMotion }) {
  return (
    <div className="absolute rounded-full" style={{ inset: ring.inset }}>
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: ring.tilt }}
        animate={reduceMotion ? { rotate: ring.tilt } : { rotate: ring.precessReverse ? [ring.tilt, ring.tilt - 360] : [ring.tilt, ring.tilt + 360] }}
        transition={{ duration: ring.precessDur, repeat: Infinity, ease: 'linear' }}
      >
        {/* Squash — turns the circle (and everything nested inside) into this ring's ellipse. */}
        <div className="absolute inset-0" style={{ transform: `scaleY(${ring.scaleY})` }}>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid rgba(${ring.color},${ring.lineAlpha})`,
              filter: `drop-shadow(0 0 5px rgba(${ring.color},${ring.glowAlpha}))`,
            }}
            animate={reduceMotion ? { opacity: 0.85 } : { opacity: [0.65, 1, 0.65] }}
            transition={{ duration: ring.breatheDur, repeat: Infinity, ease: 'easeInOut', delay: ring.breatheDelay }}
          />
          {ring.nodes.map((node, i) => (
            <OrbitNode key={i} node={node} radius={ring.radius} color={ring.color} reduceMotion={reduceMotion} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function OrbitSystem({ className = 'absolute inset-0' }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className={className}>
      {RINGS.map((ring) => (
        <Ring key={ring.key} ring={ring} reduceMotion={reduceMotion} />
      ))}
    </div>
  )
}
