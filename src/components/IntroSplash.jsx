import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import LogoMark from './LogoMark'

const STORAGE_KEY = 'tc_intro_done'

export default function IntroSplash() {
  const reduceMotion = useReducedMotion()
  // Initialise synchronously so there's never a flash of the overlay on repeat visits,
  // and skip entirely for users who've asked for reduced motion.
  const [visible, setVisible] = useState(() => !reduceMotion && !localStorage.getItem(STORAGE_KEY))

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(dismiss, 2200)
    return () => clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950 cursor-pointer"
          onClick={dismiss}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)',
            }}
          />

          {/* Logo */}
          <motion.div
            className="w-[min(80vw,320px)] sm:w-[420px]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoMark
              className="w-full"
              style={{ filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.15))' }}
            />
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="flex gap-2 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/70"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>

          {/* Tap hint */}
          <motion.p
            className="absolute bottom-8 font-mono text-[10px] tracking-[0.25em] uppercase text-white/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            tap to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
