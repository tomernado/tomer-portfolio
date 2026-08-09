const base = import.meta.env.BASE_URL   // '/' in dev, '/tomer-portfolio/' in prod

export const personalInfo = {
  name: "תומר כהן",
  title: "Full-Stack Software Engineer",
  phone: "0543210990",
  email: "tomernado1233@gmail.com",
  whatsapp: "https://wa.me/972543210990",
  linkedin: "https://www.linkedin.com/in/tomer-cohen-486457346",
  github: "https://github.com/tomernado",
  profileMedia: `${base}img/Profile.jpeg`,
  cvPdf: `${base}Tomer_Cohen_Resume.pdf`,
  aboutText:
    "מהנדס תוכנה המתמחה בפיתוח Full-Stack, מערכות תוכנה מבוססות AI וארכיטקטורת תוכנה. בעל ניסיון בפיתוח אפליקציות מקצה לקצה, תרגום דרישות עסקיות לאפליקציות מדרגיות דרך פרויקטי לקוחות (Web4You). בסיס חזק בארכיטקטורת תוכנה, פיתוח Backend מדרגי ופתרון בעיות אלגוריתמי. סטודנט שנה ג' למדעי המחשב עם רקע מקצועי בניהול תפעולי, המביא חשיבת צוות ממוקדת במסירת פתרונות איכותיים.",
};

export const aboutData = {
  mainTitle: "בוגר מדעי המחשב",
  experience: [
    {
      id: 1,
      title: "מפתח Full-Stack ושותף מייסד",
      company: "Web4You",
      description: "פיתוח מקצה לקצה של 20+ אפליקציות ואתרים (React, JS, HTML/CSS). תרגום דרישות לקוחות לפיצ'רים מדרגיים תוך שימוש ב-AI לייעול ארכיטקטורת קוד. תכנון בסיסי נתונים ותשתית דרך Supabase, יישום אימות חזק, RBAC ואינטגרציות API לשערי תשלום ומערכות CRM.",
      date: "2025 – היום",
      tags: ["React", "Node.js", "AI", "Supabase"],
    },
    {
      id: 2,
      title: "אסטרטגיה קריאטיבית ושיווק",
      company: "פרילנס",
      description: "ניהול תהליך הפקת תוכן דיגיטלי מקצה לקצה עבור עסקים מגוונים, מתרגום קונספט הלקוח ועד מסירת המוצר הסופי.",
      date: "2023 – 2025",
      tags: ["אסטרטגיית תוכן", "קשרי לקוחות", "שיווק"],
    },
    {
      id: 3,
      title: "תפעול וניהול צוות",
      company: "ניהול מסעדה",
      description: "ניהול תפעול שוטף ותיאום צוות בסביבה עתירת לחץ. אחראי על פתרון משברים בזמן אמת, ניהול משמרות ושמירה על יעילות תפעולית.",
      date: "2021 – 2023",
      tags: ["ניהול צוות", "תפעול", "ניהול משברים"],
    },
  ],
  features: [
    {
      id: 1,
      title: "פיתוח Backend",
      description: "בניית APIs חזקים, בסיסי נתונים ומערכות שרת סקיילביליות.",
    },
    {
      id: 2,
      title: "הנדסת AI ו-LLM",
      description: "בניית סוכנים חכמים, מערכות RAG ואפליקציות מונעות בינה מלאכותית.",
    },
    {
      id: 3,
      title: "ארכיטקטורת תוכנה",
      description: "עיצוב ארכיטקטורות נקיות, ברות-תחזוקה וסקיילביליות למערכות מורכבות.",
    },
    {
      id: 4,
      title: "פתרון בעיות",
      description: "חשיבה אנליטית חזקה ומיקוד באספקת השפעה אמיתית בעולם.",
    },
  ],
}

export const skills = [
  {
    category: "Languages",
    items: ["Java", "C#", "JavaScript", "TypeScript", "Python", "SQL", "C", "C++"],
  },
  {
    category: "Architecture & Security",
    items: ["OOP", "Design Patterns", "Clean Architecture", "REST APIs", "JWT", "Testing", "Secure Development"],
  },
  {
    category: "Frontend & Backend",
    items: ["React", "TypeScript", "Node.js", "Express", "Next.js", "Vite", "REST APIs", "Docker", "Postman"],
  },
  {
    category: "Databases & Tools",
    items: ["MySQL", "MongoDB", "Git", "Linux", "Docker", "AI Engineering"],
  },
];

