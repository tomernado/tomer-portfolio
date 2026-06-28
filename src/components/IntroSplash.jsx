import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'tc_intro_done'
const LOGO_SRC = `${import.meta.env.BASE_URL}img/newLOGO.png`

export default function IntroSplash() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 2800)
    return () => clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
            }}
          />

          {/* Logo — layoutId links it to the hero logo so Framer Motion flies it there on exit */}
          <motion.img
            layoutId="hero-logo"
            src={LOGO_SRC}
            alt="Tomer Cohen"
            className="w-64 sm:w-80 md:w-96 relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              scale:   { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45, ease: 'easeOut' },
              layout:  { type: 'spring', stiffness: 180, damping: 30, mass: 1 },
            }}
            style={{ filter: 'drop-shadow(0 0 52px rgba(99,102,241,0.5))' }}
          />

          {/* Loading dots — exit quickly before the logo starts moving */}
          <motion.div
            className="flex gap-2 mt-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ delay: 0.85, duration: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
