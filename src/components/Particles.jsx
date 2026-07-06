import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Slow-drifting ambient dots — pure decoration, GPU-only (transform + opacity).
 * Desktop only; inert under prefers-reduced-motion.
 */
export default function Particles({ count = 16, className = '' }) {
  const reduceMotion = useReducedMotion()

  const dots = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1.5 + Math.random() * 2,
    duration: 10 + Math.random() * 14,
    delay: Math.random() * 6,
    drift: 30 + Math.random() * 50,
  })), [count])

  if (reduceMotion) return null

  return (
    <div className={`hidden md:block absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white will-change-transform"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -d.drift, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
