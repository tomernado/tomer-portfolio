import { createContext, useContext, useState } from 'react'
import {
  personalInfo as personalInfoHe,
  aboutData    as aboutDataHe,
  skills,
  projects     as projectsHe,
  web4youData  as web4youDataHe,
} from '../data/content'
import {
  personalInfo      as personalInfoEn,
  aboutData         as aboutDataEn,
  projectDescriptions,
  web4youSteps,
  web4youSection,
  projectsSection,
  heroStrings,
  aboutStrings,
  footerStrings,
} from '../data/content-en'

/* ── Strings that appear as literals in components ─────────────────── */
const UI_HE = {
  hero: {
    readMore:     'קרא עוד',
    discoverWork: 'Discover My Work',
  },
  about: {
    clickToSkip:      '— לחץ לדילוג',
    clickToSkipTitle: 'לחץ לדילוג',
  },
  projects: {
    heading:    'פרויקטים',
    subheading: 'לחץ על כרטיס לפרטים · גלילה אוטומטית',
    cardCta:    'פרטים',
  },
  web4you: {
    label:     'העסק שלי',
    ctaButton: 'בקר באתר Web4You',
  },
  footer: {
    copyright: 'תומר כהן · כל הזכויות שמורות',
  },
}

const UI_EN = {
  hero: {
    readMore:     heroStrings.readMore,
    discoverWork: heroStrings.discoverWork,
  },
  about: {
    clickToSkip:      aboutStrings.clickToSkip,
    clickToSkipTitle: aboutStrings.clickToSkipTitle,
  },
  projects: {
    heading:    projectsSection.heading,
    subheading: projectsSection.subheading,
    cardCta:    projectsSection.cardCta,
  },
  web4you: {
    label:     web4youSection.label,
    ctaButton: web4youSection.ctaButton,
  },
  footer: {
    copyright: footerStrings.copyright,
  },
}

/* ── Context ────────────────────────────────────────────────────────── */
const LanguageContext = createContext({ lang: 'he', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

/* ── Hooks ──────────────────────────────────────────────────────────── */
export function useLang() {
  return useContext(LanguageContext)
}

export function useContent() {
  const { lang } = useLang()

  if (lang === 'he') {
    return {
      personalInfo: personalInfoHe,
      aboutData:    aboutDataHe,
      skills,
      projects:     projectsHe,
      web4youData:  web4youDataHe,
      ui:           UI_HE,
      dir:          'rtl',
    }
  }

  // English: merge base (URLs/images) with translated text
  const projectsEn = projectsHe.map(p => ({
    ...p,
    description: projectDescriptions[p.id] ?? p.description,
  }))

  const web4youDataEn = {
    ...web4youDataHe,
    steps: web4youDataHe.steps.map((step, i) => ({
      ...step,
      title:       web4youSteps[i]?.title       ?? step.title,
      description: web4youSteps[i]?.description ?? step.description,
    })),
  }

  return {
    personalInfo: { ...personalInfoHe, ...personalInfoEn },
    aboutData:    aboutDataEn,
    skills,
    projects:     projectsEn,
    web4youData:  web4youDataEn,
    ui:           UI_EN,
    dir:          'ltr',
  }
}
