import { useState } from 'react'
import { motion } from 'framer-motion'
import { personalInfo } from '../data/content'
import { MessageCircle, Linkedin, Github, Terminal, ChevronDown, FileText } from 'lucide-react'
import CvModal from './CvModal'

/* ─── Variants ──────────────────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
              transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] } },
}
const wordReveal = {
  hidden:  { opacity: 0, y: 22, filter: 'blur(5px)' },
  visible: (i) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.13 },
  }),
}

/* ─── 3D button definitions ─────────────────────────────────────────── */
const socialBtns = [
  {
    href: personalInfo.linkedin,
    label: 'LinkedIn',
    sublabel: 'Professional Profile',
    icon: <Linkedin size={15} />,
    // Teal gradient
    bg: 'linear-gradient(160deg, #2dd4bf 0%, #0d9488 55%, #0f766e 100%)',
    shadow: '0 6px 22px rgba(13,148,136,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowHover: '0 10px 32px rgba(13,148,136,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowTap: '0 2px 8px rgba(13,148,136,0.45), inset 0 2px 5px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
  {
    href: personalInfo.whatsapp,
    label: 'WhatsApp',
    sublabel: 'Send a Message',
    icon: <MessageCircle size={15} />,
    // Green gradient
    bg: 'linear-gradient(160deg, #4ade80 0%, #16a34a 55%, #15803d 100%)',
    shadow: '0 6px 22px rgba(22,163,74,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowHover: '0 10px 32px rgba(22,163,74,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowTap: '0 2px 8px rgba(22,163,74,0.45), inset 0 2px 5px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
  {
    href: personalInfo.github,
    label: 'GitHub',
    sublabel: 'Open Source',
    icon: <Github size={15} />,
    // White/silver glass
    bg: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
    shadow: '0 6px 22px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.12)',
    shadowHover: '0 10px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.18)',
    shadowTap: '0 2px 8px rgba(0,0,0,0.4), inset 0 2px 5px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
  },
]

/* ─── Contact info row (display only, no link) ───────────────────── */
function ContactRow({ icon, label, value, accentColor }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderLeft: `2.5px solid ${accentColor}`,
        boxShadow: `inset 0 0 30px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Icon badge */}
      <div
        className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
        style={{
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}40`,
          color: accentColor,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-slate-500 leading-none mb-1">
          {label}
        </span>
        <span
          className="font-mono text-sm tracking-wide truncate"
          style={{ color: 'rgba(226,232,240,0.9)' }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

/* ─── 3D Social button ───────────────────────────────────────────── */
function SocialBtn({ btn, variants }) {
  return (
    <motion.a
      href={btn.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05, y: -3, boxShadow: btn.shadowHover }}
      whileTap={{ scale: 0.97, y: 1, boxShadow: btn.shadowTap }}
      style={{
        background: btn.bg,
        boxShadow: btn.shadow,
      }}
      className="relative overflow-hidden flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-xl cursor-pointer select-none"
    >
      {/* Shine sweep on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 60%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Icon */}
      <span className="text-white drop-shadow-sm flex-shrink-0">{btn.icon}</span>

      {/* Label only */}
      <span className="text-white font-semibold font-body text-[13px] drop-shadow-sm">
        {btn.label}
      </span>
    </motion.a>
  )
}

/* ─── Component ──────────────────────────────────────────────────── */
export default function Hero() {
  const nameWords = personalInfo.name.split(' ')
  const [cvOpen, setCvOpen] = useState(false)

  const btnVariant = {
    hidden:  { opacity: 0, scale: 0.88, y: 14 },
    visible: { opacity: 1, scale: 1,    y: 0,
                transition: { type: 'spring', stiffness: 280, damping: 22 } },
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 px-5 pb-10"
    >
      <motion.div
        className="max-w-5xl mx-auto w-full"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Two-column layout ── */}
        <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16">

          {/* LEFT — floating avatar */}
          <motion.div
            className="flex-shrink-0 relative"
            variants={fadeUp}
            animate={{ y: [0, -14, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-teal-500/25 blur-3xl scale-[1.6]"
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [1.6, 1.9, 1.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-4 ring-teal-500/60 ring-offset-4 ring-offset-slate-950 shadow-[0_0_70px_rgba(20,184,166,0.4)]">
              <img src={personalInfo.profileMedia} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_12px_rgba(52,211,153,1)]">
              <span className="block w-full h-full rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </motion.div>

          {/* RIGHT — info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-right flex-1" dir="rtl">

            {/* Name words */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 mb-2">
              {nameWords.map((word, i) => (
                <motion.span
                  key={i} custom={i}
                  variants={wordReveal} initial="hidden" animate="visible"
                  className="inline-block font-body font-extrabold text-5xl sm:text-6xl leading-tight text-shimmer"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Title badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 font-display font-semibold text-sm tracking-widest uppercase">
                <Terminal size={12} className="text-teal-400" />
                {personalInfo.title}
              </span>
            </motion.div>

            {/* ── Contact display (no links, no navigation) ── */}
            <motion.div variants={fadeUp} className="w-full mb-7 space-y-2.5" dir="ltr">
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

            {/* ── 3D Social buttons ── */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center sm:justify-start"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } } }}
              initial="hidden"
              animate="visible"
            >
              {socialBtns.map((btn) => (
                <SocialBtn key={btn.label} btn={btn} variants={btnVariant} />
              ))}
            </motion.div>

            {/* ── CV button ── */}
            <motion.div
              className="mt-3 w-full flex justify-center sm:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <motion.button
                onClick={() => setCvOpen(true)}
                whileHover={{
                  scale: 1.04,
                  y: -2,
                  boxShadow: '0 8px 28px rgba(20,184,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
                whileTap={{
                  scale: 0.97, y: 1,
                  boxShadow: '0 2px 8px rgba(20,184,166,0.25), inset 0 2px 4px rgba(0,0,0,0.25)',
                }}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-body font-semibold text-sm text-white border border-teal-500/35 w-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,212,191,0.12) 0%, rgba(15,118,110,0.18) 100%)',
                  boxShadow: '0 4px 16px rgba(20,184,166,0.2), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.15)',
                }}
              >
                <FileText size={16} className="text-teal-400" />
                <span className="text-teal-100">View Resume</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="flex flex-col items-center gap-2 text-slate-600 mt-14 sm:mt-16"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </motion.div>
      </motion.div>
      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  )
}
