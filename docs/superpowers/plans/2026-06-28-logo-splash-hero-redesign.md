# Logo Splash & Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the circular profile photo in Hero with a branded TC logo SVG, and add a full-screen intro splash animation that plays only on first visit.

**Architecture:** Two new components (`LogoSVG`, `IntroSplash`) are created independently. `Hero.jsx` is surgically modified to swap the photo section for `LogoSVG`. `App.jsx` mounts `IntroSplash` before everything else. No other files touched.

**Tech Stack:** React 18, Framer Motion 12, Tailwind CSS 3, Vite — no test framework in project (visual verification only).

## Global Constraints
- No text changes anywhere in the app
- No layout/section order changes
- localStorage key must be exactly: `tc_intro_done`
- Splash only on first load per browser; subsequent loads skip it instantly
- Keep all existing Hero content (typewriter, buttons, bio, chips, project strip) unchanged
- Framer Motion is already installed — no new dependencies

---

### Task 1: Create `LogoSVG.jsx`

**Files:**
- Create: `src/components/LogoSVG.jsx`

**Interfaces:**
- Produces: `default export LogoSVG({ className, style })` — an `<svg>` element, no internal state

- [ ] **Step 1: Create the file with this exact content**

```jsx
// src/components/LogoSVG.jsx
export default function LogoSVG({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 250"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="tcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* TC Monogram */}
      <text
        x="300"
        y="118"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="110"
        fontWeight="900"
        fill="url(#tcGrad)"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        textAnchor="middle"
        letterSpacing="-8"
      >
        TC
      </text>

      {/* Accent line */}
      <line
        x1="160" y1="148" x2="440" y2="148"
        stroke="url(#tcGrad)" strokeWidth="1.5" opacity="0.55"
      />

      {/* Full name */}
      <text
        x="300"
        y="182"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="7"
      >
        TOMER COHEN
      </text>

      {/* Subtitle */}
      <text
        x="300"
        y="216"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="13"
        fontWeight="500"
        fill="#9CA3AF"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        FULL-STACK · SOFTWARE ENGINEER · AI SYSTEMS
      </text>
    </svg>
  )
}
```

- [ ] **Step 2: Verify the file exists and has no syntax errors**

Run: `node --input-type=module --eval "import('./src/components/LogoSVG.jsx').then(() => console.log('ok'))"`
(or just open `npm run dev` and check the browser console — no red errors)

- [ ] **Step 3: Commit**

```bash
git add src/components/LogoSVG.jsx
git commit -m "Add LogoSVG component — TC monogram with blue-violet gradient"
```

---

### Task 2: Create `IntroSplash.jsx`

**Files:**
- Create: `src/components/IntroSplash.jsx`

**Interfaces:**
- Consumes: `LogoSVG` from Task 1
- Produces: `default export IntroSplash()` — renders full-screen overlay or `null`

- [ ] **Step 1: Create the file with this exact content**

