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
    "מהנדס תוכנה המתמחה בפיתוח Full-Stack מאובטח וארכיטקטורת OOP מורכבת. בעל ניסיון מעשי בפיתוח אפליקציות מקצה לקצה דרך Web4You, תוך שימוש בכלי AI ובסיסי נתונים לייעול תהליכי פיתוח. בקיא במתודולוגיות S-SDLC ועקרונות אבטחת קוד (OWASP), עם דגש חזק על יעילות אלגוריתמית וסיבוכיות מערכות. סטודנט שנה ג' למדעי המחשב ב-HIT, המביא רקע בניהול תפעולי, אנרגיה חיובית וחשיבת צוות לאספקת פתרונות איכותיים תחת לחץ.",
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
    },
    {
      id: 2,
      title: "אסטרטגיה קריאטיבית ושיווק",
      company: "פרילנס",
      description: "ניהול תהליך הפקת תוכן דיגיטלי מקצה לקצה עבור עסקים מגוונים, מתרגום קונספט הלקוח ועד מסירת המוצר הסופי.",
      date: "2023 – 2025",
    },
    {
      id: 3,
      title: "תפעול וניהול צוות",
      company: "ניהול מסעדה",
      description: "ניהול תפעול שוטף ותיאום צוות בסביבה עתירת לחץ. אחראי על פתרון משברים בזמן אמת, ניהול משמרות ושמירה על יעילות תפעולית.",
      date: "2021 – 2023",
    },
  ],
}

export const skills = [
  {
    category: "Languages",
    items: ["C#", "Java", "JavaScript", "Python", "SQL", "C", "C++"],
  },
  {
    category: "Architecture & Security",
    items: ["OOP", "Design Patterns", "S-SDLC", "JWT & bcrypt", "RESTful APIs", "MVC", "Clean Code"],
  },
  {
    category: "Frontend & Backend",
    items: ["React.js", "Node.js & Express", "Tomcat & Servlets", "Material UI (MUI)", "Docker", "HTML/CSS"],
  },
  {
    category: "Databases & Tools",
    items: ["MySQL & MongoDB", "Git / GitHub", "Linux", "AI Coding Tools", "Vite"],
  },
];

export const projects = [
  {
    id: 8,
    title: "WorkShift — ניהול משמרות חכם",
    description:
      "אפליקציית Full-Stack לניהול משמרות עובדים בזמן אמת. מערכת תזמון חכמה המאפשרת הצגת לוח משמרות, שיבוץ עובדים ועדכונים דינמיים — עם ממשק נוח ורספונסיבי.",
    media: `${base}img/WorkShift.png`,
    mediaType: "image",
    linkedinPost:
      "https://www.linkedin.com/feed/update/urn:li:activity:7453001379230597120/",
    githubLink: "https://github.com/tomernado",
  },
  {
    id: 1,
    title: "Secure Customer Management (S-SDLC)",
    description:
      "מערכת Full-Stack מאובטחת. יישום מתודולוגיות S-SDLC, הגנה מפני חולשות OWASP (כמו SQLi ו-XSS), אימות JWT חזק, והצפנת bcrypt מול מסד נתונים MySQL וממשק רספונסיבי ב-React.",
    media: `${base}img/SecWebReact.mp4`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_cybersecurity-fullstack-reactjs-activity-7438883240985157632-4CzR",
    githubLink: "https://github.com/tomernado/CompterSecurity-Server",
  },
  {
    id: 2,
    title: "Advanced OOP & Architecture",
    description:
      "תכנון ופיתוח מערכות מורכבות ב-C# המיישמות עקרונות OOP ו-Design Patterns ברמה גבוהה. יצירת ארכיטקטורה מונחית אירועים להפרדה מוחלטת בין הלוגיקה העסקית ל-UI.",
    media: `${base}img/OpenWOrldGame.mp4`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/feed/update/urn:li:activity:7449086048011235328/",
    githubLink: "https://github.com/tomernado",
  },
  {
    id: 9,
    title: "PDF Sim — ניתוח מסמכים עם AI",
    description:
      "כלי Full-Stack לסימולציה וניתוח קבצי PDF מבוסס ארכיטקטורת React מודולרית. שימוש ב-AI לניתוח תוכן מסמכים, חילוץ מידע ויצירת תובנות אוטומטיות — עם עיצוב נקי וחוויית משתמש אינטואיטיבית.",
    media: `${base}img/PDFSim.jpg`,
    mediaType: "image",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_ai-architecture-react-activity-7468227901528924160-FIF0",
    githubLink: "https://github.com/tomernado",
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
  },
  {
    id: 5,
    title: "Interactive Web Games (Tornado Zone)",
    description:
      "מרכז אינטראקטיבי המציג יכולות פיתוח לוגיקה צד לקוח/שרת. בניית משחקי רשת מורכבים וחיבורם לממשק חווייתי ומהיר.",
    media: `${base}img/TornadoZoneAI.png`,
    mediaType: "image",
    linkedinPost: "https://www.linkedin.com/in/tomer-cohen-486457346",
    githubLink: "https://github.com/tomernado",
    siteLink: "https://tomernado.github.io/tornadogames-main/",
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
  },
  {
    id: 10,
    title: "Chef Platform — פלטפורמת שף פרטי",
    description:
      "פלטפורמת Full-Stack מותאמת אישית לשף פרטי — ניהול תפריטים, לקוחות והזמנות במקום אחד. שילוב Machine Learning לניתוח נתונים ותובנות עסקיות, עם Containerization ב-Docker לסביבת פרודקשן יציבה.",
    media: `${base}img/Recepies.mp4`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_ai-machinelearning-docker-activity-7466858872373342208-XTI7",
    githubLink: "https://github.com/tomernado",
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
