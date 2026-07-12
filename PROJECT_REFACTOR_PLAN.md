# PROJECT_REFACTOR_PLAN.md

A prioritized roadmap for structural improvements — **no code changes
included**. Every item below is scoped to reduce future context/token
usage and maintenance cost while preserving the current UI and behavior
exactly. Ordered highest to lowest impact.

Current baseline (for reference, measured directly from the repo):

| File | Lines |
|---|---|
| `src/components/Hero.jsx` | 827 |
| `src/components/ProjectsGrid.jsx` | 569 |
| `src/components/About.jsx` | 498 |
| `src/components/Web4YouSection.jsx` | 319 |
| `src/components/Contact.jsx` | 315 |
| `src/components/Skills.jsx` | 272 |
| `src/context/LanguageContext.jsx` | 217 |
| `src/components/EngineeringCore.jsx` | 214 |

No `CLAUDE.md` existed before this task, no test script, no committed
browser-automation helper. `git log` shows 9 of the last ~18 commits were
independent rediscoveries of the same "GPU-heavy effect not gated for
mobile" bug class in different files — the clearest signal that
duplication (not raw complexity) has been the biggest cost driver.

---

## Priority 1 — Commit a reusable browser-verification helper

**Problem**: Every verification this project has needed (mobile-crash
checks, visual confirmation, section-boundary checks) was done by writing
a fresh throwaway Playwright script — dozens of them across recent
sessions, each 30–90 lines of near-identical boilerplate (launch browser,
skip intro splash, scroll to a section, screenshot, check for
`pageerror`/`crash`). None of this is committed anywhere, so it's
reinvented every time.

**Fix (no code/UI change — new file only)**: Add `scripts/verify.cjs` (or
similar) exporting small composable helpers:
- `launchMobile()` / `launchDesktop()` — WebKit+iPhone-13 vs Chromium+1440px,
  with the intro-splash-skip `addInitScript` already wired in.
- `scrollToSection(page, id)` — the repeated `getBoundingClientRect` +
  `scrollTo(behavior:'instant')` dance.
- `watchForCrash(page)` — attaches `pageerror`/`crash` listeners, returns
  the collected error array.
- `screenshot(page, name)` — writes to the OS scratchpad, not the repo.

**Why highest priority**: this is the single measured biggest recurring
token/time cost in the project's history, and fixing it is pure addition
(zero risk to the live site). Every future task that needs verification
gets cheaper immediately.

**Effort**: small (a few hours). **Risk**: none — new file, not imported
by the app.

---

## Priority 2 — Extract Hero's `EngineeringScene` subtree into its own file

**Problem**: `Hero.jsx` is 827 lines and is both the most frequently
touched section (most git history) and the largest. Roughly 300+ of those
lines are the `showScene`-gated decorative subtree — `OrbitSystem` wiring,
`EngineeringCore`, the `SCENE_CARDS` floating UI mockups, connection-line
SVG, `FloatingLightParticles` — which is already conditionally mounted and
visually/logically separate from the actual name/copy/CTA content. Any
task that touches Hero's copy, sizing, or CTAs currently requires loading
this entire file, including the unrelated 3D-scene code.

**Fix**: Move the `showScene && (...)` block and its supporting
sub-components (`FloatingLightParticles`, `SceneCard`, `CardBody`,
`WindowChrome`, `CodeChrome`, `CardIcon`, the three preview components,
`SCENE_CARDS`/`CONNECTIONS`/`CONNECTION_ANCHORS`/`LIGHT_PARTICLES`
constants) into `src/components/HeroScene.jsx`, imported and rendered by
`Hero.jsx` with the same props it currently closes over
(`smx`/`smy`/`reduceMotion`/`sceneY`). Identical render output, identical
behavior — pure extraction.

**Why high priority**: biggest single file-size win, and it's the file
most likely to be opened again soon (Hero gets iterated on most).
Post-split, a "make the name bigger" task would only need `Hero.jsx`
minus ~350 lines it never needed anyway.

**Effort**: medium (careful prop-threading, but mechanical — no logic
changes). **Risk**: low if done as a pure extraction with no behavior
changes; verify with a single desktop screenshot diff (§9 of CLAUDE.md).

---

## Priority 3 — Consolidate the ambient-glow-blob pattern into one component

**Problem**: The "2 blur-radius-reduced-on-mobile purple/blue glow
circles, animated on desktop only" pattern is hand-duplicated, with minor
variations, in `Hero.jsx` (5 circles, its own bespoke version),
`Skills.jsx`, `Web4YouSection.jsx`, and `Contact.jsx`. This is exactly the
pattern that caused the "same bug fixed 4 times in 4 files" cost this
session — the `useIsDesktop()` mobile-blur-radius fix had to be manually
applied to each file independently, and it's easy to miss one (as
happened — Skills' version was found and fixed in a later pass than the
others).

**Fix**: Extract a shared `AmbientGlow.jsx` (or extend an existing
pattern) taking `{ color, position, size, blurDesktop, blurMobile,
animate }` props, used by Skills/Web4You/Contact identically. Leave
Hero's version bespoke (documented in `CLAUDE.md` §3 as intentionally
different — it has 5 circles with individually tuned colors/positions,
not a clean fit for the 2-circle shared shape) **or** generalize the
shared component enough to cover Hero too, if a follow-up pass wants to
fully unify it.

