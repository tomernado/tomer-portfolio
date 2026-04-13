# Hero Redesign + Web4You Section — Design Spec
**Date:** 2026-04-13  
**Project:** Tomer Cohen Portfolio (tomernado.github.io/tomer-portfolio)

---

## Page Structure (confirmed)
1. **Hero** — redesigned (this spec)
2. **About** — existing, no changes
3. **Skills** — existing, no changes
4. **Projects** — existing 2-row marquee, no changes
5. **Web4You** — new section (this spec)

---

## 1. Hero Redesign

### 1.1 Background Layer
- Two animated gradient blobs (slow float, ~8s loop):
  - Blob 1: teal/cyan, top-left quadrant
  - Blob 2: blue/indigo, bottom-right quadrant
- Subtle dot-grid pattern overlay (`background-size: 32px`, low opacity ~0.04)
- All background elements `pointer-events-none`, `aria-hidden`

### 1.2 Main Content (two-column, same structure as today)

**Left — Avatar:**
- Outer dashed ring: rotates 360° continuously (20s, linear, infinite) — color `teal-500/40`
- Inner solid ring: teal-500/60, ring-offset dark
- Existing float animation (y: 0 → -14 → 0) — keep
- Online dot indicator — keep

**Right — Info panel (dir=rtl):**

**Name:** keep existing shimmer + word-reveal animation

**Typewriter Title:**  
Replace static badge with a typewriter that cycles every 3s through:
- `Full-Stack Engineer`
- `OOP Architect`
- `Security Developer`
- `AI-Assisted Dev`

Implementation: `useState` + `useEffect` interval. Each transition: fade-out current text (150ms), update, fade-in new text (150ms). Blinking cursor `|` appended, blinks at 530ms interval.

**Bio snippet:**  
2-line excerpt from `personalInfo.aboutText` (first ~120 chars, truncated with `…`). Styled as `text-slate-400 text-sm leading-relaxed`.

**Section Pills (table of contents):**  
4 clickable pills that smooth-scroll to the matching section anchor.  
Appear with stagger-in animation (delay 0.8s, 0.1s between each).

| Pill | Icon | Target |
|------|------|--------|
| Stack & Skills | ⚡ | `#skills` |
| Secure Systems | 🔐 | `#projects` |
| My Projects | 🏗️ | `#projects` |
| Resume | 📄 | opens CV modal |

Style: `border border-white/10 bg-white/[0.04] backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-mono`  
Hover: border teal, text teal, subtle glow

**Social Buttons:**  
Keep existing 3D buttons (LinkedIn, WhatsApp, GitHub) but:
- Add `sublabel` text below main label (already defined in data, just render it)
- Make them slightly wider
- Keep existing shadow/hover behavior

**Resume button:** keep as-is below social buttons

### 1.3 Project Preview Strip
Located at the bottom of the Hero section, before the scroll CTA.  
Full-width horizontal strip with heading label `// featured.projects`.

Contents: all project images (from `projects` array) rendered as small cards:
- Size: `w-36 h-24` (144×96px), `object-cover`, `rounded-xl`
- Glassmorphism overlay on hover with project title
- Auto-scrolls left at slow speed (~0.04 px/ms) using same `useAnimationFrame` + `useMotionValue` pattern as `ProjectsGrid`
- Items doubled for seamless loop
- Pause on hover

### 1.4 Scroll CTA
Replace current minimal indicator with:
```
  [ Discover My Work ]
         ↓  (bouncing chevron)
```
- Text: `font-mono text-[11px] tracking-[0.25em] uppercase text-slate-500`
- Chevron: existing bounce animation but slightly larger (size 18)
- Clicking scrolls to `#about`

---

## 2. Web4You Section

### 2.1 Position
After `#projects`, before footer. Section id: `#web4you`.

### 2.2 Layout
Two-column on desktop, stacked on mobile:
- **Left:** Business logo/icon placeholder + site screenshot (iframe preview or static image — TBD with user)
- **Right:** Text content

### 2.3 Content (placeholder — user will provide final text)
- **Headline:** `Web4You — הסטארטאפ שלי`
- **Tagline:** שורת תיאור קצרה
- **Body:** פסקה על למה פתחתי את העסק, מה הוא עושה
- **CTA button:** "בקר באתר →" → `https://web4-you.vercel.app/`

### 2.4 Style
- Same dark glassmorphism aesthetic as the rest of the site
- Accent color: blue/purple (to differentiate from teal of Hero/About)
- Section divider line top + animated heading reveal (same pattern as Projects section)
- Subtle background glow blob (blue-purple, low opacity)

---

## 3. Implementation Notes

### Files to create/modify
| File | Action |
|------|--------|
| `src/components/Hero.jsx` | Full rewrite |
| `src/components/Web4YouSection.jsx` | New component |
| `src/App.jsx` | Add `<Web4YouSection />` after `<ProjectsGrid />` |
| `src/data/content.js` | Add `web4youData` export (text, URL) |

### Dependencies
- All existing: `framer-motion`, `lucide-react`, `tailwindcss` — no new packages needed

### Performance constraints
- Blob animations: `will-change: transform`, no `filter: blur` on mobile
- Preview strip: same pattern as existing `MarqueeRow` (proven performant)
- Typewriter: no heavy libraries, pure `useState` + `useEffect`

---

## Open Questions
- Web4You section: does user want a live iframe preview of the site, or a screenshot image?
- Web4You section: user to provide the body text about the business
