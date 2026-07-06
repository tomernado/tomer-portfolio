import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Linkedin, Github, Download, Send } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import MagneticButton from './MagneticButton'
import SectionMarker from './SectionMarker'
import { VIEWPORT, EASE_OUT } from '../motion'

/* Contact's own cross-section identity: a spotlight-style scale-up-from-
   center arrival — this is the closing act of the journey, so it should
   feel like it's coming into focus rather than sliding/settling like the
   sections before it. */
const spotlightReveal = {
  hidden:  { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_OUT } },
}

function FieldLabel({ children, active }) {
  return (
    <label className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mb-2">
      {children}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="w-1 h-1 rounded-full bg-white"
          />
        )}
      </AnimatePresence>
    </label>
  )
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Contact() {
  const { personalInfo, ui, dir } = useContent()
  const t = ui.contact

  const SOCIAL = [
    {
      href: `tel:${personalInfo.phone}`,
      icon: <Phone size={20} />,
      label: personalInfo.phone,
      color: 'text-white/70',
    },
    {
      href: personalInfo.whatsapp,
      icon: WA_ICON,
      label: 'WhatsApp',
      color: 'text-[#4ade80]',
    },
    {
      href: `mailto:${personalInfo.email}`,
      icon: <Mail size={20} />,
      label: personalInfo.email,
      color: 'text-white/70',
    },
    {
      href: personalInfo.linkedin,
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      color: 'text-white/70',
    },
    {
      href: personalInfo.github,
      icon: <Github size={20} />,
      label: 'GitHub',
      color: 'text-white/70',
    },
  ]

  const whatsappNumber = personalInfo.whatsapp.replace(/^https?:\/\/wa\.me\//, '')

  const [form, setForm]   = useState({ name: '', phone: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [focus, setFocus] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = encodeURIComponent(`Hi Tomer! 👋\nName: ${form.name}\nPhone: ${form.phone}\n\n${form.message}`)
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank')
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name: '', phone: '', message: '' }) }, 4000)
  }

  const inputClass = (field) =>
    `w-full px-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm font-body placeholder-white/25 focus:outline-none transition-all duration-200 ${
      focus === field
        ? 'border-white/40 bg-white/[0.06]'
        : 'border-white/10 hover:border-white/20'
    }`

  return (
    <section id="contact" className="relative py-24 px-5 border-t border-white/10" dir={dir}>
      <div className="max-w-6xl mx-auto">

        <SectionMarker index="05" label={t.label} className="mb-14" />

        <motion.h2
          initial="hidden" whileInView="visible" viewport={VIEWPORT}
          variants={spotlightReveal}
          className="font-display font-bold text-white tracking-tight mb-14"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3.25rem)' }}
        >
          {t.heading}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-14 lg:gap-20">

          {/* LEFT — CTA + social + download */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            className="flex flex-col gap-7"
          >
            <motion.div variants={fadeUp}>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-snug mb-3 tracking-tight">
                {t.headline1}<br />
                <span className="text-white/50">{t.headline2}</span>
              </h2>
              <p className="font-body text-white/45 text-sm leading-relaxed max-w-xs">
                {t.subtext}
              </p>
            </motion.div>

            {/* 5 social icon buttons */}
            <motion.div variants={fadeUp} className="grid grid-cols-5 gap-3">
              {SOCIAL.map((s, i) => (
                <MagneticButton
                  as="a"
                  strength={0.35}
                  key={i}
                  href={s.href}
                  target={s.href.startsWith('mailto') || s.href.startsWith('tel') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  title={s.label}
                  aria-label={s.label}
                  whileTap={{ scale: 0.92 }}
                  className={`flex items-center justify-center aspect-square rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/25 ${s.color} transition-colors duration-200`}
                >
                  {s.icon}
                </MagneticButton>
              ))}
            </motion.div>

            {/* Download CV */}
            <motion.a
              variants={fadeUp}
              href={personalInfo.cvPdf}
              download="Tomer_Cohen_Resume.pdf"
              className="group flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl border border-white/15 bg-white/[0.025] hover:bg-white/[0.055] hover:border-white/30 text-white font-semibold font-body text-sm transition-all duration-200"
            >
              <Download size={15} className="text-white/50 group-hover:text-white transition-colors duration-200" />
              {t.downloadCv}
            </motion.a>
          </motion.div>

          {/* RIGHT — Contact form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#4ade80">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <p className="font-body font-semibold text-white text-lg">{t.formTitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" dir="ltr">
              <motion.div animate={{ y: focus === 'name' ? -2 : 0 }} transition={{ duration: 0.2 }}>
                <FieldLabel active={focus === 'name'}>{t.nameLabel}</FieldLabel>
                <input
                  type="text" name="name" value={form.name}
                  onChange={set('name')}
                  onFocus={() => setFocus('name')}
                  onBlur={() => setFocus('')}
                  placeholder={t.namePlaceholder}
                  required
                  className={inputClass('name')}
                />
              </motion.div>

              <motion.div animate={{ y: focus === 'phone' ? -2 : 0 }} transition={{ duration: 0.2 }}>
                <FieldLabel active={focus === 'phone'}>{t.phoneLabel}</FieldLabel>
                <input
                  type="tel" name="phone" value={form.phone}
                  onChange={set('phone')}
                  onFocus={() => setFocus('phone')}
                  onBlur={() => setFocus('')}
                  placeholder={t.phonePlaceholder}
                  required
                  className={inputClass('phone')}
                />
              </motion.div>

              <motion.div animate={{ y: focus === 'message' ? -2 : 0 }} transition={{ duration: 0.2 }}>
                <FieldLabel active={focus === 'message'}>{t.messageLabel}</FieldLabel>
                <textarea
                  name="message" value={form.message}
                  onChange={set('message')}
                  onFocus={() => setFocus('message')}
                  onBlur={() => setFocus('')}
                  placeholder={t.msgPlaceholder}
                  required rows={5}
                  className={`${inputClass('message')} resize-none`}
                />
              </motion.div>

              <MagneticButton
                as="button"
                strength={0.15}
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-semibold font-body text-sm text-white transition-all duration-200"
                style={{
                  background: sent
                    ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                    : 'linear-gradient(135deg,#25d366,#128c7e)',
                  boxShadow: sent ? '0 8px 32px rgba(34,197,94,0.3)' : '0 8px 32px rgba(37,211,102,0.3)',
                }}
              >
                {sent ? (
                  <span>{t.successMsg}</span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t.submitBtn}
                  </>
                )}
              </MagneticButton>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
