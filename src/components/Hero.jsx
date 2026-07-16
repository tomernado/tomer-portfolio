import { useEffect, useRef, useState } from 'react'
import {
  motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion,
} from 'framer-motion'
import { Github, Linkedin, MessageCircle, FileText, ArrowUpRight, Network, CalendarClock, ChefHat, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useContent } from '../context/LanguageContext'
import { EASE_OUT, SPRING_SOFT, staggerContainer, revealUp } from '../motion'
import MagneticButton from './MagneticButton'
import SpotlightCard from './SpotlightCard'
import Particles from './Particles'
import PerspectiveFloor from './PerspectiveFloor'
import EngineeringCore from './EngineeringCore'
import OrbitSystem from './OrbitSystem'
import CvModal from './CvModal'

// Stable viewport-option objects — see About.jsx for why this matters:
// Hero re-renders every 2.8s (role-text rotation), and a fresh inline
// `viewport={{...}}` literal on that cadence breaks whileInView's
// IntersectionObserver subscription, leaving content stuck invisible.
const VP_ONCE = { once: true }
const VP_ONCE_40 = { once: true, amount: 0.4 }

/* Shared glass treatment for every social pill — one definition so all
   four buttons stay visually identical. */
const SOCIAL_BTN_CLASS = 'inline-flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full border border-white/10 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-white/55 font-mono text-[12.5px] tracking-wide hover:text-white hover:bg-black/45 hover:border-violet-300/25 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

/* ── The living scene's floating cards — real projects, real stack,
   styled as small premium product-UI widgets (icon badge, title,
   subtitle, status row, mini interface preview, external-link
   affordance) rather than decorative tiles. Positions/tilts are
   deliberately irregular so the composition reads as scattered and
   cinematic. ──────────────────────────────────────────────────────── */
const SCENE_CARDS = [
  {
    key: 'socialorg', icon: Network, iconFrom: '#818cf8', iconTo: '#6366f1', rotate: -4,
    tiltX: -16, tiltY: 12,
    className: 'top-[-2%] left-[0%] w-[196px] sm:w-[214px]',
    floatDur: 7.4, floatDelay: 0,
    title: 'SocialOrg', sub: 'AI organizational automation', body: 'dashboard',
    toolbarLabel: 'app.socialorg.io',
  },
  {
    key: 'code', rotate: 2,
    tiltX: -11, tiltY: -15,
    className: 'top-[30%] right-[-8%] w-[206px] sm:w-[228px]',
    floatDur: 9.2, floatDelay: 0.3,
    title: 'agent.ts', body: 'code',
  },
  {
    key: 'workshift', icon: CalendarClock, iconFrom: '#38bdf8', iconTo: '#0ea5e9', rotate: -2,
    tiltX: -18, tiltY: 13,
    className: 'bottom-[20%] left-[-9%] w-[172px] sm:w-[188px]',
    floatDur: 8, floatDelay: 0.9,
    title: 'WorkShift', sub: 'Smart shift scheduling', body: 'schedule',
    toolbarLabel: 'workshift.app',
  },
  {
    key: 'chef', icon: ChefHat, iconFrom: '#a5b4fc', iconTo: '#818cf8', rotate: 3,
    tiltX: -13, tiltY: -11,
    className: 'bottom-[-4%] right-[7%] w-[184px] sm:w-[200px]',
    floatDur: 7.8, floatDelay: 1.3,
    title: 'Chef Platform', sub: 'Private chef business', body: 'list',
    toolbarLabel: 'admin.chefplatform.com',
  },
]

/* Two cards shown in the mobile (< lg) lightweight scene.
   Pick one "product UI" card and one "code" card for visual variety. */
const MOBILE_SCENE_CARDS = [SCENE_CARDS[0], SCENE_CARDS[1]]

/* Absolute positions within the mobile scene container (280–340px square).
   Top-left and bottom-right so the Energy Core is framed between them. */
const MOBILE_CARD_POS = [
  'top-[4%] left-[0%] w-[48%]',
  'bottom-[4%] right-[0%] w-[48%]',
]

/* Three orbit rings — different radii, tilts and speeds/directions. */
const CONNECTIONS = [
  'M 106 84 Q 166 138 220 188',
  'M 420 224 Q 374 234 328 250',
  'M 96 372 Q 166 338 220 310',
  'M 424 462 Q 368 416 328 360',
]

