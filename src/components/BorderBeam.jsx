import { motion, useReducedMotion } from 'framer-motion'
import { ACCENT } from '../motion'

/**
 * Wraps children with a thin, slowly rotating gradient border — the
 * "signature" micro-interaction for the single most prominent card on the
 * page rather than something scattered everywhere. Built with the classic
 * padding-trick: a 1px inset reveals a rotating conic-gradient underneath.
 */
export default function BorderBeam({ children, className = '', rounded = 'rounded-3xl', duration = 8 }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={`relative ${rounded} ${className}`} style={{ padding: 1 }}>
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className={`absolute inset-0 ${rounded}`}
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, rgba(${ACCENT.rgb},0.9) 8%, transparent 20%, transparent 50%, rgba(${ACCENT.rgb2},0.7) 58%, transparent 70%)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {reduceMotion && (
        <div aria-hidden="true" className={`absolute inset-0 ${rounded} bg-white/10`} />
      )}
      <div className={`relative ${rounded} bg-ink-950 overflow-hidden h-full`}>
        {children}
      </div>
    </div>
  )
}
