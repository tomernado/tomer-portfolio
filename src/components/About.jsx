import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Briefcase } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import CvModal from './CvModal'

/* ─── Typewriter hook ────────────────────────────────────────────── */
function useTypewriter(text, speed = 14, active = false) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active || index >= text.length) return
    const id = setTimeout(() => setIndex((i) => i + 1), speed)
    return () => clearTimeout(id)
  }, [active, index, text.length, speed])

  // Skip to end on click
  const finish = () => setIndex(text.length)

  return { typed: text.slice(0, index), done: index >= text.length, finish }
}

export default function About() {
  const { personalInfo, aboutData, ui, dir } = useContent()
  const [cvOpen, setCvOpen] = useState(false)
  const [started, setStarted] = useState(false)
  const screenRef = useRef(null)

  // Start typing once the section enters view
  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { typed, done, finish } = useTypewriter(personalInfo.aboutText, 5, started)

  return (
    <>
      <section id="about" className="pt-2 pb-24 px-5">
        <div className="max-w-3xl mx-auto">

          {/* Connector divider */}
          <div className="flex items-center gap-4 mb-10" dir="rtl">
            <div className="h-px flex-1 bg-gradient-to-l from-green-500/30 to-transparent" />
            <span className="font-display text-green-500/70 text-[10px] tracking-[0.35em] uppercase font-semibold select-none">
              About
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-green-500/30 to-transparent" />
          </div>

          {/* CRT Monitor */}
          <motion.div
            initial={{ opacity: 0, y: 56, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            ref={screenRef}
          >
            {/* Monitor outer bezel */}
            <div
              className="crt-flicker rounded-2xl overflow-hidden border border-green-500/20 shadow-[0_0_80px_rgba(74,222,128,0.07),0_0_0_1px_rgba(74,222,128,0.06),inset_0_0_80px_rgba(0,0,0,0.6)]"
              style={{ background: 'linear-gradient(160deg, rgba(2,12,27,0.98) 0%, rgba(2,8,20,1) 100%)' }}
            >

              {/* ── Title bar ── */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-green-500/10"
                style={{ background: 'rgba(0,0,0,0.45)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-4 font-mono text-[11px] text-green-500/50 tracking-wider">
                  about.sh — tomer@portfolio:~
                </span>
                <span className="ml-auto font-mono text-[10px] text-green-500/30">[ system ]</span>
              </div>

              {/* ── Screen content ── */}
              <div className="relative p-6 sm:p-8">

                {/* Scanlines overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)',
                  }}
                />

                {/* Subtle inner glow */}
                <div className="absolute inset-0 pointer-events-none rounded-b-2xl"
                  style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 70%)' }} />

                {/* ── Top badge: בוגר מדעי המחשב ── */}
                <div className="mb-6 flex items-center gap-3 flex-wrap" dir="rtl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-green-500/25 bg-green-500/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                    <span className="font-mono text-green-400 text-xs tracking-widest font-semibold">
                      {aboutData.mainTitle}
                    </span>
                  </div>
                  <span className="font-mono text-green-600/50 text-[10px] tracking-wider">HIT · 2025</span>
                </div>

                {/* ── Typing text ── */}
                <div
                  className="mb-8 cursor-pointer select-none"
                  onClick={finish}
                  title={ui.about.clickToSkipTitle}
                  dir={dir}
                >
                  {/* Prompt line */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-green-600 text-sm">$</span>
                    <span className="font-mono text-green-500/60 text-xs tracking-widest">cat profile.txt</span>
                  </div>

                  <p className="font-mono text-[13px] sm:text-sm leading-[1.85] text-slate-100 relative">
                    {typed}
                    {/* Blinking cursor */}
                    <span
                      className={`inline-block w-[7px] h-[14px] bg-green-400 align-middle ml-0.5 ${done ? 'cursor-blink' : ''}`}
                    />

                  </p>

                  {!done && (
                    <p className="mt-2 font-mono text-green-700/60 text-[10px] tracking-widest">
                      {ui.about.clickToSkip}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-green-500/10" />
                  <div className="flex items-center gap-1.5 px-3 py-0.5 border border-green-500/15 rounded bg-green-500/5">
                    <Briefcase size={10} className="text-green-500/60" />
                    <span className="font-mono text-[10px] text-green-500/60 tracking-widest uppercase">Experience</span>
                  </div>
                  <div className="h-px flex-1 bg-green-500/10" />
                </div>

                {/* ── Experience panels ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {aboutData.experience.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                      whileHover={{
                        borderColor: 'rgba(74,222,128,0.25)',
                        boxShadow: '0 0 20px rgba(74,222,128,0.08), inset 0 0 20px rgba(74,222,128,0.03)',
                      }}
                      className="rounded-lg border border-green-500/10 p-4 transition-colors duration-300"
                      style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                      {/* Panel title bar */}
                      <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-green-500/8">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 flex-shrink-0" />
                        <span className="font-mono text-[9px] text-green-600/60 tracking-widest uppercase">{exp.date}</span>
                      </div>

                      {/* Title */}
                      <p className="font-mono text-[11px] text-green-400/90 font-semibold leading-tight mb-1">
                        {exp.title}
                      </p>
                      <p className="font-mono text-[10px] text-green-600/70 mb-3 tracking-wide">
                        @ {exp.company}
                      </p>

                      {/* Description */}
                      <p dir={dir} className="font-body text-slate-400/90 text-xs leading-relaxed">
                        {exp.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* ── CV button ── */}
                <div className="flex justify-end border-t border-green-500/10 pt-5">
                  <motion.button
                    onClick={() => setCvOpen(true)}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: '0 0 24px rgba(74,222,128,0.25)',
                      borderColor: 'rgba(74,222,128,0.5)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-green-500/25 font-mono text-sm text-green-400 will-change-transform transition-colors duration-200"
                    style={{ background: 'rgba(74,222,128,0.05)' }}
                  >
                    <FileText size={14} />
                    <span className="tracking-wider">./view_resume.sh</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}