/* Public-folder asset path — respects Vite's base in both dev and prod. */
const BG_URL = import.meta.env.BASE_URL + 'img/BACKGROUND.png'

/* A small pulsing "live" indicator — reused across widget status rows
   so the whole scene reads as one connected system, not four one-offs. */
function LiveDot({ color = '#34d399', reduceMotion }) {
  return (
    <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
      {!reduceMotion && (
        <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ background: color, opacity: 0.75 }} />
      )}
      <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: color }} />
    </span>
  )
}

function WindowChrome({ label }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.07]">
      <div className="flex gap-1.5 flex-shrink-0">
        <span className="w-[7px] h-[7px] rounded-full bg-[#ff5f57]/80" />
        <span className="w-[7px] h-[7px] rounded-full bg-[#febc2e]/80" />
        <span className="w-[7px] h-[7px] rounded-full bg-[#28c840]/80" />
      </div>
      <div className="flex-1 flex justify-center min-w-0">
        <span className="px-2.5 py-[3px] rounded-full bg-white/[0.05] border border-white/[0.07] font-mono text-[8px] text-white/35 truncate max-w-full">
          {label}
        </span>
      </div>
    </div>
  )
}

function CodeChrome() {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.07]">
      <div className="flex gap-1.5 flex-shrink-0">
        <span className="w-[7px] h-[7px] rounded-full bg-[#ff5f57]/80" />
        <span className="w-[7px] h-[7px] rounded-full bg-[#febc2e]/80" />
        <span className="w-[7px] h-[7px] rounded-full bg-[#28c840]/80" />
      </div>
      <div className="ml-1 flex items-center gap-0.5">
        <span className="px-2 py-[3px] rounded-t-md bg-white/[0.07] border-t border-x border-white/[0.08] font-mono text-[8.5px] text-white/65">agent.ts</span>
        <span className="px-2 py-[3px] font-mono text-[8.5px] text-white/25">index.ts</span>
      </div>
    </div>
  )
}

function CardIcon({ card }) {
  return (
    <span
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${card.iconFrom}, ${card.iconTo})`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 10px -2px ${card.iconFrom}66`,
      }}
    >
      <card.icon size={14} className="text-white" />
    </span>
  )
}

