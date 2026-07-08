import { motion, useReducedMotion } from 'framer-motion'
import {
  SiJavascript, SiTypescript, SiPython, SiC, SiCplusplus,
  SiReact, SiNodedotjs, SiExpress, SiNextdotjs, SiVite,
  SiDocker, SiPostman, SiMysql, SiMongodb, SiGit, SiLinux,
} from 'react-icons/si'
import { DiJava } from 'react-icons/di'
import { TbBrandCSharp } from 'react-icons/tb'
import { Database, Box, LayoutGrid, Layers, Cloud, ShieldCheck, CheckSquare, Lock, Sparkles } from 'lucide-react'
import { skills } from '../data/content'
import SpotlightCard from './SpotlightCard'
import SectionMarker from './SectionMarker'
import Particles from './Particles'
import SectionDissolve from './SectionDissolve'
import { ACCENT, headingReveal, revealUp, VIEWPORT, EASE_OUT } from '../motion'
import { useIsDesktop } from '../hooks/useIsDesktop'

// Stable viewport-option object — see About.jsx for why this matters.
const VP_ONCE_M50 = { once: true, margin: '-50px' }

const TAB_FILES = {
  Languages: 'languages.ts',
  'Architecture & Security': 'architecture.ts',
  'Frontend & Backend': 'frontend.tsx',
  'Databases & Tools': 'database.sql',
}

// Each pill gets its real technology mark where one exists — brand icons
// for concrete tools/languages, a small purple concept icon for practices
// that don't have a logo of their own (OOP, JWT, Testing…).
const ITEM_ICON = {
  Java:               [DiJava,          '#f89820'],
  'C#':               [TbBrandCSharp,   '#9b4f96'],
  JavaScript:         [SiJavascript,    '#F7DF1E'],
  TypeScript:         [SiTypescript,    '#3178C6'],
  Python:             [SiPython,        '#3776AB'],
  SQL:                [Database,        '#c4b5fd'],
  C:                  [SiC,             '#A8B9CC'],
  'C++':              [SiCplusplus,     '#00599C'],
  OOP:                [Box,             '#c4b5fd'],
  'Design Patterns':  [LayoutGrid,      '#c4b5fd'],
  'Clean Architecture': [Layers,        '#c4b5fd'],
  'REST APIs':        [Cloud,           '#c4b5fd'],
  JWT:                [ShieldCheck,     '#c4b5fd'],
  Testing:            [CheckSquare,     '#c4b5fd'],
  'Secure Development': [Lock,          '#c4b5fd'],
  React:              [SiReact,         '#61DAFB'],
  'Node.js':          [SiNodedotjs,     '#5FA04E'],
  Express:            [SiExpress,       '#e5e7eb'],
  'Next.js':          [SiNextdotjs,     '#e5e7eb'],
  Vite:               [SiVite,          '#BD34FE'],
  Docker:             [SiDocker,        '#2496ED'],
  Postman:            [SiPostman,       '#FF6C37'],
  MySQL:              [SiMysql,         '#4479A1'],
  MongoDB:            [SiMongodb,       '#47A248'],
  Git:                [SiGit,           '#F05032'],
  Linux:              [SiLinux,         '#FCC624'],
  'AI Engineering':   [Sparkles,        '#c4b5fd'],
}

const badgeItem = {
  hidden:  { opacity: 0, scale: 0.7, y: 8 },
  visible: { opacity: 1, scale: 1,   y: 0, transition: { duration: 0.32, ease: 'backOut' } },
}

/* Skills' own cross-section identity: cards "assemble" into place with a
   faint alternating tilt, rather than the plain scale/blur other sections
   use — reads as this section's own signature while still scroll-triggered
   like everywhere else. */
const assembleVariant = (i) => ({
  hidden:  { opacity: 0, y: 34, scale: 0.94, rotate: i % 2 === 0 ? -2.5 : 2.5 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.06 } },
})

