import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X, Github, Linkedin, ExternalLink, Globe, ChevronLeft, ChevronRight,
  Sparkles, Zap, Cloud, Activity, Layers, FileSearch, Gamepad2, Languages,
  ShoppingCart, Brain, ShieldCheck, Lock, Box, LayoutGrid, Network, Server,
} from 'lucide-react'
import { SiReact, SiNodedotjs, SiJavascript, SiDocker, SiMysql } from 'react-icons/si'
import { DiJava } from 'react-icons/di'
import { TbBrandCSharp } from 'react-icons/tb'
import { useContent } from '../context/LanguageContext'
import MagneticButton from './MagneticButton'
import BorderBeam from './BorderBeam'
import SectionDissolve from './SectionDissolve'
import { headingReveal, revealUp, cardReveal, staggerContainer, VIEWPORT, ACCENT, EASE_OUT } from '../motion'
import { useVideoAutoplayInView } from '../hooks/useVideoAutoplayInView'
import { useIsDesktop } from '../hooks/useIsDesktop'

/* Bright section tone, matching About's "black cards on white" language —
   Projects sits between two other sections that already made this switch,
   so it keeps the site's rhythm rather than reverting to a dark panel. */
const BG_TOP = '#ffffff'
const BG_MID = '#f8f7fb'
const BG_LOW = '#f3f1f8'
const CARD_DARK = '#0c0c10'
const CARD_DARK_2 = '#08080b'

/* The handful of projects given the spotlight here — everything else in
   the data stays reserved for the future full Projects page. */
const FEATURED_SET = [8, 11, 10, 9, 7, 6]

/* Tags are derived from each project's own description (see content.js) —
   this just maps them to a recognizable mark. Concept tags without a real
   logo fall back to a plain purple icon rather than a brand mark. */
const TAG_ICON = {
  React:               [SiReact, '#61DAFB'],
  'Node.js':            [SiNodedotjs, '#5FA04E'],
  JavaScript:          [SiJavascript, '#F7DF1E'],
  Docker:              [SiDocker, '#2496ED'],
  AI:                  [Sparkles, '#c4b5fd'],
  Automation:          [Zap, '#c4b5fd'],
  Cloud:               [Cloud, '#c4b5fd'],
  'Real-Time':          [Activity, '#c4b5fd'],
  'Full-Stack':         [Layers, '#c4b5fd'],
  'Document Analysis':  [FileSearch, '#c4b5fd'],
  Animation:           [Sparkles, '#c4b5fd'],
  Game:                [Gamepad2, '#c4b5fd'],
  RTL:                 [Languages, '#c4b5fd'],
  'E-Commerce':         [ShoppingCart, '#c4b5fd'],
  'Machine Learning':   [Brain, '#c4b5fd'],
  MySQL:               [SiMysql, '#4479A1'],
  JWT:                 [ShieldCheck, '#c4b5fd'],
  Security:            [Lock, '#c4b5fd'],
  'C#':                 [TbBrandCSharp, '#9b4f96'],
  OOP:                 [Box, '#c4b5fd'],
  'Design Patterns':    [LayoutGrid, '#c4b5fd'],
  Java:                [DiJava, '#f89820'],
  Networking:          [Network, '#c4b5fd'],
  'Web Development':    [Globe, '#c4b5fd'],
  'Client-Server':      [Server, '#c4b5fd'],
  Games:               [Gamepad2, '#c4b5fd'],
}

/* Most project titles follow a "Name — Subtitle" convention; split it so
   the subtitle can be styled as its own line, falling back gracefully
   when a title doesn't use the pattern. */
function splitTitle(title) {
  const parts = title.split(' — ')
  return parts.length === 2 ? { name: parts[0], subtitle: parts[1] } : { name: title, subtitle: null }
}

