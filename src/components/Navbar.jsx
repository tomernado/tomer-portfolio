import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { ACCENT } from '../motion'
import MagneticButton from './MagneticButton'

const navLinks = [
  { label: 'Home',     href: '#hero',     id: 'hero' },
  { label: 'About',   href: '#about',    id: 'about' },
  { label: 'Skills',  href: '#skills',   id: 'skills' },
  { label: 'Projects',href: '#projects', id: 'projects' },
  { label: 'Web4You', href: '#web4you',  id: 'web4you' },
  { label: 'Contact', href: '#contact',  id: 'contact' },
]

function LangToggle({ lang, setLang, compact }) {
  return (
    <button
      onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
      className={`flex-shrink-0 flex items-center gap-1 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-200 ${compact ? 'px-2.5 py-1.5' : 'px-2 py-1'}`}
      aria-label="Switch language"
    >
      <span className={`font-mono text-[11px] font-bold transition-colors duration-200 ${lang === 'he' ? 'text-white' : 'text-white/50'}`}>עב</span>
      <span className="text-white/20 text-[8px]">|</span>
      <span className={`font-mono text-[11px] font-bold transition-colors duration-200 ${lang === 'en' ? 'text-white' : 'text-white/50'}`}>EN</span>
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [menuOpen, setMenuOpen]           = useState(false)
  const { lang, setLang } = useLang()

  useEffect(() => {
    // A section becomes active the moment its top crosses 40% down the
    // viewport. We keep the last one that passed — no IntersectionObserver
    // dead zones at section boundaries (the old IO approach had a ~20vh gap
    // between Hero and About where neither registered as active).
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const trigger = window.innerHeight * 0.4
      let active = navLinks[0].id
      for (const { id } of navLinks) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= trigger) active = id
      }
      setActiveSection(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the active section changes (i.e. after a nav)
  useEffect(() => { setMenuOpen(false) }, [activeSection])

  return (
    <nav
      // `backdrop-blur-xl` on a full-width `position: fixed` bar has to
      // recompute on every scroll frame — one of the most reliable ways to
      // crash Mobile Safari's compositor. Kept exactly as-is at md: and up
      // (desktop is unchanged); mobile gets a near-opaque solid fill
      // instead, which reads the same at 95%+ opacity without the
      // per-frame blur recompute cost.
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-[#04050A]/95 md:bg-[#04050A]/90 md:backdrop-blur-xl border-b border-white/[0.07]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">

        {/* Left — TC. */}
        <a
          href="#hero"
          className="flex-shrink-0 font-display font-bold text-xl sm:text-2xl text-white tracking-wider hover:opacity-70 transition-opacity duration-200 rounded"
        >
          TC<span className="text-white/50">.</span>
        </a>

        {/* Center — Nav links (tablet/desktop only) */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <MagneticButton
                as="a"
                strength={0.15}
                key={link.href}
                href={link.href}
                className="relative flex-shrink-0 whitespace-nowrap px-3.5 py-2 rounded-full transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.08] border"
                    style={{ borderColor: `rgba(${ACCENT.rgb},0.35)`, boxShadow: `0 0 12px rgba(${ACCENT.rgb},0.15)` }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative font-display font-medium text-[13px] tracking-widest uppercase transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
                }`}>
                  {link.label}
                </span>
              </MagneticButton>
            )
          })}
        </div>

        {/* Right — lang toggle + mobile menu button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <LangToggle lang={lang} setLang={setLang} />
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/[0.04] text-white transition-all duration-200"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            id="mobile-menu-panel"
            className="sm:hidden overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-col px-5 py-3">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.id
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    // Handled manually: closing this panel changes page height
                    // (the collapse itself is a big layout shift). If that
                    // collapse happens *during* the native anchor scroll, it
                    // derails it. So: collapse first, then scroll once the
                    // panel has actually finished animating away.
                    onClick={(e) => {
                      e.preventDefault()
                      setMenuOpen(false)
                      setTimeout(() => {
                        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                      }, 320)
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className={`py-3.5 font-display font-medium text-base tracking-wide border-b border-white/[0.06] last:border-0 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