function DashboardPreview() {
  const bars = [42, 66, 48, 82, 60, 92, 70]
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
      <div className="flex items-center gap-3 mb-2.5 font-mono text-[8px] tracking-wide">
        <span className="text-white/70 pb-1 border-b border-violet-400/60">Overview</span>
        <span className="text-white/25">Teams</span>
        <span className="text-white/25">Reports</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        <div className="rounded-md bg-white/[0.03] border border-white/[0.05] px-2 py-1.5">
          <p className="font-mono text-[6.5px] tracking-wide text-white/35 mb-0.5">ACTIVE USERS</p>
          <p className="font-display font-bold text-[13px] text-white leading-none">1,284</p>
        </div>
        <div className="rounded-md bg-white/[0.03] border border-white/[0.05] px-2 py-1.5">
          <p className="font-mono text-[6.5px] tracking-wide text-white/35 mb-0.5">AUTOMATIONS</p>
          <p className="font-display font-bold text-[13px] text-white leading-none">94%</p>
        </div>
      </div>
      <div className="flex items-end gap-[3px] h-7 border-b border-white/[0.09] pb-0.5">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-[2px] bg-gradient-to-t from-violet-400/75 to-purple-300/75" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function SchedulePreview() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const rowA = [1, 1, 0, 1, 1, 0, 0]
  const rowB = [0, 1, 1, 0, 1, 1, 0]
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {days.map((d, i) => (
          <span key={i} className="font-mono text-[7px] text-white/35 text-center">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {rowA.map((on, i) => (
          <div key={i} className={on ? 'h-3.5 rounded-[3px] bg-gradient-to-b from-sky-400/75 to-sky-500/55' : 'h-3.5 rounded-[3px] bg-white/[0.04] border border-white/[0.06]'} />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {rowB.map((on, i) => (
          <div key={i} className={on ? 'h-3.5 rounded-[3px] bg-gradient-to-b from-sky-400/75 to-sky-500/55' : 'h-3.5 rounded-[3px] bg-white/[0.04] border border-white/[0.06]'} />
        ))}
      </div>
    </div>
  )
}

function ListPreview() {
  const rows = ['Menu planning', 'Client orders', 'ML insights']
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5 flex flex-col gap-1.5">
      {rows.map((label) => (
        <div key={label} className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-white/[0.02]">
          <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168,85,247,0.18)' }}>
            <CheckCircle2 size={9} className="text-violet-300" />
          </span>
          <span className="font-body text-[10.5px] text-white/60 truncate">{label}</span>
        </div>
      ))}
    </div>
  )
}

function CodeBody() {
  const lines = [
    <><span className="text-violet-300">const</span> agent = <span className="text-violet-300">new</span> RAGAgent({'{'}</>,
    <>{'  '}model: <span className="text-emerald-300">'claude-4.5'</span>,</>,
    <>{'  '}tools: [vectorSearch, db],</>,
    <>{'  '}memory: <span className="text-sky-300">true</span></>,
    <>{'}'}){'  '}<span className="text-white/30">// Node + Express</span></>,
  ]
  return (
    <div className="rounded-lg border border-white/[0.07] bg-black/25 p-2.5">
      <div className="font-mono text-[9.5px] leading-[1.7]">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="text-white/20 select-none w-3 text-right flex-shrink-0">{i + 1}</span>
            <span className="whitespace-pre text-white/60">{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardBody({ card, reduceMotion }) {
  if (card.body === 'code') {
    return (
      <>
        <CodeChrome />
        <CodeBody />
        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/[0.06]">
          <LiveDot reduceMotion={reduceMotion} />
          <span className="font-mono text-[10px] text-white/40">Deployed to production</span>
        </div>
      </>
    )
  }
  return (
    <>
      <WindowChrome label={card.toolbarLabel} />
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <CardIcon card={card} />
          <span className="font-display font-bold text-[13px] text-white">{card.title}</span>
        </div>
        <ArrowUpRight size={13} className="text-white/30 flex-shrink-0 mt-0.5" />
      </div>
      {card.sub && <p className="font-body text-[11px] text-white/40 leading-snug mb-2.5">{card.sub}</p>}

      {card.body === 'dashboard' && (
        <>
          <div className="flex items-center gap-1.5 mb-2">
            <LiveDot reduceMotion={reduceMotion} />
            <span className="font-mono text-[10px] text-white/40">Live</span>
          </div>
          <DashboardPreview />
          <div className="flex items-center gap-1 mt-2 font-mono text-[10px] text-emerald-300/80">
            <TrendingUp size={10} /> 94% automation rate
          </div>
        </>
      )}

      {card.body === 'schedule' && (
        <>
          <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-white/40">
            <span>Coverage</span><span className="text-sky-300">87%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-300"
              initial={{ width: 0 }}
              whileInView={{ width: '87%' }}
              viewport={VP_ONCE}
              transition={{ duration: 1.1, delay: 1, ease: EASE_OUT }}
            />
          </div>
          <SchedulePreview />
        </>
      )}

      {card.body === 'list' && (
        <>
          <ListPreview />
          <div className="flex items-center gap-1.5 mt-2.5 font-mono text-[10px] text-violet-300/80">
            <CheckCircle2 size={11} /> 3/3 tasks complete
          </div>
        </>
      )}
    </>
  )
}

/* Simplified card body for the mobile scene — window chrome + identity
   only, no preview widget. At ~135px card width the preview layouts are
   too cramped; the chrome+icon+title reads as a premium product card. */
function MobileCardBody({ card, reduceMotion }) {
  if (card.body === 'code') {
    return (
      <>
        <CodeChrome />
        <div className="flex items-center gap-1.5 mt-1">
          <LiveDot color="#34d399" reduceMotion={reduceMotion} />
          <span className="font-mono text-[9px] text-white/40">Production</span>
        </div>
      </>
    )
  }
  return (
    <>
      <WindowChrome label={card.toolbarLabel} />
      <div className="flex items-center gap-2">
        {card.icon && <CardIcon card={card} />}
        <div className="min-w-0">
          <span className="font-display font-bold text-[11px] text-white block truncate">{card.title}</span>
          {card.sub && <span className="font-body text-[9px] text-white/40 block mt-0.5 leading-snug truncate">{card.sub}</span>}
        </div>
      </div>
    </>
  )
}

/* Lightweight card for mobile: float-bob only (no mouse parallax, no 3D
   tilt). Background is purple-tinted to feel lit by the Energy Core. */
function MobileSceneCard({ card, index }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={`absolute ${MOBILE_CARD_POS[index]}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.65 + index * 0.2, ease: EASE_OUT }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: card.floatDur, delay: card.floatDelay, repeat: Infinity, ease: 'easeInOut' }}
        style={{ rotate: card.rotate * 0.5 }}
      >
        <SpotlightCard
          className="w-full rounded-xl border p-2.5"
          style={{
            background: 'linear-gradient(160deg, rgba(148,85,247,0.08) 0%, rgba(18,10,28,0.90) 50%)',
            borderColor: 'rgba(168,85,247,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 24px rgba(28,0,56,0.5)',
          }}
        >
          <MobileCardBody card={card} reduceMotion={reduceMotion} />
        </SpotlightCard>
      </motion.div>
    </motion.div>
  )
}

function SceneCard({ card, index, smx, smy, reduceMotion }) {
  const depth = 10 + index * 4
  const px = useTransform(smx, [-1, 1], [-depth, depth])
  const py = useTransform(smy, [-1, 1], [-depth, depth])
  // Perspective tilt: a fixed per-card base angle (so each window sits at
  // its own oblique angle, like a pane of glass rather than a flat sticker)
  // plus a small mouse-driven swing around that base for a holographic feel.
  const tiltX = useTransform(smy, [-1, 1], [card.tiltX - 4, card.tiltX + 4])
  const tiltY = useTransform(smx, [-1, 1], [card.tiltY - 4, card.tiltY + 4])

  return (
    // Layer 1 (outer): fixed position + width, entrance reveal only.
    <motion.div
      className={`absolute ${card.className}`}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VP_ONCE_40}
      transition={{ duration: 0.8, delay: 0.7 + index * 0.13, ease: EASE_OUT }}
    >
      {/* Layer 2: mouse-parallax drift, driven entirely by external motion values. */}
      <motion.div style={reduceMotion ? {} : { x: px, y: py }}>
        {/* Layer 3: continuous float bob + static in-plane tilt + 3D
            perspective tilt — every card has its own duration/delay/angle
            (set in SCENE_CARDS) so none move or sit alike. */}
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -11, 0] }}
          whileHover={reduceMotion ? undefined : { rotate: card.rotate * 1.8 }}
          transition={reduceMotion ? undefined : { duration: card.floatDur, delay: card.floatDelay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            rotate: card.rotate,
            rotateX: reduceMotion ? card.tiltX : tiltX,
            rotateY: reduceMotion ? card.tiltY : tiltY,
            transformPerspective: 900,
          }}
        >
          <SpotlightCard
            className="w-full rounded-2xl border border-white/[0.15] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_30px_rgba(168,85,247,0.07),0_10px_16px_-4px_rgba(0,0,0,0.4),0_32px_65px_rgba(0,0,0,0.58)] hover:border-violet-400/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_42px_rgba(168,85,247,0.14),0_14px_22px_-4px_rgba(0,0,0,0.45),0_44px_90px_rgba(168,85,247,0.34)] hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-300 p-3.5"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(14,14,20,0.86) 42%)' }}
          >
            <CardBody card={card} reduceMotion={reduceMotion} />
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const { personalInfo, ui, dir } = useContent()
  const [cvOpen, setCvOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  // The floating-card/orbit/energy-core scene is a purely decorative,
  // JS-animation-heavy subtree (dozens of concurrent framer-motion loops).
  // It's already visually a desktop composition (the grid only splits into
  // two columns at lg:), but without also skipping the *mount* on smaller
  // screens those animations keep running off-screen and can seriously
  // bog down weaker/mobile CPUs. Gate the actual render, not just layout,
  // at the same lg: breakpoint the grid itself uses.
  const [showScene, setShowScene] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 1024px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setShowScene(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const sectionRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, SPRING_SOFT)
  const smy = useSpring(my, SPRING_SOFT)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.97])
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 90])

  const handleMouseMove = (e) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }
  const handleMouseLeave = () => { mx.set(0); my.set(0) }

  const globeX = useTransform(smx, [-1, 1], [-10, 10])
  const globeY = useTransform(smy, [-1, 1], [-10, 10])

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  /* Slow, elegant, endless role rotation — paused under reduced motion. */
  const roles = ui.hero.roles
  const [roleIndex, setRoleIndex] = useState(0)
  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2800)
    return () => clearInterval(id)
  }, [roles, reduceMotion])

  return (
    <section
      id="hero"
      ref={sectionRef}
      dir={dir}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center overflow-hidden isolate px-6 pt-28 pb-32 lg:pb-20"
    >
      {/* ── Layer: BackgroundAtmosphere ─────────────────────────────── */}
      {/* Five large `filter: blur()` layers (120–180px radius, up to
          1200px wide), mounted unconditionally from first paint, two of
          them animating forever — this is the single heaviest GPU cost on
          the page and the most likely cause of Mobile Safari crashing
          during initial load. Desktop keeps the exact original blur radii
          via `md:blur-[...]`; mobile gets a much smaller radius (same
          color/shape/position, just cheaper to composite) and the two
          animated ones stop looping so their blur is computed once
          instead of every frame. */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[#04050A]" />

        {/* ── Layer: Background texture ─────────────────────────────────
            Dark AI/tech landscape whose violet/blue/purple palette matches
            Hero's accent scheme exactly. Two-layer approach:
              1. The image itself at reduced opacity — lets the glowing
                 horizon and energy waves show as atmospheric depth.
              2. Gradient overlay that fades the image back into the dark
                 base at the top (navbar/content zone), bottom (dissolve
                 handoff), and sides — so it reads as part of the scene
                 rather than a placed asset.
            No filter/blur on the image layer — cheap to composite. */}
        <div
          className="absolute inset-0 [background-position:12%_78%] lg:[background-position:center_62%]"
          style={{
            backgroundImage: `url(${BG_URL})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.58,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              /* Top fade — covers the sky/circuit zone where headline sits;
                 clears quickly so the mountains and horizon show below */
              'linear-gradient(to bottom, rgba(4,5,10,0.78) 0%, rgba(4,5,10,0.38) 8%, rgba(4,5,10,0.08) 18%, transparent 28%)',
              /* Wide radial — keeps far corners dark while letting the
                 full mountain/horizon/grid show through the center+bottom */
              'radial-gradient(ellipse 160% 90% at 50% 105%, transparent 30%, rgba(4,5,10,0.35) 60%, rgba(4,5,10,0.72) 82%, #04050A 97%)',
            ].join(', '),
          }}
        />

        {/* Left ambient — violet.
            `filter: blur()` has to be re-rasterized at a higher effective
            resolution whenever the visual viewport zooms (pinch/double-tap
            zoom) — cost scales with pixel count, so it balloons under
            zoom even at the already-reduced 45-60px mobile radius.
            Reported crash trigger: pinch-zooming directly on Hero. Mobile
            now uses a pure radial-gradient (extra stops for a soft edge,
            no blur) instead — cheap to render at any zoom level; desktop
            keeps the exact original blur unchanged. */}
        <div
          className="absolute -left-[20%] top-[10%] h-[900px] w-[900px] rounded-full md:blur-[180px] opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,.22) 0%, rgba(139,92,246,.13) 22%, rgba(139,92,246,.06) 40%, rgba(139,92,246,.02) 58%, transparent 75%)' }}
        />

        {/* Right glow — purple */}
        <div
          className="absolute right-[-10%] top-[0%] h-[850px] w-[850px] rounded-full md:blur-[180px] opacity-28"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,.20) 0%, rgba(168,85,247,.12) 25%, rgba(168,85,247,.05) 45%, rgba(168,85,247,.02) 62%, transparent 75%)' }}
        />

        {/* Purple center glow — breathing, the dominant hue of the scene */}
        <motion.div
          className="absolute right-[18%] top-[28%] h-[500px] w-[500px] rounded-full md:blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(147,51,234,.38) 0%, rgba(147,51,234,.22) 25%, rgba(147,51,234,.08) 45%, rgba(147,51,234,.03) 62%, transparent 75%)' }}
          animate={(reduceMotion || !showScene) ? {} : { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />

        {/* Bottom energy glow — the one place blue remains, as a
            deliberately secondary accent beneath the purple-led scene. */}
        <div
          className="absolute bottom-[-250px] left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full md:blur-[150px] opacity-18"
          style={{ background: 'radial-gradient(circle, rgba(71,113,255,.16) 0%, rgba(71,113,255,.09) 30%, rgba(71,113,255,.04) 55%, rgba(71,113,255,.015) 68%, transparent 75%)' }}
        />

        {/* ── Layer: PerspectiveFloor — converging arcs + spokes, fades into
            distance. Desktop only: it combines a CSS mask, several SVG
            blur filters and ~20 concurrent SMIL/Framer animations, all
            mounted from first paint — exactly the combination (masks +
            blur + GPU layers, present during initial load) that crashes
            Mobile Safari's compositor. */}
        {showScene && (
          <PerspectiveFloor className="absolute inset-x-[6%] bottom-[-8%] h-[46%]" />
        )}

        {/* Atmospheric vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,.35) 100%)' }}
        />

        {/* ── Layer: ParticleSystem ────────────────────────────────── */}
        <Particles count={16} />

        {/* Hero → About dissolve — kept quiet on purpose: Hero simply
            gets darker toward its own bottom, with only a faint violet
            undertone that itself fades to black, and only resolves to
            About's white in a short, quick band right at the very edge.
            No bright purple bloom, no separator line — the handoff should
            read as almost invisible while scrolling. */}
        <svg className="absolute bottom-0 left-0 w-full h-[280px]" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="heroDissolveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(10,6,16,0)" />
              <stop offset="45%" stopColor="rgba(18,10,28,0.55)" />
              <stop offset="70%" stopColor="rgba(28,16,42,0.85)" />
              <stop offset="88%" stopColor="rgba(35,22,50,0.95)" />
              <stop offset="97%" stopColor="#f8f7fb" />
              <stop offset="100%" stopColor="#f8f7fb" />
            </linearGradient>
          </defs>
          <path
            d="M0,44 Q500,148 1000,44 L1000,280 L0,280 Z"
            fill="url(#heroDissolveGrad)"
          />
          {/* Fine diagonal threads of current, kept low in the band (well
              clear of the content above) — each trends across the width at
              a different slight angle so they cross one another, thin and
              low-opacity for delicacy. A slow drift is the only motion.
              Desktop only — this is the "fade" the crash reports pointed
              at, so mobile now gets just the static gradient below with
              none of these infinite animations layered on top. */}
          {showScene && [
            { d: 'M0,150 C100,160 200,142 300,154 C400,166 500,148 600,168 C700,188 800,172 900,188 C950,196 980,204 1000,216', o: 0.32, w: 0.8, dur: 15, bob: 5 },
            { d: 'M0,238 C100,226 200,236 300,226 C400,216 500,231 600,211 C700,191 800,203 900,187 C950,179 980,171 1000,160', o: 0.2, w: 0.65, dur: 19, bob: 4 },
            { d: 'M0,196 C150,204 250,187 380,198 C500,208 600,190 720,201 C820,211 900,195 1000,208', o: 0.13, w: 0.55, dur: 23, bob: 3 },
          ].map((w, i) => (
            <motion.path
              key={i}
              d={w.d}
              fill="none"
              stroke="rgba(196,166,255,1)"
              strokeOpacity={w.o}
              strokeWidth={w.w}
              strokeLinecap="round"
              animate={reduceMotion ? undefined : { x: [0, 16, 0, -16, 0], y: [0, -w.bob, 0, w.bob * 0.5, 0] }}
              transition={reduceMotion ? undefined : { duration: w.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {showScene && [
            [60, 196, 1.1, 0.35], [150, 196, 1.6, 0.55], [230, 216, 1, 0.3],
            [310, 205, 1.3, 0.4], [390, 222, 1, 0.28], [430, 200, 1.6, 0.5],
            [520, 218, 1.1, 0.32], [600, 205, 1.4, 0.45], [680, 224, 1, 0.28],
            [730, 198, 1.6, 0.5], [810, 220, 1, 0.3], [900, 203, 1.5, 0.48],
            [960, 222, 1, 0.3],
          ].map(([cx, cy, r, o], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(196,181,253,1)" opacity={o} />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">

        {/* ── LEFT — identity first: name, role, pitch, CTAs ─────────── */}
        {/* `contentY/contentOpacity/contentScale` are continuously
            recalculated from raw scroll position and applied to this
            entire column, for the whole time Hero is scrolling out of
            view — a range that ends exactly at the Hero→About boundary,
            the same zone where About's own continuous scroll-transform
            (see About.jsx) is simultaneously active. Both running
            concurrently, recalculated every scroll frame, is what
            crashed real iPhones on repeated scrolling across that
            specific seam. Desktop-only now; mobile content stays put. */}
        <motion.div
          style={(reduceMotion || !showScene) ? {} : { y: contentY, opacity: contentOpacity, scale: contentScale }}
          variants={staggerContainer(0.11, 0.05)}
          initial="hidden"
          animate="visible"
          className={`lg:-mt-6 text-center ${dir === 'rtl' ? 'lg:text-right' : 'lg:text-left'}`}
        >
          <motion.div variants={revealUp} className="flex items-center justify-center lg:justify-start gap-3.5 mb-6">
            <div className="relative flex-shrink-0">
              {/* Breathing purple glow ring behind the avatar */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-2.5 lg:-inset-3 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)', filter: 'blur(11px)' }}
                animate={reduceMotion ? {} : { opacity: [0.5, 0.95, 0.5], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="relative block w-[82px] h-[82px] lg:w-[92px] lg:h-[92px] rounded-full overflow-hidden ring-1 ring-white/20"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 24px -4px rgba(168,85,247,0.45)' }}
                animate={reduceMotion ? {} : { y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src={personalInfo.profileMedia} alt={personalInfo.name} loading="eager" className="w-full h-full object-cover object-top" />
              </motion.span>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-sm text-white/55">
              {ui.hero.eyebrow}
              <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#c084fc', boxShadow: '0 0 8px 2px rgba(192,132,252,0.8)' }}
                animate={reduceMotion ? {} : { opacity: [0.4, 1, 0.4], scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.div>

          <motion.div variants={revealUp} className="relative mb-3">
            {/* Very subtle glow accent behind the name — reads as ambient
                light, not a text effect. */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-6 -inset-y-4 -z-10 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 65% 80% at 20% 50%, rgba(168,85,247,0.22), transparent 72%)', filter: 'blur(22px)' }}
            />
            <h1 className="font-display font-bold leading-[1.04] tracking-tight text-[3.25rem] sm:text-6xl lg:text-[5.5rem]">
              {(() => {
                const words = personalInfo.name.split(' ')
                const last = words[words.length - 1]
                const rest = words.slice(0, -1).join(' ')
                return (
                  <>
                    <span className="text-white" style={{ textShadow: '0 2px 24px rgba(168,85,247,0.2)' }}>{rest ? `${rest} ` : ''}</span>
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #d8b4fe 55%, #a855f7 100%)', textShadow: '0 2px 30px rgba(168,85,247,0.35)' }}
                    >
                      {last}
                    </span>
                  </>
                )
              })()}
            </h1>
          </motion.div>

          <motion.div variants={revealUp} className="relative h-[1.4em] overflow-hidden mb-9 flex items-center">
            {roles.map((r, i) => (
              <motion.span
                key={r}
                animate={{ opacity: i === roleIndex ? 1 : 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="absolute inset-0 flex items-center justify-center lg:justify-start gap-2 font-mono text-[13px] font-bold tracking-[0.25em] uppercase text-violet-200"
                style={{ textShadow: '0 0 18px rgba(196,181,253,0.3)' }}
              >
                <span className="w-3 h-px flex-shrink-0 bg-gradient-to-r from-violet-300 to-transparent" />
                {r}
              </motion.span>
            ))}
          </motion.div>

          <motion.div variants={revealUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-9">
            <MagneticButton
              as="button"
              strength={0.3}
              onClick={() => scrollTo('#projects')}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-400 text-ink-950 font-display font-semibold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_28px_rgba(168,85,247,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_16px_42px_rgba(168,85,247,0.55)] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              {ui.hero.viewProjects}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton
              as="button"
              strength={0.3}
              onClick={() => scrollTo('#contact')}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 bg-white/[0.1] md:bg-white/[0.04] md:backdrop-blur-xl text-white font-display font-semibold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.08] hover:border-violet-300/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_0_26px_rgba(168,85,247,0.18)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              {ui.hero.contactCta}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </motion.div>

          <motion.div variants={revealUp} dir="ltr" className={`flex items-center justify-center flex-wrap gap-3 ${dir === 'rtl' ? 'lg:justify-end' : 'lg:justify-start'}`}>
            <MagneticButton as="a" strength={0.35} href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={SOCIAL_BTN_CLASS}>
              <Github size={14} /> GitHub
            </MagneticButton>
            <MagneticButton as="a" strength={0.35} href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={SOCIAL_BTN_CLASS}>
              <Linkedin size={14} /> LinkedIn
            </MagneticButton>
            <MagneticButton as="a" strength={0.35} href={personalInfo.whatsapp} target="_blank" rel="noopener noreferrer" className={SOCIAL_BTN_CLASS}>
              <MessageCircle size={14} /> WhatsApp
            </MagneticButton>
            <MagneticButton as="button" strength={0.35} onClick={() => setCvOpen(true)} className={SOCIAL_BTN_CLASS}>
              <FileText size={14} /> Resume
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* ── RIGHT — EngineeringScene ─────────────────────────────────
            Full desktop scene at lg:+; lightweight mobile scene below that.
            Previously the mobile subtree was entirely unmounted to avoid
            ~30 concurrent blur/filter animations crashing Mobile Safari —
            now a compact version (fewer layers, static blooms, no orbit
            rings) runs on mobile with the same visual character at a much
            lower GPU cost. ──────────────────────────────────────────────── */}
        {showScene ? (
        <motion.div
          style={reduceMotion ? {} : { y: sceneY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] aspect-square mx-auto scale-[0.86] sm:scale-95 lg:scale-100 origin-center">

            {/* Layer: ConnectionLights — dashed link lines + traveling pulses */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 560 560" aria-hidden="true">
              <defs>
                <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168,85,247)" stopOpacity="0" />
                  <stop offset="50%" stopColor="rgb(196,181,253)" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="rgb(168,85,247)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {CONNECTIONS.map((d, i) => (
                <g key={i}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#heroLineGrad)"
                    strokeWidth="1.15"
                    strokeDasharray="4 7"
                    initial={{ opacity: 0 }}
                    animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.34, 0.65, 0.34], strokeDashoffset: [0, -110] }}
                    transition={reduceMotion
                      ? { duration: 0.6 }
                      : { strokeDashoffset: { duration: 3.4, repeat: Infinity, ease: 'linear' }, opacity: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } }}
                  />
                  {!reduceMotion && (
                    <circle r="2.2" fill="rgb(216,180,254)" opacity="0.85">
                      <animateMotion dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" path={d} begin={`${i * 0.7}s`} />
                    </circle>
                  )}
                </g>
              ))}

            </svg>

            {/* Layer: EnergyCore + OrbitRings */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-[220px] h-[220px] -ml-[110px] -mt-[110px]"
              style={reduceMotion ? {} : { x: globeX, y: globeY }}
            >
              <OrbitSystem />

              <EngineeringCore size={188} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </motion.div>

            {/* Layer: Premium software widgets */}
            {SCENE_CARDS.map((card, i) => (
              <SceneCard key={card.key} card={card} index={i} smx={smx} smy={smy} reduceMotion={reduceMotion} />
            ))}
          </div>
        </motion.div>
        ) : (
        /* Mobile/tablet: compact Energy Core + 2 floating cards.
           No orbit rings, no connection lines, no mouse parallax.
           Cards use a purple-tinted glass finish so they read as lit
           by the core rather than floating in a separate layer. */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square mx-auto"
        >
          <EngineeringCore
            size={112}
            compact
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          {MOBILE_SCENE_CARDS.map((card, i) => (
            <MobileSceneCard key={card.key} card={card} index={i} />
          ))}
        </motion.div>
        )}
      </div>


      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  )
}