function TagPill({ tag, compact = false }) {
  const [Icon, color] = TAG_ICON[tag] ?? [Sparkles, '#c4b5fd']
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] text-white/65 font-mono ${compact ? 'px-2 py-1 text-[9px]' : 'px-2.5 py-1 text-[10.5px]'}`}
    >
      <Icon size={compact ? 10 : 12} style={{ color, flexShrink: 0 }} />
      {tag}
    </span>
  )
}

/* ─── Project modal — unchanged (still dark; it's a full-screen overlay,
   not part of the section's own background) ──────────────────────────── */
const backdropV = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.2, delay: 0.06 } },
}
const modalV = {
  hidden:  { scale: 0.82, opacity: 0, y: 28 },
  visible: { scale: 1, opacity: 1, y: 0,
              transition: { type: 'spring', damping: 18, stiffness: 260, mass: 0.85 } },
  exit:    { scale: 0.88, opacity: 0, y: 16,
              transition: { duration: 0.2, ease: 'easeIn' } },
}

function ProjectModal({ project, onClose }) {
  // Unconditional autoPlay here was never gated for mobile — reachable
  // from a single tap on any video-type project card (carousel or grid),
  // so it's a real crash path even with the carousel/grid videos already
  // fixed. Desktop only; mobile gets the video paused (still has native
  // `controls` so the user can play it manually).
  const isDesktop = useIsDesktop()
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div key="bd" variants={backdropV} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
            onClick={onClose} />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div key="modal" variants={modalV} initial="hidden" animate="visible" exit="exit"
              className="pointer-events-auto w-full max-w-2xl will-change-transform" dir="rtl">

              <div className="relative rounded-2xl border border-white/15 shadow-[0_0_90px_rgba(0,0,0,0.6)]">
                <div className="bg-ink-950 sm:backdrop-blur-2xl rounded-2xl overflow-hidden relative">

                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent z-10" />

                  <motion.button onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="absolute top-3 left-3 z-20 p-2 bg-ink-900/90 hover:bg-white/10 text-white/50 hover:text-white rounded-xl border border-white/10 transition-colors duration-150"
                    aria-label="Close">
                    <X size={15} />
                  </motion.button>

                  <div className="relative w-full aspect-video bg-ink-900 overflow-hidden">
                    {project.mediaType === 'video' ? (
                      <video key={project.id} src={project.media} autoPlay={isDesktop} loop muted playsInline controls
                        preload="metadata"
                        className="w-full h-full object-cover" />
                    ) : (
                      <motion.img key={project.id} src={project.media} alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.07 }} animate={{ scale: 1 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="px-7 pt-6 pb-7">
                    <motion.h3
                      className="font-body font-extrabold text-white text-2xl sm:text-3xl leading-snug mb-4"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}>
                      {project.title}
                    </motion.h3>

                    <motion.p
                      className="font-body text-white/60 text-base leading-[2.1] mb-7"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.17, duration: 0.4 }}>
                      {project.description}
                    </motion.p>

                    <div className="h-px bg-gradient-to-r from-white/10 via-white/20 to-white/10 mb-6" />

                    <motion.div className="flex flex-wrap gap-3 justify-end"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.38 }}>
                      {project.siteLink && (
                        <MagneticButton as="a" strength={0.2} href={project.siteLink} target="_blank" rel="noopener noreferrer"
                          whileHover={{ boxShadow: '0 0 28px rgba(255,255,255,0.2)' }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-white/90 text-black rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                          <Globe size={15} /> Visit Site
                        </MagneticButton>
                      )}
                      <MagneticButton as="a" strength={0.2} href={project.githubLink} target="_blank" rel="noopener noreferrer"
                        whileHover={{ borderColor: 'rgba(255,255,255,0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                        <Github size={15} /> GitHub
                      </MagneticButton>
                      {project.linkedinPost && (
                        <MagneticButton as="a" strength={0.2} href={project.linkedinPost} target="_blank" rel="noopener noreferrer"
                          whileHover={{ borderColor: 'rgba(255,255,255,0.4)' }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                          <Linkedin size={15} /> LinkedIn Post
                        </MagneticButton>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Featured carousel — a reliable, state-driven stack. Every card is
   always mounted and absolutely centered; only its transform/opacity
   change based on distance from the active index, animated by Framer
   rather than raw scroll position (which proved fragile — scroll-snap
   fighting live transform writes made it feel stuck / unresponsive).
   Auto-advances on a timer, pauses on hover/touch, and can be driven by
   the arrow buttons, the dots, or a swipe on mobile. ─────────────────── */
const AUTO_ADVANCE_MS = 5000

function FeaturedCard({ project, i, delta, onSelect }) {
  const { ui } = useContent()
  const { name, subtitle } = splitTitle(project.title)
  const abs = Math.min(Math.abs(delta), 3)
  const isFront = delta === 0
  // Autoplaying video decode is one of the most reliable ways to crash
  // Mobile Safari, especially with several <video> elements mounted at
  // once (all 6 carousel cards are always in the DOM). Desktop-only;
  // mobile shows the video paused at whatever frame it loads to instead
  // of looping.
  const isDesktop = useIsDesktop()

  return (
    <motion.div
      className="absolute top-0 left-1/2 w-[90%] sm:w-[80%] lg:w-[70%] max-w-[760px]"
      style={{ zIndex: 30 - Math.round(abs * 10), pointerEvents: abs > 2 ? 'none' : 'auto' }}
      animate={{
        x: `calc(-50% + ${delta * 42}%)`,
        scale: 1 - abs * 0.13,
        opacity: abs > 2.2 ? 0 : 1 - abs * 0.38,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
      dir="ltr"
    >
      {/* Only the front card's border actually rotates — the other five
          are always mounted (absolutely stacked) so six concurrent
          rotating-gradient layers would run at all times otherwise. */}
      <BorderBeam animate={isFront}>
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden">
          <button
            onClick={() => isFront && onSelect(project)}
            aria-label={`View details: ${name}`}
            tabIndex={isFront ? 0 : -1}
            className="relative aspect-video lg:aspect-auto overflow-hidden text-left"
            style={{ cursor: isFront ? 'pointer' : 'default' }}
          >
            <span
              className="absolute top-4 left-4 z-10 font-mono text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: ACCENT.css }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {project.mediaType === 'video' ? (
              <video src={project.media} muted autoPlay={isFront && isDesktop} loop playsInline preload="metadata" className="w-full h-full object-cover" />
            ) : (
              <img src={project.media} alt={project.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent pointer-events-none lg:hidden" />
          </button>

          <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center bg-ink-950 min-h-[220px] lg:min-h-[420px]" dir="rtl">
            <h3 className="font-display font-bold text-white tracking-tight leading-[1.05] mb-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              {name}
            </h3>
            {subtitle && (
              <p className="font-body font-semibold text-base mb-4" style={{ color: ACCENT.css }}>{subtitle}</p>
            )}
            <p className="font-body text-white/50 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
              {project.description}
            </p>
            {project.tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {project.siteLink && (
                <a
                  href={project.siteLink} target="_blank" rel="noopener noreferrer"
                  tabIndex={isFront ? 0 : -1}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-display font-semibold text-sm text-ink-950 transition-shadow duration-300 hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, rgba(${ACCENT.rgb2},1), rgba(${ACCENT.rgb},1))` }}
                >
                  {ui.projects.liveDemo} <ExternalLink size={14} />
                </a>
              )}
              <a
                href={project.githubLink} target="_blank" rel="noopener noreferrer"
                tabIndex={isFront ? 0 : -1}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] text-white font-display font-semibold text-sm hover:bg-white/[0.08] hover:border-white/25 transition-colors duration-200"
              >
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>
        </div>
      </BorderBeam>
    </motion.div>
  )
}

