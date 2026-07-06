import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ExternalLink, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import { ACCENT } from '../motion'

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
        animate={{ opacity: active ? 1 : 0.4, x: active ? 0 : -4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={`font-mono text-xs tracking-widest flex-shrink-0 transition-colors duration-300 ${active ? 'text-white' : 'text-white/45'}`}>
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
          <div key={i} className="snap-center shrink-0 w-full pr-3" style={{ scrollSnapAlign: 'center' }}>
            <div className="rounded-2xl overflow-hidden bg-ink-900 relative h-[220px] border border-white/10 mb-4">
              <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
            </div>
            <p className="font-mono text-xs tracking-widest text-white/45 mb-1.5">{step.number}</p>
            <h3 className="font-display font-semibold text-xl text-white tracking-tight mb-1.5">{step.title}</h3>
            <p className="font-body text-sm leading-relaxed text-white/55">{step.description}</p>
          </div>
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

  // Preload all step images so they're ready before the user scrolls into view
  useEffect(() => {
    steps.forEach(step => {
      const img = new Image()
      img.src = step.image
    })
  }, [steps])

  // Scroll-driven activation: whichever step is closest to viewport-center wins.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length === 0) return
        const closest = visible.reduce((best, e) =>
          Math.abs(e.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? e : best
        )
        const idx = stepRefs.current.indexOf(closest.target)
        if (idx !== -1) setActiveIndex(idx)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )
    stepRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [steps])

  // Slide the progress indicator to track the active step's position
  useEffect(() => {
    const el = stepRefs.current[activeIndex]
    if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight })
  }, [activeIndex])

  return (
    <section id="web4you" className="relative bg-ink-950 py-28 sm:py-36 px-5">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          top: '-10%', right: '-20%',
        }}
      />

      <div className="max-w-6xl mx-auto relative">

        {/* Section marker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="font-mono text-white/45 text-xs">04</span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-white/50 text-xs tracking-[0.3em] uppercase">{ui.web4you.label}</span>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <h2 className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}>
            Web4You
          </h2>
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-full font-body font-semibold text-xs sm:text-sm transition-colors duration-200 w-fit"
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
              className="absolute left-0 w-px bg-white"
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
            <div className="w-full">
              <div
                className="w-full rounded-2xl overflow-hidden bg-ink-900 relative h-[min(52vh,440px)] border border-white/10"
                style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={steps[activeIndex].image}
                    alt={steps[activeIndex].title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.04, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
