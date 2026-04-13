# Hero Redesign + Web4You Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `Hero.jsx` into a cinematic, dynamic landing screen with typewriter title, section pills, and project preview strip; then add a new `Web4YouSection.jsx` after ProjectsGrid.

**Architecture:** Hero is fully rewritten in-place. Background blobs/grid already live in `App.jsx` — Hero adds only local enhancements (rotating avatar ring, preview strip). Web4You is a new standalone section component wired into `App.jsx` between `<ProjectsGrid>` and `<Footer>`.

**Tech Stack:** React 18, Framer Motion, Tailwind CSS, Lucide React — no new packages.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/Hero.jsx` | Full rewrite | Entire Hero section — all sub-components live here (file stays single, components are local functions) |
| `src/components/Web4YouSection.jsx` | Create | Business section component |
| `src/data/content.js` | Modify | Add `web4youData` export |
| `src/App.jsx` | Modify | Import + render `<Web4YouSection />` between ProjectsGrid and Footer |
| `public/img/web4you.png` | Add (manual) | Screenshot of web4-you.vercel.app — user must add this file |

---

## Task 1: Rewrite Hero.jsx — avatar, typewriter, pills, buttons

**Files:**
- Modify: `src/components/Hero.jsx` (full rewrite)
- Read first: `src/data/content.js` (for `personalInfo`, `projects`)

- [ ] **Step 1: Read current Hero.jsx and content.js to understand imports and data shapes**

Confirm: `personalInfo` has `.name`, `.title`, `.phone`, `.email`, `.profileMedia`, `.whatsapp`, `.linkedin`, `.github`, `.cvPdf`, `.aboutText`. `projects` is an array with `.id`, `.title`, `.media`, `.mediaType`.

- [ ] **Step 2: Write the new Hero.jsx**

Replace the entire file with the following:

```jsx
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

  // Cycle titles every 3s with fade transition
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

  // Cursor blink
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
      <span className="text-teal-400 font-mono text-sm" style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}>|</span>
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
  const handleClick = (e, href, isCV) => {
    if (isCV) { e.preventDefault(); onOpenCv(); return }
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
          onClick={(e) => handleClick(e, pill.href, false)}
          variants={{
            hidden:  { opacity: 0, scale: 0.85, y: 10 },
            visible: { opacity: 1, scale: 1,    y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } },
          }}
          whileHover={{ scale: 1.06, borderColor: 'rgba(45,212,191,0.5)' }}
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
          visible: { opacity: 1, scale: 1,    y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } },
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
    shadowHover: '0 10px 32px rgba(13,148,136,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowTap: '0 2px 8px rgba(13,148,136,0.45), inset 0 2px 5px rgba(0,0,0,0.3)',
  },
  {
    href: personalInfo.whatsapp,
    label: 'WhatsApp',
    sublabel: 'Send a Message',
    icon: <MessageCircle size={15} />,
    bg: 'linear-gradient(160deg, #4ade80 0%, #16a34a 55%, #15803d 100%)',
    shadow: '0 6px 22px rgba(22,163,74,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowHover: '0 10px 32px rgba(22,163,74,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.22)',
    shadowTap: '0 2px 8px rgba(22,163,74,0.45), inset 0 2px 5px rgba(0,0,0,0.3)',
  },
  {
    href: personalInfo.github,
    label: 'GitHub',
    sublabel: 'Open Source',
    icon: <Github size={15} />,
    bg: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
    shadow: '0 6px 22px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.12)',
    shadowHover: '0 10px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.18)',
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
const STRIP_SPEED = 0.045  // px/ms

function ProjectStrip() {
  // Double items for seamless loop
  const doubled   = [...projects, ...projects]
  const trackRef  = useRef(null)
  const x         = useMotionValue(0)
  const paused    = useRef(false)

  useAnimationFrame((_, delta) => {
    if (paused.current || !trackRef.current) return
    const half = trackRef.current.scrollWidth / 2
    if (half <= 0) return
    const step = STRIP_SPEED * Math.min(delta, 50)
    const next = x.get() - step
    x.set(next <= -half ? next + half : next)
  })

  return (
    <motion.div
      variants={fadeUp}
      className="w-full mt-10"
    >
      {/* Label */}
      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-600 mb-3 px-1">
        // featured.projects
      </p>

      {/* Strip */}
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

/* ── Main Hero component ────────────────────────────────────────── */
export default function Hero() {
  const nameWords = personalInfo.name.split(' ')
  const [cvOpen, setCvOpen] = useState(false)

  // Bio snippet: first ~130 chars of aboutText
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

            {/* Typewriter title */}
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

            {/* Social buttons */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center sm:justify-start"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } } }}
              initial="hidden"
              animate="visible"
            >
              {socialBtns.map((btn) => (
                <SocialBtn key={btn.label} btn={btn} />
              ))}

              {/* CV button */}
              <motion.button
                onClick={() => setCvOpen(true)}
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 8px 28px rgba(20,184,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.97, y: 1 }}
                className="flex flex-col items-center px-5 py-2.5 rounded-xl font-body font-semibold text-white border border-teal-500/35 will-change-transform min-w-[88px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,212,191,0.12) 0%, rgba(15,118,110,0.18) 100%)',
                  boxShadow: '0 4px 16px rgba(20,184,166,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <FileText size={15} className="text-teal-400 mb-0.5" />
                <span className="text-teal-100 text-[13px] leading-tight">Resume</span>
                <span className="text-white/60 font-body text-[9px] tracking-wide leading-tight hidden sm:block">View / Download</span>
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
```

- [ ] **Step 3: Verify dev server renders correctly**

Run: `npm run dev`  
Check in browser:
- [ ] Avatar has outer dashed rotating ring
- [ ] Title cycles through 4 roles every 3s with cursor blink
- [ ] Bio snippet appears (2 lines)
- [ ] 4 section pills appear with stagger animation
- [ ] Social buttons now show sublabel on desktop
- [ ] Project strip scrolls left continuously, pauses on hover
- [ ] "Discover My Work" CTA at bottom
- [ ] Mobile (375px): avatar centered, pills wrap, strip works

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "Redesign Hero: typewriter title, section pills, project strip, enhanced avatar"
```

---

## Task 2: Add web4youData to content.js

**Files:**
- Modify: `src/data/content.js`

- [ ] **Step 1: Add web4youData export at the bottom of content.js**

```js
export const web4youData = {
  tagline: 'בניית אתרים מקצועיים לעסקים קטנים ובינוניים',
  description:
    'Web4You היא חברת בניית אתרים שהקמתי מתוך תשוקה לטכנולוגיה ועיצוב. אני מאמין שכל עסק — קטן כגדול — ראוי לנוכחות דיגיטלית מרשימה. Web4You מציעה פיתוח אתרים מותאם אישית, מהיר ומקצועי, תוך שילוב טכנולוגיות מתקדמות וכלי AI לאספקה מהירה. [USER: החלף טקסט זה בתיאור שלך על העסק]',
  url: 'https://web4-you.vercel.app/',
  screenshot: `${base}img/web4you.png`,
}
```

> **Note:** The `base` variable is already defined at the top of `content.js` — reuse it.

- [ ] **Step 2: Commit**

```bash
git add src/data/content.js
git commit -m "Add web4youData to content"
```

---

## Task 3: Create Web4YouSection.jsx

**Files:**
- Create: `src/components/Web4YouSection.jsx`

- [ ] **Step 1: Write the component**

```jsx
import { motion } from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'
import { web4youData } from '../data/content'

const fadeLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}
const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Web4YouSection() {
  return (
    <section id="web4you" className="py-28 px-5 relative overflow-hidden">
      {/* Accent glow */}
      <div
        className="absolute pointer-events-none"
        aria-hidden
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          top: '10%', right: '-15%',
        }}
      />

      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <motion.div
          dir="rtl"
          className="mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <p className="font-display text-indigo-400 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
            My Business
          </p>
          <h2 className="font-body font-extrabold text-4xl sm:text-5xl text-white">
            Web4You
          </h2>
          <motion.div
            className="h-1 bg-gradient-to-l from-transparent via-indigo-500 to-indigo-400 rounded-full mt-4 origin-right"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ width: 56 }}
          />
        </motion.div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — screenshot */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative group"
          >
            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
              style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.15)' }}
            >
              <img
                src={web4youData.screenshot}
                alt="Web4You website"
                className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
            </div>
            {/* Decorative glow under image */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-2xl rounded-full pointer-events-none"
              style={{ background: 'rgba(99,102,241,0.35)' }}
            />
          </motion.div>

          {/* Right — text */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            dir="rtl"
            className="space-y-6"
          >
            {/* Tagline */}
            <h3 className="font-body font-bold text-white text-2xl sm:text-3xl leading-snug">
              {web4youData.tagline}
            </h3>

            {/* Description */}
            <p className="font-body text-slate-400 text-base leading-[2.1]">
              {web4youData.description}
            </p>

            {/* CTA */}
            <motion.a
              href={web4youData.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-body font-semibold text-sm transition-colors duration-200 will-change-transform"
            >
              <Globe size={16} />
              בקר באתר Web4You
              <ExternalLink size={13} className="opacity-60" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Web4YouSection.jsx
git commit -m "Add Web4YouSection component"
```

---

## Task 4: Wire Web4YouSection into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import at top of App.jsx**

After the existing imports, add:
```js
import Web4YouSection from './components/Web4YouSection'
```

- [ ] **Step 2: Add component between ProjectsGrid and Footer**

In the JSX, change:
```jsx
        <ProjectsGrid />
        <Footer />
```
To:
```jsx
        <ProjectsGrid />
        <Web4YouSection />
        <Footer />
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Scroll to bottom — Web4You section should appear after Projects with the indigo accent color. Screenshot image will be broken until user adds `public/img/web4you.png`.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "Wire Web4YouSection into app between Projects and Footer"
```

---

## Task 5: User provides Web4You content + deploy

**Files:**
- Add: `public/img/web4you.png` (screenshot — user must provide)
- Modify: `src/data/content.js` (update placeholder text with real description)

- [ ] **Step 1: User adds screenshot**

User should take a screenshot of `https://web4-you.vercel.app/` and save it to `public/img/web4you.png`. Recommended size: 1200×700px or similar landscape ratio.

- [ ] **Step 2: User updates description in content.js**

In `src/data/content.js`, update `web4youData.description` and `web4youData.tagline` with real business description text.

- [ ] **Step 3: Deploy**

```bash
npm run deploy
```

---

## Self-Review

**Spec coverage:**
- ✅ Animated background — handled by existing App.jsx blobs (no duplication needed)
- ✅ Rotating dashed avatar ring — Task 1
- ✅ Typewriter cycling title — Task 1 (`TypewriterTitle` component)
- ✅ Bio snippet — Task 1 (first 130 chars of `aboutText`)
- ✅ Section pills — Task 1 (`SectionPills` component, smooth-scroll on click)
- ✅ Social buttons with sublabel — Task 1 (columns with icon + label + sublabel)
- ✅ Project preview strip — Task 1 (`ProjectStrip` component, same marquee pattern)
- ✅ Scroll CTA "Discover My Work" — Task 1
- ✅ Responsive (mobile + desktop) — all components use sm: breakpoints, flex-wrap
- ✅ Web4You section — Tasks 2–4
- ✅ Web4You: indigo accent, two-column, image + text + CTA button
- ✅ Page order: Hero → About → Skills → Projects → Web4You → Footer

**Placeholder scan:** None found. All steps have complete code.

**Type consistency:** `web4youData` defined in Task 2, used in Task 3. Properties `.tagline`, `.description`, `.url`, `.screenshot` used consistently.
