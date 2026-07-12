# CLAUDE.md

Project-specific guidance for working on this repo. This is not a generic
React/Vite guide — everything here was learned by building and then
debugging this exact site. Read the relevant section before touching code;
skip the rest.

## -1. Token efficiency is a first-class constraint

Default to minimal context, minimal tool usage, minimal reasoning, direct
implementation:
- Read only the files required for the specific task — use the file map
  in §1, don't scan the repo.
- No broad/exploratory searches unless explicitly asked.
- No proactive refactoring of unrelated code.
- No Playwright/MCP/browser automation unless explicitly requested or
  genuinely required to complete the task (e.g. verifying a crash fix) —
  see §9 for what counts as "required."
- No upfront implementation plans for small changes — implement directly.
- If more context is genuinely needed, ask rather than exploring broadly.

## 0. The single most important rule

**Modify only the file(s) for the section you were asked to change.** See
§1 for the file map. Do not "fix" or "improve" sibling sections, shared
files, or things you notice along the way unless the task explicitly asks
for it. Do not redesign a section that already exists unless explicitly
asked to. If a task says "the Projects section," open `ProjectsGrid.jsx`
and stay there.

## 1. Architecture

Single-page site, no router. `App.jsx` renders every section in a fixed
stack, all mounted at once (no lazy-mount, no code-splitting per section):

```
App.jsx
├─ IntroSplash.jsx      (one-time splash, uses LogoMark.jsx)
├─ Navbar.jsx           (fixed, IntersectionObserver-driven active link)
├─ Hero.jsx             (#hero)   — 827 lines, largest file, see §13
├─ About.jsx            (#about)  — 498 lines
├─ Skills.jsx           (#skills) — 272 lines
├─ ProjectsGrid.jsx     (#projects) — 569 lines, see §13
├─ Web4YouSection.jsx   (#web4you) — 319 lines
├─ Contact.jsx          (#contact) — 315 lines
└─ Footer.jsx
```

Section → file is 1:1. There is no shared layout wrapper beyond `App.jsx`
itself (which also owns the global fixed grid/ambient-glow background
layer, both `hidden md:block`, desktop-only).

**Content/i18n**: `useContent()` from `src/context/LanguageContext.jsx`
returns `{ personalInfo, aboutData, skills, projects, web4youData, ui, dir }`.
- `src/data/content.js` — Hebrew is the primary data (names, dates, tags,
  image/video paths, links). This is the source of truth for structural
  data (ids, media, links) in **both** languages.
- `src/data/content-en.js` — only the English **text** overrides
  (descriptions, headings, UI strings). URLs/images/phone/email are never
  duplicated here — they always come from `content.js`.
- `dir` is `'rtl'` or `'ltr'`. Any layout with directional alignment
  (`justify-start`/`text-left` etc.) must branch on `dir`, not hardcode
  one direction — a real bug shipped from hardcoding `justify-start` on
  Hero's social-button row, which broke in Hebrew.

**Deploy**: push to `main` → `.github/workflows/deploy.yml` builds with
`npm run build` and publishes `dist/` to `gh-pages` via
`peaceiris/actions-gh-pages@v4`. Live at
`https://tomernado.github.io/tomer-portfolio/` (Vite `base:
'/tomer-portfolio/'`). No preview/staging environment — every push to
`main` is live.

## 2. Design system

- **Fonts**: `font-display` = Space Grotesk (headings/UI), `font-body` =
  Assistant (paragraphs), `font-mono` = Space Mono (labels/eyebrows/tags).
  Declared in `tailwind.config.js`.
- **Base dark color**: `ink-950 #050505` (also `#04050A` used directly in
  a couple of places — Skills/Hero/Navbar — as a near-black variant, not
  yet unified with the `ink` scale). `ink-900/800/700/600` step up from
  there.
- **Accent**: `ACCENT` from `src/motion.js` — `rgb(99,102,241)` (indigo)
  with `rgb2 = 56,189,248` (sky) as a secondary glint for gradients. This
  is **the only spot of color** allowed in the otherwise monochrome dark
  sections. Don't introduce new accent hues without being asked.
- **Light-section palette**: About and ProjectsGrid each define local
  `BG_TOP / BG_MID / BG_LOW` (near-white, vertical gradient) and
  `CARD_DARK / CARD_DARK_2` (near-black cards sitting on the light
  background) constants at the top of the file. This "white section,
  dark cards" pattern is intentional and duplicated by design between the
  two files — keep it consistent if editing either.