export const projects = [
  {
    id: 12,
    title: "Karaoke Studio — Real-Time Karaoke Platform",
    description:
      "פלטפורמת קריוקי Full-Stack המאפשרת יצירת חדרי שירה בזמן אמת עם רשימת השמעה משותפת, סנכרון מילות שיר וניהול תורים בין משתתפים. נבנתה עם ארכיטקטורת קליינט-שרת מודרנית ו-Backend מדרגי לתמיכה בחיבורים מרובים במקביל.",
    media: `${base}img/KaraokeStudio.mp4`,
    mediaPoster: `${base}img/KaraokeStudio_poster.jpg`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_softwareengineering-fullstack-backend-ugcPost-7491065208732434432-ZF7y/?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFaQVuYB4TlPvjKcWTSihPNIMkLKQp8ySKE",
    githubLink: "https://github.com/tomernado/karaoke-studio",
    siteLink: "https://frontend-blond-nu-2dw9j9eppo.vercel.app/",
    tags: ["React", "Node.js", "Real-Time", "Full-Stack"],
  },
  {
    id: 8,
    title: "WorkShift — Smart Shift Management",
    description:
      "אפליקציית Full-Stack לניהול משמרות עובדים בזמן אמת. מערכת תזמון חכמה המאפשרת הצגת לוח משמרות, שיבוץ עובדים ועדכונים דינמיים — עם ממשק נוח ורספונסיבי.",
    media: `${base}img/WorkShift.png`,
    mediaType: "image",
    linkedinPost:
      "https://www.linkedin.com/feed/update/urn:li:activity:7453001379230597120/",
    githubLink: "https://github.com/tomernado/WorkShift",
    siteLink: "https://workshift-ekq8.onrender.com",
    tags: ["React", "Node.js", "Real-Time", "Full-Stack"],
  },
  {
    id: 1,
    title: "Secure Customer Management (S-SDLC)",
    description:
      "מערכת Full-Stack מאובטחת. יישום מתודולוגיות S-SDLC, הגנה מפני חולשות OWASP (כמו SQLi ו-XSS), אימות JWT חזק, והצפנת bcrypt מול מסד נתונים MySQL וממשק רספונסיבי ב-React.",
    media: `${base}img/SecWebReact.mp4`,
    mediaPoster: `${base}img/SecWebReact_poster.jpg`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_cybersecurity-fullstack-reactjs-activity-7438883240985157632-4CzR",
    githubLink: "https://github.com/tomernado/CompterSecurity-Server",
    tags: ["React", "MySQL", "JWT", "Security"],
  },
  {
    id: 11,
    title: "SocialOrg — AI Organizational Automation",
    description:
      "פלטפורמת Full-Stack לניהול ואוטומציה של תהליכים ארגוניים באמצעות AI. המערכת מייעלת תקשורת פנים-ארגונית, מנהלת משימות ומייצרת תובנות חכמות — עם ממשק רספונסיבי מלא ו-Deployment בענן.",
    media: `${base}img/SocialOrg.mp4`,
    mediaPoster: `${base}img/SocialOrg_poster.jpg`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_ai-softwareengineering-automation-ugcPost-7476927528452907008-PFR7/",
    githubLink: "https://github.com/tomernado/SocialOrg",
    siteLink: "https://social-org-git-master-tomernados-projects.vercel.app/",
    tags: ["React", "AI", "Automation", "Cloud"],
  },
  {
    id: 2,
    title: "Advanced OOP & Architecture",
    description:
      "תכנון ופיתוח מערכות מורכבות ב-C# המיישמות עקרונות OOP ו-Design Patterns ברמה גבוהה. יצירת ארכיטקטורה מונחית אירועים להפרדה מוחלטת בין הלוגיקה העסקית ל-UI.",
    media: `${base}img/OpenWOrldGame.mp4`,
    mediaPoster: `${base}img/OpenWOrldGame_poster.jpg`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_softwareengineering-claudecode-ai-activity-7446866692426620929-1zcR?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFaQVuYB4TlPvjKcWTSihPNIMkLKQp8ySKE",
    githubLink: "https://github.com/tomernado/GTA-Game",
    tags: ["C#", "OOP", "Design Patterns"],
  },
  {
    id: 9,
    title: "PDF Sim — AI Document Analysis",
    description:
      "כלי Full-Stack לסימולציה וניתוח קבצי PDF מבוסס ארכיטקטורת React מודולרית. שימוש ב-AI לניתוח תוכן מסמכים, חילוץ מידע ויצירת תובנות אוטומטיות — עם עיצוב נקי וחוויית משתמש אינטואיטיבית.",
    media: `${base}img/PDFSim.jpg`,
    mediaType: "image",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_ai-architecture-react-activity-7468227901528924160-FIF0",
    githubLink: "https://github.com/tomernado/universal_interviewer",
    siteLink: "https://tomernado.github.io/universal_interviewer/dashboard.html",
    tags: ["React", "AI", "Document Analysis"],
  },
  {
    id: 3,
    title: "Multiplayer Client-Server Game",
    description:
      "פיתוח משחק רשת ב-Java מקצה לקצה. ארכיטקטורת צד שרת יציבה עם Java Servlets ו-Tomcat, וניהול נתונים (Sessions). צד לקוח שנבנה באמצעות JavaFX.",
    media: `${base}img/JAVACourse.png`,
    mediaType: "image",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_java-backend-oop-activity-7440003959379070977-4D6h",
    githubLink: "https://github.com/tomernado/four-in-row-server",
    tags: ["Java", "JavaFX", "Networking"],
  },
  {
    id: 4,
    title: "Web Development & AI Integration",
    description:
      "מעבר מפיתוח ידני של HTML/CSS לפיתוח React מואץ באמצעות כלי AI. יצירה והטמעה של 3 אתרים חיים, תוך ניהול דומיינים ו-SSL.",
    media: `${base}img/WebWithAI.png`,
    mediaType: "image",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_webdevelopment-ai-claude-share-7441776772855255040-aOY8",
    githubLink: "https://github.com/tomernado",
    tags: ["React", "AI", "Web Development"],
  },
  {
    id: 5,
    title: "Interactive Web Games (Tornado Zone)",
    description:
      "מרכז אינטראקטיבי המציג יכולות פיתוח לוגיקה צד לקוח/שרת. בניית משחקי רשת מורכבים וחיבורם לממשק חווייתי ומהיר.",
    media: `${base}img/TornadoZoneAI.png`,
    mediaType: "image",
    linkedinPost: "https://www.linkedin.com/posts/tomer-cohen-486457346_softwareengineering-csharp-react-activity-7436389412193804288-uL7j?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFaQVuYB4TlPvjKcWTSihPNIMkLKQp8ySKE",
    githubLink: "https://github.com/tomernado/tornadogames-main",
    siteLink: "https://tomernado.github.io/tornadogames-main/",
    tags: ["JavaScript", "Client-Server", "Games"],
  },
  {
    id: 6,
    title: "SLOTTAMBLE — Slot Machine Game",
    description:
      "משחק מכונת מזל אינטראקטיבי שפותח עם לוגיקה מורכבת בצד הלקוח. ממשק משתמש עשיר עם אנימציות, מערכת ניקוד, וחוויית משחק מלאה — הכל בדפדפן ללא שרת.",
    media: `${base}img/SlotGame.png`,
    mediaType: "image",
    linkedinPost: "https://www.linkedin.com/feed/update/urn:li:activity:7449086048011235328/",
    githubLink: "https://github.com/tomernado/san-quentin-xways",
    siteLink: "https://tomernado.github.io/san-quentin-xways/",
    tags: ["JavaScript", "Animation", "Game"],
  },
  {
    id: 7,
    title: "DevStore — E-Commerce Website",
    description:
      "בניית חנות אונליין מלאה עם ממשק RTL בעברית. קטלוג מוצרים, עגלת קניות, מועדפים וחיפוש — עם עיצוב רספונסיבי ודגש על חוויית משתמש. פותח תוך שילוב כלי AI להאצת הפיתוח.",
    media: `${base}img/SHOP.png`,
    mediaType: "image",
    linkedinPost: "https://www.linkedin.com/feed/update/urn:li:activity:7449086048011235328/",
    githubLink: "https://github.com/tomernado/DevStore",
    siteLink: "https://tomernado.github.io/DevStore/",
    tags: ["React", "RTL", "E-Commerce"],
  },
  {
    id: 10,
    title: "Chef Platform — Private Chef Platform",
    description:
      "פלטפורמת Full-Stack מותאמת אישית לשף פרטי — ניהול תפריטים, לקוחות והזמנות במקום אחד. שילוב Machine Learning לניתוח נתונים ותובנות עסקיות, עם Containerization ב-Docker לסביבת פרודקשן יציבה.",
    media: `${base}img/Recepies.mp4`,
    mediaPoster: `${base}img/Recepies_poster.jpg`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_ai-machinelearning-docker-activity-7466858872373342208-XTI7",
    githubLink: "https://github.com/tomernado/bens-playbook",
    tags: ["Machine Learning", "Docker", "Full-Stack"],
  },
];

