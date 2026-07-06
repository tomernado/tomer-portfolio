import { motion } from 'framer-motion'
import { revealUp, VIEWPORT } from '../motion'

/**
 * The "01 ─────── Background" row every section opens with. Pulled into one
 * component so the reveal timing, hairline draw, and index-numbering read
 * as a single system across About/Skills/Projects/Web4You/Contact instead
 * of five near-identical hand-rolled copies.
 */
export default function SectionMarker({ index, label, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealUp}
      className={`flex items-center gap-3 ${className}`}
    >
      <span className="font-mono text-white/45 text-xs flex-shrink-0">{index}</span>
      <motion.div
        className="h-px flex-1 bg-white/10 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      />
      <span className="font-mono text-white/50 text-xs tracking-[0.3em] uppercase flex-shrink-0">{label}</span>
    </motion.div>
  )
}
