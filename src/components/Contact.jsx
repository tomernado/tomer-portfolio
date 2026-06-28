import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Linkedin, Github, Download, Send } from 'lucide-react'
import { useContent } from '../context/LanguageContext'

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
      bg: 'bg-green-500/10 hover:bg-green-500/18',
      border: 'border-green-500/20 hover:border-green-500/40',
      color: 'text-green-400',
    },
    {
      href: personalInfo.whatsapp,
      icon: WA_ICON,
      label: 'WhatsApp',
      bg: 'bg-green-500/10 hover:bg-green-500/18',
      border: 'border-green-500/20 hover:border-green-500/40',
      color: 'text-green-400',
    },
    {
      href: `mailto:${personalInfo.email}`,
      icon: <Mail size={20} />,
      label: personalInfo.email,
      bg: 'bg-blue-500/10 hover:bg-blue-500/18',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      color: 'text-blue-400',
    },
    {
      href: personalInfo.linkedin,
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      bg: 'bg-blue-500/10 hover:bg-blue-500/18',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      color: 'text-blue-400',
    },
    {
      href: personalInfo.github,
      icon: <Github size={20} />,
      label: 'GitHub',
      bg: 'bg-slate-700/25 hover:bg-slate-700/40',
      border: 'border-slate-600/30 hover:border-slate-500/50',
      color: 'text-slate-300',
    },
  ]

  const [form, setForm]   = useState({ name: '', phone: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [focus, setFocus] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = encodeURIComponent(`Hi Tomer! 👋\nName: ${form.name}\nPhone: ${form.phone}\n\n${form.message}`)
    window.open(`https://wa.me/972543210990?text=${text}`, '_blank')
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name: '', phone: '', message: '' }) }, 4000)
  }

  const inputClass = (field) =>
    `w-full px-4 py-3.5 bg-slate-800/50 border rounded-xl text-white text-sm font-body placeholder-slate-600 focus:outline-none transition-all duration-200 ${
      focus === field
        ? 'border-blue-500/60 bg-slate-800/80 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
        : 'border-slate-700/60 hover:border-slate-600/70'
    }`

  return (
    <section id="contact" className="relative py-24 px-5 border-t border-slate-800/50" dir={dir}>
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-14"
        >
          <p className="font-display text-blue-500 text-xs tracking-[0.3em] uppercase mb-2 font-semibold">{t.label}</p>
          <h2 className="font-body font-extrabold text-4xl sm:text-5xl text-white">{t.heading}</h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-transparent rounded-full mt-4"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ width: 56, originX: dir === 'rtl' ? 1 : 0 }}
          />
        </motion.div>

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
              <h2 className="font-body font-extrabold text-3xl sm:text-4xl text-white leading-snug mb-3">
                {t.headline1}<br />
                <span className="text-blue-400">{t.headline2}</span>
              </h2>
              <p className="font-body text-slate-400 text-sm leading-relaxed max-w-xs">
                {t.subtext}
              </p>
            </motion.div>

            {/* 5 social icon buttons */}
            <motion.div variants={fadeUp} className="grid grid-cols-5 gap-3">
              {SOCIAL.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target={s.href.startsWith('mailto') || s.href.startsWith('tel') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  title={s.label}
                  className={`flex items-center justify-center aspect-square rounded-2xl border ${s.bg} ${s.border} ${s.color} transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95`}
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>

            {/* Download CV */}
            <motion.a
              variants={fadeUp}
              href={personalInfo.cvPdf}
              download="Tomer_Cohen_Resume.pdf"
              className="group flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl border border-slate-600/40 bg-white/[0.025] hover:bg-white/[0.055] hover:border-slate-500/55 text-white font-semibold font-body text-sm transition-all duration-200"
            >
              <Download size={15} className="text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
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
              <div>
                <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 mb-2">
                  {t.nameLabel}
                </label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={set('name')}
                  onFocus={() => setFocus('name')}
                  onBlur={() => setFocus('')}
                  placeholder={t.namePlaceholder}
                  required
                  className={inputClass('name')}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 mb-2">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel" name="phone" value={form.phone}
                  onChange={set('phone')}
                  onFocus={() => setFocus('phone')}
                  onBlur={() => setFocus('')}
                  placeholder={t.phonePlaceholder}
                  required
                  className={inputClass('phone')}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-slate-500 mb-2">
                  {t.messageLabel}
                </label>
                <textarea
                  name="message" value={form.message}
                  onChange={set('message')}
                  onFocus={() => setFocus('message')}
                  onBlur={() => setFocus('')}
                  placeholder={t.msgPlaceholder}
                  required rows={5}
                  className={`${inputClass('message')} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
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
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