```jsx
// src/components/IntroSplash.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoSVG from './LogoSVG'

const STORAGE_KEY = 'tc_intro_done'

export default function IntroSplash() {
  // Initialise synchronously so there's never a flash of the overlay on repeat visits
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 2700)
    return () => clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950"
        >
          {/* Logo — scales up from small */}
          <motion.div
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm sm:max-w-md px-8"
            style={{ filter: 'drop-shadow(0 0 48px rgba(99,102,241,0.45))' }}
          >
            <LogoSVG />
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="flex gap-2 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify behavior manually**

Start dev server: `npm run dev`

Open browser → first load → full-screen splash with TC logo should appear for ~2.7s, then fade out.
Refresh → splash should NOT appear (localStorage key is set).

To re-test first-load: open DevTools → Application → Local Storage → delete `tc_intro_done` key → refresh.

- [ ] **Step 3: Commit**

```bash
git add src/components/IntroSplash.jsx
git commit -m "Add IntroSplash component — first-load logo animation with localStorage gate"
```

---

### Task 3: Wire `IntroSplash` into `App.jsx`

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `IntroSplash` from Task 2

- [ ] **Step 1: Add import at top of `App.jsx`**

Add this import after the existing imports (around line 9):
```jsx
import IntroSplash from './components/IntroSplash'
```

- [ ] **Step 2: Add `<IntroSplash />` as the first child inside the outer div**

Current code (line 45):
```jsx
  return (
    <LanguageProvider>
    <div className="bg-slate-950 min-h-screen relative [overflow-x:clip]">
      {/* Static dot-grid layer */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0 opacity-50" />
```

Change to:
```jsx
  return (
    <LanguageProvider>
    <div className="bg-slate-950 min-h-screen relative [overflow-x:clip]">
      <IntroSplash />
      {/* Static dot-grid layer */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0 opacity-50" />
```

- [ ] **Step 3: Verify in browser**

`npm run dev` → clear `tc_intro_done` from localStorage → refresh → splash appears over the whole page including navbar. After fade, everything is normal.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "Wire IntroSplash into App — renders above everything on first visit"
```

---

### Task 4: Replace photo with `LogoSVG` in `Hero.jsx`

**Files:**
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: `LogoSVG` from Task 1

This task replaces the entire left-column photo block in Hero with a floating LogoSVG. Nothing else in Hero changes.

- [ ] **Step 1: Add import at top of `Hero.jsx`**

Add after existing imports (around line 10):
```jsx
import LogoSVG from './LogoSVG'
```

- [ ] **Step 2: Replace the photo `motion.div` block**

Find this block (lines 288–322 approximately):
```jsx
          {/* LEFT — avatar */}
          <motion.div
            className="flex-shrink-0 relative will-change-transform"
            variants={fadeUp}
            animate={{ y: [0, -12, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
          >
            {/* Outer dashed rotating ring */}
            <motion.div
              className="absolute rounded-full border-2 border-dashed border-teal-500/30"
              style={{ inset: '-16px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            {/* Second slower counter-rotating ring — desktop only */}
            <motion.div
              className="hidden sm:block absolute rounded-full border border-blue-500/15"
              style={{ inset: '-28px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            {/* Glow blob — desktop only */}
            <motion.div
              className="hidden md:block absolute inset-0 rounded-full bg-teal-500/20 blur-3xl scale-[1.7]"
              animate={{ opacity: [0.35, 0.8, 0.35], scale: [1.7, 2.0, 1.7] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Photo */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-4 ring-teal-500/55 ring-offset-4 ring-offset-slate-950 shadow-[0_0_70px_rgba(20,184,166,0.4)]">
              <img src={personalInfo.profileMedia} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-[0_0_12px_rgba(52,211,153,1)]">
              <span className="block w-full h-full rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </motion.div>
```

Replace the entire block with:
```jsx
          {/* LEFT — logo */}
          <motion.div
            className="flex-shrink-0 relative will-change-transform"
            variants={fadeUp}
            animate={{ y: [0, -12, 0] }}
            transition={{ y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
          >
            {/* Ambient glow behind logo */}
            <motion.div
              className="hidden md:block absolute inset-0 blur-3xl"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.22) 0%, transparent 70%)',
                transform: 'scale(1.6)',
              }}
              animate={{ opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <LogoSVG
              className="relative w-64 sm:w-80"
              style={{ filter: 'drop-shadow(0 0 28px rgba(99,102,241,0.38))' }}
            />
          </motion.div>
```

- [ ] **Step 3: Verify visually in browser**

`npm run dev` → hero section → left side should show the TC logo with subtle float animation and indigo glow. No circular photo, no rings, no green dot. All right-side content (name, typewriter, buttons, bio, chips, strip) unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "Replace profile photo with LogoSVG in Hero — floating with indigo glow"
```

---

### Task 5: Deploy

- [ ] **Step 1: Build and deploy to gh-pages**

```bash
npm run deploy
```

Expected output ends with: `Published`

- [ ] **Step 2: Clear localStorage on the live site and verify splash plays**

Open the live site URL, open DevTools → Application → Local Storage → delete `tc_intro_done` → refresh.
Splash should play, then fade to normal hero with logo.

- [ ] **Step 3: Verify repeat visits skip splash**

Refresh again without clearing localStorage → splash should not appear.
