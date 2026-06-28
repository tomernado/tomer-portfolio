---
name: logo-splash-hero-redesign
description: Replace profile photo with TC logo, add first-load splash animation, improve hero professionalism
metadata:
  type: project
---

## Goal
Replace the circular profile photo in Hero with a branded TC logo SVG. Add a full-screen intro splash animation that plays only on first visit (localStorage gate). Keep all other Hero content identical.

## Components

### 1. `src/components/LogoSVG.jsx` (new)
SVG logo based on Gemini's design, enhanced:
- TC monogram: gradient fill blue-500→violet-500, white stroke 3.5px, fontSize 110, fontWeight 900
- TOMER COHEN: white, fontSize 40, fontWeight 800, letterSpacing 5
- Subtitle: `FULL-STACK | SOFTWARE ENGINEER | AI SYSTEM`, gray (#9CA3AF), fontSize 15
- viewBox="0 0 600 250"
- Props: `className`, `animate` (bool, default false — controls whether to animate parts in separately for splash use)

### 2. `src/components/IntroSplash.jsx` (new)
Full-screen intro, shown only once per browser session via `localStorage.getItem('tc_intro_done')`.

Animation sequence (Framer Motion):
- t=0: dark overlay (#020817) covers screen
- t=0–0.5s: TC letters scale 0.4→1 + fade in
- t=0.4s: TOMER COHEN slides up 30px→0 + fade in
- t=0.7s: subtitle fades in
- t=2.2s: everything fades out (0.5s duration)
- t=2.7s: component unmounts, sets `localStorage.setItem('tc_intro_done', '1')`

If `tc_intro_done` is already set → return null immediately.

### 3. `src/components/Hero.jsx` (modify)
Remove from left column:
- `<img>` profile photo
- Rotating dashed ring (`motion.div` with `rotate: 360`)
- Counter-rotating ring
- Glow blob
- `ring-4 ring-teal-500/55` circle container
- Online green dot

Replace with:
- `<LogoSVG />` inside a `motion.div` that keeps the existing `animate={{ y: [0, -12, 0] }}` float
- Add `drop-shadow` filter: `filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.35))'`
- Remove the import of profile photo (it's referenced via `personalInfo.profileMedia` so no import to remove, just don't render the img)

### 4. `src/App.jsx` (modify)
Add `<IntroSplash />` as the first child inside the outer div, before the dot-grid layer.

## Constraints
- No text changes anywhere
- No layout/order changes beyond replacing photo→logo in Hero left column
- localStorage key: `tc_intro_done`
- Splash only on first load, not on every page refresh after first visit
