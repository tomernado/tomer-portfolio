import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useAnimationFrame, useReducedMotion } from 'framer-motion'
import { Play, X, Github, Linkedin, ExternalLink, Globe, Pause } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import SpotlightCard from './SpotlightCard'
import MagneticButton from './MagneticButton'
import SectionMarker from './SectionMarker'
import BorderBeam from './BorderBeam'
import { headingReveal, revealUp, revealLeft, revealRight, VIEWPORT, ACCENT } from '../motion'

/* ─── Card size configs ────────────────────────────────────────────── */
const CARD_SIZES = [
  { w: 'w-[320px]', h: 'h-[280px]', mediaH: 'h-44' },
  { w: 'w-[400px]', h: 'h-[300px]', mediaH: 'h-48' },
  { w: 'w-[350px]', h: 'h-[260px]', mediaH: 'h-40' },
  { w: 'w-[420px]', h: 'h-[310px]', mediaH: 'h-48' },
  { w: 'w-[360px]', h: 'h-[270px]', mediaH: 'h-44' },
  { w: 'w-[390px]', h: 'h-[290px]', mediaH: 'h-44' },
]

/* ─── Modal variants ──────────────────────────────────────────────── */
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

/* ─── Single project card ─────────────────────────────────────────── */
function ProjectCard({ project, sizeConfig, onClick, hidden }) {
  const { ui } = useContent()
  const reduceMotion = useReducedMotion()
  const rotateX = useSpring(0, { stiffness: 220, damping: 18, mass: 0.5 })
  const rotateY = useSpring(0, { stiffness: 220, damping: 18, mass: 0.5 })

  const onMove = (e) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 8)
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 8)
  }
  const onLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden || undefined}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ y: -6, borderColor: 'rgba(255,255,255,0.32)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex-shrink-0 ${sizeConfig.w} ${sizeConfig.h} text-right overflow-hidden bg-ink-900 sm:bg-white/[0.035] sm:backdrop-blur-xl border border-white/10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 will-change-transform`}
    >
      {/* Shimmer top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent z-10" />

      {/* Media */}
      <div className={`relative ${sizeConfig.mediaH} overflow-hidden bg-ink-900`}>
        {project.mediaType === 'video' ? (
          <>
            <video
              src={project.media}
              autoPlay loop muted playsInline
              preload="metadata"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-600"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10 z-10">
              <Play size={8} fill="white" className="text-white" />
              <span className="font-mono text-white text-[8px] tracking-widest font-bold">VIDEO</span>
            </div>
          </>
        ) : (
          <img src={project.media} alt={project.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-body font-bold text-white text-sm leading-snug mb-1 transition-colors duration-200 line-clamp-1">
          {project.title}
        </h3>
        <p className="font-body text-white/45 text-xs leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="mt-2 flex items-center justify-start gap-1 text-white/60">
          <ExternalLink size={10} />
          <span className="font-mono text-[9px] tracking-widest uppercase">{ui.projects.cardCta}</span>
        </div>
      </div>
    </motion.button>
  )
}

/* ─── Project modal ───────────────────────────────────────────────── */
function ProjectModal({ project, onClose }) {
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
                      <video key={project.id} src={project.media} autoPlay loop muted playsInline controls
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
                      <MagneticButton as="a" strength={0.2} href={project.linkedinPost} target="_blank" rel="noopener noreferrer"
                        whileHover={{ borderColor: 'rgba(255,255,255,0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                        <Linkedin size={15} /> LinkedIn Post
                      </MagneticButton>
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

/* ─── Seamless JS-driven marquee row ──────────────────────────────── */
const SPEED  = 0.09   // px per ms
const COPIES = 4      // repetitions — keeps the track wide enough on any screen

function MarqueeRow({ items, direction = 'left' }) {
  const reduceMotion = useReducedMotion()
  // Repeat items COPIES times so the track is always several viewports wide.
  // Only the first copy stays reachable/announced; the rest are duplicates
  // purely for the seamless loop and are hidden from keyboard/AT users.
  const repeated = Array.from({ length: COPIES }, (_, copyIdx) =>
    items.map((it) => ({ ...it, hidden: copyIdx > 0 }))
  ).flat()

  const trackRef = useRef(null)
  const x        = useMotionValue(0)
  const paused   = useRef(false)
  const started  = useRef(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { started.current = true }, 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => { paused.current = isPaused }, [isPaused])

  // Touch drag state
  const touchStartX  = useRef(null)
  const touchStartY  = useRef(null)
  const touchStartVal = useRef(0)
  const isHorizontalSwipe = useRef(false)

  // For 'right' direction start shifted left by one unit so motion is rightward
  useLayoutEffect(() => {
    if (!trackRef.current || direction !== 'right') return
    x.set(-(trackRef.current.scrollWidth / COPIES))
  }, [direction, x])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !started.current || paused.current || !trackRef.current) return
    const unit = trackRef.current.scrollWidth / COPIES  // width of one set of items
    if (unit <= 0) return
    const step = SPEED * Math.min(delta, 50)
    let next = x.get() + (direction === 'left' ? -step : step)
    // Wrap to keep within [-unit, 0] — the seamless loop window
    if (next <= -unit) next += unit
    if (next > 0)      next -= unit
    x.set(next)
  })

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchStartVal.current = x.get()
    isHorizontalSwipe.current = false
  }

  const onTouchMove = (e) => {
    if (touchStartX.current === null || !trackRef.current) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current

    if (!isHorizontalSwipe.current) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
      isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy)
      if (!isHorizontalSwipe.current) return
    }

    paused.current = true
    const unit = trackRef.current.scrollWidth / COPIES
    let next = touchStartVal.current + dx
    while (next > 0)      next -= unit
    while (next < -unit)  next += unit
    x.set(next)
  }

  const onTouchEnd = () => {
    if (isHorizontalSwipe.current) {
      setTimeout(() => { paused.current = isPaused }, 700)
    }
    touchStartX.current = null
    isHorizontalSwipe.current = false
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsPaused(p => !p)}
        aria-label={isPaused ? 'Play project carousel' : 'Pause project carousel'}
        className="absolute -top-9 right-5 z-10 flex items-center justify-center w-6 h-6 rounded-full border border-white/10 text-white/50 hover:text-white/80 hover:border-white/25 transition-colors duration-200"
      >
        {isPaused ? <Play size={9} /> : <Pause size={9} />}
      </button>
      <div
        className="overflow-hidden w-full"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = isPaused }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <motion.div
          ref={trackRef}
          style={{ x, willChange: 'transform' }}
          className="flex gap-5 w-max py-2"
        >
          {repeated.map(({ project, size, onSelect, hidden }, i) => (
            <ProjectCard
              key={`${project.id}-${i}`}
              project={project}
              sizeConfig={size}
              hidden={hidden}
              onClick={() => onSelect(project)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Featured project spotlight ──────────────────────────────────────
   Rotates through a curated set (Chef Platform → SocialOrg → WorkShift →
   repeat) instead of pinning a single project forever. Pauses on hover;
   respects reduced motion by simply not auto-advancing. ─────────────── */
const FEATURED_ORDER = [10, 11, 8]
const FEATURED_ROTATE_MS = 6000

function FeaturedProject({ projects, onClick }) {
  const { ui } = useContent()
  const reduceMotion = useReducedMotion()
  const featuredList = FEATURED_ORDER
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean)
  const list = featuredList.length ? featuredList : projects.slice(0, 1)

  const [index, setIndex] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    if (reduceMotion || list.length < 2) return
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % list.length)
    }, FEATURED_ROTATE_MS)
    return () => clearInterval(t)
  }, [reduceMotion, list.length])

  const project = list[index]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      className="px-5 mb-16 sm:mb-20"
    >
      <div
        className="max-w-6xl mx-auto"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
      >
        <BorderBeam>
        <SpotlightCard
          as="button"
          onClick={() => onClick(project)}
          radius={420}
          className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center text-left w-full cursor-pointer rounded-3xl p-6 sm:p-8 lg:p-10"
        >
          {/* Image converges from the left, text from the right — the same
              opposing directions the two marquee rows below scroll in,
              so the section's own motion identity is horizontal. */}
          <motion.div
            variants={revealLeft}
            className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/25 transition-colors duration-300 order-2 lg:order-1"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {project.mediaType === 'video' ? (
                  <video key={project.id} src={project.media} muted autoPlay loop playsInline preload="metadata"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500" />
                ) : (
                  <img src={project.media} alt={project.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500" />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>
          <motion.div variants={revealRight} className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50">Featured Project</p>
              {list.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {list.map((p, i) => (
                    <span
                      key={p.id}
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                      style={{ background: i === index ? ACCENT.css : 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-display font-bold text-white tracking-tight leading-[1.05] mb-4" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)' }}>
                  {project.title}
                </h3>
                <p className="font-body text-white/50 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                  {project.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-white/60 group-hover:text-white border-b border-white/20 group-hover:border-white/60 pb-1 transition-colors duration-200">
              <ExternalLink size={12} />
              {ui.projects.cardCta}
            </span>
          </motion.div>
        </SpotlightCard>
        </BorderBeam>
      </div>
    </motion.div>
  )
}

/* ─── Main export ──────────────────────────────────────────────────── */
export default function ProjectsGrid() {
  const { projects, ui } = useContent()
  const [selected, setSelected] = useState(null)

  // The rotating spotlight above already covers these three, so the
  // marquee rows show everything else — no duplicate cards.
  const others = projects.filter((p) => !FEATURED_ORDER.includes(p.id))

  const row1 = others.slice(0, 5).map((p, i) => ({
    project: p,
    size: CARD_SIZES[i % CARD_SIZES.length],
    onSelect: setSelected,
  }))
  const row2 = others.slice(5).map((p, i) => ({
    project: p,
    size: CARD_SIZES[i + 3] ?? CARD_SIZES[3],
    onSelect: setSelected,
  }))

  return (
    <>
      <section id="projects" className="py-28 sm:py-36 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Section marker + heading */}
          <div className="px-5 mb-16 max-w-6xl mx-auto">
            <SectionMarker index="03" label="Portfolio" className="mb-8" />
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={headingReveal}
              className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
            >
              {ui.projects.heading}
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={revealUp}
              className="font-body text-white/50 text-sm mt-3"
            >
              {ui.projects.subheading}
            </motion.p>
          </div>

          <FeaturedProject projects={projects} onClick={setSelected} />

          {/* Carousel rows */}
          <motion.div
            className="flex flex-col gap-10"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
          >
            <div className="pl-5">
              <MarqueeRow items={row1} direction="left" />
            </div>
            <div className="pr-5">
              <MarqueeRow items={row2} direction="right" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
