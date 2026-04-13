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
        aria-hidden="true"
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
              className="relative rounded-2xl overflow-hidden border border-white/10"
              style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.15)' }}
            >
              <img
                src={web4youData.screenshot}
                alt="Web4You website"
                className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
            </div>
            {/* Glow under image */}
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
            <h3 className="font-body font-bold text-white text-2xl sm:text-3xl leading-snug">
              {web4youData.tagline}
            </h3>

            <p className="font-body text-slate-400 text-base leading-[2.1]">
              {web4youData.description}
            </p>

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
