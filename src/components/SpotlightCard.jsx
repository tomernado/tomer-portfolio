import { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion'

/**
 * Wraps children in a relative container with a soft radial light that
 * tracks the cursor — the "premium card" micro-interaction seen on
 * Linear/Stripe/Vercel. Inert under prefers-reduced-motion.
 */
export default function SpotlightCard({ as: Tag = 'div', children, className = '', radius = 260, ...props }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(-radius)
  const y = useMotionValue(-radius)

  const onMouseMove = (e) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 75%)`

  return (
    <Tag ref={ref} onMouseMove={onMouseMove} className={`group relative ${className}`} {...props}>
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{ background }}
        />
      )}
      {children}
    </Tag>
  )
}
