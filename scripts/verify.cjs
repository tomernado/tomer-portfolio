// Reusable Playwright verification helpers for this project.
//
// PROJECT_REFACTOR_PLAN.md Priority 1: every mobile-crash/visual check this
// project has needed was previously a fresh throwaway script — dozens of
// them, each ~30-90 lines of near-identical boilerplate. This module is
// that boilerplate, written once, so future sessions `require()` it
// instead of reinventing it. It is NOT imported by the app (src/) and has
// no effect on the built site.
//
// Usage from a one-off script (see CLAUDE.md §9 for when a browser check
// is actually warranted — most tasks don't need one):
//
//   const { launchMobile, launchDesktop, scrollToSection, watchForCrash, screenshot } = require('../scripts/verify.cjs')
//   const { browser, page } = await launchMobile('http://localhost:5188/tomer-portfolio/')
//   const errors = watchForCrash(page)
//   await scrollToSection(page, 'about')
//   await screenshot(page, 'about-mobile')
//   console.log(errors)
//   await browser.close()
//
// Run directly (`node scripts/verify.cjs [url]`) for a minimal sanity
// pass: loads the site on both mobile (WebKit/iPhone 13) and desktop
// (Chromium/1440x900), confirms every section mounts, and reports any
// console/page errors. Not a full test suite (see PROJECT_REFACTOR_PLAN.md
// Priority 6 for that, not yet built) — just a fast first check.
//
// Port note: pick a dev/preview port outside common blocked ranges.
// Port 4190 is WebKit's "restricted port" list (mail/sieve protocol) and
// silently fails every navigation in WebKit only — cost real debugging
// time to track down. 5100-5999 and 8000-8999 are safe in practice.

const path = require('path')

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'web4you', 'contact']

const SCRATCHPAD_DIR =
  process.env.SHOT_DIR ||
  process.env.TEMP && path.join(process.env.TEMP, 'claude-verify-shots') ||
  __dirname

/** Marks the intro splash as already-dismissed so it doesn't block content. */
async function skipIntroSplash(page) {
  await page.addInitScript(() => localStorage.setItem('tc_intro_done', '1'))
}

/**
 * Launch WebKit with an iPhone 13 viewport and navigate to `url`.
 * Use for anything that could affect Mobile Safari specifically — crashes,
 * video, blur, sticky, backdrop-filter (see CLAUDE.md §9). Chromium's CPU
 * throttling does NOT reproduce these; only real WebKit does.
 */
async function launchMobile(url, { waitForId = 'hero', timeout = 30000 } = {}) {
  const { webkit, devices } = require('playwright')
  const browser = await webkit.launch()
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()
  await skipIntroSplash(page)
  if (url) {
    await page.goto(url, { waitUntil: 'load', timeout })
    if (waitForId) await page.waitForSelector(`#${waitForId}`, { timeout })
  }
  return { browser, context, page }
}

/**
 * Launch Chromium at a desktop viewport (1440x900 by default) and
 * navigate to `url`. Sufficient for desktop-only style/copy checks — no
 * need for WebKit unless the change is mobile/animation/scroll-related.
 */
async function launchDesktop(url, { width = 1440, height = 900, waitForId = 'hero', timeout = 20000 } = {}) {
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width, height } })
  await skipIntroSplash(page)
  if (url) {
    await page.goto(url, { waitUntil: 'load', timeout })
    if (waitForId) await page.waitForSelector(`#${waitForId}`, { timeout })
  }
  return { browser, page }
}

/** Scrolls so `#id`'s top sits `offset`px below the viewport top (instant, no animation). */
async function scrollToSection(page, id, offset = 10) {
  const top = await page.evaluate((elId) => {
    const el = document.getElementById(elId)
    return el ? el.getBoundingClientRect().top + window.scrollY : null
  }, id)
  if (top === null) throw new Error(`scrollToSection: no element with id "${id}"`)
  await page.evaluate(({ y, off }) => window.scrollTo({ top: Math.max(0, y - off), behavior: 'instant' }), { y: top, off: offset })
  return top
}

/**
 * Attaches pageerror/crash listeners and returns the array they push
 * into — check its length/contents any time after the interaction you're
 * testing. `page.on('crash')` fires only on an actual renderer crash;
 * `pageerror` fires on any uncaught JS exception (page keeps running) —
 * they're distinct signals, both included here.
 */
function watchForCrash(page) {
  const errors = []
  page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e}`))
  page.on('crash', () => errors.push('CRASH'))
  return errors
}

/** Screenshots to the OS scratchpad (or $SHOT_DIR) — never the repo. */
async function screenshot(page, name) {
  const file = path.join(SCRATCHPAD_DIR, name.endsWith('.png') ? name : `${name}.png`)
  await page.screenshot({ path: file })
  return file
}

module.exports = {
  SECTION_IDS,
  SCRATCHPAD_DIR,
  skipIntroSplash,
  launchMobile,
  launchDesktop,
  scrollToSection,
  watchForCrash,
  screenshot,
}

// `node scripts/verify.cjs [url]` — minimal sanity pass, both viewports.
if (require.main === module) {
  ;(async () => {
    const url = process.argv[2]
    if (!url) {
      console.error('Usage: node scripts/verify.cjs <url>  (e.g. http://localhost:5188/tomer-portfolio/)')
      process.exit(1)
    }

    let failed = false

    for (const [label, launch] of [['desktop (Chromium)', launchDesktop], ['mobile (WebKit/iPhone 13)', launchMobile]]) {
      console.log(`\n--- ${label} ---`)
      const { browser, page } = await launch(url)
      const errors = watchForCrash(page)
      await page.waitForTimeout(1200)

      for (const id of SECTION_IDS) {
        const exists = await page.evaluate((elId) => !!document.getElementById(elId), id)
        console.log(`  #${id}: ${exists ? 'ok' : 'MISSING'}`)
        if (!exists) failed = true
      }

      if (errors.length) {
        console.log('  errors:', JSON.stringify(errors))
        failed = true
      } else {
        console.log('  errors: none')
      }

      await browser.close()
    }

    console.log(failed ? '\nFAILED' : '\nOK')
    process.exit(failed ? 1 : 0)
  })()
}
