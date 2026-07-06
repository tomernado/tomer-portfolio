import { useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Magnetic-pull effect: the element eases toward the cursor while hovered,
 * within `strength` of its own movement, then springs back on leave.
 * Inert (no-op) for touch (no mousemove) and for prefers-reduced-motion.
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 22, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 300, damping: 22, mass: 0.5 })

  const onMouseMove = (e) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const onMouseLeave = () => { x.set(0); y.set(0) }

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave }
}
