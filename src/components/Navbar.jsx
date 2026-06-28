import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const navLinks = [
  { label: 'Home',     href: '#hero',     id: 'hero' },
  { label: 'About',   href: '#about',    id: 'about' },
  { label: 'Skills',  href: '#skills',   id: 'skills' },
  { label: 'Projects',href: '#projects', id: 'projects' },
  { label: 'Web4You', href: '#web4you',  id: 'web4you' },
]

function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
      aria-label="Switch language"
    >
      <span className={`font-mono text-[10px] sm:text-[11px] font-bold transition-colors duration-200 ${lang === 'he' ? 'text-teal-300' : 'text-slate-500'}`}>עב</span>
      <span className="text-slate-700 text-[9px]">|</span>
      <span className={`font-mono text-[10px] sm:text-[11px] font-bold transition-colors duration-200 ${lang === 'en' ? 'text-teal-300' : 'text-slate-500'}`}>EN</span>
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [menuOpen, setMenuOpen]       = useState(false)
  const { lang, setLang } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Lock body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Track active section */
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

  const handleNavClick = (href) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-slate-950/97 backdrop-blur-xl border-b border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">

          {/* ── Logo (always visible) ── */}
          <a
            href="#hero"
            className="font-display font-bold text-xl sm:text-2xl text-white tracking-wider hover:text-teal-400 transition-colors duration-200 flex-shrink-0"
          >
            TC<span className="text-teal-500">.</span>
          </a>

          {/* ── Desktop nav ── */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-center">
            {/* Contact CTA */}
            <a
              href="#contact"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-teal-500/30 bg-teal-500/8 hover:bg-teal-500/15 hover:border-teal-500/50 transition-all duration-200 mr-2"
            >
              <span className="font-display font-semibold text-[11px] tracking-widest uppercase text-teal-300">Contact</span>
            </a>

            {/* Nav links */}
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
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
                  <span className={`relative font-display font-semibold text-[13px] tracking-widest uppercase transition-colors duration-200 ${
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

          {/* ── Desktop: lang toggle ── */}
          <div className="hidden sm:block flex-shrink-0">
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          {/* ── Mobile: lang toggle + hamburger ── */}
          <div className="flex sm:hidden items-center gap-2">
            <LangToggle lang={lang} setLang={setLang} />
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 text-white"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile full-screen menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-2xl flex flex-col pt-20 pb-10 px-6 sm:hidden"
          >
            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.id
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full text-left flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-500/10 border border-teal-500/25'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(20,184,166,0.9)' }} />}
                    <span className={`font-display font-bold text-2xl tracking-widest uppercase ${
                      isActive ? 'text-teal-300' : 'text-slate-300'
                    }`}>
                      {link.label}
                    </span>
                  </motion.button>
                )
              })}
            </nav>

            {/* Contact CTA at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.25 }}
            >
              <button
                onClick={() => handleNavClick('#contact')}
                className="w-full py-4 rounded-2xl font-display font-bold text-base tracking-widest uppercase text-white transition-all duration-200 border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20"
              >
                Contact
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
