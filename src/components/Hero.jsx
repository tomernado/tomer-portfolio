import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { useContent } from '../context/LanguageContext'
import {
  Linkedin, Github, Terminal, ChevronDown,
  FileText, Layers, ArrowRight,
  Mail, Phone,
} from 'lucide-react'
import CvModal from './CvModal'
import LogoSVG from './LogoSVG'

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
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/[0.08] border border-indigo-500/25 rounded-full">
      <Terminal size={12} className="text-indigo-400 flex-shrink-0" />
      <span
        className="font-display font-semibold text-sm tracking-widest uppercase text-indigo-300"
        style={{ transition: 'opacity 0.18s', opacity: visible ? 1 : 0, minWidth: 180 }}
      >
        {TITLES[index]}
      </span>
      <span className="text-indigo-400 font-mono text-sm" style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>
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
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:border-white/[0.18] hover:bg-white/[0.07] text-white font-semibold font-body text-[13px] transition-all duration-200 will-change-transform cursor-pointer select-none"
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
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-500">
          // featured.projects
        </p>
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

      <p className="sm:hidden text-center font-mono text-[8px] text-slate-700 mt-2 tracking-widest uppercase">
        tap a card to explore projects
      </p>
    </motion.div>
  )
}

/* ── Main Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const { personalInfo, ui, dir } = useContent()
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
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 lg:gap-16">

          {/* LEFT — logo */}
          <motion.div
            className="flex-shrink-0 relative will-change-transform"
            variants={fadeUp}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' } }}
          >
            <motion.div
              className="hidden md:block absolute inset-0 blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 70%)',
                transform: 'scale(1.7)',
              }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <LogoSVG
              className="relative w-72 sm:w-96"
              style={{ filter: 'drop-shadow(0 0 32px rgba(99,102,241,0.4))' }}
            />
          </motion.div>

          {/* RIGHT — info */}
          <div
            className={`flex flex-col items-center sm:items-start text-center ${dir === 'rtl' ? 'sm:text-right' : 'sm:text-left'} flex-1 gap-3.5`}
            dir={dir}
          >

            {/* Name */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-3">
              {nameWords.map((word, i) => (
                <motion.span
                  key={i} custom={i}
                  variants={wordReveal} initial="hidden" animate="visible"
                  className="inline-block font-body font-extrabold text-3xl sm:text-4xl leading-tight text-shimmer will-change-transform"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Typewriter */}
            <motion.div variants={fadeUp}>
              <TypewriterTitle />
            </motion.div>

            {/* Buttons — unified glass style */}
            <motion.div variants={fadeUp} dir="ltr" className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <SocialBtn href={personalInfo.linkedin} label="LinkedIn"  icon={<Linkedin size={15} />} iconColor="#60a5fa" delay={0.45} />
              <SocialBtn href={personalInfo.whatsapp} label="WhatsApp" icon={WA_ICON}               iconColor="#4ade80" delay={0.53} />
              <SocialBtn href={personalInfo.github}   label="GitHub"   icon={<Github size={15} />}  iconColor="#94a3b8" delay={0.61} />
              <motion.button
                onClick={() => setCvOpen(true)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.69 }}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(96,165,250,0.18)' }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:border-white/[0.18] hover:bg-white/[0.07] text-white font-semibold font-body text-[13px] transition-all duration-200 will-change-transform cursor-pointer select-none"
              >
                <FileText size={15} className="text-blue-400" />
                Resume
              </motion.button>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeUp} dir="ltr" className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center sm:justify-start">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-300 transition-colors duration-200 group"
              >
                <Mail size={12} className="text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />
                <span className="font-mono text-[11px] tracking-wide">{personalInfo.email}</span>
              </a>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Phone size={12} className="text-slate-500/60" />
                <span className="font-mono text-[11px] tracking-wide">{personalInfo.phone}</span>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div variants={fadeUp} className="w-full">
              <button
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                className="group text-right w-full sm:w-auto cursor-pointer"
                dir="rtl"
              >
                <p className="font-body text-slate-400 text-sm leading-relaxed max-w-sm text-center sm:text-right">
                  {bioSnippet}
                  <span className="inline-flex items-center gap-0.5 text-indigo-400/60 group-hover:text-indigo-300 transition-colors font-mono text-[10px] mr-1">
                    {ui.hero.readMore}
                    <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </p>
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
