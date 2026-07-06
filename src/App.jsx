import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import { ACCENT } from './motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import ProjectsGrid from './components/ProjectsGrid'
import Web4YouSection from './components/Web4YouSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import IntroSplash from './components/IntroSplash'

/* Two quiet, slow-drifting monochrome glows — restraint over noise.
   Desktop only: blur-[140px] is too heavy for mobile GPUs. */
const glows = [
  {
    id: 1,
    className: 'w-[800px] h-[800px] bg-white/[0.05] -top-64 -left-64',
    animate: { x: [0, 60, -20, 0], y: [0, -40, 30, 0] },
    duration: 34,
    depth: 18,
  },
  {
    id: 2,
    className: 'w-[600px] h-[600px] bg-white/[0.035] top-[45%] -right-56',
    animate: { x: [0, -50, 25, 0], y: [0, 40, -30, 0] },
    duration: 40,
    depth: 28,
  },
]

/* Shared pointer position, normalised to [-0.5, 0.5] on each axis — a single
   listener drives every parallax layer instead of one per element. */
function usePointerNormalized() {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const onMove = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5)
      py.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduceMotion, px, py])

  return { px, py }
}

function ParallaxGlow({ glow, px, py }) {
  const x = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 })

  useEffect(() => {
    const unsubX = px.on('change', (v) => x.set(v * glow.depth * 2))
    const unsubY = py.on('change', (v) => y.set(v * glow.depth * 2))
    return () => { unsubX(); unsubY() }
  }, [px, py, x, y, glow.depth])

  return (
    <motion.div style={{ x, y }} className="absolute inset-0 will-change-transform">
      <motion.div
        className={`absolute rounded-full blur-[140px] pointer-events-none will-change-transform ${glow.className}`}
        animate={glow.reduceMotion ? undefined : glow.animate}
        transition={{ duration: glow.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

export default function App() {
  const reduceMotion = useReducedMotion()
  const { px, py } = usePointerNormalized()

  // A single accent-tinted glow that bookends the page: present at the
  // cinematic Hero, recedes through the monochrome middle, and returns
  // faintly at Contact — scroll itself becomes part of the atmosphere
  // instead of every section looking like a flat repeat of the last.
  const { scrollYProgress } = useScroll()
  const accentOpacity = useTransform(scrollYProgress, [0, 0.12, 0.75, 0.92, 1], [1, 0, 0, 0.6, 0.6])

  return (
    <LanguageProvider>
    <div className="bg-ink-950 min-h-screen relative [overflow-x:clip]">
      <IntroSplash />

      {/* Cinematic grain */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient glows with subtle mouse-parallax depth */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {glows.map((glow) => (
          <ParallaxGlow key={glow.id} glow={{ ...glow, reduceMotion }} px={px} py={py} />
        ))}
        <motion.div
          aria-hidden="true"
          className="absolute w-[900px] h-[900px] rounded-full -top-96 right-1/3"
          style={{
            opacity: reduceMotion ? 0 : accentOpacity,
            background: `radial-gradient(circle, rgba(${ACCENT.rgb},0.06) 0%, transparent 70%)`,
            filter: 'blur(120px)',
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <ProjectsGrid />
        <Web4YouSection />
        <Contact />
        <Footer />
      </div>
    </div>
    </LanguageProvider>
  )
}
