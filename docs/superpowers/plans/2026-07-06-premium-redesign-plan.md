# Premium Redesign Plan — Tomer Cohen Portfolio

> **Status: DRAFT FOR REVIEW.** No code has been touched. This document is the "Understand → Research → Plan" phase of the Premium Website Design Workflow. Nothing here should be built until it's approved; on approval, the next step is to turn the agreed parts into an execution plan (superpowers:writing-plans) before any Build phase begins.

**Stack confirmed from repo:** React 18 + Vite 5 + Tailwind 3 + Framer Motion 12, no test framework, deployed via `gh-pages`. Bilingual (Hebrew RTL default / English) via `LanguageContext`, content split into `content.js` / `content-en.js`. Fonts loaded: Rajdhani (`font-display`), Assistant (`font-body`), Space Mono (`font-mono`).

**Sections in current build order:** `IntroSplash` → `Navbar` → `Hero` → `About` → `Skills` → `ProjectsGrid` → `Web4YouSection` → `Contact` → `Footer`.

---

## 1. Current Design Analysis

The site has a strong, deliberate visual identity: a dark navy canvas (`#020817`/`slate-950`) with an indigo/blue/violet accent system, expressed through a consistent "engineer/terminal" motif — a CRT-monitor panel in About (scanlines, flicker, typed `cat profile.txt`), code-editor-styled tab cards in Skills, a `<TC/>` orbiting tech-stack diagram, a shared-layout logo animation from splash into Hero (`layoutId="hero-logo"`), and bespoke JS-driven marquees (project strip in Hero, two carousel rows in Projects) built on `useAnimationFrame` rather than a canned carousel library.

This isn't a generic template — it reads as "built by a software engineer, for software engineers," which is the right instinct for this audience (recruiters, technical hiring managers, fellow devs). The craft level in the Framer Motion work (spring-tuned transitions, `viewport={{ once: true }}` discipline, staggered reveals) is genuinely above average for a personal portfolio.

The gap between "distinctive and technically impressive" and "premium" is mostly about **restraint, hierarchy, and consistency** — not about adding more effects. Right now nearly every section runs its own simultaneous animation loop (blobs, orbit rings ×2 speeds, marquees ×3, shimmer, CRT flicker, scan-lines), several identity treatments compete for attention in the same viewport, and a couple of accent-color/typography decisions drift from the rest of the system. Premium sites (Linear, Stripe, Vercel, Framer) tend to run one or two animations per viewport at most, and lean on negative space and typographic scale rather than glow/border effects to signal quality.

## 2. Strengths (keep these)

- **Cohesive dark "systems engineer" identity** — CRT terminal, code tabs, orbit diagram, typewriter are a real point of view, not a template default. Worth preserving in a toned-down form, not replacing wholesale.
- **Production-grade i18n** — `LanguageContext`, `dir`-aware components, separate content files. This is architecturally solid and should be untouched.
- **Shared-element transition** — `layoutId="hero-logo"` linking `IntroSplash` → `Hero` is a genuinely premium touch (this is the kind of detail Linear/Framer use). Keep and lean into it more.
- **Bespoke, well-behaved motion primitives** — the `useAnimationFrame` marquees handle touch-drag, pause-on-hover, and seamless looping by hand; better engineering than most portfolio sites bother with.
- **Real content, not filler** — every project has a live site link, GitHub link, and a LinkedIn post; About has real, specific experience entries. The redesign should surface this content more, not add more decoration around it.
- **Working deploy pipeline** — `npm run deploy` → gh-pages is already proven across multiple shipped iterations (see recent commit history).

## 3. Weaknesses (grounded in the code, not vibes)