- **Dark sections**: Hero, Skills, Web4You, Contact are dark
  (`ink-950`/`#04050A`) throughout.

## 3. Visual language

- Sections alternate light/dark: Hero(dark) → About(light) → Skills(dark)
  → Projects(light) → Web4You(dark) → Contact(dark) → Footer(dark).
- Section boundaries use a soft gradient "dissolve" instead of a hard
  color cut — see `SectionDissolve.jsx`, used at the bottom of About,
  Skills, and ProjectsGrid. Hero has its own bespoke, more elaborate
  version (`heroDissolveGrad` SVG with static gradient + circles, plus
  desktop-only animated current-lines) — this is intentional, not a bug
  to "fix into" matching `SectionDissolve`.
- Every section opens with a `SectionMarker` row ("04 ─── LABEL") — but
  `SectionMarker.jsx` is hardcoded to white text, so the two **light**
  sections (About, ProjectsGrid) each hand-roll their own inline
  light-mode equivalent instead of using it. Known duplication, see
  `PROJECT_REFACTOR_PLAN.md`.
- Cards/pills: `rounded-xl`/`rounded-2xl`/`rounded-3xl`, thin
  `border-white/10`-ish borders, soft shadows — no hard borders anywhere.

## 4. Animation principles (`src/motion.js`)

Shared primitives — **reuse these, don't invent new easing/timing per
component**:

- `EASE_OUT = [0.16, 1, 0.3, 1]` — decelerate, for reveals/entrances.
- `EASE_IN_OUT = [0.65, 0, 0.35, 1]` — symmetric, for crossfades/toggles.
- `SPRING_SNAPPY` / `SPRING_SOFT` — the two spring presets in use.
- `DURATION.fast/base/slow = 0.35/0.6/0.9`.
- `revealUp` / `revealLeft` / `revealRight` — the standard
  `whileInView` entrance variant, opacity+translate.
- `headingReveal` — opacity+translate+blur(8px→0), used by every big
  section heading (mirrors the Hero name reveal).
- `cardReveal` — opacity+translate+scale, for any grid of cards.
- `staggerContainer(stagger, delayChildren)` — wraps a list of
  `cardReveal`/similar children.
- `VIEWPORT = { once: true, amount: 0.2, margin: '-60px' }` — the
  standard `viewport` prop for `whileInView`. **Always import this (or a
  module-level local constant, see §8) — never write `viewport={{...}}`
  inline.** See §12.

Each section has its own one-off "identity" transition (About's
depth-settle, Contact's spotlight scale-up, Web4You's `headingReveal`,
etc.) layered on top of the shared primitives above — that's intentional
variety, not something to consolidate.

## 5. Responsive behavior

- Tailwind default breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- **Two different "desktop" thresholds currently coexist**, both real,
  neither wrong — just be aware which one an area uses:
  - `useIsDesktop()` hook → `1024px` (`lg:`), used for GPU-heavy gating
    (see §6).
  - `App.jsx`'s global ambient glow/grid layers → `hidden md:block`
    (`768px`).
- Hero's right-column "EngineeringScene" (orbit rings, energy core,
  floating cards) is gated by `showScene` state (same `1024px` check as
  `useIsDesktop`, implemented locally in `Hero.jsx` rather than via the
  hook — predates it). Below `lg:`, this whole subtree isn't mounted at
  all, not just hidden.
- Projects' featured carousel switches from a horizontal-stack layout to
  a single-column stacked-card layout below `lg:` — same component, CSS
  handles the reflow (`grid lg:grid-cols-2`).
- Web4You's step list + sticky image panel (`useScroll`-driven) only
  renders `hidden sm:grid`; mobile gets a completely separate, simpler
  `MobileStepCarousel` (swipeable, no `useScroll`/sticky at all).

## 6. Mobile performance rules

These are hard-won, not theoretical — every rule below maps to a real
crash that shipped and had to be fixed in production. **Any new
decorative/GPU-heavy effect must follow these from the start**, not be
retrofitted later.

