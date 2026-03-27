import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import ProjectsGrid from './components/ProjectsGrid'
import Footer from './components/Footer'

const blobs = [
  {
    id: 1,
    className: 'w-[700px] h-[700px] bg-blue-700/12 -top-48 -left-48',
    animate: { x: [0, 80, -40, 55, 0], y: [0, -50, 70, -25, 0] },
    duration: 28,
    delay: 0,
  },
  {
    id: 2,
    className: 'w-[550px] h-[550px] bg-violet-700/10 top-[40%] -right-48',
    animate: { x: [0, -60, 35, -40, 0], y: [0, 55, -70, 30, 0] },
    duration: 32,
    delay: 3,
  },
  {
    id: 3,
    className: 'w-[450px] h-[450px] bg-cyan-700/8 bottom-[20%] left-[25%]',
    animate: { x: [0, 50, -55, 25, 0], y: [0, -40, 60, -20, 0] },
    duration: 22,
    delay: 7,
  },
  {
    id: 4,
    className: 'w-[380px] h-[380px] bg-blue-500/7 -bottom-24 right-[20%]',
    animate: { x: [0, -40, 60, -30, 0], y: [0, 60, -35, 45, 0] },
    duration: 26,
    delay: 5,
  },
]

export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen relative overflow-x-hidden">
      {/* Static dot-grid layer */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0 opacity-50" />

      {/* Animated ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {blobs.map((blob) => (
          <motion.div
            key={blob.id}
            className={`absolute rounded-full blur-[130px] pointer-events-none ${blob.className}`}
            animate={blob.animate}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: blob.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <ProjectsGrid />
        <Footer />
      </div>
    </div>
  )
}