**Why high priority**: directly prevents the exact multi-file-sweep tax
that has already happened at least twice (the `viewport` stability fix
and the mobile-blur-radius fix both had to touch 4+ files by hand).
Consolidating means the next such fix touches one file.

**Effort**: medium. **Risk**: low — visually identical if props are set
correctly per current per-file values; verify each section's dark
background once.

---

## Priority 4 — Split `ProjectsGrid.jsx` into focused files

**Problem**: 569 lines currently holding: the `TAG_ICON` lookup map
(~30 tag→icon/color entries), `splitTitle()` helper, `TagPill`,
`FeaturedCard`, `FeaturedCarousel`, `MiniProjectCard`, and the main
`ProjectsGrid` export/orchestrator — six different concerns in one file.

**Fix**: Split into:
- `src/utils/projectDisplay.js` — `TAG_ICON` map + `splitTitle()`
  (pure data/logic, no JSX, easy to reuse/verify independently).
- `src/components/FeaturedCarousel.jsx` — `FeaturedCard` +
  `FeaturedCarousel`.
- `src/components/MiniProjectCard.jsx` — the grid card.
- `src/components/ProjectsGrid.jsx` — orchestrator only (state, layout,
  imports the above).

**Why medium-high priority**: second-largest file, and (per git history)
the second-most-iterated section. Same "future edits pull less into
context" benefit as Priority 2, slightly smaller payoff since it's a
smaller file.

**Effort**: medium. **Risk**: low, mechanical extraction.

---

## Priority 5 — Make `SectionMarker` theme-aware

**Problem**: `SectionMarker.jsx` hardcodes white text, so the two light
sections (`About.jsx`, `ProjectsGrid.jsx`) each hand-roll their own
near-identical inline "03 ─── LABEL" marker instead of reusing it —
duplicated reveal timing, hairline-draw animation, and layout, maintained
in three places for what should be one component with a `dark`/`light`
variant.

**Fix**: Add a `theme="dark" | "light"` prop to `SectionMarker`
controlling text/line color, then replace the two inline hand-rolled
versions in About/ProjectsGrid with `<SectionMarker theme="light" ... />`.

**Effort**: small. **Risk**: low — visually identical if colors are
matched exactly to the current inline versions.

---

## Priority 6 — Minimal smoke test script

**Problem**: No `test` script exists. `npm run build` only validates the
bundler succeeds — it caught none of the actual bugs found this project
(runtime crashes, invisible content, broken autoplay). Every behavioral
regression currently requires a manual browser cycle to catch.

**Fix**: Add a small `npm run test:smoke` (Playwright, Chromium is
sufficient for this tier) that: loads the site, asserts each section's
`#id` element exists and is non-empty, asserts zero console errors, and
exits non-zero on failure. Not a replacement for the WebKit mobile checks
in `CLAUDE.md` §9 (those stay manual/targeted), but a fast first line of
defense.

**Effort**: small–medium. **Risk**: none (additive, dev-only).

---

## Priority 7 — Document/standardize the breakpoint convention

**Problem**: `useIsDesktop()` uses `1024px`; `App.jsx`'s global
glow/grid layers use `768px` (`hidden md:block`). Both are currently
correct for their own context, but a future contributor gating a *new*
effect has no clear default to reach for.

**Fix**: Documentation-only (already partially done in `CLAUDE.md` §5) —
pick one default (`1024px`/`useIsDesktop()`) for **new** gated effects
going forward, and note the `768px` global-layer exception as
intentionally legacy. **Do not retroactively change either existing
threshold** — that would alter live visual behavior at tablet widths,
which is out of scope for a token/maintainability refactor.

**Effort**: trivial (already largely captured in `CLAUDE.md`).
**Risk**: none if no code changes.

---

## Priority 8 — Normalize `public/img/` asset naming

**Problem**: Mixed casing and inconsistent naming
(`OpenWOrldGame.mp4`, `SlotGame.png`, `web4you1.png`…`4.png`,
`newLOGO.png`, `tc-icon-512.png`) makes it slightly harder to guess an
asset's filename without checking `content.js`. Purely cosmetic — no
functional or performance impact.

**Fix**: Not recommended as an active task. Renaming requires updating
every reference in `content.js`/`content-en.js` for zero behavioral or
token-cost benefit — this is the lowest-value item on the list and should
only be done incidentally if those files are being touched for another
reason anyway.

**Effort**: small. **Risk**: low but non-zero (broken image/video paths
if a reference is missed) for essentially no upside. **Recommend
skipping unless bundled with unrelated content work.**

---

## Suggested order of execution

If tackling this list, do **Priority 1 first regardless of what else is
planned** — it's zero-risk and pays back on the very next task. After
that, 2 and 3 are the two highest-leverage structural changes (they
directly address the two things that made this project expensive:
largest-file-in-context and duplicated-fix-across-files). 4–6 are solid
incremental wins with no urgency. 7 needs no action beyond what
`CLAUDE.md` already captures. 8 should probably never be done as a
standalone task.
