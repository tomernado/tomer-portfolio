import { motion } from 'framer-motion'
import { skills } from '../data/content'

/* ─── Theme per category ──────────────────────────────────────────── */
const THEMES = {
  Languages: {
    accent: '#3b82f6',
    accentMuted: 'rgba(59,130,246,0.18)',
    accentBorder: 'rgba(59,130,246,0.35)',
    badge: 'bg-blue-500/10 text-blue-200 border-blue-500/25 hover:bg-blue-500/20',
    badgeGlow: '0 0 18px rgba(59,130,246,0.6)',
    tabFile: 'languages.ts',
    dot: 'bg-blue-400',
    headerText: 'text-blue-400',
    scanLine: 'from-blue-500/0 via-blue-500/30 to-blue-500/0',
  },
  'Architecture & Security': {
    accent: '#8b5cf6',
    accentMuted: 'rgba(139,92,246,0.18)',
    accentBorder: 'rgba(139,92,246,0.35)',
    badge: 'bg-violet-500/10 text-violet-200 border-violet-500/25 hover:bg-violet-500/20',
    badgeGlow: '0 0 18px rgba(139,92,246,0.6)',
    tabFile: 'architecture.ts',
    dot: 'bg-violet-400',
    headerText: 'text-violet-400',
    scanLine: 'from-violet-500/0 via-violet-500/30 to-violet-500/0',
  },
  'Frontend & Backend': {
    accent: '#06b6d4',
    accentMuted: 'rgba(6,182,212,0.18)',
    accentBorder: 'rgba(6,182,212,0.35)',
    badge: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/25 hover:bg-cyan-500/20',
    badgeGlow: '0 0 18px rgba(6,182,212,0.6)',
    tabFile: 'frontend.tsx',
    dot: 'bg-cyan-400',
    headerText: 'text-cyan-400',
    scanLine: 'from-cyan-500/0 via-cyan-500/30 to-cyan-500/0',
  },
  'Databases & Tools': {
    accent: '#10b981',
    accentMuted: 'rgba(16,185,129,0.18)',
    accentBorder: 'rgba(16,185,129,0.35)',
    badge: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25 hover:bg-emerald-500/20',
    badgeGlow: '0 0 18px rgba(16,185,129,0.6)',
    tabFile: 'database.sql',
    dot: 'bg-emerald-400',
    headerText: 'text-emerald-400',
    scanLine: 'from-emerald-500/0 via-emerald-500/30 to-emerald-500/0',
  },
}

/* Independent water-float config per card */
const FLOATS = [
  { y: [0, -11, 3, -8, 2, -10, 0], rotate: [0,  0.5, -0.3, 0.4, -0.2, 0], dur: 7.2, delay: 0   },
  { y: [0,  -8, 4, -13, 1, -7,  0], rotate: [0, -0.4,  0.6,-0.3,  0.5, 0], dur: 8.8, delay: 1.1 },
  { y: [0, -14, 2, -9,  4, -12, 0], rotate: [0,  0.3, -0.5, 0.2, -0.4, 0], dur: 6.5, delay: 0.5 },
  { y: [0,  -9, 5, -11, 2, -8,  0], rotate: [0, -0.3,  0.4,-0.5,  0.3, 0], dur: 9.0, delay: 1.8 },
]

const badgeItem = {
  hidden:  { opacity: 0, scale: 0.7, y: 8 },
  visible: { opacity: 1, scale: 1,   y: 0, transition: { duration: 0.35, ease: 'backOut' } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-5 bg-line-grid" dir="ltr">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
      >
        {/* Heading */}
        <motion.div
          className="mb-16"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
        >
          <p className="font-display text-blue-500 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
            Technical Expertise
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">Skills</h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mt-4 origin-left"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ width: 56 }}
          />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((group, idx) => {
            const theme = THEMES[group.category] ?? THEMES['Languages']
            const float = FLOATS[idx] ?? FLOATS[0]

            return (
              /* Scroll-reveal wrapper */
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 55, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Continuous water-float wrapper */}
                <motion.div
                  animate={{ y: float.y, rotate: float.rotate }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'mirror',
                    duration: float.dur,
                    ease: 'easeInOut',
                    delay: float.delay,
                  }}
                >
                  {/* Card — hover stops float & glows */}
                  <motion.div
                    whileHover={{
                      y: -3,
                      rotate: 0,
                      boxShadow: `0 0 50px ${theme.accentMuted}, 0 0 100px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)`,
                    }}
                    transition={{ duration: 0.22 }}
                    className="relative overflow-hidden rounded-2xl border"
                    style={{
                      background: 'rgba(15,23,42,0.75)',
                      backdropFilter: 'blur(20px)',
                      borderColor: theme.accentBorder.replace('0.35', '0.18'),
                    }}
                  >
                    {/* ── Code-editor tab bar ── */}
                    <div
                      className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: theme.accentBorder.replace('0.35', '0.12'),
                      }}
                    >
                      {/* macOS traffic lights */}
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/75" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/75" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/75" />

                      {/* File tab */}
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

                      {/* Item count */}
                      <span className="ml-auto font-mono text-[9px] text-slate-600 tracking-widest">
                        {group.items.length} items
                      </span>
                    </div>

                    {/* ── Card body ── */}
                    <div className="p-5 relative">
                      {/* Animated scan-line */}
                      <motion.div
                        className={`absolute left-0 right-0 h-px bg-gradient-to-r ${theme.scanLine} opacity-60`}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: float.dur * 0.9, repeat: Infinity, ease: 'linear', delay: float.delay }}
                        style={{ pointerEvents: 'none' }}
                      />

                      {/* Category name as code comment */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-mono text-slate-600 text-xs">{'// '}</span>
                        <span className={`font-mono text-xs font-semibold tracking-wider ${theme.headerText}`}>
                          {group.category}
                        </span>
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.35 }}
                          style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }}
                        />
                      </div>

                      {/* Bottom accent rule */}
                      <div
                        className="absolute bottom-0 left-5 right-5 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${theme.accentBorder}, transparent)` }}
                      />

                      {/* Badges */}
                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
                      >
                        {group.items.map((item) => (
                          <motion.span
                            key={item}
                            variants={badgeItem}
                            whileHover={{ scale: 1.1, y: -2, boxShadow: theme.badgeGlow }}
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