function FeaturedCarousel({ projects, onSelect, index, setIndex }) {
  const list = FEATURED_SET.map((id) => projects.find((p) => p.id === id)).filter(Boolean)
  const reduceMotion = useReducedMotion()
  const pausedRef = useRef(false)
  const touchStartX = useRef(null)

  const go = (dir) => {
    setIndex((i) => (i + dir + list.length) % list.length)
  }

  // Shortest signed distance from the active card, so the loop always
  // wraps the short way around instead of spinning through every card.
  const deltaFor = (i) => {
    let d = i - index
    if (d > list.length / 2) d -= list.length
    if (d < -list.length / 2) d += list.length
    return d
  }

  useEffect(() => {
    if (reduceMotion) return
    const timer = setInterval(() => {
      if (!pausedRef.current) go(1)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, list.length])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; pausedRef.current = true }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
    setTimeout(() => { pausedRef.current = false }, 400)
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealUp}
      className="mb-10"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="max-w-6xl mx-auto relative">
      <div
        className="relative h-[530px] lg:h-[460px] overflow-visible"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {list.map((project, i) => (
          <FeaturedCard
            key={project.id}
            project={project}
            i={i}
            delta={deltaFor(i)}
            onSelect={onSelect}
          />
        ))}

        {/* Clear, always-visible arrow nav — the primary way to move,
            styled with the site's own purple accent rather than a subtle
            glass button so it reads as an obvious control. Centered on
            just this card-stack box, not the dots below it. */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{ background: `linear-gradient(135deg, rgba(${ACCENT.rgb2},1), rgba(${ACCENT.rgb},1))` }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next project"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{ background: `linear-gradient(135deg, rgba(${ACCENT.rgb2},1), rgba(${ACCENT.rgb},1))` }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot pagination — a position readout you can also click to jump. */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {list.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to project ${i + 1}`}
            className="p-1.5"
          >
            <span
              className="block h-1.5 rounded-full transition-all duration-300"
              style={{ background: i === index ? ACCENT.css : 'rgba(0,0,0,0.15)', width: i === index ? '1.1rem' : '0.375rem' }}
            />
          </button>
        ))}
      </div>
      </div>
    </motion.div>
  )
}

