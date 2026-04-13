import { useState, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion'
import { Play, X, Github, Linkedin, ExternalLink, Globe } from 'lucide-react'
import { projects } from '../data/content'

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
function ProjectCard({ project, sizeConfig, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        y: -6,
        boxShadow: '0 0 40px rgba(59,130,246,0.3), 0 30px 70px rgba(0,0,0,0.65)',
        borderColor: 'rgba(59,130,246,0.4)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      /* Mobile: solid bg. sm+: glassmorphism with backdrop-blur */
      className={`group relative flex-shrink-0 ${sizeConfig.w} ${sizeConfig.h} text-right overflow-hidden bg-slate-900/95 sm:bg-white/[0.04] sm:backdrop-blur-xl border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 will-change-transform`}
    >
      {/* Shimmer top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent z-10" />

      {/* Media */}
      <div className={`relative ${sizeConfig.mediaH} overflow-hidden bg-slate-900`}>
        {project.mediaType === 'video' ? (
          <>
            <video
              src={project.media}
              autoPlay loop muted playsInline
              preload="metadata"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-600"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10 z-10">
              <Play size={8} fill="white" className="text-white" />
              <span className="font-mono text-white text-[8px] tracking-widest font-bold">VIDEO</span>
            </div>
          </>
        ) : (
          <img src={project.media} alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-body font-bold text-white text-sm leading-snug mb-1 group-hover:text-blue-300 transition-colors duration-200 line-clamp-1">
          {project.title}
        </h3>
        <p className="font-body text-slate-400 text-xs leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="mt-2 flex items-center justify-start gap-1 text-blue-400">
          <ExternalLink size={10} />
          <span className="font-mono text-[9px] tracking-widest uppercase">פרטים</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-600/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
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
            className="fixed inset-0 z-50 bg-black/82 backdrop-blur-sm"
            onClick={onClose} />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div key="modal" variants={modalV} initial="hidden" animate="visible" exit="exit"
              className="pointer-events-auto w-full max-w-2xl will-change-transform" dir="rtl">

              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/55 via-violet-500/25 to-cyan-500/40 shadow-[0_0_90px_rgba(59,130,246,0.28)]">
                <div className="bg-slate-950 sm:backdrop-blur-2xl rounded-2xl overflow-hidden relative">

                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/55 to-transparent z-10" />

                  <motion.button onClick={onClose}
                    whileHover={{ scale: 1.12, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="absolute top-3 left-3 z-20 p-2 bg-slate-800/90 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-slate-700/50 transition-colors duration-150"
                    aria-label="Close">
                    <X size={15} />
                  </motion.button>

                  <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="px-7 pt-6 pb-7">
                    <motion.h3
                      className="font-body font-extrabold text-white text-2xl sm:text-3xl leading-snug mb-4"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}>
                      {project.title}
                    </motion.h3>

                    <motion.p
                      className="font-body text-slate-300 text-base leading-[2.1] mb-7"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.17, duration: 0.4 }}>
                      {project.description}
                    </motion.p>

                    <div className="h-px bg-gradient-to-r from-white/10 via-blue-500/25 to-white/10 mb-6" />

                    <motion.div className="flex flex-wrap gap-3 justify-end"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.38 }}>
                      {project.siteLink && (
                        <motion.a href={project.siteLink} target="_blank" rel="noopener noreferrer"
                          whileHover={{ scale: 1.07, boxShadow: '0 0 28px rgba(59,130,246,0.55)' }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                          <Globe size={15} /> Visit Site
                        </motion.a>
                      )}
                      <motion.a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.07, boxShadow: '0 0 25px rgba(99,102,241,0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500/50 text-white rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                        <Github size={15} /> GitHub
                      </motion.a>
                      <motion.a href={project.linkedinPost} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.07, boxShadow: '0 0 25px rgba(0,119,181,0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0077b5]/15 hover:bg-[#0077b5]/30 border border-[#0077b5]/40 hover:border-[#0077b5]/70 text-[#60c0f0] hover:text-white rounded-xl text-sm font-semibold font-body transition-colors duration-150">
                        <Linkedin size={15} /> LinkedIn Post
                      </motion.a>
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
  // Repeat items COPIES times so the track is always several viewports wide
  const repeated = Array.from({ length: COPIES }, () => items).flat()

  const trackRef = useRef(null)
  const x        = useMotionValue(0)
  const paused   = useRef(false)

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
    if (paused.current || !trackRef.current) return
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
      setTimeout(() => { paused.current = false }, 700)
    }
    touchStartX.current = null
    isHorizontalSwipe.current = false
  }

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
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
        {repeated.map(({ project, size }, i) => (
          <ProjectCard
            key={`${project.id}-${i}`}
            project={project}
            sizeConfig={size}
            onClick={() => items[i % items.length]?.onSelect(project)}
          />
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Main export ──────────────────────────────────────────────────── */
export default function ProjectsGrid() {
  const [selected, setSelected] = useState(null)

  const row1 = projects.slice(0, 3).map((p, i) => ({
    project: p,
    size: CARD_SIZES[i],
    onSelect: setSelected,
  }))
  const row2 = projects.slice(3).map((p, i) => ({
    project: p,
    size: CARD_SIZES[i + 3] ?? CARD_SIZES[3],
    onSelect: setSelected,
  }))

  return (
    <>
      <section id="projects" className="py-28 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Section heading */}
          <motion.div
            dir="rtl"
            className="px-5 mb-12"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}
          >
            <div className="max-w-6xl mx-auto">
              <p className="font-display text-blue-500 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Portfolio</p>
              <h2 className="font-body font-extrabold text-4xl sm:text-5xl text-white">פרויקטים</h2>
              <motion.div className="h-1 bg-gradient-to-l from-transparent via-blue-500 to-blue-400 rounded-full mt-4 origin-right"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }} style={{ width: 56 }} />
              <p className="font-body text-slate-500 text-sm mt-3">לחץ על כרטיס לפרטים · גלילה אוטומטית</p>
            </div>
          </motion.div>

          {/* Carousel rows */}
          <motion.div
            className="flex flex-col gap-6"
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
