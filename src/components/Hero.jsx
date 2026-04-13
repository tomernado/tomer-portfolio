import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { personalInfo, projects } from '../data/content'
import { MessageCircle, Linkedin, Github, Terminal, ChevronDown, FileText, Zap, Shield, Layers } from 'lucide-react'
import CvModal from './CvModal'

/* ── Animation variants ─────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] } },
}
const wordReveal = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.13 },
  }),
}

/* ── Typewriter titles ──────────────────────────────────────────── */
const TITLES = [
  'Full-Stack Engineer',
  'OOP Architect',
  'Security Developer',
  'AI-Assisted Dev',
]

function TypewriterTitle() {
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(true)
  const [blink, setBlink]     = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % TITLES.length)
        setVisible(true)
      }, 200)
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
        style={{ transition: 'opacity 0.18s', opacity: visible ? 1 : 0 }}
      >
        {TITLES[index]}
      </span>
      <span
        className="text-teal-400 font-mono text-sm"
        style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}
      >|</span>
    </div>
  )
}

/* ── Section pills ──────────────────────────────────────────────── */
const PILLS = [
  { label: 'Stack & Skills', icon: <Zap size={12} />,    href: '#skills'   },
  { label: 'Secure Systems', icon: <Shield size={12} />, href: '#projects' },
  { label: 'My Projects',    icon: <Layers size={12} />, href: '#projects' },
]

