import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { useContent } from '../context/LanguageContext'
import {
  Linkedin, Github, Terminal, ChevronDown,
  FileText, Layers, ArrowRight,
  Briefcase, ExternalLink,
} from 'lucide-react'
import CvModal from './CvModal'
import LogoMark from './LogoMark'

/* ── Variants ───────────────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}
const wordReveal = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.12 },
  }),
}

/* ── Typewriter ─────────────────────────────────────────────────── */
const TITLES = ['Software Developer', 'AI Developer', 'Full-Stack Developer', 'Backend Developer']

function TypewriterTitle() {
  const [text, setText]       = useState('')
  const [titleIdx, setTitleIdx] = useState(0)
  const [phase, setPhase]     = useState('typing') // 'typing' | 'deleting'
  const [blink, setBlink]     = useState(true)

  useEffect(() => {
    const title = TITLES[titleIdx]

    if (phase === 'typing') {
      if (text.length < title.length) {
        const id = setTimeout(() => setText(title.slice(0, text.length + 1)), 88)
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setPhase('deleting'), 1900)
        return () => clearTimeout(id)
      }
    }

    if (phase === 'deleting') {
      if (text.length > 0) {
        const id = setTimeout(() => setText(prev => prev.slice(0, -1)), 50)
        return () => clearTimeout(id)
      } else {
        setTitleIdx(i => (i + 1) % TITLES.length)
        setPhase('typing')
      }
    }
  }, [text, phase, titleIdx])

  useEffect(() => {
    const iv = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex items-center gap-3" dir="ltr">
      <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
      <span
        className="font-body font-semibold text-lg sm:text-xl text-slate-200 tracking-wide"
        style={{ minWidth: 210 }}
      >
        {text}
      </span>
      <span className="text-blue-400 font-mono text-lg" style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>
    </div>
  )
}

/* ── Unified glass social button ────────────────────────────────── */
const WA_ICON = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function SocialBtn({ href, label, icon, iconColor, delay }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay }}
      whileHover={{ y: -2, boxShadow: `0 8px 24px ${iconColor}20` }}
      whileTap={{ scale: 0.96 }}
      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:border-white/[0.18] hover:bg-white/[0.07] text-white font-semibold font-body text-[13px] transition-all duration-200 will-change-transform cursor-pointer select-none"
    >
      <span style={{ color: iconColor }}>{icon}</span>
      {label}
    </motion.a>
  )
}

/* ── Project preview strip ──────────────────────────────────────── */
const STRIP_SPEED = 0.05

