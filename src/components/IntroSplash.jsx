import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from './LogoMark'

export default function IntroSplash() {
  const [visible, setVisible] = useState(true)

  const dismiss = () => setVisible(false)

  useEffect(() => {
    const timer = setTimeout(dismiss, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 cursor-pointer"
          onClick={dismiss}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
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

          {/* Logo */}
          <motion.div
            layoutId="hero-logo"
            className="w-[min(92vw,380px)] sm:w-[560px] md:w-[640px]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              scale:   { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45, ease: 'easeOut' },
              layout:  { type: 'spring', stiffness: 180, damping: 30, mass: 1 },
            }}
          >
            <LogoMark
              className="w-full"
              style={{ filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.38))' }}
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
                className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>

          {/* Tap hint */}
          <motion.p
            className="absolute bottom-8 font-mono text-[10px] tracking-[0.25em] uppercase text-slate-600"
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