function SkillCard({ group, wide = false, index = 0 }) {
  const reduceMotion = useReducedMotion()
  // `backdrop-blur-xl` stacked across every card is expensive to
  // composite on Mobile Safari. Desktop keeps the exact original glass
  // look; mobile swaps to a slightly more opaque solid fill instead of
  // the (near-transparent without blur) original background, so the
  // card still reads as a distinct surface without the per-card blur cost.
  const isDesktop = useIsDesktop()
  // Mobile only (mobile-first: applied by default, reset at sm: where the
  // bento/grid layout takes over): a slight alternating horizontal offset
  // + overlap so the stack reads as layered cards rather than plain
  // full-width rows. A plain CSS transform on a wrapper div, kept separate
  // from the motion.div below so it never fights Framer's own transform.
  const mobileStagger = index === 0
    ? 'sm:mt-0'
    : index % 2 === 1
      ? '-mt-3 ml-4 mr-0 sm:m-0'
      : '-mt-3 mr-4 ml-0 sm:m-0'
  return (
    <div className={mobileStagger}>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={assembleVariant(index)}
      whileHover={{ y: -4 }}
      className={wide ? 'sm:col-span-2' : ''}
    >
      <SpotlightCard
        className={`overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 ${isDesktop ? 'backdrop-blur-xl' : ''} transition-colors duration-300 h-full`}
        style={{ background: isDesktop ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.05)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#6b21a8' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#a855f7' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#c4b5fd' }} />
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
            viewport={VP_ONCE_M50}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
          >
            {group.items.map((item) => {
              const [Icon, color] = ITEM_ICON[item] ?? [null, null]
              return (
                <motion.span
                  key={item}
                  variants={badgeItem}
                  whileHover={{
                    scale: 1.07, y: -3,
                    borderColor: 'rgba(255,255,255,0.4)',
                    backgroundColor: 'rgba(255,255,255,0.09)',
                    boxShadow: `0 10px 24px -8px rgba(${ACCENT.rgb},0.5), 0 0 0 1px rgba(${ACCENT.rgb},0.18)`,
                  }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/12 bg-white/[0.03] text-white/75 text-[11px] font-mono font-semibold tracking-wide cursor-default select-none transition-colors duration-150"
                >
                  {Icon && <Icon size={13} style={{ color, flexShrink: 0 }} />}
                  {item}
                </motion.span>
              )
            })}
          </motion.div>
        </div>
      </SpotlightCard>
    </motion.div>
    </div>
  )
}

export default function Skills() {
  const [primary, ...rest] = skills
  const reduceMotion = useReducedMotion()
  // Animated `filter: blur()` glow layers are expensive to composite —
  // stacked across sections they're what caused Mobile Safari to
  // repeatedly crash the page. Desktop only; mobile just skips them
  // rather than rendering a static (still costly) blurred layer.
  const isDesktop = useIsDesktop()

  return (
    <section id="skills" className="py-28 sm:py-36 px-5 relative overflow-hidden" dir="ltr">
      {/* Base — explicit near-black matching Hero's own tone, so the
          section reads as genuinely dark rather than an inherited flat
          fill, with just enough layered lighting on top for depth. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#04050A]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 35% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
      />
      {/* Soft purple ambient lighting — top-left and a faint echo on the
          right, both low-opacity so they read as atmosphere rather than
          a competing glow. */}
      {isDesktop && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -top-32 -left-32 w-[620px] h-[620px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(${ACCENT.rgb},0.16) 0%, transparent 70%)`, filter: 'blur(60px)' }}
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.85, 0.55] }}
            transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-[20%] -right-40 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, rgba(${ACCENT.rgb},0.1) 0%, transparent 72%)`, filter: 'blur(60px)' }}
            animate={reduceMotion ? undefined : { opacity: [0.4, 0.65, 0.4] }}
            transition={reduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)' }}
      />
      <Particles count={22} />

      <div className="max-w-6xl mx-auto relative">

        <SectionMarker index="02" label="Skills & Technologies" className="mb-16" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={headingReveal}
            className="font-display font-bold text-white tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
          >
            Tools I reach for,<br />technologies I trust<span style={{ color: ACCENT.css }}>.</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={revealUp}
            transition={{ delay: 0.15 }}
            className="flex items-start gap-5 lg:max-w-xs lg:pt-2"
          >
            <div className="hidden sm:block relative w-px self-stretch flex-shrink-0" style={{ minHeight: '4.5rem' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 85%)' }} />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: ACCENT.css, boxShadow: `0 0 10px 2px ${ACCENT.css}` }} />
            </div>
            <p className="font-body text-white/50 text-sm leading-relaxed">
              A curated arsenal of languages, frameworks, databases and tools I use to build secure, scalable and impactful digital solutions.
            </p>
          </motion.div>
        </div>

        {/* Bento: primary category full-width, rest in a 3-up row */}
        <div className="flex flex-col gap-6">
          <SkillCard group={primary} wide index={0} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {rest.map((group, i) => (
              <SkillCard key={group.category} group={group} index={i + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Soft dissolve into Projects' white surface, instead of a hard cut.
          Replaces the old thread-only decoration (mobile-visible, no actual
          color blend) with the same gradient+thread treatment used at every
          other section seam — desktop gets the drifting threads, mobile
          gets just the static gradient. */}
      <SectionDissolve toColor="#ffffff" height={160} />
    </section>
  )
}
