import { Github, Linkedin, Mail } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import MagneticButton from './MagneticButton'

export default function Footer() {
  const { personalInfo, ui } = useContent()
  return (
    <footer className="relative py-10 px-5 border-t border-white/10 bg-ink-950">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">

        {/* Logo */}
        <a
          href="#hero"
          className="font-display font-bold text-2xl text-white tracking-widest hover:opacity-70 transition-opacity duration-200"
        >
          TC<span className="text-white/50">.</span>
        </a>

        {/* Copyright */}
        <p className="font-body text-white/50 text-sm order-3 sm:order-2">
          © {new Date().getFullYear()} {ui.footer.copyright}
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-4 order-2 sm:order-3">
          <MagneticButton
            as="a"
            strength={0.4}
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/15 transition-colors duration-200"
          >
            <Github size={17} />
          </MagneticButton>
          <MagneticButton
            as="a"
            strength={0.4}
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/15 transition-colors duration-200"
          >
            <Linkedin size={17} />
          </MagneticButton>
          <MagneticButton
            as="a"
            strength={0.4}
            href={`mailto:${personalInfo.email}`}
            aria-label="Email"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/15 transition-colors duration-200"
          >
            <Mail size={17} />
          </MagneticButton>
        </div>
      </div>
    </footer>
  )
}
