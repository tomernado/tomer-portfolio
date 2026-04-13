import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Home',     href: '#hero',     id: 'hero' },
  { label: 'About',   href: '#about',    id: 'about' },
  { label: 'Skills',  href: '#skills',   id: 'skills' },
  { label: 'Projects',href: '#projects', id: 'projects' },
  { label: 'Web4You', href: '#web4you',  id: 'web4you', accent: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Track which section is in the viewport */
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id).filter(id => id !== 'web4you')

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px', // trigger when section is in upper 40% of viewport
        threshold: [0, 0.1, 0.25, 0.5],
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/97 sm:bg-slate-950/90 sm:backdrop-blur-xl border-b border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <a
          href="#hero"
          className="font-display font-bold text-lg sm:text-2xl text-white tracking-wider hover:text-teal-400 transition-colors duration-200 flex-shrink-0"
        >
          TC<span className="text-teal-500">.</span>
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id

            /* Web4You — styled differently */
            if (link.accent) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/[0.07] hover:bg-indigo-500/[0.14] hover:border-indigo-400/50 transition-all duration-200 ml-1"
                >
                  <span className="relative font-display font-semibold text-[11px] sm:text-[13px] tracking-widest uppercase text-indigo-300 hover:text-indigo-200 transition-colors duration-200">
                    {link.label}
                  </span>
                </a>
              )
            }

            return (
              <a
                key={link.href}
                href={link.href}
                className="relative flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'rgba(20,184,166,0.12)',
                      border: '1px solid rgba(20,184,166,0.3)',
                      boxShadow: '0 0 12px rgba(20,184,166,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative font-display font-semibold text-[11px] sm:text-[13px] tracking-widest uppercase transition-colors duration-200 ${
                    isActive ? 'text-teal-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-400"
                    style={{ boxShadow: '0 0 6px rgba(20,184,166,0.8)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
