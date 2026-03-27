import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { personalInfo } from '../data/content'
import CvModal from './CvModal'

export default function About() {
  const [cvOpen, setCvOpen] = useState(false)

  return (
    <>
      <section id="about" className="pt-2 pb-24 px-5">
        <div className="max-w-3xl mx-auto">

          {/* Connector divider — always visible, no animation */}
          <div className="flex items-center gap-4 mb-10" dir="rtl">
            <div className="h-px flex-1 bg-gradient-to-l from-blue-500/35 to-transparent" />
            <span className="font-display text-blue-500 text-[10px] tracking-[0.35em] uppercase font-semibold select-none">
              About
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/35 to-transparent" />
          </div>

          {/* Card — appears on scroll, disappears when leaving viewport */}
          <motion.div
            dir="rtl"
            initial={{ opacity: 0, y: 64, scale: 0.97, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              whileHover={{
                boxShadow: '0 0 55px rgba(59,130,246,0.1), 0 28px 70px rgba(0,0,0,0.55)',
                borderColor: 'rgba(59,130,246,0.22)',
              }}
              className="relative overflow-hidden water-card bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-9 transition-colors duration-400"
            >
              {/* Top shimmer */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent" />
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-blue-600/7 rounded-full blur-3xl -translate-y-20 translate-x-16 pointer-events-none" />

              <p className="font-body text-slate-300 text-base sm:text-lg leading-[2.2] text-right relative">
                {personalInfo.aboutText}
              </p>

              <div className="mt-7 mb-6 h-px bg-gradient-to-r from-white/8 via-blue-500/18 to-white/8" />

              <div className="flex justify-start">
                <motion.button
                  onClick={() => setCvOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59,130,246,0.55)' }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-body font-semibold text-sm transition-colors duration-200"
                >
                  <FileText size={15} />
                  צפה בקורות חיים
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}
