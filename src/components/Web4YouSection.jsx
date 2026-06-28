import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'
import { useContent } from '../context/LanguageContext'

export default function Web4YouSection() {
  const { web4youData, ui, dir } = useContent()
  const { steps, url } = web4youData
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Preload all step images so they're ready before the user scrolls into view
  useEffect(() => {
    steps.forEach(step => {
      const img = new Image()
      img.src = step.image
    })
  }, [steps])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(1, scrolled / totalScrollable)
      const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length))
      setActiveIndex(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="web4you" className="relative bg-slate-950">

      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
          top: '-10%', right: '-20%',
        }}
      />

      {/* Scroll driver — 4 × 100vh tall */}
      <div ref={containerRef} style={{ minHeight: `${steps.length * 100}vh` }}>

        {/* Sticky panel — fills exactly one viewport */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-14 sm:pt-20 pb-4 px-4 sm:px-10 gap-2 sm:gap-3">

          {/* ── Heading ── */}
          <div dir={dir} className="w-full max-w-2xl flex-shrink-0">
            <p className="font-display text-indigo-400 text-[10px] tracking-[0.3em] uppercase mb-0.5 font-semibold text-center">
              {ui.web4you.label}
            </p>
            <h2 className="font-body font-extrabold text-2xl sm:text-4xl text-white text-center leading-tight">
              Web4You
            </h2>
          </div>

          {/* ── Step text (animated) ── */}
          <div className="w-full max-w-xl flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                dir={dir}
                className="text-center w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <p className="font-display font-bold text-indigo-400 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-0.5">
                  {steps[activeIndex].number}
                </p>
                <h3 className="font-body font-bold text-white text-sm sm:text-xl leading-snug mb-1.5">
                  {steps[activeIndex].title}
                </h3>
                <p className="font-body text-slate-400 text-[11px] sm:text-sm leading-relaxed max-w-md mx-auto">
                  {steps[activeIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Image (fixed height — always reserves space to avoid layout shift) ── */}
          <div
            className="w-full max-w-xs sm:max-w-xl flex-shrink-0 rounded-2xl overflow-hidden bg-slate-900/60 relative mt-3 sm:mt-4 h-[min(30vh,240px)] sm:h-[min(46vh,420px)]"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,102,241,0.18)' }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={steps[activeIndex].image}
                alt={steps[activeIndex].title}
                className="w-full h-full object-contain"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>

          {/* ── Progress dots ── */}
          <div className="flex gap-2 flex-shrink-0">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: activeIndex === i ? 1 : 0.55,
                  backgroundColor: activeIndex === i ? 'rgb(99,102,241)' : 'rgb(71,85,105)',
                  boxShadow: activeIndex === i ? '0 0 8px rgba(99,102,241,0.6)' : 'none',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="flex-shrink-0">
            <motion.a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-body font-semibold text-xs sm:text-sm transition-colors duration-200 will-change-transform"
            >
              <Globe size={14} />
              {ui.web4you.ctaButton}
              <ExternalLink size={12} className="opacity-60" />
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  )
}
