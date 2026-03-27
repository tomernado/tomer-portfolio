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
    "שמי תומר כהן, סטודנט שנה ג' למדעי המחשב ב-HIT ומפתח Full-Stack מונחה עצמים (OOP). בעל ניסיון מוכח בארכיטקטורת מערכות מורכבות, פיתוח מאובטח (S-SDLC) צד שרת ולקוח, ושילוב כלי בינה מלאכותית להאצת תהליכי פיתוח. הרקע שלי בניהול אופרציות בסביבות מרובות-לחץ מקנה לי יכולות עבודה בצוות וניהול משברים. אני אוהב לפתור בעיות אלגוריתמיות, לכתוב קוד נקי (Clean Code), ולייצר ממשקי משתמש מתקדמים.",
};

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
    items: ["React.js", "Node.js & Express", "Tomcat & Servlets", "Material UI (MUI)", "HTML/CSS"],
  },
  {
    category: "Databases & Tools",
    items: ["MySQL & MongoDB", "Git / GitHub", "Linux", "AI Coding Tools", "Vite"],
  },
];

export const projects = [
  {
    id: 1,
    title: "Secure Customer Management (S-SDLC)",
    description:
      "מערכת Full-Stack מאובטחת. יישום מתודולוגיות S-SDLC, הגנה מפני חולשות OWASP (כמו SQLi ו-XSS), אימות JWT חזק, והצפנת bcrypt מול מסד נתונים MySQL וממשק רספונסיבי ב-React.",
    media: `${base}img/SecWebReact.mp4`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_cybersecurity-fullstack-reactjs-activity-7438883240985157632-4CzR",
    githubLink: "https://github.com/tomernado",
  },
  {
    id: 2,
    title: "Advanced OOP & Architecture",
    description:
      "תכנון ופיתוח מערכות מורכבות ב-C# המיישמות עקרונות OOP ו-Design Patterns ברמה גבוהה. יצירת ארכיטקטורה מונחית אירועים להפרדה מוחלטת בין הלוגיקה העסקית ל-UI.",
    media: `${base}img/OpenWOrldGame.mp4`,
    mediaType: "video",
    linkedinPost:
      "https://www.linkedin.com/posts/tomer-cohen-486457346_softwareengineering-csharp-react-activity-7436389412193804288-uL7j",
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
    githubLink: "https://github.com/tomernado",
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
    siteLink: "https://tornadogames.lovable.app/",
  },
  {
    id: 6,
    title: "SLOTTAMBLE — Slot Machine Game",
    description:
      "משחק מכונת מזל אינטראקטיבי שפותח עם לוגיקה מורכבת בצד הלקוח. ממשק משתמש עשיר עם אנימציות, מערכת ניקוד, וחוויית משחק מלאה — הכל בדפדפן ללא שרת.",
    media: `${base}img/SlotGame.png`,
    mediaType: "image",
    linkedinPost: "https://www.linkedin.com/in/tomer-cohen-486457346",
    githubLink: "https://github.com/tomernado",
    siteLink: "https://tomernado.github.io/san-quentin-xways/",
  },
];
