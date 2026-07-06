import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useAnimationFrame, useReducedMotion, useMotionTemplate } from 'framer-motion'
import { useContent } from '../context/LanguageContext'
import {
  Linkedin, Github, ChevronDown,
  FileText, ArrowRight, ArrowUpRight,
  Briefcase, Pause, Play,
} from 'lucide-react'
import CvModal from './CvModal'
import MagneticButton from './MagneticButton'
import Particles from './Particles'
import { EASE_OUT, ACCENT } from '../motion'

/* ── Variants ───────────────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
}
const wordReveal = {
  hidden:  { opacity: 0, y: 36, filter: 'blur(12px)' },
  visible: (i) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.13 },
  }),
}

/* ── Typewriter ─────────────────────────────────────────────────── */
const TITLES = ['Software Developer', 'AI Developer', 'Full-Stack Developer', 'Backend Developer']

function TypewriterTitle() {
  const [text, setText]       = useState('')
  const [titleIdx, setTitleIdx] = useState(0)
  const [phase, setPhase]     = useState('typing')
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
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT.css, boxShadow: `0 0 8px rgba(${ACCENT.rgb},0.8)` }} />
      <span className="font-mono font-medium text-sm sm:text-base text-white/70 tracking-wide" style={{ minWidth: 200 }}>
        {text}
      </span>
      <span className="text-white/50 font-mono text-sm" style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>
    </div>
  )
}

/* ── WhatsApp icon ──────────────────────────────────────────────── */
const WA_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const SOCIALS = (personalInfo) => [
  { href: personalInfo.linkedin, label: 'LinkedIn', icon: <Linkedin size={15} /> },
  { href: personalInfo.whatsapp, label: 'WhatsApp', icon: WA_ICON },
  { href: personalInfo.github,   label: 'GitHub',   icon: <Github size={15} /> },
]

/* ── Vertical social rail — desktop only, elegant + minimal ─────── */
function SocialRail({ personalInfo, onResumeClick }) {
  const items = [...SOCIALS(personalInfo), { label: 'Resume', icon: <FileText size={15} />, onClick: onResumeClick }]
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.3 }}
      className="hidden lg:flex flex-col items-center gap-5 absolute left-8 xl:left-12 top-1/2 -translate-y-1/2 z-20"
    >
      <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/20" />
      {items.map((item, i) => {
        const Tag = item.href ? MagneticButton : MagneticButton
        return (
          <Tag
            key={i}
            as={item.href ? 'a' : 'button'}
            strength={0.5}
            href={item.href}
            onClick={item.onClick}
            target={item.href ? '_blank' : undefined}
            rel={item.href ? 'noopener noreferrer' : undefined}
            aria-label={item.label}
            title={item.label}
            whileHover={{ color: ACCENT.css }}
            className="text-white/45 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {item.icon}
          </Tag>
        )
      })}
      <div className="w-px h-16 bg-gradient-to-t from-transparent to-white/20" />
      <span
        className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25"
        style={{ writingMode: 'vertical-rl' }}
      >
        Connect
      </span>
    </motion.div>
  )
}

/* ── Project preview strip ──────────────────────────────────────── */
const STRIP_SPEED = 0.05

