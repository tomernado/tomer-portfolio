import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Code2, Brain, Layers, Lightbulb, Github, Download, ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import CvModal from './CvModal'
import SpotlightCard from './SpotlightCard'
import SectionDissolve from './SectionDissolve'
import { useIsDesktop } from '../hooks/useIsDesktop'
import { revealUp, cardReveal, staggerContainer, VIEWPORT, EASE_OUT } from '../motion'

// Stable viewport-option objects — module scope so the reference never
// changes across renders. A fresh inline `{...}` literal recreated on every
// render silently breaks whileInView's IntersectionObserver subscription
// whenever the parent re-renders on a timer/state change, leaving the
// element stuck invisible (found the hard way in Web4You/Projects).
const VP_ONCE = { once: true }
const VP_ONCE_30 = { once: true, amount: 0.3 }
const VP_ONCE_40 = { once: true, amount: 0.4 }

// Local purple, matching the Hero's own Engineering Core palette exactly
// (rather than the site-wide indigo ACCENT) so the Hero → About seam
// reads as one continuous light source, not a handoff between palettes.
const CORE = '168,85,247'
const CORE_SOFT = '196,181,253'

// About's own bright section tone. BG_TOP intentionally matches the
// quiet color Hero's own bottom gradient now resolves to (see Hero.jsx's
// heroDissolveGrad final stop) — Hero simply gets darker toward its own
// bottom and only resolves to this pale tone in a short, quick band right
// at the edge, so the handoff reads as almost invisible rather than a
// bright event. Card surfaces stay dark ("black cards") throughout.
const BG_TOP = '#f8f7fb'
const BG_MID = '#f8f7fb'
const BG_LOW = '#f3f1f8'
const CARD_DARK = '#0c0c10'
const CARD_DARK_2 = '#08080b'

const FEATURE_ICONS = [Code2, Brain, Layers, Lightbulb]

// Local blur-reveal variants — same shape as the shared `headingReveal` /
// `revealUp` but kept in this file since they're only meant for About's
// now-different (light) surface, and the shared motion.js primitives back
// other, still-dark sections.
const blurReveal = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_OUT } },
}
const blurRevealSm = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } },
}

/* ─── Typewriter hook ────────────────────────────────────────────── */
function useTypewriter(text, speed = 14, active = false) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active || index >= text.length) return
    const id = setTimeout(() => setIndex((i) => i + 1), speed)
    return () => clearTimeout(id)
  }, [active, index, text.length, speed])

  const finish = () => setIndex(text.length)

  return { typed: text.slice(0, index), done: index >= text.length, finish }
}

/* ─── Count-up hook — animates 0 → target once triggered ─────────── */
function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduceMotion) { setValue(target); return }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration, reduceMotion])

  return value
}