/* ─── "Explore more" grid — the rest of the set, compact cards ───────── */
function MiniProjectCard({ project, onClick }) {
  const { name, subtitle } = splitTitle(project.title)
  const isDesktop = useIsDesktop()
  const videoRef = useVideoAutoplayInView(isDesktop)
  return (
    <motion.button
      variants={cardReveal}
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="group relative text-left rounded-xl overflow-hidden border border-white/[0.07] shadow-lg shadow-black/10 hover:border-white/[0.16] hover:shadow-xl hover:shadow-black/15 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
      style={{ background: `linear-gradient(180deg, ${CARD_DARK} 0%, ${CARD_DARK_2} 100%)` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      <div className="relative aspect-video overflow-hidden bg-ink-900">
        {project.mediaType === 'video' ? (
          <video ref={videoRef} src={project.media} muted loop playsInline preload="metadata" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <img src={project.media} alt={project.title} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <h4 className="font-body font-bold text-white text-sm mb-0.5 truncate">{name}</h4>
        {subtitle && <p className="font-mono text-[10px] mb-2 truncate" style={{ color: ACCENT.css }}>{subtitle}</p>}
        <p className="font-body text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">{project.description}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => <TagPill key={tag} tag={tag} compact />)}
          </div>
        )}
      </div>
    </motion.button>
  )
}

/* ─── Main export ──────────────────────────────────────────────────── */
export default function ProjectsGrid() {
  const { projects, ui } = useContent()
  const [selected, setSelected] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const featuredList = FEATURED_SET.map((id) => projects.find((p) => p.id === id)).filter(Boolean)
  // The grid below shows the rest of the curated set, minus the carousel's
  // default front project — fixed, not tied to `activeIndex`, so the grid
  // doesn't reshuffle (a card blinking in/out) every time the carousel
  // auto-advances. Collapsed, it's capped to a single row; "View All
  // Projects" expands it in place to every project in the data.
  const defaultFeaturedId = featuredList[0]?.id
  const ONE_ROW_COUNT = 4
  const curatedRest = featuredList.filter((p) => p.id !== defaultFeaturedId)
  const gridProjects = showAll
    ? projects.filter((p) => p.id !== defaultFeaturedId)
    : curatedRest.slice(0, ONE_ROW_COUNT)

  return (
    <>
      <section
        id="projects"
        className="relative py-28 sm:py-36 px-5"
        style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_MID} 22%, ${BG_LOW} 100%)` }}
      >
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={revealUp}
            className="flex items-center gap-3 mb-8"
          >
            <span className="font-mono text-black/35 text-xs flex-shrink-0">03</span>
            <motion.div
              className="h-px flex-1 origin-left"
              style={{ background: 'rgba(0,0,0,0.1)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            />
            <span className="font-mono text-black/40 text-xs tracking-[0.3em] uppercase flex-shrink-0">
              {ui.projects.eyebrow}
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={headingReveal}
              className="font-display font-bold tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
            >
              <span className="text-ink-950">{ui.projects.heading1}</span><br />
              <span className="text-ink-950">{ui.projects.heading2.slice(0, -1)}</span>
              <span style={{ color: ACCENT.css }}>{ui.projects.heading2.slice(-1)}</span>
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={revealUp}
              transition={{ delay: 0.15 }}
              className="flex items-start gap-5 lg:max-w-xs lg:pt-2"
            >
              <div className="hidden sm:block relative w-px self-stretch flex-shrink-0" style={{ minHeight: '4.5rem' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0) 85%)' }} />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: ACCENT.css, boxShadow: `0 0 10px 2px ${ACCENT.css}` }} />
              </div>
              <p className="font-body text-neutral-500 text-sm leading-relaxed">
                {ui.projects.subheading}
              </p>
            </motion.div>
          </div>
        </div>

        <FeaturedCarousel projects={projects} onSelect={setSelected} index={activeIndex} setIndex={setActiveIndex} />

        <div className="max-w-6xl mx-auto px-0">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={revealUp}
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/35 mb-6"
          >
            {ui.projects.exploreMore}
          </motion.p>

          <motion.div
            key={gridProjects.length}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={staggerContainer(0.06, 0)}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-12"
          >
            {gridProjects.map((p) => (
              <MiniProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
            ))}
          </motion.div>

          {!showAll && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={revealUp}
              className="flex justify-center"
            >
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/12 bg-black/[0.02] text-ink-950 font-display font-semibold text-sm hover:bg-black/[0.05] hover:border-black/20 transition-colors duration-200"
              >
                {ui.projects.viewAll}
              </button>
            </motion.div>
          )}
        </div>

        {/* Soft dissolve into Web4You's dark surface, instead of a hard cut. */}
        <SectionDissolve toColor="#050505" height={160} />
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