function ProjectStrip() {
  const { projects } = useContent()
  const doubled  = [...projects, ...projects]
  const trackRef = useRef(null)
  const x        = useMotionValue(0)
  const paused   = useRef(false)
  const started  = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => { started.current = true }, 700)
    return () => clearTimeout(t)
  }, [])

  useAnimationFrame((_, delta) => {
    if (!started.current || paused.current || !trackRef.current) return
    const half = trackRef.current.scrollWidth / 2
    if (half <= 0) return
    const step = STRIP_SPEED * Math.min(delta, 50)
    const next = x.get() - step
    x.set(next <= -half ? next + half : next)
  })

  const scrollToProjects = () =>
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <motion.div variants={fadeUp} className="w-full mt-10">

      {/* Header row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3.5 rounded-full bg-indigo-500/55" />
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-slate-500">
            Featured Projects
          </p>
        </div>
        <motion.button
          onClick={scrollToProjects}
          whileHover={{ x: 2 }}
          className="group flex items-center gap-1 font-mono text-[10px] text-indigo-400/70 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          View All
          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </motion.button>
      </div>

      {/* Strip */}
      <div
        className="overflow-hidden w-full"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
      >
        <motion.div
          ref={trackRef}
          style={{ x, willChange: 'transform' }}
          className="flex gap-3 w-max"
        >
          {doubled.map((p, i) => (
            <motion.button
              key={`${p.id}-${i}`}
              onClick={scrollToProjects}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,102,241,0.22)' }}
              whileTap={{ scale: 0.97 }}
              className="relative w-44 h-[116px] sm:w-52 sm:h-[136px] rounded-2xl overflow-hidden flex-shrink-0 group border border-white/[0.1] hover:border-indigo-400/25 cursor-pointer will-change-transform transition-colors duration-300"
            >
              {p.mediaType === 'video' ? (
                <video
                  src={p.media} muted autoPlay loop playsInline preload="metadata"
                  className="w-full h-full object-cover opacity-55 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <img
                  src={p.media} alt={p.title}
                  className="w-full h-full object-cover opacity-55 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              {/* Hover indigo tint */}
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.07] transition-colors duration-300" />

              {/* Hover explore chip — top right */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-250 translate-y-1 group-hover:translate-y-0">
                <span className="flex items-center gap-1 bg-indigo-500/75 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <Layers size={7} className="text-white" />
                  <span className="font-mono text-[7px] text-white tracking-wider uppercase">View</span>
                </span>
              </div>

              {/* Bottom title bar */}
              <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-5">
                <p className="font-body text-[9px] sm:text-[10px] text-white/85 font-semibold leading-tight truncate text-left">
                  {p.title}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <p className="sm:hidden text-center font-mono text-[8px] text-slate-700 mt-2 tracking-widest uppercase">
        tap a card to explore projects
      </p>
    </motion.div>
  )
}

/* ── Main Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const { personalInfo, web4youData, ui, dir } = useContent()
  const nameWords = personalInfo.name.split(' ')
  const [cvOpen, setCvOpen] = useState(false)

  const bioSnippet = personalInfo.aboutText.slice(0, 115).trimEnd() + '…'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-start sm:justify-center pt-16 px-5 pb-10 overflow-hidden"
    >
      <motion.div
        className="max-w-6xl mx-auto w-full"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Two-column layout ── */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-12 lg:gap-16">

          {/* LEFT — logo (layoutId links to IntroSplash logo for the fly-in transition) */}
          <motion.div
            className="flex-shrink-0 relative will-change-transform"
            variants={fadeUp}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' } }}
          >
            {/* Ambient glow */}
            <motion.div
              className="hidden md:block absolute inset-0 blur-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 65%)',
                transform: 'scale(1.1)',
              }}
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              layoutId="hero-logo"
              className="relative w-[min(92vw,300px)] sm:w-[520px] overflow-hidden aspect-[510/262] sm:aspect-auto"
              transition={{ layout: { type: 'spring', stiffness: 180, damping: 30, mass: 1 } }}
            >
              <LogoMark
                className="w-full"
                style={{ filter: 'drop-shadow(0 0 14px rgba(99,102,241,0.22))' }}
                nameClassName="hidden sm:block"
              />
            </motion.div>
          </motion.div>

          {/* RIGHT — info */}
          <div
            className="flex flex-col items-center text-center flex-1 gap-3.5 relative"
          >

            {/* Name + Photo row — grouped and centered */}
            <div className="flex items-center gap-4 sm:gap-5" dir="ltr">
              <div className="flex gap-x-2 sm:gap-x-3" dir={dir}>
                {nameWords.map((word, i) => (
                  <motion.span
                    key={i} custom={i}
                    variants={wordReveal} initial="hidden" animate="visible"
                    className="inline-block font-body font-extrabold text-[28px] sm:text-5xl lg:text-6xl leading-tight text-shimmer will-change-transform tracking-tight whitespace-nowrap"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0 w-[76px] h-[76px] sm:w-[112px] sm:h-[112px] rounded-full overflow-hidden border-2 border-indigo-500/40 shadow-[0_0_28px_rgba(99,102,241,0.25)] ring-1 ring-white/[0.08]"
              >
                <img
                  src={personalInfo.profileMedia}
                  alt="Tomer Cohen"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="sync"
                  style={{ transform: 'translate3d(0,0,0)', WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', imageRendering: 'auto' }}
                />
              </motion.div>
            </div>

            {/* Typewriter */}
            <motion.div variants={fadeUp}>
              <TypewriterTitle />
            </motion.div>

            {/* 2×2 buttons + Bio side by side */}
            <motion.div variants={fadeUp} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch" dir="ltr">
                {/* 2×2 social buttons — LEFT */}
                <div className="grid grid-cols-2 gap-2 flex-shrink-0 content-start">
                  <SocialBtn href={personalInfo.linkedin} label="LinkedIn"  icon={<Linkedin size={14} />} iconColor="#60a5fa" delay={0.45} />
                  <SocialBtn href={personalInfo.whatsapp} label="WhatsApp" icon={WA_ICON}               iconColor="#4ade80" delay={0.53} />
                  <SocialBtn href={personalInfo.github}   label="GitHub"   icon={<Github size={14} />}  iconColor="#94a3b8" delay={0.61} />
                  <motion.button
                    onClick={() => setCvOpen(true)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.69 }}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(96,165,250,0.18)' }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:border-white/[0.18] hover:bg-white/[0.07] text-white font-semibold font-body text-[13px] transition-all duration-200 will-change-transform cursor-pointer select-none"
                  >
                    <FileText size={14} className="text-blue-400" />
                    Resume
                  </motion.button>
                </div>

                {/* Bio card — RIGHT */}
                <button
                  onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex-1 min-w-0 cursor-pointer"
                  dir={dir}
                >
                  <div className="relative p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.055] hover:border-indigo-500/20 transition-colors duration-300 h-full">
                    <p className="font-body text-slate-400/90 text-sm leading-[1.8]">
                      {bioSnippet}
                      <span className="inline-flex items-center gap-0.5 text-indigo-400/60 group-hover:text-indigo-300 transition-colors font-mono text-[10px] ml-1">
                        {ui.hero.readMore}
                        <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Web4You callout — below buttons & bio */}
            <motion.div variants={fadeUp} dir="ltr" className="w-full">
              <button
                onClick={() => document.querySelector('#web4you')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.04] hover:bg-indigo-500/[0.08] hover:border-indigo-500/30 transition-all duration-300 text-left cursor-pointer"
              >
                {/* Icon box */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  <Briefcase size={15} className="text-indigo-400" />
                </div>

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-indigo-400/55 mb-0.5">Co-Founder</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-body font-bold text-[13px] text-white leading-tight whitespace-nowrap">Web4You</span>
                    <span className="hidden sm:block text-slate-600 text-xs">·</span>
                    <span className="font-body text-slate-400/80 text-xs leading-snug truncate">Designing & shipping production-grade web apps</span>
                  </div>
                </div>

                {/* CTA chip */}
                <div
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-semibold text-[11px] text-white group-hover:scale-105 transition-transform duration-200"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
                >
                  <span className="hidden sm:inline">See More</span>
                  <ArrowRight size={11} />
                </div>
              </button>
            </motion.div>

          </div>
        </div>

        {/* ── Project preview strip (full width) ── */}
        <ProjectStrip />

        {/* ── Scroll CTA ── */}
        <motion.div
          className="flex flex-col items-center gap-2 text-slate-600 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{ui.hero.discoverWork}</span>
          <motion.button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-slate-600 hover:text-indigo-400 transition-colors duration-200 will-change-transform"
          >
            <ChevronDown size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  )
}