1. **Motion overload, no visual "rest."** Simultaneously running: 4 blurred ambient blobs, 2 counter-rotating orbit rings (×2 instances), 3 marquees, CRT flicker, scanlines, shimmer text, cursor blink, typewriter (×2 places). Nothing on the page is ever fully still — this reads as busy rather than premium, and costs battery/scroll-smoothness on lower-end devices.
2. **Three competing identity marks for one person.** In the Hero alone: the large `LogoMark` (T+C monogram), the circular profile photo next to the name, *and* the "TC." wordmark repeated in Navbar and Footer. Three different treatments of the same identity fragment attention instead of reinforcing it.
3. **Accent-color inconsistency.** Navbar's active-link pill and dot are **teal/emerald** (`rgba(20,184,166,...)`), while literally every other section (Hero, About, Skills, Projects, Web4You, Contact) uses **indigo/blue/violet**. Footer's logo dot is blue, Navbar's is teal. This is the single easiest "looks templated" tell to fix.
4. **Typography system isn't actually a system.** `font-display` (Rajdhani) is defined but barely used — About's `<h2>` uses `font-body`, Skills' `<h2>` uses `font-display` — headings inconsistently pick between the two. Three typefaces (display/body/mono) is reasonable *if* each has one clear job; right now the job assignment isn't consistent section-to-section.
5. **Hero tries to do too much in one viewport.** Logo + name + photo + typewriter + 4 buttons (2×2 grid) + bio card + Web4You callout + auto-scrolling project strip — eight distinct elements competing before the user has scrolled at all, with no single dominant focal statement or primary CTA.
6. **Skills info is duplicated, not curated.** The orbit diagram shows a curated subset (React, Java, SQL, Python / Docker, Git, OWASP, LLMs, Node, TS) while the badge grid below lists ~24 items across 4 categories — same information twice, in two different visual languages, with no proficiency/recency signal in either (it reads as a keyword list rather than a story).
7. **Regression found vs. the site's own intended UX.** `docs/superpowers/plans/2026-06-28-logo-splash-hero-redesign.md` specifies `IntroSplash` should gate on `localStorage['tc_intro_done']` so it plays once ever. The current `src/components/IntroSplash.jsx` has **no localStorage check at all** — `useState(true)` unconditionally, so the ~2s splash now replays on every single reload. For a portfolio a recruiter may revisit or refresh, this is real, measurable friction, not a style opinion.
8. **No `prefers-reduced-motion` handling anywhere.** Every infinite-loop animation (blobs, orbits, marquees, shimmer, flicker) runs unconditionally for users who've asked their OS to reduce motion — an accessibility gap, not just a nicety.
9. **Auto-moving content has no pause/stop control reachable by keyboard or touch.** WCAG 2.2.2 requires a way to pause auto-advancing content that moves >5s; here `onMouseEnter`/`onMouseLeave` is the only pause mechanism, which does nothing for touch or keyboard users.
10. **Focus states are inconsistent.** `ProjectCard` has a visible `focus:ring`; `SocialBtn`, nav links, and the language toggle do not — keyboard users lose track of where they are on most of the page.
11. **Mobile nav is 6 links squeezed into one row at `text-[9px]`.** Recent commits deliberately removed the hamburger for a "compact single-row" layout; worth revisiting against WCAG's 24×24px minimum target-size guidance once other fixes land.
12. **Contrast risk on secondary text.** Mono labels at `text-slate-500`/`600` (9–10px) on `slate-950` are used pervasively for eyebrow labels and captions — should be checked against WCAG AA before/after the redesign, not assumed fine because it "looks intentional."
13. **`ProcessSection.tsx`** sitting untracked at the project root (light theme, Next.js `"use client"`, orange brand) is not wired into the app — it looks like a reference/inspiration file for a "how it works" pattern, most likely meant to inform a `Web4YouSection` rework rather than ship as-is. Flagging so it doesn't get lost or accidentally committed as dead code.

## 4. UX Improvements

- **Give Hero one clear job:** name + role + one primary CTA (e.g. "View Projects" or "Contact Me") dominant; move secondary actions (Resume, socials, Web4You callout) to a lower-emphasis row. The project strip can stay, but shouldn't visually compete with the name on load.
- **Fix the splash regression:** restore the `localStorage` gate so first-time visitors get the moment and repeat visitors don't wait through it again. This is a bug fix, not a redesign choice.
- **Collapse the three identity marks into one system:** pick either the logotype (LogoMark) *or* the photo as the primary mark in Hero, and let Navbar/Footer's "TC." be a simple derivative of the same mark/color rather than an independent teal treatment.
- **Make Skills tell a story once, not show the same data twice:** either fold the orbit diagram's curated subset into "top skills" and let the badge grid be the exhaustive/secondary list, or drop one representation.
- **Respect `prefers-reduced-motion`:** gate every infinite/ambient animation (blobs, orbits, marquees, shimmer, flicker, cursor-blink) behind a single reduced-motion check so the site remains fully functional and calm for users who ask for it.
- **Add a real pause control to marquees** (small pause/play icon, or convert to a manually-swipeable/dot-indexed carousel) so WCAG 2.2.2 is satisfied without relying on hover.
- **Visible focus rings everywhere interactive** — extend the `ProjectCard` treatment to `SocialBtn`, nav links, language toggle, and form fields.

