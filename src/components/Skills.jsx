import { motion, useReducedMotion } from 'framer-motion'
import { skills } from '../data/content'
import SpotlightCard from './SpotlightCard'
import { ACCENT } from '../motion'

const TAB_FILES = {
  Languages: 'languages.ts',
  'Architecture & Security': 'architecture.ts',
  'Frontend & Backend': 'frontend.tsx',
  'Databases & Tools': 'database.sql',
}

const badgeItem = {
  hidden:  { opacity: 0, scale: 0.7, y: 8 },
  visible: { opacity: 1, scale: 1,   y: 0, transition: { duration: 0.32, ease: 'backOut' } },
}

function SkillCard({ group, wide = false }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className={wide ? 'sm:col-span-2' : ''}
    >
      <SpotlightCard
        className="overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 backdrop-blur-xl transition-colors duration-300 h-full"
        style={{ background: 'rgba(255,255,255,0.025)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/12" />
          <div className="ml-3 flex items-center gap-1.5 px-3 py-0.5 rounded-t-md text-[10px] font-mono border border-white/12" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-white/70">{TAB_FILES[group.category] ?? 'skills.ts'}</span>
          </div>
          <span className="ml-auto font-mono text-[9px] text-white/45 tracking-widest">{group.items.length} items</span>
        </div>

        <div className="p-5 sm:p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-white/45 text-xs">{'// '}</span>
            <span className="font-mono text-xs font-semibold tracking-wider text-white/70">{group.category}</span>
            <motion.span
              className="ml-auto w-1.5 h-1.5 rounded-full"
              style={{ background: ACCENT.css }}
              animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="absolute bottom-0 left-5 right-5 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }} />

          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
          >
            {group.items.map((item) => (
              <motion.span
                key={item}
                variants={badgeItem}
                whileHover={{ scale: 1.06, y: -2, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.09)' }}
                whileTap={{ scale: 0.94 }}
                className="px-3 py-1.5 rounded-lg border border-white/12 bg-white/[0.03] text-white/75 text-[11px] font-mono font-semibold tracking-wide cursor-default select-none transition-colors duration-150"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

export default function Skills() {
  const [primary, ...rest] = skills

  return (
    <section id="skills" className="py-28 sm:py-36 px-5 relative overflow-hidden" dir="ltr">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 35% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative">

        {/* Section marker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="font-mono text-white/45 text-xs">02</span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-white/50 text-xs tracking-[0.3em] uppercase">Skills</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display font-bold text-white tracking-tight leading-[1.05] mb-16"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
        >
          Tools I reach for,<br />technologies I trust.
        </motion.h2>

        {/* Bento: primary category full-width, rest in a 3-up row */}
        <div className="flex flex-col gap-6">
          <SkillCard group={primary} wide />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {rest.map((group) => (
              <SkillCard key={group.category} group={group} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
