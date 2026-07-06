// Shared motion language — every section pulls from here so reveals,
// easing and stagger timing feel like one system, not per-component guesses.

export const EASE_OUT = [0.16, 1, 0.3, 1]      // premium "decelerate" — reveals, entrances
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]  // symmetric — crossfades, toggles
export const SPRING_SNAPPY = { type: 'spring', stiffness: 300, damping: 26, mass: 0.6 }
export const SPRING_SOFT   = { type: 'spring', stiffness: 160, damping: 20, mass: 0.7 }

export const DURATION = { fast: 0.35, base: 0.6, slow: 0.9 }

/* Section-level reveal: the one pattern every section heading/marker uses. */
export const revealUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export const revealLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export const revealRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

export const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/* Blur→focus: the one treatment every big section heading shares — mirrors
   the Hero name reveal so the "materializing" moment reads as one system
   instead of a Hero-only trick. */
export const headingReveal = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE_OUT } },
}

/* Card-grid reveal: subtle scale-in, used for any grid of cards/tiles. */
export const cardReveal = {
  hidden:  { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

/* Standard viewport gate — reused so "when" a reveal fires is as
   consistent as "how" it animates. */
export const VIEWPORT = { once: true, amount: 0.2, margin: '-60px' }

/* Accent — the one spot of color allowed in an otherwise monochrome system.
   Echoes the portrait's own neon circuit-board lighting. */
export const ACCENT = {
  rgb: '99,102,241',       // indigo-500
  rgb2: '56,189,248',      // sky-400 (secondary glint)
  css: 'rgb(99,102,241)',
}
