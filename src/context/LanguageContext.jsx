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
  contactStrings,
  footerStrings,
} from '../data/content-en'

/* ── Strings that appear as literals in components ─────────────────── */
const UI_HE = {
  hero: {
    readMore:     'קרא עוד',
    discoverWork: 'Discover My Work',
    coFounder:    'שותף מייסד',
    web4youDesc:  'מעצב ומספק אתרים ואפליקציות web ברמת production',
    seeMore:      'ראה עוד',
    viewProjects: 'צפה בפרויקטים',
    contactCta:   'צור קשר',
    eyebrow:      'שלום, אני',
    roles: [
      'מהנדס AI',
      'מפתח Full Stack',
      'מפתח Backend',
      'ארכיטקט תוכנה',
      'בונה פתרונות AI',
    ],
  },
  about: {
    clickToSkip:      '— לחץ לדילוג',
    clickToSkipTitle: 'לחץ לדילוג',
    eyebrow:          'אודות',
    heading1:         'קצת',
    heading2:         'עליי.',
    moreAboutMe:      'עוד עליי',
    experienceEyebrow:'ניסיון',
    journeyHeading1:  'המסע',
    journeyHeading2:  'שלי.',
    journeyDesc:      'ציר זמן של המסע המקצועי והאקדמי שלי עד כה.',
    downloadCv:       'הורד קורות חיים',
    viewGithub:       'צפה ב-GitHub',
    statProjects:     'פרויקטים שנבנו',
    statTech:         'טכנולוגיות בשימוש',
    statFocusValue:   'בוגר מדמ״ח',
    statFocusLabel:   'פוקוס AI ו-Full-Stack',
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
  contact: {
    label:            'צור קשר',
    heading:          'יצירת קשר',
    headline1:        'בואו נבנה',
    headline2:        'משהו ביחד.',
    subtext:          'פתוח להזדמנויות חדשות, פרויקטים מאתגרים ושיתופי פעולה מעניינים.',
    downloadCv:       'הורד קורות חיים',
    formTitle:        'שלח הודעת WhatsApp',
    nameLabel:        'שם',
    namePlaceholder:  'השם שלך',
    phoneLabel:       'מספר טלפון',
    phonePlaceholder: '05X-XXX-XXXX',
    messageLabel:     'הודעה',
    msgPlaceholder:   'ספר לי על הפרויקט שלך...',
    submitBtn:        'שלח דרך WhatsApp',
    successMsg:       'פותח WhatsApp... ✓',
  },
  footer: {
    copyright: 'תומר כהן · כל הזכויות שמורות',
  },
}

const UI_EN = {
  hero: {
    readMore:     heroStrings.readMore,
    discoverWork: heroStrings.discoverWork,
    coFounder:    heroStrings.coFounder,
    web4youDesc:  heroStrings.web4youDesc,
    seeMore:      heroStrings.seeMore,
    viewProjects: heroStrings.viewProjects,
    contactCta:   heroStrings.contactCta,
    eyebrow:      heroStrings.eyebrow,
    roles:        heroStrings.roles,
  },
  about: {
    clickToSkip:      aboutStrings.clickToSkip,
    clickToSkipTitle: aboutStrings.clickToSkipTitle,
    eyebrow:          aboutStrings.eyebrow,
    heading1:         aboutStrings.heading1,
    heading2:         aboutStrings.heading2,
    moreAboutMe:      aboutStrings.moreAboutMe,
    experienceEyebrow:aboutStrings.experienceEyebrow,
    journeyHeading1:  aboutStrings.journeyHeading1,
    journeyHeading2:  aboutStrings.journeyHeading2,
    journeyDesc:      aboutStrings.journeyDesc,
    downloadCv:       aboutStrings.downloadCv,
    viewGithub:       aboutStrings.viewGithub,
    statProjects:     aboutStrings.statProjects,
    statTech:         aboutStrings.statTech,
    statFocusValue:   aboutStrings.statFocusValue,
    statFocusLabel:   aboutStrings.statFocusLabel,
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
  contact: {
    label:            contactStrings.label,
    heading:          contactStrings.heading,
    headline1:        contactStrings.headline1,
    headline2:        contactStrings.headline2,
    subtext:          contactStrings.subtext,
    downloadCv:       contactStrings.downloadCv,
    formTitle:        contactStrings.formTitle,
    nameLabel:        contactStrings.nameLabel,
    namePlaceholder:  contactStrings.namePlaceholder,
    phoneLabel:       contactStrings.phoneLabel,
    phonePlaceholder: contactStrings.phonePlaceholder,
    messageLabel:     contactStrings.messageLabel,
    msgPlaceholder:   contactStrings.messagePlaceholder,
    submitBtn:        contactStrings.submitBtn,
    successMsg:       contactStrings.successMsg,
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