function ProjectStrip() {
  const { projects } = useContent()
  const reduceMotion = useReducedMotion()
  const doubled  = [...projects, ...projects]
  const trackRef = useRef(null)
  const x        = useMotionValue(0)
  const paused   = useRef(false)
  const started  = useRef(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { started.current = true }, 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => { paused.current = isPaused }, [isPaused])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !started.current || paused.current || !trackRef.current) return
    const half = trackRef.current.scrollWidth / 2
    if (half <= 0) return
    const step = STRIP_SPEED * Math.min(delta, 50)
    const next = x.get() - step
    x.set(next <= -half ? next + half : next)
  })

  const scrollToProjects = () =>
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <motion.div variants={fadeUp} className="w-full mt-14 lg:mt-20">
      <div className="flex items-center justify-between mb-4 px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3.5 rounded-full bg-white/25" />
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50">Featured Projects</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(p => !p)}
            aria-label={isPaused ? 'Play project scroll' : 'Pause project scroll'}
            className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 text-white/50 hover:text-white/80 hover:border-white/25 transition-colors duration-200"
          >
            {isPaused ? <Play size={9} /> : <Pause size={9} />}
          </button>
          <button
            onClick={scrollToProjects}
            className="group flex items-center gap-1 font-mono text-[10px] text-white/45 hover:text-white transition-colors cursor-pointer"
          >
            View All
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden w-full"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = isPaused }}
      >
        <motion.div ref={trackRef} style={{ x, willChange: 'transform' }} className="flex gap-3 w-max">
          {doubled.map((p, i) => (
            <motion.button
              key={`${p.id}-${i}`}
              onClick={scrollToProjects}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="relative w-44 h-[116px] sm:w-52 sm:h-[136px] rounded-2xl overflow-hidden flex-shrink-0 group border border-white/10 cursor-pointer will-change-transform transition-colors duration-300"
            >
              {p.mediaType === 'video' ? (
                <video src={p.media} muted autoPlay loop playsInline preload="metadata"
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              ) : (
                <img src={p.media} alt={p.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-5">
                <p className="font-body text-[9px] sm:text-[10px] text-white/85 font-semibold leading-tight truncate text-left">{p.title}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <p className="sm:hidden text-center font-mono text-[8px] text-white/45 mt-2 tracking-widest uppercase">
        tap a card to explore projects
      </p>
    </motion.div>
  )
}

/* ── Dominant portrait — tilt, glare, color, atmospheric glow ────── */
function Portrait({ src, alt, mvX, mvY }) {
  const reduceMotion = useReducedMotion()
  const rotateX = useSpring(0, { stiffness: 140, damping: 16, mass: 0.6 })
  const rotateY = useSpring(0, { stiffness: 140, damping: 16, mass: 0.6 })
  const glareX  = useMotionValue(50)
  const glareY  = useMotionValue(50)
  const glareBg = useMotionTemplate`radial-gradient(280px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14), transparent 65%)`

  // gentle counter-parallax vs the background layers
  const px = useTransformSafe(mvX, -14)
  const py = useTransformSafe(mvY, -10)

  const onMove = (e) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    rotateY.set((relX - 0.5) * 12)
    rotateX.set(-(relY - 0.5) * 12)
    glareX.set(relX * 100)
    glareY.set(relY * 100)
  }
  const onLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <motion.div style={{ x: px, y: py }} className="perspective-1000 relative">
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-[min(82vw,340px)] sm:w-[380px] lg:w-[420px] aspect-[704/891] will-change-transform"
      >
        <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-white/10">
          <img
            src={src} alt={alt}
            className="w-full h-full object-cover object-top"
            loading="eager" decoding="sync"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
          {!reduceMotion && (
            <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glareBg }} />
          )}
        </div>
        {['top-0 left-0 border-t border-l rounded-tl-lg', 'top-0 right-0 border-t border-r rounded-tr-lg',
          'bottom-0 left-0 border-b border-l rounded-bl-lg', 'bottom-0 right-0 border-b border-r rounded-br-lg']
          .map((pos, i) => (
            <span key={i} className={`absolute w-7 h-7 border-white/35 pointer-events-none ${pos}`} style={{ margin: -11 }} />
          ))}
      </motion.div>
    </motion.div>
  )
}

/* Tiny helper so Portrait can stay a plain component but still react to
   shared motion values passed from Hero without recreating springs per-render. */
function useTransformSafe(mv, factor) {
  return useTransform(mv, (v) => v * factor)
}