1. **Never let a `<video>` autoplay unconditionally.** Gate with
   `useIsDesktop()` (autoplay desktop-only) or, for scroll-position-driven
   preview clips, use `useVideoAutoplayInView(enabled)` from
   `src/hooks/useVideoAutoplayInView.js` (plays only while the specific
   card is intersecting, retries on `canplay`/`loadeddata` so a slow
   network doesn't leave it looking broken).
2. **Never tie `filter: blur()` continuously to raw scroll position**
   (`useTransform(scrollYProgress, ..., ['blur(Npx)', 'blur(0px)'])`)
   on anything but a tiny decorative shape — and even then, gate it to
   desktop. Applying it to a real content wrapper is the single most
   expensive thing found in this codebase (About's old `enterBlur`, fixed
   — see git history for `Fix mobile crash from Hero->About scroll-linked
   blur filter`).
3. **Any `animate={{...}}` with `repeat: Infinity` on an element using
   `filter: blur()` or `backdrop-filter` must be gated behind
   `useIsDesktop()`.** Mobile should get the static version (same
   color/shape, no animation) — not literally nothing, unless the effect
   is purely decorative and skippable (see Hero's `PerspectiveFloor`,
   which is fully desktop-only).
4. **Large blur radius (100px+) is expensive even static; multiple of
   them, worse.** Where a big soft glow is genuinely needed on mobile,
   shrink the radius substantially (Hero's `BackgroundAtmosphere` circles
   went from 120–180px to 45–60px on mobile via `blur-[60px] md:blur-[180px]`
   pattern) rather than dropping it entirely.
5. **`position: fixed` + `backdrop-filter` recalculates every scroll
   frame.** The Navbar backdrop-blur is desktop-only now
   (`md:backdrop-blur-xl`, mobile gets a near-opaque solid fill instead)
   for this reason.
6. **`overflow-hidden` on any ancestor of a `position: sticky` element
   silently breaks the sticky behavior** (no error, it just stops
   sticking). Keep decorative/clipped background layers as a **sibling**
   of the sticky element's subtree, never an ancestor. See Web4You's own
   sticky panel for the real incident that shipped from this.
7. **`viewport={{...}}` passed inline breaks `whileInView` silently** in
   any component that re-renders on a timer/state change (carousel
   auto-advance, role-text rotation, scroll-driven index, form typing) —
   a fresh object each render destabilizes the IntersectionObserver
   subscription and the element can get stuck invisible forever. Always
   use the shared `VIEWPORT` constant or a module-level local one — see
   §12.
8. **`BorderBeam`'s rotating conic-gradient border**: pass `animate={false}`
   for any non-focal instance in a repeated-card pattern (only
   ProjectsGrid's front carousel card animates; the 5 stacked-behind
   cards don't — no visual loss, meaningful GPU saving).

## 7. Shared components & hooks — use these, don't reinvent

| File | Purpose |
|---|---|
| `MagneticButton.jsx` | Cursor-follow pull wrapper (`as="a"`/`"button"`), used for most CTAs/social buttons |
| `SpotlightCard.jsx` | Cursor-tracking radial highlight card wrapper |
| `BorderBeam.jsx` | Rotating gradient border (`animate` prop, see §6.8) |
| `SectionMarker.jsx` | Dark-mode-only "01 ── LABEL" row |
| `SectionDissolve.jsx` | Generic light↔dark gradient section-boundary blend (`toColor`, `height` props) |
| `Particles.jsx` | Ambient drifting dots, already `hidden md:block` |
| `useIsDesktop()` (`hooks/useIsDesktop.js`) | `matchMedia('min-width: 1024px')`, mount-gates (not just CSS-hides) expensive subtrees |
| `useVideoAutoplayInView(enabled)` (`hooks/useVideoAutoplayInView.js`) | IntersectionObserver-driven video autoplay with retry |
| `useMagnetic()` (`hooks/useMagnetic.js`) | Powers `MagneticButton` |

Before writing a new ambient-glow-blob, dissolve gradient, or
viewport-stability workaround, **check if it already exists** — the same
"2 blur-radius-reduced-on-mobile glow circles" pattern is currently
hand-duplicated in Hero, Skills, Web4You, and Contact (not yet
consolidated — see `PROJECT_REFACTOR_PLAN.md`). Match the existing
pattern exactly rather than inventing a new one.

## 8. Coding conventions already in use

- Per-file local color constants: `BG_TOP/BG_MID/BG_LOW`,
  `CARD_DARK/CARD_DARK_2` (see §2). Keep this naming if adding another
  light section.
- Stable `viewport` objects: define `const VP_ONCE_XX = { once: true,
  amount: 0.X }` once at module scope, reuse across the file. Never
  `viewport={{ once: true }}` inline (see §6.7).
- `dir="ltr"` is deliberately forced on some inner content (e.g. the
  GitHub/LinkedIn/WhatsApp/Resume row in Hero) to keep English proper
  nouns/icon order un-mirrored — but the **container's alignment**
  (`justify-start` vs `justify-end`) must still branch on the real page
  `dir`, or it visually detaches from the rest of the RTL column.
- Icons: `lucide-react` for generic UI icons; `react-icons/si`, `/di`,
  `/tb` for tech-brand marks (React, Node, Docker, Java, C# etc.).
- Tags/media: `project.tags` (array of strings) maps to an icon+color via
  a `TAG_ICON` lookup object inside `ProjectsGrid.jsx` — extend that map
  rather than inlining a one-off icon somewhere else.
- Section ids for nav/anchors: `#hero #about #skills #projects #web4you
  #contact` — don't rename without updating `Navbar.jsx`'s `navLinks`.

## 9. Verification workflow

Match the verification cost to what actually changed — **don't reach for
a full browser cycle by default**.

1. **Always run `npm run build` first.** Cheap, catches import/syntax
   errors. This alone is sufficient for copy/content/color/spacing
   changes that don't touch animation, scroll, or mobile-specific code.
2. **Only spin up a browser if the change touches**: `useScroll`/
   `useTransform`, `backdrop-filter`, `filter: blur()`, `<video>`
   elements, `position: sticky`, `whileInView`/`viewport`, or anything
   explicitly about mobile/responsive behavior.
3. **When a browser check is warranted, scope it to the affected
   section(s) only** — scroll straight to the relevant `#id` via
   `window.scrollTo({ top, behavior: 'instant' })`, don't re-verify the
   whole site end-to-end unless the task is explicitly cross-cutting
   (e.g. this session's mobile-crash sweep).
4. **For anything that could affect Mobile Safari specifically (crashes,
   video, blur, sticky, backdrop-filter): use real WebKit
   (`require('playwright').webkit`), not Chromium.** Chromium + CDP CPU
   throttling does **not** reproduce Safari-specific compositor bugs —
   confirmed directly this session (a bug invisible under throttled
   Chromium was trivially reproducible on real WebKit). Emulate
   `devices['iPhone 13']`, listen for `page.on('crash')` and
   `page.on('pageerror')`, and actually scroll through the affected
   zone rather than just loading the page.
5. **Desktop-only style tweaks**: a single Chromium screenshot at
   `1440×900` is enough. No WebKit needed.
6. **Don't write a new one-off verification script per task.** Reuse the
   same small script shape (goto → skip intro splash via
   `localStorage.setItem('tc_intro_done','1')` in `addInitScript` →
   scroll to target `#id` → screenshot/assert). If no committed helper
   exists yet, that's tracked in `PROJECT_REFACTOR_PLAN.md` as the
   top-priority fix — check there first.
7. **Write temp scripts/screenshots to the OS scratchpad directory, never
   the repo root** — leftover `_*.cjs`/`*.png` files in the repo root
   have repeatedly shown up as untracked files needing manual cleanup.
   Delete them before finishing regardless.
8. **Verify only the file(s) the task touched.** Don't re-screenshot
   unrelated sections "just in case."

## 10. Reference image workflow

When given a reference image/screenshot for a redesign:

- The image is a **design/layout spec only** — proportions, hierarchy,
  spacing, card composition, lighting. Never copy its actual text/content.
- All content (project names, descriptions, links, images) comes from
  `src/data/content.js` / `content-en.js` — reuse what exists, don't
  invent new copy to match the reference.
- Ignore chrome that isn't part of the requested section (e.g. a nav bar
  shown in a reference image for a "redesign the Projects section" ask).
- Implement directly in the target section's file only — don't let a
  reference image justify touching sibling sections "for consistency"
  unless asked.
- Stop when the requested section matches the reference's design
  language — don't keep iterating on adjacent polish unless asked.

## 11. Explicit operating rules for this repo

- **Modify only the requested section's file(s).** Use the map in §1.
- **Do not redesign an existing section** unless explicitly asked —
  "fix X" or "adjust Y" is not permission to restyle the whole section.
- **Reuse existing components/hooks/utilities** (§7) before writing new
  ones. If a pattern is duplicated across files and you're touching one
  copy, consider (but don't silently perform) consolidating — flag it
  instead, per `PROJECT_REFACTOR_PLAN.md`'s process.
- **Never duplicate an implementation that already exists** — check §7
  and grep for the pattern name before writing a new glow-blob/dissolve/
  magnetic-button/etc.
- **Don't do repo-wide analysis for a section-scoped task.** The file map
  in §1 should resolve routing for the large majority of requests without
  broader exploration. Only search broadly when the task is explicitly
  about a shared/cross-cutting concern (design tokens, hooks, global
  performance).
- **Don't read files unrelated to the task.** If a task is about
  `ProjectsGrid.jsx`, there's rarely a reason to open `Web4YouSection.jsx`.
- **Match verification cost to the change** — see §9. Don't run a full
  mobile-crash sweep for a copy change.
- **Preserve the existing design system and motion language** (§2–§4) —
  new work should look like it was built by the same hand, using the
  same tokens/easing/variants, not introducing a parallel style.
- **When a task says "desktop must remain exactly as it is"** (or
  similar), gate every change behind `md:`/`lg:` Tailwind prefixes or
  `useIsDesktop()` rather than touching the base (mobile-first) styles —
  this is the pattern used throughout the mobile-crash fixes.

## 12. Framer Motion performance guidelines (summary of §6, motion-specific)

- Prefer `y`/`opacity`/`scale` `MotionValue`s for scroll-linked content
  transforms (cheap, GPU-composited, no repaint) over `filter`.
- `useScroll` + `useTransform` writing directly to a `style` prop
  (MotionValue) is fine and cheap for transform/opacity. The same pattern
  writing to `filter` or driving continuous React state
  (`useMotionValueEvent` → `setState`) is not — the latter forces a
  React re-render on every scroll tick and should only be used where the
  UI genuinely needs discrete state (e.g. "which carousel step is
  active"), with the resulting re-renders kept cheap (no heavy children,
  no unstable `viewport` objects — see §6.7).
- Infinite `repeat: Infinity` loops are fine in moderation on desktop;
  audit anything layering more than 2–3 concurrent infinite animations
  plus a filter/backdrop-filter for whether it needs `useIsDesktop()`
  gating.
- `reduceMotion` (via `useReducedMotion()`) and `useIsDesktop()` are
  **separate, both-required** gates — reduced-motion users on desktop
  should still avoid animation; mobile users without reduced-motion
  preference should still avoid GPU-heavy effects. Check both where
  relevant, don't assume one implies the other.

## 13. Mobile Safari limitations discovered on this project

Confirmed via real WebKit testing + production incidents (not
speculation):

1. Multiple simultaneous `<video autoplay>` elements — reliable crash
   trigger, even when most are off-screen/paused-adjacent.
2. `position: fixed` + `backdrop-filter: blur()`, recalculated on every
   scroll frame — reliable crash contributor.
3. Continuously scroll-linked `filter: blur()` (via `useTransform`)
   applied to a large content wrapper — the single worst offender found;
   markedly worse than blurring small decorative shapes.
4. Large `filter: blur()` radius (100–180px), especially several such
   elements always-mounted with infinite-loop animation — significant
   GPU/battery cost, contributed to crashes in combination with the above.
5. CSS `mask`/`-webkit-mask-image` combined with many (~20+) concurrent
   SVG/SMIL animations in one subtree — heavy; now desktop-only
   (`PerspectiveFloor.jsx`).
6. `overflow-hidden` on an ancestor of `position: sticky` — not a crash,
   but silently disables the sticky behavior with no console warning.
7. **Desktop-class WebKit (this dev machine) under-reproduces real iPhone
   memory pressure.** Some fixes were validated via real WebKit +
   logical audit against known iOS failure patterns, not a 100%
   reproduced crash locally — Chromium+CDP throttling reproduced none of
   these; real WebKit reproduced some but likely not all with the same
   severity a physical low-memory device would show. Err conservative
   (gate to desktop) rather than assuming "didn't crash in testing" means
   "safe."
