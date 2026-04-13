import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { personalInfo, projects } from '../data/content'
import {
  Linkedin, Github, Terminal, ChevronDown,
  FileText, Layers, ArrowRight,
  Mail, Phone,
} from 'lucide-react'
import CvModal from './CvModal'

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
const TITLES = ['Full-Stack Engineer', 'OOP Architect', 'Security Developer', 'AI-Assisted Dev']

function TypewriterTitle() {
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(true)
  const [blink, setBlink]     = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIndex(i => (i + 1) % TITLES.length); setVisible(true) }, 200)
    }, 3000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full">
      <Terminal size={12} className="text-teal-400 flex-shrink-0" />
      <span
        className="font-display font-semibold text-sm tracking-widest uppercase text-teal-300"
        style={{ transition: 'opacity 0.18s', opacity: visible ? 1 : 0, minWidth: 180 }}
      >
        {TITLES[index]}
      </span>
      <span className="text-teal-400 font-mono text-sm" style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>
    </div>
  )
}

/* ── Social buttons ─────────────────────────────────────────────── */
const socialBtns = [
  {
    href: personalInfo.linkedin, label: 'LinkedIn', sublabel: 'Connect',
    icon: <Linkedin size={14} />,
    bg: 'linear-gradient(160deg,#2dd4bf 0%,#0d9488 55%,#0f766e 100%)',
    shadow: '0 6px 22px rgba(13,148,136,0.5),inset 0 1px 0 rgba(255,255,255,0.25),inset 0 -2px 0 rgba(0,0,0,0.2)',
    shadowHover: '0 10px 32px rgba(13,148,136,0.65),inset 0 1px 0 rgba(255,255,255,0.3)',
    shadowTap: '0 2px 8px rgba(13,148,136,0.4),inset 0 2px 5px rgba(0,0,0,0.3)',
  },
  {
    href: personalInfo.whatsapp, label: 'WhatsApp', sublabel: 'Message',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    bg: 'linear-gradient(160deg,#4ade80 0%,#16a34a 55%,#15803d 100%)',
    shadow: '0 6px 22px rgba(22,163,74,0.5),inset 0 1px 0 rgba(255,255,255,0.25),inset 0 -2px 0 rgba(0,0,0,0.2)',
    shadowHover: '0 10px 32px rgba(22,163,74,0.65),inset 0 1px 0 rgba(255,255,255,0.3)',
    shadowTap: '0 2px 8px rgba(22,163,74,0.4),inset 0 2px 5px rgba(0,0,0,0.3)',
  },
  {
    href: personalInfo.github, label: 'GitHub', sublabel: 'Code',
    icon: <Github size={14} />,
    bg: 'linear-gradient(160deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.07) 100%)',
    shadow: '0 6px 22px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.2),inset 0 -2px 0 rgba(0,0,0,0.22),0 0 0 1px rgba(255,255,255,0.1)',
    shadowHover: '0 10px 32px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.25),0 0 0 1px rgba(255,255,255,0.16)',
    shadowTap: '0 2px 8px rgba(0,0,0,0.35),inset 0 2px 5px rgba(0,0,0,0.3)',
  },
]