function StatTile({ stat, active, index }) {
  const count = useCountUp(stat.countTo ?? 0, active && !!stat.countTo)
  return (
    <motion.div
      variants={cardReveal}
      className="rounded-2xl border border-white/10 px-4 py-4 text-center"
      style={{ background: CARD_DARK, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px -12px rgba(20,10,35,0.35), 0 0 0 1px rgba(${CORE},0.03)` }}
    >
      <p className="font-display font-bold text-2xl text-white tracking-tight tabular-nums">
        {stat.countTo ? `${count}+` : stat.value}
      </p>
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/45 mt-1.5 leading-snug">
        {stat.label}
      </p>
    </motion.div>
  )
}

// Each card gets its own slow, phase-offset idle float — subtle enough to
// read as "alive" without competing with scroll-reveal or hover motion.
// Kept on an inner wrapper so it never fights the outer reveal `variants`.
function FeatureCard({ feature, index, dir }) {
  const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length]
  const tilt = index % 2 === 0 ? -1.5 : 1.5
  const reduceMotion = useReducedMotion()
  return (
    <motion.div variants={cardReveal} className="h-full">
      <motion.div
        className="h-full"
        style={{ rotate: tilt }}
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={reduceMotion ? undefined : { duration: 5.5 + index * 0.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
        whileHover={{ y: -9, rotate: 0, scale: 1.015, transition: { duration: 0.3, ease: EASE_OUT } }}
      >
        <SpotlightCard
          className="group relative h-full rounded-2xl border border-white/[0.08] p-6 overflow-hidden transition-colors duration-300 hover:border-violet-400/30"
          style={{
            background: `linear-gradient(180deg, ${CARD_DARK} 0%, ${CARD_DARK_2} 100%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 30px rgba(${CORE},0.05), 0 24px 48px -16px rgba(20,10,40,0.4)`,
          }}
        >
          <span
            className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, rgba(${CORE_SOFT},1), rgba(${CORE},1))`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 16px -4px rgba(${CORE},0.5)`,
            }}
          >
            <Icon size={19} className="text-white" />
          </span>
          <h3 className="font-display font-bold text-white text-lg tracking-tight mb-2">
            {feature.title}
          </h3>
          <p className="font-body text-white/50 text-sm leading-relaxed">
            {feature.description}
          </p>
          <ArrowUpRight
            size={15}
            className={`absolute top-6 text-white/20 group-hover:text-violet-300 transition-colors duration-300 ${dir === 'rtl' ? 'left-6' : 'right-6'}`}
          />
        </SpotlightCard>
      </motion.div>
    </motion.div>
  )
}

export default function About() {
  const { personalInfo, aboutData, ui, dir } = useContent()
  const [cvOpen, setCvOpen] = useState(false)
  const [inView, setInView] = useState(false)
  const [statsInView, setStatsInView] = useState(false)
  const bioRef = useRef(null)
  const timelineRef = useRef(null)
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()
  // `filter: blur()` continuously recalculated on every scroll pixel,
  // applied to the whole section's content wrapper, is about as expensive
  // an animation as a browser compositor can be asked to do — scrolling
  // back and forth across this boundary a few times was enough to crash
  // Mobile Safari. Desktop keeps the full depth-settle (scale+opacity+
  // blur); mobile keeps the scale+opacity climb but drops the blur term.
  const isDesktop = useIsDesktop()

  // About's own cross-section identity: it arrives with a quiet depth-settle
  // (scale/opacity/blur climb) rather than the blur Hero uses to leave —
  // each boundary reads differently while both are scroll-linked, not just
  // viewport-triggered. This is also what makes the Hero → About handoff
  // itself feel animated, not just the content once it's already in view.
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.35'],
  })
  const enterScale   = useTransform(enterProgress, [0, 1], [0.965, 1])
  const enterOpacity = useTransform(enterProgress, [0, 1], [0.6, 1])
  const enterBlur     = useTransform(enterProgress, [0, 1], ['blur(10px)', 'blur(0px)'])
  const glowParallaxY = useTransform(enterProgress, [0, 1], [-40, 0])

  useEffect(() => {
    const el = bioRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { typed, done, finish } = useTypewriter(personalInfo.aboutText, 10, inView)

  // Timeline line "draws" itself in as the reader scrolls past it
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.6'],
  })

  return (
    <>
      <section
        ref={sectionRef}
        id="about"
        className="relative py-28 sm:py-36 px-5"
        style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_MID} 18%, ${BG_LOW} 100%)` }}
      >
        {/* Just a whisper of the same violet undertone Hero was carrying,
            settling out almost immediately — kept deliberately quiet so
            there's no visible band or separator at the seam. */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-40 pointer-events-none"
          style={{
            y: reduceMotion ? 0 : glowParallaxY,
            background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(${CORE},0.05), transparent 75%)`,
          }}
        />

        <motion.div
          className="max-w-6xl mx-auto relative"
          // `enterScale`/`enterOpacity` are continuously recalculated from
          // raw scroll position (useTransform on `enterProgress`) and
          // applied to this section's *entire* content wrapper — every
          // card, timeline entry, everything. Its scroll range ends
          // exactly at the point Hero's own scroll-linked transform
          // (below) also stops, i.e. both are actively recalculating
          // every scroll frame specifically while crossing the Hero→About
          // boundary — the one place repeated scrolling reliably crashed
          // real iPhones even after the filter:blur() term was removed.
          // Desktop keeps the full depth-settle; mobile content is simply
          // visible with no continuous per-frame transform.
          style={(reduceMotion || !isDesktop) ? undefined : { scale: enterScale, opacity: enterOpacity, filter: enterBlur }}
        >

          {/* ── True 2×2 grid, not nested columns — About/Journey (col 1)
              and Cards/Timeline (col 2) each occupy a row, so "My Journey"
              naturally lines up with wherever the card grid ends, and the
              row-gap alone controls the space between them. ──────────── */}
          <div className="grid lg:grid-cols-12 gap-x-12 lg:gap-x-16 gap-y-16 lg:gap-y-28">

            {/* ═══ Row 1 · Col 1 — About Me identity ═══════════════ */}
            <div className="lg:col-span-5 flex flex-col">

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={blurRevealSm}
                className="flex items-center gap-3 mb-9"
              >
                <span className="font-mono text-black/35 text-xs flex-shrink-0">01</span>
                <motion.div
                  className="h-px flex-1 origin-left"
                  style={{ background: 'rgba(0,0,0,0.1)' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
                />
                <span className="font-mono text-black/40 text-xs tracking-[0.3em] uppercase flex-shrink-0">
                  {ui.about.eyebrow}
                </span>
              </motion.div>

              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={blurReveal}
                className="font-display font-bold tracking-tight leading-[1.03] mb-8"
                style={{ fontSize: 'clamp(2.5rem, 4.4vw, 3.75rem)' }}
              >
                <span className="text-ink-950">{ui.about.heading1}</span>{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, rgba(${CORE},1) 0%, #6d28d9 100%)` }}
                >
                  {ui.about.heading2}
                </span>
              </motion.h2>

              <motion.div
                ref={bioRef}
                initial="hidden"
                whileInView="visible"
                viewport={VP_ONCE}
                variants={blurRevealSm}
                transition={{ delay: 0.1 }}
                onClick={finish}
                title={ui.about.clickToSkipTitle}
                className="cursor-pointer select-none mb-9"
                dir={dir}
              >
                <p className="font-body text-neutral-600 leading-[1.85]" style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)' }}>
                  {typed}
                  <span className={`inline-block w-[2px] h-[1.05em] bg-black/50 align-middle ml-1 ${done ? 'cursor-blink' : ''}`} />
                </p>
                {!done && (
                  <p className="mt-3 font-mono text-neutral-400 text-[10px] tracking-widest uppercase">
                    {ui.about.clickToSkip}
                  </p>
                )}
              </motion.div>

              <motion.button
                initial="hidden"
                whileInView="visible"
                viewport={VP_ONCE}
                variants={blurRevealSm}
                transition={{ delay: 0.2 }}
                onClick={() => setCvOpen(true)}
                whileHover={{ gap: '0.65rem', y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-full text-white text-sm font-display font-semibold transition-shadow duration-300 hover:shadow-lg"
                style={{ background: CARD_DARK, boxShadow: '0 10px 24px -10px rgba(10,5,20,0.4)' }}
              >
                {ui.about.moreAboutMe}
                <ArrowUpRight size={14} />
              </motion.button>
            </div>

            {/* ═══ Row 1 · Col 2 — capability cards ═══════════════ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={staggerContainer(0.11, 0.15)}
              className="lg:col-span-7 grid sm:grid-cols-2 gap-5 content-start lg:mt-14"
            >
              {aboutData.features.map((feature, i) => (
                <FeatureCard key={feature.id} feature={feature} index={i} dir={dir} />
              ))}
            </motion.div>

            {/* ═══ Row 2 · Col 1 — Journey ═════════════════════════ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={revealUp}
              className="lg:col-span-5 flex flex-col"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3 block" style={{ color: '#7e22ce' }}>
                {ui.about.experienceEyebrow}
              </span>
              <h3 className="font-display font-bold text-ink-950 tracking-tight text-2xl mb-3">
                {ui.about.journeyHeading1}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, rgba(${CORE},1) 0%, #6d28d9 100%)` }}
                >
                  {ui.about.journeyHeading2}
                </span>
              </h3>
              <p className="font-body text-neutral-500 text-sm leading-relaxed mb-6 max-w-xs">
                {ui.about.journeyDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <a
                  href={personalInfo.cvPdf}
                  download="Tomer_Cohen_Resume.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-semibold text-sm text-ink-950 transition-shadow duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(${CORE_SOFT},1), rgba(${CORE},1))`,
                    boxShadow: `0 8px 24px rgba(${CORE},0.3)`,
                  }}
                >
                  {ui.about.downloadCv}
                  <Download size={14} />
                </a>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/12 bg-black/[0.02] text-ink-950 font-display font-semibold text-sm hover:bg-black/[0.05] hover:border-black/20 transition-colors duration-200"
                >
                  {ui.about.viewGithub}
                  <Github size={14} />
                </a>
              </div>

              {/* ── Stats — animate once on viewport entry ──────── */}
              <StatsRow ui={ui} onEnter={() => setStatsInView(true)} statsInView={statsInView} />
            </motion.div>

            {/* ═══ Row 2 · Col 2 — Timeline ════════════════════════ */}
            <div ref={timelineRef} className="lg:col-span-7 relative pl-8 sm:pl-10">
              {/* Vertical line — base track + scroll-drawn fill */}
              <div className="absolute left-[3px] sm:left-[5px] top-2 bottom-2 w-px bg-black/10" />
              <motion.div
                className="absolute left-[3px] sm:left-[5px] top-2 bottom-2 w-px origin-top"
                style={{
                  scaleY: reduceMotion ? 1 : timelineProgress,
                  background: `linear-gradient(rgba(${CORE},0.9), rgba(${CORE_SOFT},0.6))`,
                }}
              />

              {aboutData.experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={VP_ONCE_30}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: EASE_OUT }}
                  className={`relative ${i !== aboutData.experience.length - 1 ? 'pb-10 sm:pb-12' : ''}`}
                >
                  {/* Node — the current role gets a slow pulsing glow, past roles stay neutral */}
                  <motion.span
                    className="absolute -left-8 sm:-left-10 top-1.5 w-[7px] h-[7px] rounded-full"
                    style={i === 0
                      ? { background: `rgb(${CORE})` }
                      : { background: '#1c1c22', boxShadow: `0 0 0 4px ${BG_MID}` }}
                    animate={i === 0 && !reduceMotion
                      ? { boxShadow: [
                          `0 0 10px 2px rgba(${CORE},0.5), 0 0 0 4px ${BG_MID}`,
                          `0 0 16px 4px rgba(${CORE},0.85), 0 0 0 4px ${BG_MID}`,
                          `0 0 10px 2px rgba(${CORE},0.5), 0 0 0 4px ${BG_MID}`,
                        ] }
                      : undefined}
                    transition={i === 0 ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  />

                  <motion.div
                    whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE_OUT } }}
                    className="rounded-2xl border border-white/[0.07] p-5 sm:p-6"
                    style={{ background: `linear-gradient(180deg, ${CARD_DARK} 0%, ${CARD_DARK_2} 100%)`, boxShadow: '0 20px 40px -20px rgba(20,10,40,0.35)' }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-2">
                      <div>
                        <h4 className="font-display font-bold text-white text-base sm:text-lg tracking-tight">
                          {exp.title}
                        </h4>
                        <p className="font-mono text-[11px] mt-0.5" style={{ color: `rgb(${CORE_SOFT})` }}>
                          {exp.company}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase flex-shrink-0">
                        {exp.date}
                      </span>
                    </div>
                    <p dir={dir} className="font-body text-white/50 text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>
                    {exp.tags && (
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] font-mono text-[10px] text-white/55"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Soft dissolve into Skills' dark surface, instead of a hard cut. */}
        <SectionDissolve toColor="#04050A" height={220} accentColor="rgba(139,92,246,0.22)" />
      </section>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}

/* Stats live in their own small component purely so `skills` (needed for
   a real "Technologies Used" count) can be pulled from context without
   threading it through the parent's render body. */
function StatsRow({ ui, onEnter, statsInView }) {
  const { skills } = useContent()
  const techCount = skills.reduce((sum, group) => sum + group.items.length, 0)

  const stats = [
    { label: ui.about.statProjects, countTo: 20 },
    { label: ui.about.statTech, countTo: techCount },
    { label: ui.about.statFocusLabel, value: ui.about.statFocusValue },
  ]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      onViewportEnter={onEnter}
      viewport={VP_ONCE_40}
      variants={staggerContainer(0.1, 0)}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((stat, i) => (
        <StatTile key={i} stat={stat} active={statsInView} index={i} />
      ))}
    </motion.div>
  )
}
