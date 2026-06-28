import { motion } from 'framer-motion'
import { skills } from '../data/content'

/* ─── Theme per category ──────────────────────────────────────────── */
const THEMES = {
  Languages: {
    accent: '#3b82f6',
    accentMuted: 'rgba(59,130,246,0.14)',
    accentBorder: 'rgba(59,130,246,0.32)',
    badge: 'bg-blue-500/[0.08] text-blue-200 border-blue-500/20 hover:bg-blue-500/[0.18] hover:border-blue-400/40',
    badgeGlow: '0 0 16px rgba(59,130,246,0.55)',
    cardGlow: 'rgba(59,130,246,0.12)',
    tabFile: 'languages.ts',
    dot: 'bg-blue-400',
    headerText: 'text-blue-400',
    scanLine: 'from-blue-500/0 via-blue-500/25 to-blue-500/0',
    sectionGlow: 'rgba(59,130,246,0.07)',
  },
  'Architecture & Security': {
    accent: '#8b5cf6',
    accentMuted: 'rgba(139,92,246,0.14)',
    accentBorder: 'rgba(139,92,246,0.32)',
    badge: 'bg-violet-500/[0.08] text-violet-200 border-violet-500/20 hover:bg-violet-500/[0.18] hover:border-violet-400/40',
    badgeGlow: '0 0 16px rgba(139,92,246,0.55)',
    cardGlow: 'rgba(139,92,246,0.12)',
    tabFile: 'architecture.ts',
    dot: 'bg-violet-400',
    headerText: 'text-violet-400',
    scanLine: 'from-violet-500/0 via-violet-500/25 to-violet-500/0',
    sectionGlow: 'rgba(139,92,246,0.07)',
  },
  'Frontend & Backend': {
    accent: '#06b6d4',
    accentMuted: 'rgba(6,182,212,0.14)',
    accentBorder: 'rgba(6,182,212,0.32)',
    badge: 'bg-cyan-500/[0.08] text-cyan-200 border-cyan-500/20 hover:bg-cyan-500/[0.18] hover:border-cyan-400/40',
    badgeGlow: '0 0 16px rgba(6,182,212,0.55)',
    cardGlow: 'rgba(6,182,212,0.12)',
    tabFile: 'frontend.tsx',
    dot: 'bg-cyan-400',
    headerText: 'text-cyan-400',
    scanLine: 'from-cyan-500/0 via-cyan-500/25 to-cyan-500/0',
    sectionGlow: 'rgba(6,182,212,0.07)',
  },
  'Databases & Tools': {
    accent: '#10b981',
    accentMuted: 'rgba(16,185,129,0.14)',
    accentBorder: 'rgba(16,185,129,0.32)',
    badge: 'bg-emerald-500/[0.08] text-emerald-200 border-emerald-500/20 hover:bg-emerald-500/[0.18] hover:border-emerald-400/40',
    badgeGlow: '0 0 16px rgba(16,185,129,0.55)',
    cardGlow: 'rgba(16,185,129,0.12)',
    tabFile: 'database.sql',
    dot: 'bg-emerald-400',
    headerText: 'text-emerald-400',
    scanLine: 'from-emerald-500/0 via-emerald-500/25 to-emerald-500/0',
    sectionGlow: 'rgba(16,185,129,0.07)',
  },
}

const FLOATS = [
  { y: [0, -11, 3, -8, 2, -10, 0], rotate: [0,  0.5, -0.3, 0.4, -0.2, 0], dur: 7.2, delay: 0   },
  { y: [0,  -8, 4, -13, 1, -7,  0], rotate: [0, -0.4,  0.6,-0.3,  0.5, 0], dur: 8.8, delay: 1.1 },
  { y: [0, -14, 2, -9,  4, -12, 0], rotate: [0,  0.3, -0.5, 0.2, -0.4, 0], dur: 6.5, delay: 0.5 },
  { y: [0,  -9, 5, -11, 2, -8,  0], rotate: [0, -0.3,  0.4,-0.5,  0.3, 0], dur: 9.0, delay: 1.8 },
]