function SocialBtn({ btn, delay }) {
  return (
    <motion.a
      href={btn.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay }}
      whileHover={{ scale: 1.07, y: -3, boxShadow: btn.shadowHover }}
      whileTap={{ scale: 0.96, y: 1, boxShadow: btn.shadowTap }}
      style={{ background: btn.bg, boxShadow: btn.shadow }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer select-none will-change-transform"
    >
      <span className="text-white">{btn.icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-white font-semibold font-body text-[13px]">{btn.label}</span>
        <span className="text-white/55 font-body text-[9px] tracking-wide hidden sm:block mt-0.5">{btn.sublabel}</span>
      </div>
    </motion.a>
  )
}

/* ── Stack chips + Web4You ──────────────────────────────────────── */
const STACK_CHIPS = [
  'React', 'Java', 'C#', 'Node.js', 'Python', 'SQL', 'OOP', 'S-SDLC',
]

function StackAndBusiness() {
  const goSkills = () => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <motion.div variants={fadeUp} dir="ltr" className="w-full space-y-2.5">
      {/* Label */}
      <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-slate-600 text-center sm:text-left">
        // tech stack
      </p>

      {/* Chips row — all scroll to #skills */}
      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
        {STACK_CHIPS.map((chip, i) => (
          <motion.button
            key={chip}
            onClick={goSkills}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65 + i * 0.045, duration: 0.3, ease: 'backOut' }}
            whileHover={{
              y: -2,
              boxShadow: '0 0 10px rgba(45,212,191,0.18)',
              borderColor: 'rgba(45,212,191,0.4)',
              color: '#5eead4',
            }}
            whileTap={{ scale: 0.94 }}
            className="font-mono text-[10px] tracking-wide text-slate-500 border border-white/[0.09] rounded-lg px-2.5 py-1 cursor-pointer will-change-transform transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Project preview strip ──────────────────────────────────────── */
const STRIP_SPEED = 0.05

function ProjectStrip() {
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
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
          // featured.projects
        </p>
        <motion.button
          onClick={scrollToProjects}
          whileHover={{ x: 2 }}
          className="group flex items-center gap-1 font-mono text-[10px] text-teal-500 hover:text-teal-300 transition-colors cursor-pointer"
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
              whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="relative w-40 h-[104px] sm:w-48 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 group border border-white/8 cursor-pointer will-change-transform"
            >
              {p.mediaType === 'video' ? (
                <video
                  src={p.media} muted autoPlay loop playsInline preload="metadata"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <img
                  src={p.media} alt={p.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Hover overlay — "Explore" badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
                  <Layers size={8} className="text-white" />
                  <span className="font-mono text-[8px] text-white tracking-wider">Explore</span>
                </span>
              </div>

              <p className="absolute bottom-2 left-2 right-2 font-mono text-[8px] text-white/65 truncate text-left">
                {p.title}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Mobile hint */}
      <p className="sm:hidden text-center font-mono text-[8px] text-slate-700 mt-2 tracking-widest uppercase">
        tap a card to explore projects
      </p>
    </motion.div>
  )
}

/* ── Main Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const nameWords = personalInfo.name.split(' ')
  const [cvOpen, setCvOpen] = useState(false)

  const bioSnippet = personalInfo.aboutText.slice(0, 115).trimEnd() + '…'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 px-5 pb-10 overflow-hidden"
    >
      <motion.div
        className="max-w-5xl mx-auto w-full"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Two-column layout ── */}
        <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-14">

          {/* LEFT — avatar */}
          <motion.div
            className="flex-shrink-0 relative will-change-transform"
            variants={fadeUp}
            animate={{ y: [0, -12, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
          >
            {/* Outer dashed rotating ring */}
            <motion.div
              className="absolute rounded-full border-2 border-dashed border-teal-500/30"
              style={{ inset: '-16px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            {/* Second slower counter-rotating ring — desktop only */}
            <motion.div
              className="hidden sm:block absolute rounded-full border border-blue-500/15"
              style={{ inset: '-28px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            {/* Glow blob — desktop only */}
            <motion.div
              className="hidden md:block absolute inset-0 rounded-full bg-teal-500/20 blur-3xl scale-[1.7]"
              animate={{ opacity: [0.35, 0.8, 0.35], scale: [1.7, 2.0, 1.7] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Photo */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-4 ring-teal-500/55 ring-offset-4 ring-offset-slate-950 shadow-[0_0_70px_rgba(20,184,166,0.4)]">
              <img src={personalInfo.profileMedia} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_12px_rgba(52,211,153,1)]">
              <span className="block w-full h-full rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </motion.div>

          {/* RIGHT — info (new order: name → title → buttons → bio → nav) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-right flex-1 gap-4" dir="rtl">

            {/* 1. Name */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4">
              {nameWords.map((word, i) => (
                <motion.span
                  key={i} custom={i}
                  variants={wordReveal} initial="hidden" animate="visible"
                  className="inline-block font-body font-extrabold text-5xl sm:text-6xl leading-tight text-shimmer will-change-transform"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* 2. Typewriter title */}
            <motion.div variants={fadeUp}>
              <TypewriterTitle />
            </motion.div>

            {/* 3. Social + CV buttons — moved up for immediate CTA */}
            <motion.div variants={fadeUp} dir="ltr" className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
              {socialBtns.map((btn, i) => (
                <SocialBtn key={btn.label} btn={btn} delay={0.45 + i * 0.08} />
              ))}
              {/* CV button — mobile: direct PDF link, desktop: modal */}
              <motion.a
                href={personalInfo.cvPdf}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.69 }}
                whileTap={{ scale: 0.96, y: 1 }}
                className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-500/30 will-change-transform"
                style={{
                  background: 'linear-gradient(135deg,rgba(45,212,191,0.1) 0%,rgba(15,118,110,0.16) 100%)',
                  boxShadow: '0 4px 16px rgba(20,184,166,0.18),inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <FileText size={14} className="text-teal-400" />
                <span className="text-teal-100 font-semibold font-body text-[13px]">Resume</span>
              </motion.a>
              <motion.button
                onClick={() => setCvOpen(true)}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.69 }}
                whileHover={{ scale: 1.07, y: -3, boxShadow: '0 8px 28px rgba(20,184,166,0.35)' }}
                whileTap={{ scale: 0.96, y: 1 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-500/30 will-change-transform"
                style={{
                  background: 'linear-gradient(135deg,rgba(45,212,191,0.1) 0%,rgba(15,118,110,0.16) 100%)',
                  boxShadow: '0 4px 16px rgba(20,184,166,0.18),inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <FileText size={14} className="text-teal-400" />
                <div className="flex flex-col leading-none">
                  <span className="text-teal-100 font-semibold font-body text-[13px]">Resume</span>
                  <span className="text-white/50 font-body text-[9px] tracking-wide mt-0.5">View / Download</span>
                </div>
              </motion.button>
            </motion.div>

            {/* 4. Compact contact */}
            <motion.div variants={fadeUp} dir="ltr" className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center sm:justify-start">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 text-slate-500 hover:text-teal-300 transition-colors duration-200 group"
              >
                <Mail size={12} className="text-teal-500/60 group-hover:text-teal-400 transition-colors" />
                <span className="font-mono text-[11px] tracking-wide">{personalInfo.email}</span>
              </a>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Phone size={12} className="text-green-500/60" />
                <span className="font-mono text-[11px] tracking-wide">{personalInfo.phone}</span>
              </div>
            </motion.div>

            {/* 5. Bio snippet — clickable → About */}
            <motion.div variants={fadeUp} className="w-full">
              <button
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="group text-right w-full sm:w-auto cursor-pointer"
                dir="rtl"
              >
                <p className="font-body text-slate-400 text-sm leading-relaxed max-w-sm text-center sm:text-right">
                  {bioSnippet}
                  <span className="inline-flex items-center gap-0.5 text-teal-500/70 group-hover:text-teal-300 transition-colors font-mono text-[10px] mr-1">
                    קרא עוד
                    <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </p>
              </button>
            </motion.div>

            {/* 6. Stack chips + Web4You */}
            <StackAndBusiness />
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
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Discover My Work</span>
          <motion.button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-slate-600 hover:text-teal-400 transition-colors duration-200 will-change-transform"
          >
            <ChevronDown size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  )
}
