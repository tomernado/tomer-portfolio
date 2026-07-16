import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { ExternalLink, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import SectionMarker from './SectionMarker'
import { ACCENT, VIEWPORT, revealUp, headingReveal } from '../motion'
import { useIsDesktop } from '../hooks/useIsDesktop'

// Stable viewport-option object — see About.jsx for why this matters:
// MobileStepCarousel re-renders on every scroll tick (active-index state).
const VP_ONCE_40 = { once: true, amount: 0.4 }

function StepRow({ step, index, active, onActivate, dir, stepRef }) {
  return (
    <button
      ref={stepRef}
      onClick={() => onActivate(index)}
      // Generous vertical rhythm is deliberate: it gives the sticky panel
      // opposite it real scroll runway to stay pinned + centered, instead
      // of the pin window being too short to read as an effect at all.
      className="group relative w-full text-left py-16 sm:py-24 lg:py-28 cursor-pointer flex items-center min-h-[40vh]"
      dir={dir}
    >
      <motion.div
        className="pl-6 flex items-baseline gap-4"
        animate={{
          opacity: active ? 1 : 0.4,
          x: active ? 0 : -4,
          filter: active ? 'blur(0px)' : 'blur(1.5px)',
        }}
        whileHover={active ? undefined : { opacity: 0.68, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="font-mono text-xs tracking-widest flex-shrink-0 transition-colors duration-300"
          style={{ color: active ? ACCENT.css : 'rgba(255,255,255,0.45)' }}
        >
          {step.number}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-semibold tracking-tight mb-2 transition-colors duration-300 ${active ? 'text-white' : 'text-white/45'}`} style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2rem)' }}>
            {step.title}
          </h3>
          <p className="font-body text-sm sm:text-base leading-relaxed max-w-md text-white/55">
            {step.description}
          </p>
        </div>
      </motion.div>
    </button>
  )
}

/* ── Mobile: swipeable snap-scroll step carousel ─────────────────── */
function MobileStepCarousel({ steps }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActive(Math.max(0, Math.min(steps.length - 1, idx)))
  }

  const goTo = (i) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="sm:hidden">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="snap-center shrink-0 w-full pr-3"
            style={{ scrollSnapAlign: 'center' }}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={VP_ONCE_40}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
          >
            <div
              className="rounded-2xl overflow-hidden bg-ink-900 relative h-[220px] border border-white/10 mb-4"
              style={{ boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(${ACCENT.rgb},0.06)` }}
            >
              <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
            </div>
            <p className="font-mono text-xs tracking-widest mb-1.5" style={{ color: active === i ? ACCENT.css : 'rgba(255,255,255,0.45)' }}>{step.number}</p>
            <h3 className="font-display font-semibold text-xl text-white tracking-tight mb-1.5">{step.title}</h3>
            <p className="font-body text-sm leading-relaxed text-white/55">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Dots + swipe hint */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to step ${i + 1}`}
            className="p-1.5 -m-1.5"
          >
            <motion.span
              animate={{ scale: active === i ? 1 : 0.6, backgroundColor: active === i ? `rgb(${ACCENT.rgb})` : 'rgb(82,82,91)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="block w-2 h-2 rounded-full"
            />
          </button>
        ))}
      </div>
      <p className="text-center font-mono text-[9px] text-white/30 mt-3 tracking-widest uppercase flex items-center justify-center gap-1.5">
        <ChevronLeft size={10} /> swipe <ChevronRight size={10} />
      </p>
    </div>
  )
}

export default function Web4YouSection() {
  const { web4youData, ui, dir } = useContent()
  const { steps, url } = web4youData
  const [activeIndex, setActiveIndex] = useState(0)
  const [indicator, setIndicator] = useState({ top: 0, height: 0 })
  const stepRefs = useRef([])
  const stepsContainerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  // Animated `filter: blur()` glow layers are expensive to composite —
  // stacked across sections they're what caused Mobile Safari to
  // repeatedly crash the page. Desktop only.
  const isDesktop = useIsDesktop()

  // Preload all step images so they're ready before the user scrolls into view
  useEffect(() => {
    steps.forEach(step => {
      const img = new Image()
      img.src = step.image
    })
  }, [steps])

  // Continuous scroll-linked progress through the step list — smoother and
  // more precise than the old IntersectionObserver heuristic, and it's what
  // actually makes this read as "sticky storytelling" rather than a series
  // of independent triggers.
  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ['start start', 'end end'],
  })
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, steps.length - 0.001])
  useMotionValueEvent(rawIndex, 'change', (v) => {
    const idx = Math.max(0, Math.min(steps.length - 1, Math.floor(v)))
    setActiveIndex((prev) => (prev === idx ? prev : idx))
  })

  // Slide the progress indicator to track the active step's position
  useEffect(() => {
    const el = stepRefs.current[activeIndex]
    if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight })
  }, [activeIndex])

  return (
    <section id="web4you" className="relative py-28 sm:py-36 px-5">

      {/* Background layer lives in its own clipped, absolutely-positioned
          box — kept OUT of the sticky panel's ancestor chain below, since
          an `overflow-hidden` ancestor breaks `position: sticky` (it was
          on the <section> itself here previously, which silently killed
          the pinned-image scroll effect). */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base — same layered dark treatment as Skills/Projects' dark
            passages, so this section reads as part of one continuous
            system rather than a flatter fill in between them. */}
        <div className="absolute inset-0 bg-ink-950" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
        />
        {/* Soft purple ambient lighting, gently drifting for a slow sense of
            depth — restrained so it reads as atmosphere, not a spotlight. */}
        {isDesktop && (
          <>
            <motion.div
              className="absolute -top-24 -right-24 w-[620px] h-[620px] rounded-full"
              style={{ background: `radial-gradient(circle, rgba(${ACCENT.rgb},0.14) 0%, transparent 70%)`, filter: 'blur(70px)' }}
              animate={reduceMotion ? undefined : { opacity: [0.5, 0.8, 0.5], x: [0, -18, 0] }}
              transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-[-10%] -left-32 w-[480px] h-[480px] rounded-full"
              style={{ background: `radial-gradient(circle, rgba(${ACCENT.rgb2},0.08) 0%, transparent 72%)`, filter: 'blur(70px)' }}
              animate={reduceMotion ? undefined : { opacity: [0.35, 0.6, 0.35], x: [0, 16, 0] }}
              transition={reduceMotion ? undefined : { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
          </>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 60% at 50% 40%, transparent 55%, rgba(0,0,0,0.3) 100%)' }}
        />
      </div>

      {/* Projects ends white; this dark section opens with a short white→dark
          blend so the two backgrounds meet naturally. Fits within py-28. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: 100,
          background: 'linear-gradient(to bottom, #f3f1f8 0%, transparent 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative">

        <SectionMarker index="04" label={ui.web4you.label} className="mb-8" />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={VIEWPORT}
            variants={headingReveal}
            className="font-display font-bold text-white tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
          >
            Web4You<span style={{ color: ACCENT.css }}>.</span>
          </motion.h2>
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            initial="hidden" whileInView="visible" viewport={VIEWPORT}
            variants={revealUp}
            whileHover={{ scale: 1.03, boxShadow: `0 8px 32px -6px rgba(${ACCENT.rgb},0.5)` }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-full font-body font-semibold text-xs sm:text-sm transition-colors duration-200 w-fit"
            style={{ boxShadow: '0 4px 20px -6px rgba(0,0,0,0.4)' }}
          >
            <Globe size={14} />
            {ui.web4you.ctaButton}
            <ExternalLink size={12} className="opacity-60" />
          </motion.a>
        </div>

        {/* Mobile carousel */}
        <MobileStepCarousel steps={steps} />

        {/* Desktop: step list + centered sticky image */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-10 sm:gap-16 items-start">
          {/* LEFT — step list with sliding progress track */}
          <div ref={stepsContainerRef} className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
            <motion.div
              className="absolute left-0 w-px"
              style={{ background: `linear-gradient(rgba(${ACCENT.rgb},0.9), rgba(255,255,255,0.6))` }}
              animate={{ top: indicator.top, height: indicator.height }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
            />
            {steps.map((step, i) => (
              <StepRow
                key={i}
                step={step}
                index={i}
                active={activeIndex === i}
                onActivate={setActiveIndex}
                dir={dir}
                stepRef={(el) => { stepRefs.current[i] = el }}
              />
            ))}
          </div>

          {/* RIGHT — sticky panel pinned to exactly one viewport height and
              flex-centered within it, so the image stays vertically centered
              and fully readable for the whole time it's pinned — no matter
              how tall the left column's content ends up being. */}
          <div className="sticky top-0 h-screen flex items-center py-10">
            <div className="w-full relative">
              {/* Ambient purple glow seated behind the panel — echoes the
                  card glow used across Projects/Skills for one continuous
                  "premium depth" language. */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(${ACCENT.rgb},0.16) 0%, transparent 70%)`, filter: 'blur(30px)' }}
              />
              <div
                className="w-full rounded-2xl overflow-hidden bg-ink-900 relative h-[min(52vh,440px)] border border-white/10"
                style={{ boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${ACCENT.rgb},0.08)` }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={steps[activeIndex].image}
                    alt={steps[activeIndex].title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent pointer-events-none" />
              </div>
              {/* Progress dots */}
              <div className="flex gap-2 mt-5 justify-center">
                {steps.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: activeIndex === i ? 1 : 0.55,
                      backgroundColor: activeIndex === i ? `rgb(${ACCENT.rgb})` : 'rgb(82,82,91)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