const badgeItem = {
  hidden:  { opacity: 0, scale: 0.7, y: 8 },
  visible: { opacity: 1, scale: 1,   y: 0, transition: { duration: 0.32, ease: 'backOut' } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-5 relative overflow-hidden" dir="ltr">

      {/* Subtle ambient glow — matches section vibe without a grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 35% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="max-w-5xl mx-auto relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: '-50px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
      >
        {/* ── Heading ── */}
        <motion.div
          className="mb-16"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
        >
          <p className="font-display text-indigo-400 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
            Technical Expertise
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">Skills</h2>
          <motion.div
            className="h-[3px] rounded-full mt-4 origin-left"
            style={{ width: 56, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((group, idx) => {
            const theme = THEMES[group.category] ?? THEMES['Languages']
            const float = FLOATS[idx] ?? FLOATS[0]

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 55, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Float wrapper */}
                <motion.div
                  animate={{ y: float.y, rotate: float.rotate }}
                  transition={{
                    repeat: Infinity, repeatType: 'mirror',
                    duration: float.dur, ease: 'easeInOut', delay: float.delay,
                  }}
                  style={{ willChange: 'transform' }}
                >
                  {/* Card */}
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: `0 0 60px ${theme.cardGlow}, 0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`,
                    }}
                    transition={{ duration: 0.22 }}
                    className="relative overflow-hidden rounded-2xl border backdrop-blur-xl"
                    style={{
                      background: 'rgba(10,15,30,0.75)',
                      borderColor: theme.accentBorder.replace('0.32', '0.18'),
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                    }}
                  >
                    {/* Top shimmer */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${theme.accentBorder}, transparent)` }}
                    />

                    {/* ── Tab bar ── */}
                    <div
                      className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: theme.accentBorder.replace('0.32', '0.1'),
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />

                      <div
                        className="ml-3 flex items-center gap-1.5 px-3 py-0.5 rounded-t-md text-[10px] font-mono"
                        style={{
                          background: theme.accentMuted,
                          borderTop: `1px solid ${theme.accentBorder}`,
                          borderLeft: `1px solid ${theme.accentBorder}`,
                          borderRight: `1px solid ${theme.accentBorder}`,
                        }}
                      >
                        <span className={`${theme.dot} w-1.5 h-1.5 rounded-full`} />
                        <span className={theme.headerText}>{theme.tabFile}</span>
                      </div>

                      <span className="ml-auto font-mono text-[9px] text-slate-600 tracking-widest">
                        {group.items.length} items
                      </span>
                    </div>

                    {/* ── Body ── */}
                    <div className="p-5 relative">
                      {/* Scan-line */}
                      <motion.div
                        className={`absolute left-0 right-0 h-px bg-gradient-to-r ${theme.scanLine} opacity-50`}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: float.dur * 0.9, repeat: Infinity, ease: 'linear', delay: float.delay }}
                        style={{ pointerEvents: 'none', willChange: 'top' }}
                      />

                      {/* Category label */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-mono text-slate-600 text-xs">{'// '}</span>
                        <span className={`font-mono text-xs font-semibold tracking-wider ${theme.headerText}`}>
                          {group.category}
                        </span>
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          animate={{ opacity: [1, 0.25, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.35 }}
                          style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }}
                        />
                      </div>

                      {/* Bottom accent */}
                      <div
                        className="absolute bottom-0 left-5 right-5 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${theme.accentBorder}, transparent)` }}
                      />

                      {/* Badges */}
                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
                      >
                        {group.items.map((item) => (
                          <motion.span
                            key={item}
                            variants={badgeItem}
                            whileHover={{ scale: 1.08, y: -2, boxShadow: theme.badgeGlow }}
                            whileTap={{ scale: 0.93 }}
                            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-semibold tracking-wide cursor-default select-none transition-colors duration-150 ${theme.badge}`}
                          >
                            {item}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
