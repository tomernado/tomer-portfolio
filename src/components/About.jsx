import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import CvModal from './CvModal'
import { ACCENT } from '../motion'

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

const STATS = [
  { value: '20+',          label: 'Projects Built',  sub: 'Client-delivered, end to end', countTo: 20, suffix: '+' },
  { value: 'OOP · C/S',    label: 'Architecture',    sub: 'Design Patterns · MVC' },
  { value: 'Full-Stack',   label: 'Development',     sub: 'React · Node.js · Java' },
  { value: 'RAG & Agents', label: 'AI Systems',      sub: 'Claude · Gemini · LLMs' },
]

function StatValue({ stat, active }) {
  const count = useCountUp(stat.countTo ?? 0, active && !!stat.countTo)
  if (!stat.countTo) return <>{stat.value}</>
  return <>{count}{stat.suffix}</>
}

export default function About() {
  const { personalInfo, aboutData, ui, dir } = useContent()
  const [cvOpen, setCvOpen] = useState(false)
  const [inView, setInView] = useState(false)
  const [statsInView, setStatsInView] = useState(false)
  const bioRef = useRef(null)
  const timelineRef = useRef(null)
  const reduceMotion = useReducedMotion()

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
      <section id="about" className="py-28 sm:py-36 px-5">
        <div className="max-w-6xl mx-auto">

          {/* Section marker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-16 sm:mb-24"
          >
            <span className="font-mono text-white/45 text-xs">01</span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-white/50 text-xs tracking-[0.3em] uppercase">Background</span>
          </motion.div>

          {/* ── Editorial intro: heading + bio (left) / stat list (right) ── */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-24 sm:mb-32">

            {/* LEFT — heading + typed bio */}
            <div className="lg:col-span-7" ref={bioRef}>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-white tracking-tight leading-[1.05] mb-8"
                style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
              >
                {aboutData.mainTitle}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                onClick={finish}
                title={ui.about.clickToSkipTitle}
                className="cursor-pointer select-none"
                dir={dir}
              >
                <p className="font-body text-white/70 leading-[1.75]" style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)' }}>
                  {typed}
                  <span className={`inline-block w-[2px] h-[1.05em] bg-white/70 align-middle ml-1 ${done ? 'cursor-blink' : ''}`} />
                </p>
                {!done && (
                  <p className="mt-3 font-mono text-white/45 text-[10px] tracking-widest uppercase">
                    {ui.about.clickToSkip}
                  </p>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => setCvOpen(true)}
                whileHover={{ gap: '0.75rem' }}
                className="mt-10 inline-flex items-center gap-2 font-mono text-sm text-white/60 hover:text-white border-b border-white/20 hover:border-white/60 pb-1 transition-colors duration-200"
              >
                <FileText size={14} />
                view_resume.pdf
              </motion.button>
            </div>

            {/* RIGHT — stat list */}
            <div className="lg:col-span-5 flex flex-col">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  onViewportEnter={i === 0 ? () => setStatsInView(true) : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  whileHover={{ x: -4 }}
                  className={`flex items-baseline justify-between gap-6 py-5 ${i !== 0 ? 'border-t border-white/10' : ''}`}
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">{stat.label}</p>
                    <p className="font-mono text-[11px] text-white/45">{stat.sub}</p>
                  </div>
                  <p className="font-display font-bold text-white text-xl sm:text-2xl text-right flex-shrink-0 tracking-tight tabular-nums">
                    <StatValue stat={stat} active={statsInView} />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Experience timeline ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-12"
          >
            <span className="font-mono text-white/50 text-[10px] tracking-[0.3em] uppercase">Experience</span>
            <div className="h-px flex-1 bg-white/10" />
          </motion.div>

          <div ref={timelineRef} className="relative pl-8 sm:pl-10">
            {/* Vertical line — base track + scroll-drawn fill */}
            <div className="absolute left-[3px] sm:left-[5px] top-2 bottom-2 w-px bg-white/12" />
            <motion.div
              className="absolute left-[3px] sm:left-[5px] top-2 bottom-2 w-px origin-top"
              style={{
                scaleY: reduceMotion ? 1 : timelineProgress,
                background: `linear-gradient(rgba(${ACCENT.rgb},0.9), rgba(255,255,255,0.6))`,
              }}
            />

            {aboutData.experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${i !== aboutData.experience.length - 1 ? 'pb-12 sm:pb-14' : ''}`}
              >
                {/* Node — the current role gets the accent, past roles stay neutral */}
                <span
                  className="absolute -left-8 sm:-left-10 top-1.5 w-[7px] h-[7px] rounded-full ring-4 ring-ink-950"
                  style={i === 0 ? { background: ACCENT.css, boxShadow: `0 0 10px rgba(${ACCENT.rgb},0.7)` } : { background: '#fff' }}
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[11px] text-white/50 tracking-widest uppercase flex-shrink-0 sm:w-32">
                    {exp.date}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-white text-lg sm:text-xl tracking-tight mb-1">
                      {exp.title}
                    </h3>
                    <p className="font-mono text-[11px] text-white/50 mb-3 tracking-wide">@ {exp.company}</p>
                    <p dir={dir} className="font-body text-white/50 text-sm leading-relaxed max-w-2xl">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}
