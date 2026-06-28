import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

const navLinks = [
  { label: 'Home',     href: '#hero',     id: 'hero' },
  { label: 'About',   href: '#about',    id: 'about' },
  { label: 'Skills',  href: '#skills',   id: 'skills' },
  { label: 'Projects',href: '#projects', id: 'projects' },
  { label: 'Web4You', href: '#web4you',  id: 'web4you' },
  { label: 'Contact', href: '#contact',  id: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { lang, setLang } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    )
    navLinks.forEach(({ id }) => {
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
      <div className="max-w-6xl mx-auto px-3 sm:px-8 h-12 sm:h-16 flex items-center justify-between gap-1 sm:gap-3">

        {/* Left — TC. */}
        <div className="flex items-center flex-shrink-0">
          <a
            href="#hero"
            className="font-display font-bold text-base sm:text-2xl text-white tracking-wider hover:text-teal-400 transition-colors duration-200"
          >
            TC<span className="text-teal-500">.</span>
          </a>
        </div>

        {/* Center — Nav links */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative flex-shrink-0 whitespace-nowrap px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-md sm:rounded-lg"
                    style={{
                      background: 'rgba(20,184,166,0.12)',
                      border: '1px solid rgba(20,184,166,0.3)',
                      boxShadow: '0 0 12px rgba(20,184,166,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative font-display font-semibold text-[9px] sm:text-[13px] tracking-widest uppercase transition-colors duration-200 ${
                  isActive ? 'text-teal-300' : 'text-slate-400 hover:text-white'
                }`}>
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

        {/* Right — Lang toggle */}
        <button
          onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
          className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
          aria-label="Switch language"
        >
          <span className={`font-mono text-[9px] sm:text-[11px] font-bold transition-colors duration-200 ${lang === 'he' ? 'text-teal-300' : 'text-slate-500'}`}>עב</span>
          <span className="text-slate-700 text-[8px]">|</span>
          <span className={`font-mono text-[9px] sm:text-[11px] font-bold transition-colors duration-200 ${lang === 'en' ? 'text-teal-300' : 'text-slate-500'}`}>EN</span>
        </button>

      </div>
    </nav>
  )
}