export const web4youData = {
  tagline: 'בניית אתרים מקצועיים לעסקים קטנים ובינוניים',
  url: 'https://web4-you.vercel.app/',
  steps: [
    {
      number: '01',
      title: 'למה יצאנו לדרך? (הסיפור שלנו)',
      description: 'הבנו שמהפכת ה-AI היא כבר מזמן לא העתיד – היא ההווה, והיא כאן כדי להישאר. במקום לחשוש משינוי, החלטנו לרתום את העוצמה הזו לטובת בעלי עסקים. גילינו ששילוב בין אפיון אנושי חכם והבנה עמוקה ב-UX/UI, לבין יכולות כתיבת קוד של בינה מלאכותית, מאפשר לנו ליצור אתרים מרהיבים, מודרניים ומתקדמים – ברמה שלא הייתה נגישה בעבר לכל עסק.',
      image: `${base}img/web4you1.png`,
    },
    {
      number: '02',
      title: 'איך הקסם קורה? (השיטה שלנו)',
      description: 'בנינו תהליך עבודה מדויק ונטול עיכובים. זה מתחיל מאפיון אנושי שבו אנחנו לומדים את הצרכים שלכם לעומק. משם, אנחנו מתרגמים את החזון שלכם ל"בריף טכני" מדויק ומזינים אותו לסוכני קוד מתקדמים מבוססי AI. לבסוף, אנחנו מבצעים בקרת איכות קפדנית, התאמות עיצוב, שילוב אנימציות וגימורים ידניים כדי להבטיח שהתוצר הסופי יהיה לא פחות ממושלם.',
      image: `${base}img/web4you2.png`,
    },
    {
      number: '03',
      title: 'היתרון המובהק שלנו (למה אנחנו?)',
      description: 'השילוב המנצח של איכות פרימיום, מהירות שיא ומחיר הוגן. בזכות מודל העבודה החדשני שלנו, אנחנו חוסכים עשרות שעות פיתוח – ואת החיסכון הזה אנחנו מגלגלים אליכם. אתם מקבלים אתר ברמת גימור של חברות הייטק, עם אנימציות חלקות, קוד נקי ועיצוב מותאם אישית, בחצי מהזמן ובמחיר משתלם משמעותית מהמקובל בשוק.',
      image: `${base}img/web4you3.png`,
    },
    {
      number: '04',
      title: 'החזון שלנו קדימה (לאן פנינו מועדות?)',
      description: 'עולם הטכנולוגיה מתפתח בקצב מסחרר, ואנחנו דואגים להיות תמיד צעד אחד קדימה. אנחנו רעבים ליצירה, שואפים להמשיך ללמוד, להתרחב ולשלב את הכלים החדשים ביותר כדי להעניק ללקוחות שלנו את המילה האחרונה ברשת. המטרה שלנו היא לעזור לעוד המון עסקים להפוך את החזון שלהם למציאות דיגיטלית בועטת.',
      image: `${base}img/web4you4.png`,
    },
  ],
};