function SectionPills({ onOpenCv }) {
  const handleClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center sm:justify-start"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.85 } } }}
      initial="hidden"
      animate="visible"
    >
      {PILLS.map((pill) => (
        <motion.a
          key={pill.label}
          href={pill.href}
          onClick={(e) => handleClick(e, pill.href)}
          variants={{
            hidden:  { opacity: 0, scale: 0.85, y: 10 },
            visible: { opacity: 1, scale: 1,    y: 0,
                       transition: { type: 'spring', stiffness: 300, damping: 22 } },
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide text-slate-400 hover:text-teal-300 border border-white/10 hover:border-teal-500/40 bg-white/[0.03] transition-colors duration-200 cursor-pointer select-none will-change-transform"
        >
          <span className="text-teal-500/70">{pill.icon}</span>
          {pill.label}
        </motion.a>
      ))}
      <motion.button
        onClick={onOpenCv}
        variants={{
          hidden:  { opacity: 0, scale: 0.85, y: 10 },
          visible: { opacity: 1, scale: 1,    y: 0,
                     transition: { type: 'spring', stiffness: 300, damping: 22 } },
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide text-slate-400 hover:text-teal-300 border border-white/10 hover:border-teal-500/40 bg-white/[0.03] transition-colors duration-200 cursor-pointer select-none will-change-transform"
      >
        <span className="text-teal-500/70"><FileText size={12} /></span>
        Resume
      </motion.button>
    </motion.div>
  )
}

/* ── Social buttons ─────────────────────────────────────────────── */
const socialBtns = [
  {
    href: personalInfo.linkedin,
    label: 'LinkedIn',
    sublabel: 'Professional Profile',
    icon: <Linkedin size={15} />,
    bg: 'linear-gradient(160deg, #2dd4bf 0%, #0d9488 55%, #0f766e 100%)',
    shadow: '0 6px 22px rgba(13,148,136,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowHover: '0 10px 32px rgba(13,148,136,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
    shadowTap: '0 2px 8px rgba(13,148,136,0.45), inset 0 2px 5px rgba(0,0,0,0.3)',
  },
  {
    href: personalInfo.whatsapp,
    label: 'WhatsApp',
    sublabel: 'Send a Message',
    icon: <MessageCircle size={15} />,
    bg: 'linear-gradient(160deg, #4ade80 0%, #16a34a 55%, #15803d 100%)',
    shadow: '0 6px 22px rgba(22,163,74,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowHover: '0 10px 32px rgba(22,163,74,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
    shadowTap: '0 2px 8px rgba(22,163,74,0.45), inset 0 2px 5px rgba(0,0,0,0.3)',
  },
  {
    href: personalInfo.github,
    label: 'GitHub',
    sublabel: 'Open Source',
    icon: <Github size={15} />,
    bg: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
    shadow: '0 6px 22px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.12)',
    shadowHover: '0 10px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), 0 0 0 1px rgba(255,255,255,0.18)',
    shadowTap: '0 2px 8px rgba(0,0,0,0.4), inset 0 2px 5px rgba(0,0,0,0.3)',
  },
]

function SocialBtn({ btn }) {
  return (
    <motion.a
      href={btn.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -3, boxShadow: btn.shadowHover }}
      whileTap={{ scale: 0.97, y: 1, boxShadow: btn.shadowTap }}
      style={{ background: btn.bg, boxShadow: btn.shadow }}
      className="relative overflow-hidden flex flex-col items-center px-5 py-2.5 rounded-xl cursor-pointer select-none will-change-transform min-w-[88px]"
    >
      <span className="text-white flex-shrink-0 mb-0.5">{btn.icon}</span>
      <span className="text-white font-semibold font-body text-[13px] leading-tight">{btn.label}</span>
      <span className="text-white/60 font-body text-[9px] tracking-wide leading-tight hidden sm:block">{btn.sublabel}</span>
    </motion.a>
  )
}

/* ── Project preview strip ──────────────────────────────────────── */
const STRIP_SPEED = 0.045

function ProjectStrip() {
  const doubled  = [...projects, ...projects]
  const trackRef = useRef(null)
  const x        = useMotionValue(0)
  const paused   = useRef(false)

  useAnimationFrame((_, delta) => {
    if (paused.current || !trackRef.current) return
    const half = trackRef.current.scrollWidth / 2
    if (half <= 0) return
    const step = STRIP_SPEED * Math.min(delta, 50)
    const next = x.get() - step
    x.set(next <= -half ? next + half : next)
  })

  return (
    <motion.div variants={fadeUp} className="w-full mt-10">
      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-600 mb-3 px-1">
        // featured.projects
      </p>
      <div
        className="overflow-hidden w-full rounded-xl"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
      >
        <motion.div
          ref={trackRef}
          style={{ x, willChange: 'transform' }}
          className="flex gap-3 w-max"
        >
          {doubled.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="relative w-40 h-[104px] sm:w-48 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 group border border-white/8"
            >
              {p.mediaType === 'video' ? (
                <video
                  src={p.media}
                  muted autoPlay loop playsInline
                  preload="metadata"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <img
                  src={p.media}
                  alt={p.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <p className="absolute bottom-2 left-2 right-2 font-mono text-[8px] text-white/70 truncate">
                {p.title}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ── Contact row ────────────────────────────────────────────────── */
function ContactRow({ icon, label, value, accentColor }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderLeft: `2.5px solid ${accentColor}`,
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div
        className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
        style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}
      >
        {icon}
      </div>
      <div className="flex flex-col flex-1 min-w-0 items-center sm:items-start text-center sm:text-left">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-slate-500 leading-none mb-1">{label}</span>
        <span className="font-mono text-sm tracking-wide truncate" style={{ color: 'rgba(226,232,240,0.9)' }}>{value}</span>
      </div>
    </div>
  )
}

/* ── Main Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const nameWords = personalInfo.name.split(' ')
  const [cvOpen, setCvOpen] = useState(false)

  const bioSnippet = personalInfo.aboutText.slice(0, 130).trimEnd() + '…'

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
        <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16">

          {/* LEFT — avatar */}
          <motion.div
            className="flex-shrink-0 relative will-change-transform"
            variants={fadeUp}
            animate={{ y: [0, -14, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
          >
            {/* Outer dashed rotating ring */}
            <motion.div
              className="absolute rounded-full border-2 border-dashed border-teal-500/35"
              style={{ inset: '-14px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            {/* Glow blob — desktop only */}
            <motion.div
              className="hidden md:block absolute inset-0 rounded-full bg-teal-500/25 blur-3xl scale-[1.6]"
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [1.6, 1.9, 1.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Photo */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-4 ring-teal-500/60 ring-offset-4 ring-offset-slate-950 shadow-[0_0_70px_rgba(20,184,166,0.4)]">
              <img src={personalInfo.profileMedia} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_12px_rgba(52,211,153,1)]">
              <span className="block w-full h-full rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </motion.div>

          {/* RIGHT — info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-right flex-1" dir="rtl">

            {/* Name */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 mb-3">
              {nameWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordReveal}
                  initial="hidden"
                  animate="visible"
                  className="inline-block font-body font-extrabold text-5xl sm:text-6xl leading-tight text-shimmer will-change-transform"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Typewriter */}
            <motion.div variants={fadeUp} className="mb-4">
              <TypewriterTitle />
            </motion.div>

            {/* Bio snippet */}
            <motion.p
              variants={fadeUp}
              dir="rtl"
              className="font-body text-slate-400 text-sm leading-relaxed mb-5 max-w-sm text-center sm:text-right"
            >
              {bioSnippet}
            </motion.p>

            {/* Section pills */}
            <motion.div variants={fadeUp} className="mb-6 w-full" dir="ltr">
              <SectionPills onOpenCv={() => setCvOpen(true)} />
            </motion.div>

            {/* Contact rows */}
            <motion.div variants={fadeUp} className="w-full mb-6 space-y-2.5" dir="ltr">
              <ContactRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Email"
                value={personalInfo.email}
                accentColor="#2dd4bf"
              />
              <ContactRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                label="Phone"
                value={personalInfo.phone}
                accentColor="#4ade80"
              />
            </motion.div>

            {/* Social + CV buttons */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center sm:justify-start"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } } }}
              initial="hidden"
              animate="visible"
            >
              {socialBtns.map((btn) => (
                <SocialBtn key={btn.label} btn={btn} />
              ))}

              {/* CV */}
              <motion.button
                onClick={() => setCvOpen(true)}
                initial={{ opacity: 0, scale: 0.88, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0,
                           transition: { type: 'spring', stiffness: 280, damping: 22, delay: 0.27 } }}
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 8px 28px rgba(20,184,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.97, y: 1 }}
                className="flex flex-col items-center px-5 py-2.5 rounded-xl font-body text-white border border-teal-500/35 will-change-transform min-w-[88px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,212,191,0.12) 0%, rgba(15,118,110,0.18) 100%)',
                  boxShadow: '0 4px 16px rgba(20,184,166,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <FileText size={15} className="text-teal-400 mb-0.5" />
                <span className="text-teal-100 font-semibold text-[13px] leading-tight">Resume</span>
                <span className="text-white/60 text-[9px] tracking-wide leading-tight hidden sm:block">View / Download</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── Project preview strip ── */}
        <ProjectStrip />

        {/* ── Scroll CTA ── */}
        <motion.div
          className="flex flex-col items-center gap-2 text-slate-600 mt-10"
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