## 5. UI Improvements

- **One accent-color system.** Retire the Navbar teal; use the same indigo/blue gradient family everywhere an "active/accent" state is needed. This alone will make the site feel more designed and less assembled.
- **Pick one heading-font rule and apply it everywhere:** e.g. all `<h2>` section titles use `font-display`, all body copy uses `font-body`, all labels/code/data use `font-mono` — no exceptions per-section.
- **Reduce simultaneous ambient effects per viewport to 1–2.** E.g., keep the blob drift in Hero but don't also run CRT flicker + scanlines + shimmer + orbit rotation all within one scroll snapshot in About.
- **Increase whitespace between "stat strip → CRT panel → experience grid" in About** — currently three dense blocks stack with little breathing room between them.
- **Normalize card treatments** — About's experience cards, Skills' category cards, and Projects' cards each have their own bespoke border/glow recipe; converging on one card component with theme-able accent color would tighten consistency.

## 6. Animation Ideas

- Keep and *extend* the `layoutId` shared-element pattern — e.g., a subtle shared underline/dot between Navbar's active pill and section headings as you scroll, mirroring how the logo already flies from splash to Hero.
- Replace decorative always-on orbit rotation with a **scroll-linked reveal** (rotate/settle once into view, then rest) — same visual signature, dramatically less continuous motion.
- For Web4You, the untracked `ProcessSection.tsx` reference has a nice detail worth borrowing: a small indicator dot that slides between step labels via `top` transition, and description opacity dropping to 0.45 for inactive steps — cleaner than the current full mount/unmount `AnimatePresence` swap, and cheaper to run.
- Marquees: keep the hand-rolled `useAnimationFrame` approach (it's good work) but add an explicit pause affordance and drop to a slower speed or static grid under `prefers-reduced-motion`.
- Splash: keep the 2–3s logo intro for true first visits only; consider trimming the "tap to continue" affordance-less full 2s wait into a skippable/faster experience once the localStorage bug is fixed.

## 7. Premium References (named patterns, not URLs)

- **Linear / Vercel marketing sites** — restraint: one hero statement, one CTA, generous whitespace, a single accent color used consistently across product, marketing, and docs surfaces.
- **Stripe** — how a single, tightly-scoped animation per section (not five) still reads as "premium engineering."
- **Framer's own site** — shared-element/layout transitions used sparingly for maximum impact, similar to this project's `hero-logo` transition — a pattern already present here and worth leaning into further rather than replacing.
- **Rauno Freiberg / Josh Comeau / Brittany Chiang-style engineer portfolios** — proof that a strong single typographic identity + one signature interaction (not a dozen ambient effects) reads more senior than maximalist motion.
- **Internal reference:** `ProcessSection.tsx` (untracked, root of repo) — light-theme "how it works" scroll pattern with a sliding indicator dot; useful structural reference for reworking `Web4YouSection`, even though its color theme (orange, light bg) won't be adopted.

## 8. Typography

- **Proposal:** three fonts stay, but each gets exactly one job, enforced everywhere:
  - `font-display` (Rajdhani) → all section `<h2>` headings and the nav/footer wordmark only.
  - `font-body` (Assistant) → all paragraph copy, buttons, form labels/values.
  - `font-mono` (Space Mono) → eyebrow labels, code-flavored UI (terminal lines, tab-bar filenames, stat captions).
- Audit every section against this rule (About and Skills currently disagree on which font owns `<h2>`) and correct the two-three outliers rather than changing the type system itself — it's sound, just inconsistently applied.
- Confirm Hebrew rendering quality for Rajdhani/Space Mono where they appear near RTL text (they're Latin-only display faces — verify they're never asked to render Hebrew glyphs, only Assistant should carry Hebrew).

## 9. Color Palette

- **Base:** keep `slate-950`/`#020817` background — it's already distinctive and works well with the accent system.
- **Single accent family:** indigo → blue → violet gradient (`#6366f1 / #3b82f6 / #8b5cf6`), used for *all* active/accent states (nav active link, buttons, glows, borders). Retire teal/emerald from Navbar; reserve green only for genuinely "success/online" semantics (WhatsApp brand green, form-submitted state) where it already correctly appears in Contact.
- **Category colors in Skills** (blue/violet/cyan/emerald per category) can stay as-is — that's a deliberate, functional differentiation, not an inconsistency, since it's mapped 1:1 to a taxonomy the user already understands (Languages/Architecture/Frontend/Data).
- **Text hierarchy:** verify/adjust the `slate-500`–`slate-700` range used for mono captions against WCAG AA on the `slate-950` background; nudge lightness up rather than changing hue if contrast fails.

## 10. Layout Changes

- **Hero:** move to a clearer primary/secondary split — name + role + one CTA as the dominant block; social links, resume, Web4You callout, and project strip demoted to a secondary row/section with less visual weight (smaller, less saturated, or moved just below the fold as a "scroll to discover" reveal rather than all present at once).
- **About:** add vertical rhythm between the stats strip, CRT panel, and experience grid (currently `mb-10` / `mt-6` are the only separators for three visually heavy blocks).
- **Skills:** consider single representation (orbit *or* badges) per category rather than both, freeing vertical space and removing duplication.
- **Projects:** keep the two-row marquee for casual browsing, but confirm there's some non-motion way to reach every project (e.g., "View All" already scrolls here — verify keyboard/screen-reader users can actually tab to every card, not just the visible ones, given `overflow-hidden` + continuous transform).
- **Web4You:** restructure the sticky-scroll interaction using the cleaner indicator-dot + opacity pattern referenced in `ProcessSection.tsx`, keeping the indigo theme.

## 11. Component-by-Component Redesign

| Component | Current | Proposed direction |
|---|---|---|
| `IntroSplash.jsx` | Runs every load, no persistence | Restore `localStorage` gate (bug fix); keep the `layoutId` hand-off |
| `Navbar.jsx` | Teal active-pill, inconsistent with rest of site | Switch active-pill/dot to indigo/blue to match global accent |
| `Hero.jsx` | 8 competing elements in first viewport | Primary (name/role/CTA) + secondary row (socials/resume/Web4You/strip) |
| `About.jsx` | Dense stack: stats + CRT panel + experience, orbit duplicated in Skills-adjacent way | Add spacing; decide if `TechOrbitCard` here should show different info than Skills' badges to stop feeling redundant |
| `Skills.jsx` | Badge grid duplicates orbit info | Pick one representation, or clearly differentiate "top 4" (orbit) vs "full list" (badges) with explicit labeling |
| `ProjectsGrid.jsx` | Marquee-only browsing, fixed pixel card sizes | Add pause control; consider responsive card sizing instead of hardcoded `CARD_SIZES` px widths |
| `Web4YouSection.jsx` | Full mount/unmount step swap | Sliding-indicator + opacity pattern (see `ProcessSection.tsx` reference) |
| `Contact.jsx` | Solid as-is structurally | Only needs focus-ring pass + WhatsApp number sourced from `personalInfo.phone` instead of hardcoded string (maintainability, not visual) |
| `Footer.jsx` | Blue logo dot vs Navbar's teal | Align with unified accent post-fix |
| `LogoMark.jsx` / photo in Hero | Both shown together | Choose one as primary identity mark for Hero |

## 12. Responsive Strategy

- Verify each fix against **390px (mobile), 768px (tablet), 1440px (desktop)** — the breakpoints already implied by existing `sm:`/`lg:` usage throughout.
- Mobile Navbar: re-evaluate the "no hamburger, single compact row" decision once accent-color and focus-ring fixes land — specifically check real tap-target sizes at `text-[9px]` against 24×24px guidance; a hamburger fallback below ~360px width may still be warranted.
- Confirm `ProjectsGrid` marquees and `Hero`'s project strip both remain usable (draggable, not just auto-scrolling) at touch sizes — the touch-drag logic already exists in `MarqueeRow`, just needs revalidation after any card-sizing changes.
- Confirm ambient blob layer (already `hidden md:block`) and any newly-added scroll-linked motion stay disabled below `md` for performance, consistent with the existing comment in `App.jsx` about mobile GPU cost.

## 13. Accessibility Considerations

- Add a global `prefers-reduced-motion` gate (likely a small hook/utility consumed by every component with an infinite Framer Motion loop).
- Add visible `focus-visible` rings to every interactive element site-wide, not just `ProjectCard`.
- Add a pause/stop affordance to all auto-advancing marquees (WCAG 2.2.2).
- Audit color contrast for all `slate-500`–`700` mono captions against `slate-950`.
- Ensure marquee-duplicated project cards (`doubled`/`repeated` arrays) don't create duplicate-announcement noise for screen readers — likely need `aria-hidden` on the cloned copies used purely for seamless looping.
- Increase mobile nav tap targets or add an accessible alternate nav pattern.
- Verify language toggle button has an accessible name beyond the visual "עב | EN" (currently has `aria-label="Switch language"` — good, keep it).

## 14. MCP Validation Strategy

No browser-automation MCP server (Playwright / Chrome DevTools) is currently connected in this session, so automated screenshot capture and DOM/contrast inspection aren't available right now. Two options once implementation begins:

1. **Connect a browser-automation MCP** (e.g. Playwright MCP) via `claude mcp` so screenshots, accessibility-tree snapshots, and Lighthouse-style audits can be scripted directly against the local Vite dev server across the three target breakpoints, before/after each change.
2. **Fallback without an MCP:** use this repo's `run` skill to launch `npm run dev` and drive the app in a real browser manually, combined with the `verify` skill to confirm each change actually works end-to-end (not just visually), plus manual DevTools contrast/Lighthouse checks.

Either way, validation should run against the four Validation categories from the design skill: **Visual** (alignment/typography/spacing/color consistency), **UX** (navigation/hierarchy/CTAs), **Responsive** (mobile/tablet/desktop), **Accessibility** (contrast/keyboard/focus), **Performance** (asset weight, layout shift, animation cost).

## 15. Screenshot Comparison Workflow

1. **Baseline capture** (before any change): screenshot every section at 390px / 768px / 1440px — 8 sections × 3 breakpoints = 24 reference images, saved with a consistent naming scheme (`{section}-{breakpoint}-before.png`).
2. **Per-change loop:** after each discrete change (one component or one concern at a time — e.g. "unify accent color" as its own pass before "restructure Hero layout"), re-capture only the affected section(s) at all 3 breakpoints.
3. **Side-by-side review:** compare `-before` vs `-after` pairs directly (an Artifact page showing both images stacked works well for this without needing an external diffing tool).
4. **Full-site re-baseline** after each major milestone (e.g., after Hero rework is approved, that becomes the new baseline for subsequent Skills/Projects work) so drift is always measured against the latest approved state, not the original.
5. **Final pass:** once all sections are done, do one more full 24-image sweep and a scroll-through video/gif if feasible, mirroring the design skill's "Self Review" step — ask what a senior designer would still flag — before calling the redesign complete.

---

## Open Questions For You

- **Identity mark:** keep the LogoMark (T+C monogram), the photo, or redesign to feature one primary and drop/shrink the other in Hero?
- **Skills duplication:** merge orbit + badges into one representation, or keep both but differentiate their purpose explicitly?
- **Scope for this pass:** everything above, or should we prioritize (e.g., "fix the splash bug + unify accent color + accessibility" first, defer layout/animation rework to a second pass)?
- **`ProcessSection.tsx`:** confirm this is inspiration-only and not meant to be wired in as-is (it's Next.js-flavored and light-themed, so it doesn't fit this Vite/dark-themed app directly).

Once you weigh in, the next step (only after your approval) is converting the agreed scope into a checkbox-style execution plan via `superpowers:writing-plans`, sized into safe, independently-verifiable tasks — matching the format already used in `docs/superpowers/plans/2026-06-28-logo-splash-hero-redesign.md`.
