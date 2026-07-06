import { motion } from 'framer-motion'
import { useId } from 'react'

export default function LogoMark({ className = '', style = {}, nameClassName = '' }) {
  const base = useId().replace(/[^a-z0-9]/gi, '')
  const tG  = `${base}tG`
  const cG  = `${base}cG`
  const lG  = `${base}lG`
  const shG = `${base}shG`
  const fB  = `${base}fB`
  const fW  = `${base}fW`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 510 310"
      className={className}
      style={{ overflow: 'hidden', ...style }}
    >
      <defs>
        <linearGradient id={tG} x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="55%"  stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#7f92a8" />
        </linearGradient>
        <linearGradient id={cG} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f4f4f5" />
          <stop offset="45%"  stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
        <linearGradient id={lG} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"   />
          <stop offset="15%"  stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#ffffff" stopOpacity="1"   />
          <stop offset="85%"  stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"   />
        </linearGradient>
        <linearGradient id={shG} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="white" stopOpacity="0"    />
          <stop offset="50%"  stopColor="white" stopOpacity="0.11" />
          <stop offset="100%" stopColor="white" stopOpacity="0"    />
        </linearGradient>
        <filter id={fB} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={fW} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ambient pulse behind C */}
      <motion.ellipse
        cx="318" cy="125" rx="115" ry="100"
        fill="rgba(255,255,255,0.08)"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.06, 0.95] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '318px 125px' }}
      />
      <ellipse cx="195" cy="125" rx="85" ry="72" fill="rgba(226,232,240,0.03)" />

      {/* T */}
      <text x="197" y="218" fontFamily="'Segoe UI', -apple-system, system-ui, sans-serif"
        fontSize="208" fontWeight="900" fill="rgba(0,0,0,0.45)" textAnchor="middle">T</text>
      <text x="195" y="216" fontFamily="'Segoe UI', -apple-system, system-ui, sans-serif"
        fontSize="208" fontWeight="900" fill={`url(#${tG})`} textAnchor="middle"
        filter={`url(#${fW})`}>T</text>

      {/* C */}
      <text x="320" y="218" fontFamily="'Segoe UI', -apple-system, system-ui, sans-serif"
        fontSize="208" fontWeight="900" fill="rgba(0,0,40,0.5)" textAnchor="middle">C</text>
      <text x="318" y="216" fontFamily="'Segoe UI', -apple-system, system-ui, sans-serif"
        fontSize="208" fontWeight="900" fill={`url(#${cG})`} textAnchor="middle"
        filter={`url(#${fB})`}>C</text>

      {/* Separator line */}
      <line x1="12" y1="250" x2="498" y2="250" stroke={`url(#${lG})`} strokeWidth="1.5" />

      {/* Center glow dot */}
      <motion.circle cx="255" cy="250" r="3" fill="#e4e4e7"
        initial={{ r: 2 }}
        animate={{ opacity: [0.3, 1, 0.3], r: [2, 4.5, 2] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      />

      {/* TOMER COHEN */}
      <g className={nameClassName}>
        <text x="255" y="290" fontFamily="'Segoe UI', -apple-system, system-ui, sans-serif"
          fontSize="27" fontWeight="700" textAnchor="middle" style={{ letterSpacing: '0.32em' }}>
          <tspan fill="white">TOMER </tspan>
          <tspan fill="#a1a1aa">COHEN</tspan>
        </text>
      </g>

      {/* Shimmer sweep */}
      <motion.rect x="-280" y="0" width="380" height="310"
        fill={`url(#${shG})`}
        animate={{ x: [-280, 840] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 4.8, ease: [0.4, 0, 0.6, 1] }}
      />
    </svg>
  )
}