/* ── Main Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const { personalInfo, ui, dir } = useContent()
  const reduceMotion = useReducedMotion()
  const nameWords = personalInfo.name.split(' ')
  const [cvOpen, setCvOpen] = useState(false)
  const sectionRef = useRef(null)

  const bioSnippet = personalInfo.aboutText.slice(0, 118).trimEnd() + '…'

  // Shared pointer position (normalised -0.5..0.5) drives every depth layer
  const mvX = useSpring(0, { stiffness: 40, damping: 20 })
  const mvY = useSpring(0, { stiffness: 40, damping: 20 })

  // Cursor-tracked colored light wash
  const lightX = useSpring(50, { stiffness: 35, damping: 18 })
  const lightY = useSpring(40, { stiffness: 35, damping: 18 })
  const lightBg = useMotionTemplate`radial-gradient(650px circle at ${lightX}% ${lightY}%, rgba(${ACCENT.rgb},0.09), transparent 60%)`

  const onSectionMove = (e) => {
    if (reduceMotion || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    lightX.set(relX * 100)
    lightY.set(relY * 100)
    mvX.set(relX - 0.5)
    mvY.set(relY - 0.5)
  }

  // Hero's own cross-section handoff: instead of just fading in and sitting
  // static, it quietly recedes — softening and drifting up — as the reader
  // scrolls it out of view, so About feels like it's arriving over Hero
  // rather than simply appearing after it.
  const { scrollYProgress: heroExit } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const exitOpacity = useTransform(heroExit, [0, 0.6, 1], [1, 1, 0.4])
  const exitScale   = useTransform(heroExit, [0, 0.6, 1], [1, 1, 0.95])
  const exitY        = useTransform(heroExit, [0, 0.6, 1], [0, 0, -30])
  const exitBlur     = useTransform(heroExit, [0, 0.6, 1], [0, 0, 3])
  const exitFilter   = useMotionTemplate`blur(${exitBlur}px)`

  return (
    <section
      ref={sectionRef}
      onMouseMove={onSectionMove}
      id="hero"
      className="relative min-h-screen flex items-center pt-24 px-5 pb-14 overflow-hidden"
    >
      {/* ── Layer 0: atmospheric colored glow behind everything ── */}
      <motion.div
        aria-hidden="true"
        className="hidden md:block absolute rounded-full pointer-events-none will-change-transform"
        style={{
          width: 900, height: 900, right: '8%', top: '50%',
          x: useTransformSafe(mvX, 26), y: useTransformSafe(mvY, 20),
          translateY: '-50%',
          background: `radial-gradient(circle, rgba(${ACCENT.rgb},0.16) 0%, rgba(${ACCENT.rgb2},0.06) 40%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Layer 1: ambient particles ── */}
      <Particles count={14} />

      {/* ── Layer 2: cursor-tracked light wash ── */}
      {!reduceMotion && (
        <motion.div aria-hidden="true" className="hidden md:block absolute inset-0 pointer-events-none" style={{ background: lightBg }} />
      )}

      {/* ── Vertical social rail ── */}
      <SocialRail personalInfo={personalInfo} onResumeClick={() => setCvOpen(true)} />

      <motion.div
        className="max-w-6xl mx-auto w-full relative lg:pl-16 xl:pl-20"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        style={reduceMotion ? undefined : { opacity: exitOpacity, scale: exitScale, y: exitY, filter: exitFilter }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* LEFT — content, in a faint glass panel (desktop only — mobile stays tight/unboxed) */}
          <div
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-start gap-5 min-w-0 w-full order-2 lg:order-1 rounded-[32px] lg:p-8 lg:-m-8 lg:border lg:border-white/[0.04] lg:bg-white/[0.012] lg:backdrop-blur-[2px]"
            dir={dir}
          >
            <motion.p variants={fadeUp} className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/50" dir="ltr">
              Software Engineer · Full-Stack &amp; AI
            </motion.p>

            {/* flex-nowrap from sm+ keeps the name's line-count stable across the
                fallback→webfont swap, so that reflow can't cascade into a large
                layout shift for anchor-scroll targets further down the page */}
            <div className="flex flex-wrap sm:flex-nowrap justify-center lg:justify-start gap-x-3 sm:gap-x-4" dir={dir}>
              {nameWords.map((word, i) => (
                <motion.span
                  key={i} custom={i}
                  variants={wordReveal} initial="hidden" animate="visible"
                  className="inline-block font-body font-extrabold leading-[1.05] text-shimmer will-change-transform tracking-tight whitespace-nowrap"
                  style={{ fontSize: 'clamp(2.75rem, 6.4vw, 5rem)' }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <motion.div variants={fadeUp}><TypewriterTitle /></motion.div>

            <motion.button
              variants={fadeUp}
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              className="group max-w-sm lg:max-w-md cursor-pointer text-center lg:text-start"
              dir={dir}
            >
              <p className="font-body text-white/50 text-[15px] sm:text-base leading-[1.8]">
                {bioSnippet}
                <span className="inline-flex items-center gap-0.5 text-white/60 group-hover:text-white transition-colors font-mono text-[11px] ml-1.5">
                  {ui.hero.readMore}
                  <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </p>
            </motion.button>

            {/* CTA — one dominant, one visually light */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-1" dir="ltr">
              <MagneticButton
                strength={0.3}
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ boxShadow: `0 10px 40px rgba(${ACCENT.rgb},0.35)` }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-full bg-white text-black font-body font-semibold text-sm cursor-pointer"
              >
                View My Work
                <ArrowUpRight size={16} />
              </MagneticButton>
              <MagneticButton
                strength={0.25}
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ gap: '0.6rem' }}
                className="flex items-center gap-1.5 font-body font-medium text-sm text-white/60 hover:text-white cursor-pointer border-b border-transparent hover:border-white/30 pb-0.5 transition-colors"
              >
                Get In Touch
                <ArrowRight size={14} />
              </MagneticButton>
            </motion.div>

            {/* Social icons — mobile/tablet only (desktop uses the vertical rail) */}
            <motion.div variants={fadeUp} className="flex lg:hidden items-center gap-3 mt-1" dir="ltr">
              {SOCIALS(personalInfo).map((s) => (
                <MagneticButton
                  key={s.label} as="a" strength={0.4}
                  href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label={s.label}
                  whileHover={{ borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.07)' }}
                  whileTap={{ scale: 0.94 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/75 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {s.icon}
                </MagneticButton>
              ))}
              <MagneticButton
                as="button" strength={0.4} onClick={() => setCvOpen(true)} title="Resume" aria-label="Resume"
                whileHover={{ borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.07)' }}
                whileTap={{ scale: 0.94 }}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/75 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <FileText size={16} />
              </MagneticButton>
            </motion.div>

            {/* Web4You callout */}
            <motion.div variants={fadeUp} dir="ltr" className="w-full max-w-sm lg:max-w-md mt-2">
              <button
                onClick={() => document.querySelector('#web4you')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 text-left cursor-pointer"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-white/12 bg-white/[0.04]">
                  <Briefcase size={13} className="text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/50 mb-0.5">{ui.hero.coFounder}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-body font-bold text-[13px] text-white leading-tight whitespace-nowrap">Web4You</span>
                    <span className="hidden sm:block text-white/20 text-xs">·</span>
                    <span className="font-body text-white/45 text-xs leading-snug truncate">{ui.hero.web4youDesc}</span>
                  </div>
                </div>
                <span className="hidden sm:inline flex-shrink-0 font-mono text-[10px] tracking-widest uppercase text-white/45 group-hover:text-white/70 transition-colors duration-200">
                  {ui.hero.seeMore}
                </span>
                <ArrowRight size={14} className="flex-shrink-0 text-white/45 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
              </button>
            </motion.div>
          </div>

          {/* RIGHT — dominant portrait. Mobile: bleeds to the screen edges
              (negative margin cancels the section's own px-5) instead of
              sitting as a shrunk copy of the desktop card. */}
          <motion.div
            className="flex-shrink-0 relative order-1 lg:order-2 will-change-transform -mx-5 sm:mx-0 w-[calc(100%+2.5rem)] sm:w-auto flex justify-center"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
          >
            <Portrait src={personalInfo.profileMedia} alt={personalInfo.name} mvX={mvX} mvY={mvY} />
          </motion.div>
        </div>

        <ProjectStrip />

        <motion.div
          className="flex flex-col items-center gap-2 text-white/45 mt-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">{ui.hero.discoverWork}</span>
          <motion.button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white/45 hover:text-white transition-colors duration-200 will-change-transform"
            aria-label="Scroll to About"
          >
            <ChevronDown size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  )
}
