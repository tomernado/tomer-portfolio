import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Briefcase, Code2, Database, Globe, Cpu, GitBranch, Server, Package, Brain, Shield, Terminal } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import CvModal from './CvModal'

/* ─── Tech-orbit card ────────────────────────────────────────────── */
function TechOrbitCard({ large = false }) {
  const S  = large ? 280 : 200
  const IR = large ? 62  : 44
  const OR = large ? 108 : 76
  const innerBox    = large ? 38 : 30
  const outerBox    = large ? 32 : 26
  const innerIcon   = large ? 16 : 13
  const outerIcon   = large ? 13 : 11
  const innerOffset = innerBox / 2
  const outerOffset = outerBox / 2
  const centerPx    = large ? 72 : 58
  const centerFont  = large ? 13 : 10
  const nameFont    = large ? '9px' : '7px'
  const outerNameFont = large ? '8px' : '6px'
  const glowSize    = large ? 'w-28 h-28' : 'w-20 h-20'

  const innerSkills = [
    { Icon: Code2,    color: '#60a5fa', name: 'React'      },
    { Icon: Cpu,      color: '#f472b6', name: 'Java'       },
    { Icon: Database, color: '#a78bfa', name: 'SQL'        },
    { Icon: Globe,    color: '#34d399', name: 'Python'     },
  ]
  const outerSkills = [
    { Icon: Package,   color: '#c084fc', name: 'Docker'    },
    { Icon: GitBranch, color: '#4ade80', name: 'Git'       },
    { Icon: Shield,    color: '#fb923c', name: 'OWASP'     },
    { Icon: Brain,     color: '#fbbf24', name: 'LLMs'      },
    { Icon: Server,    color: '#67e8f9', name: 'Node.js'   },
    { Icon: Terminal,  color: '#818cf8', name: 'TypeScript'},
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.46 }}
      whileHover={{ borderColor: 'rgba(99,102,241,0.28)', boxShadow: '0 0 20px rgba(99,102,241,0.08), inset 0 0 20px rgba(99,102,241,0.03)' }}
      className="rounded-lg border border-indigo-500/10 p-4 transition-all duration-300 flex flex-col items-center"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="w-full flex items-center gap-1.5 mb-2 pb-2 border-b border-indigo-500/[0.08]">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 animate-pulse" />
        <span className="font-mono text-[9px] text-indigo-400/50 tracking-widest uppercase">Tech Stack · Core Skills</span>
      </div>

      <div className="relative" style={{ width: S, height: S }}>
        {/* Dashed orbit paths */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full border border-dashed border-slate-700/40" style={{ width: IR*2, height: IR*2 }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-full border border-dashed border-slate-700/25" style={{ width: OR*2, height: OR*2 }} />
        </div>

        {/* Inner ring — clockwise */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {innerSkills.map((item, i) => {
            const rad = ((i / innerSkills.length) * 360 - 90) * (Math.PI / 180)
            return (
              <motion.div
                key={i}
                className="absolute flex flex-col items-center gap-0.5"
                style={{ left: S/2 + Math.cos(rad)*IR - innerOffset, top: S/2 + Math.sin(rad)*IR - innerOffset }}
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div style={{ width: innerBox, height: innerBox, background: `${item.color}18`, border: `1px solid ${item.color}55`, color: item.color }}
                  className="rounded-lg flex items-center justify-center">
                  <item.Icon size={innerIcon} />
                </div>
                <span className="font-mono tracking-wide" style={{ color: `${item.color}cc`, fontSize: nameFont }}>
                  {item.name}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Outer ring — counter-clockwise */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 33, repeat: Infinity, ease: 'linear' }}
        >
          {outerSkills.map((item, i) => {
            const rad = ((i / outerSkills.length) * 360 - 90) * (Math.PI / 180)
            return (
              <motion.div
                key={i}
                className="absolute flex flex-col items-center gap-0.5"
                style={{ left: S/2 + Math.cos(rad)*OR - outerOffset, top: S/2 + Math.sin(rad)*OR - outerOffset }}
                animate={{ rotate: 360 }}
                transition={{ duration: 33, repeat: Infinity, ease: 'linear' }}
              >
                <div style={{ width: outerBox, height: outerBox, background: `${item.color}14`, border: `1px solid ${item.color}45`, color: item.color }}
                  className="rounded-lg flex items-center justify-center">
                  <item.Icon size={outerIcon} />
                </div>
                <span className="font-mono tracking-wide" style={{ color: `${item.color}99`, fontSize: outerNameFont }}>
                  {item.name}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`${glowSize} rounded-full`}
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        </div>

        {/* Central identity card */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{
              width: centerPx, height: centerPx,
              background: 'linear-gradient(135deg, rgba(15,20,45,0.98), rgba(8,12,28,0.98))',
              border: '1px solid rgba(99,102,241,0.5)',
            }}
            className="rounded-xl flex flex-col items-center justify-center"
            animate={{ boxShadow: [
              '0 0 16px rgba(99,102,241,0.15)',
              '0 0 30px rgba(99,102,241,0.28)',
              '0 0 16px rgba(99,102,241,0.15)',
            ]}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="font-mono text-indigo-300 font-bold" style={{ fontSize: centerFont }}>&lt;TC/&gt;</span>
            <div className="flex items-center gap-0.5 mt-1">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="font-mono text-green-400 text-[7px]">online</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
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

export default function About() {
  const { personalInfo, aboutData, ui, dir } = useContent()
  const [cvOpen, setCvOpen] = useState(false)
  const [inView, setInView] = useState(false)
  const screenRef = useRef(null)

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { typed, done, finish } = useTypewriter(personalInfo.aboutText, 5, inView)

  return (
    <>
      <section id="about" className="pt-2 pb-24 px-5">
        <div className="max-w-6xl mx-auto">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-10"
          >
            <p className="font-display text-blue-500 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Background</p>
            <h2 className="font-body font-extrabold text-4xl sm:text-5xl text-white">About Me</h2>
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-transparent rounded-full mt-4"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ width: 56, originX: 0 }}
            />
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { value: '20+',           label: 'Projects Built',  sub: 'Client-delivered',        accent: '#60a5fa', dot: 'bg-blue-400'    },
              { value: 'OOP · C/S',     label: 'Architecture',    sub: 'Design Patterns · MVC',   accent: '#a78bfa', dot: 'bg-violet-400'  },
              { value: 'Full-Stack',    label: 'Development',     sub: 'React · Node.js · Java',  accent: '#34d399', dot: 'bg-emerald-400' },
              { value: 'RAG & Agents',  label: 'AI Systems',      sub: 'Claude · Gemini · LLMs',  accent: '#fbbf24', dot: 'bg-amber-400'   },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative p-4 rounded-xl border bg-white/[0.02] overflow-hidden hover:bg-white/[0.035] transition-colors duration-300"
                style={{ borderColor: `${stat.accent}25` }}
              >
                <div className="absolute top-0 left-0 w-14 h-14 pointer-events-none opacity-25"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${stat.accent} 0%, transparent 70%)` }} />
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${stat.dot}`} />
                  <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: `${stat.accent}bb` }}>
                    {stat.label}
                  </span>
                </div>
                <p className="font-body font-extrabold text-lg sm:text-xl text-white leading-tight">{stat.value}</p>
                <p className="font-mono text-[9px] text-slate-600 mt-1.5 tracking-wide">{stat.sub}</p>
              </motion.div>
            ))}
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
              className="crt-flicker rounded-2xl overflow-hidden border border-indigo-500/20 shadow-[0_0_80px_rgba(99,102,241,0.07),0_0_0_1px_rgba(99,102,241,0.06),inset_0_0_80px_rgba(0,0,0,0.6)]"
              style={{ background: 'linear-gradient(160deg, rgba(2,12,27,0.98) 0%, rgba(2,8,20,1) 100%)' }}
            >

              {/* ── Title bar ── */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-indigo-500/10"
                style={{ background: 'rgba(0,0,0,0.45)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/70" />
                <span className="ml-4 font-mono text-[11px] text-indigo-400/50 tracking-wider">
                  about.sh — tomer@portfolio:~
                </span>
                <span className="ml-auto font-mono text-[10px] text-indigo-400/30">[ system ]</span>
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
                  style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

                {/* ── Top row: bio text (always) + large orbital (desktop only) ── */}
                <div className="flex flex-col lg:flex-row lg:gap-10">

                  {/* LEFT — bio text */}
                  <div className="lg:w-5/12 lg:flex-shrink-0">
                    <div className="mb-6 flex items-center gap-3 flex-wrap" dir="rtl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-indigo-500/25 bg-indigo-500/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
                        <span className="font-mono text-indigo-300 text-xs tracking-widest font-semibold">
                          {aboutData.mainTitle}
                        </span>
                      </div>
                      <span className="font-mono text-indigo-400/40 text-[10px] tracking-wider">HIT · 2025</span>
                    </div>

                    <div
                      className="mb-8 lg:mb-0 cursor-pointer select-none"
                      onClick={finish}
                      title={ui.about.clickToSkipTitle}
                      dir={dir}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-indigo-500 text-sm">$</span>
                        <span className="font-mono text-indigo-400/50 text-xs tracking-widest">cat profile.txt</span>
                      </div>
                      <p className="font-mono text-[13px] sm:text-sm leading-[1.85] text-slate-100 relative">
                        {typed}
                        <span className={`inline-block w-[7px] h-[14px] bg-indigo-400 align-middle ml-0.5 ${done ? 'cursor-blink' : ''}`} />
                      </p>
                      {!done && (
                        <p className="mt-2 font-mono text-indigo-600/50 text-[10px] tracking-widest">
                          {ui.about.clickToSkip}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT — large orbital (desktop only, hidden on mobile) */}
                  <div className="hidden lg:flex flex-1 min-w-0 border-l border-indigo-500/[0.08] pl-8 items-center justify-center">
                    <TechOrbitCard large />
                  </div>

                </div>

                {/* ── Experience + CV (below on desktop, below bio on mobile) ── */}
                <div className="mt-6 lg:mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-indigo-500/10" />
                    <div className="flex items-center gap-1.5 px-3 py-0.5 border border-indigo-500/15 rounded bg-indigo-500/5">
                      <Briefcase size={10} className="text-indigo-400/60" />
                      <span className="font-mono text-[10px] text-indigo-400/60 tracking-widest uppercase">Experience</span>
                    </div>
                    <div className="h-px flex-1 bg-indigo-500/10" />
                  </div>

                  {/* Grid: 1-col mobile, 2-col sm, 3-col lg */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                    {aboutData.experience.map((exp, i) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                        whileHover={{
                          borderColor: 'rgba(99,102,241,0.25)',
                          boxShadow: '0 0 20px rgba(99,102,241,0.08), inset 0 0 20px rgba(99,102,241,0.03)',
                        }}
                        className="rounded-lg border border-indigo-500/10 p-4 transition-colors duration-300"
                        style={{ background: 'rgba(0,0,0,0.3)' }}
                      >
                        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-indigo-500/[0.08]">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 flex-shrink-0" />
                          <span className="font-mono text-[9px] text-indigo-400/50 tracking-widest uppercase">{exp.date}</span>
                        </div>
                        <p className="font-mono text-[11px] text-indigo-300/90 font-semibold leading-tight mb-1">{exp.title}</p>
                        <p className="font-mono text-[10px] text-indigo-400/60 mb-3 tracking-wide">@ {exp.company}</p>
                        <p dir={dir} className="font-body text-slate-400/90 text-xs leading-relaxed">{exp.description}</p>
                      </motion.div>
                    ))}

                    {/* Small orbital — mobile/tablet only (hidden on lg) */}
                    <div className="lg:hidden">
                      <TechOrbitCard />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-indigo-500/10 pt-5">
                    <motion.button
                      onClick={() => setCvOpen(true)}
                      whileHover={{
                        scale: 1.04,
                        boxShadow: '0 0 24px rgba(99,102,241,0.25)',
                        borderColor: 'rgba(99,102,241,0.5)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-indigo-500/25 font-mono text-sm text-indigo-400 will-change-transform transition-colors duration-200"
                      style={{ background: 'rgba(99,102,241,0.05)' }}
                    >
                      <FileText size={14} />
                      <span className="tracking-wider">./view_resume.sh</span>
                    </motion.button>
                  </div>
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
