import { useState, useEffect } from "react";
import { Menu, X, ArrowLeft, ArrowRight, ChevronDown, Instagram, Phone, Mail, MapPin } from "lucide-react";
import pineaLogo from "@/imports/Asset_9_4x.png";
import pineaLogoHe from "@/imports/Asset_8_4x.png";
import { fetchContent } from "./api";
import Admin from "./Admin";

// ── Translations ──────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  he: {
    dir: "rtl" as const,
    nav: [
      { label: "העבודות שלנו", id: "work" },
      { label: "תהליך", id: "process" },
      { label: "אודות", id: "about" },
      { label: "בקש הצעה", id: "quote" },
    ],
    navCta: "בקש הצעת מחיר",
    heroBadge: "עבודה בעיצוב אישי · עץ וברזל",
    heroH1: ["המרחב שלך.", "הרהיט שלך.", "נבנה פעם אחת."],
    heroPrimary: "הרהיט שלך.",
    heroBody: "כל פריט שאנו מייצרים הוא ייחודי — נבנה מאפס סביב המרחב המדויק שלך, החומרים שאתה אוהב, והחזון שלך. אין קטלוג. יש רק הזמנה שלך.",
    heroBtn1: "בקש הצעת מחיר",
    heroBtn2: "ראה את עבודותינו",
    strip: "אף שני פריטים לא זהים · כל הזמנה מתחילה מדף ריק · עבודת יד מהתחלה ועד הסוף",
    workLabel: "מה אנחנו עושים",
    workTitle: "תחומי העבודה",
    workSubtitle: "אלה סוגי הפריטים שאנחנו עושים — לא תפריט קבוע, אלא נקודת פתיחה לשיחה על הפריט שלך.",
    catLearnMore: "פרטים נוספים",
    catQuoteBtn: "בקש הצעה על פריט כזה",
    workshopLabel: "הסדנה",
    workshopH2: ["העץ מעוצב.", "הפלדה מרותכת.", "הכל נעשה בבית."],
    workshopBtn: "התחל את הפרויקט שלך",
    processLabel: "מרעיון למסירה",
    processTitle: "איך עובדת הזמנה",
    aboutLabel: "אודות הסטודיו",
    aboutTitle: ["סטודיו", "פינאה"],
    aboutBody: [
      "סטודיו פינאה הוא סטודיו לנגרות ומסגרות המבוסס במרכז הארץ. אחרי שנים בייצור תעשייתי, הפנינו את המקצוע לכיוון אישי יותר: רהיטים שנבנים סביב האנשים שמשתמשים בהם.",
      "מכיוון שכל פריט הוא ייחודי, אנחנו מקבלים מספר מוגבל של הזמנות בכל חודש. זה לא שיווק — כך העבודה נשארת טובה. כל לקוח מקבל את תשומת לבנו המלאה, מהשיחה הראשונה ועד היום שהפריט נמצא בחדר.",
      "חומרים מגיעים ממקורות מקומיים ככל האפשר — אגוז, אלון, עץ אורן ועץ ממוחזר, בשילוב פלדה חמה וקרה המעובדת בסדנה.",
    ],
    aboutBtn: "הזמן את הפריט שלך",
    quoteLabel: "פנייה להזמנה",
    quoteTitle: ["ספרו לנו", "על הפרויקט", "שלכם"],
    quoteSubtitle: "אין בריף שגס מדי. שרטוט, תמונת השראה, רעיון מטושטש — הכל בסדר. אנחנו קוראים כל פנייה ומגיבים תוך 24 שעות לתיאום ייעוץ חינם.",
    contacts: [
      { label: "טלפון / וואטסאפ", value: "050-000-0000" },
      { label: "אימייל", value: "oren@pineastudio.co.il" },
      { label: "הסדנה", value: "מרכז הארץ · ביקורים בתיאום מראש" },
      { label: "אינסטגרם", value: "@pineastudio" },
    ],
    formName: "שם *",
    formNamePh: "השם שלך",
    formContact: "טלפון או אימייל *",
    formContactPh: "איך ליצור איתך קשר",
    formType: "סוג הפריט",
    formTypePh: "בחר קטגוריה",
    formTypeOpts: ["שולחנות אוכל", "מדפים ואחסון", "שולחנות סלון", "שולחנות עבודה", "ספסלים וישיבה", "משהו אחר?"],
    formDesc: "על הפרויקט שלך *",
    formDescPh: "תאר את הפריט — מידות אם ידועות, חומרים שאתה אוהב, החדר שבו הוא יעמוד, לוח הזמנים שלך. ככל שתשתף יותר — נוכל לעזור טוב יותר.",
    formBudget: "טווח תקציב (אופציונלי)",
    formBudgetPh: "מעדיף לא לציין",
    formBudgetOpts: ["עד ₪5,000", "₪5,000 – ₪10,000", "₪10,000 – ₪20,000", "₪20,000+"],
    formBudgetNote: "שיתוף בטווח עוזר לנו להציע את החומרים הנכונים. זה לא מחייב אותך לכלום.",
    formSubmit: "שלח פנייה",
    formNote: "אנחנו מגיבים באופן אישי תוך 24 שעות. כל הפניות סודיות.",
    formAlert: "הפנייה שלך נשלחה. נחזור אליך תוך 24 שעות.",
    footerCopy: `© ${new Date().getFullYear()} סטודיו פינאה · עבודות עץ ופלדה מותאמות אישית · תוצרת ישראל`,
    logoAlt: "סטודיו פינאה",
    categories: [
      {
        id: "dining",
        name: "שולחנות אוכל",
        desc: "לב הבית. לוחות עץ מלא, קצה חי, או חיתוך ישר ונקי — בשילוב רגלי פלדה שעוצבו סביב הדרך שבה אתם אוכלים ומתכנסים.",
        img: "https://images.unsplash.com/photo-1698770531036-c627d35188f2?w=900&h=700&fit=crop&auto=format",
        alt: "שולחן אוכל מאגוז עם רגלי פלדה",
      },
      {
        id: "shelving",
        name: "מדפים ואחסון",
        desc: "מודולרי או קבוע. מסגרות פלדה עם מדפי עץ, או יחידות מרצפה לתקרה — מתוכננות לקיר המדויק שלכם ולמה שאתם שמים עליו.",
        img: "https://images.unsplash.com/photo-1704428381485-fbdc84a7e58c?w=900&h=700&fit=crop&auto=format",
        alt: "יחידת מדפים מעץ ופלדה תעשייתית",
      },
      {
        id: "coffee",
        name: "שולחנות סלון",
        desc: "שולחן הסלון הוא מה שכולם רואים. אנחנו בונים שולחנות מעץ מלא ופלדה בכל גודל וצורה — מינימליסטיים, כבדים, עם אופי — בדיוק לפי מה שמתאים לחדר שלכם.",
        img: "https://images.unsplash.com/photo-1564644411733-d11b24daf95e?w=900&h=700&fit=crop&auto=format",
        alt: "שולחן קפה מאלון קצה חי",
      },
      {
        id: "desk",
        name: "שולחנות עבודה",
        desc: "צף או עומד. מותאם למרחב המדויק שלכם — ממשרד ביתי קטן ועד סטודיו שלם. בנוי לעמוד בעומס ולהיראות טוב יותר עם הזמן.",
        img: "https://images.unsplash.com/photo-1745635621480-6a258cc1b1a2?w=900&h=700&fit=crop&auto=format",
        alt: "שולחן עבודה מותאם אישית מעץ ופלדה",
      },
      {
        id: "bench",
        name: "ספסלים וישיבה",
        desc: "ספסלי כניסה, ספסלי פינת אוכל, ישיבות חלון. מסגרות פלדה, מושבי עץ — חזקים מספיק לשימוש יומיומי ויפים מספיק להתיישן בכבוד.",
        img: "https://images.unsplash.com/photo-1617638717732-a3ef01769ff2?w=900&h=700&fit=crop&auto=format",
        alt: "ספסל מעץ ופלדה",
      },
      {
        id: "custom",
        name: "פרויקטים מיוחדים",
        desc: "יש לכם רעיון שלא מתאים לאף קטגוריה? ספרו לנו.",
        img: "https://images.unsplash.com/photo-1631396326838-de37e5f8bcbc?w=900&h=700&fit=crop&auto=format",
        alt: "אומן עובד בסטודיו פינאה",
      },
    ],
    processSteps: [
      {
        num: "01",
        title: "ספרו לנו על הרעיון",
        body: "מלאו את טופס הבקשה למטה — או פשוט התקשרו. אין בריף שגס מדי. שרטוט, תמונת השראה, תחושה מעורפלת — כולם נקודות התחלה טובות. אנחנו קוראים כל פנייה באופן אישי.",
      },
      {
        num: "02",
        title: "מתכננים יחד",
        body: "אנחנו נפגשים פיזית או בוידאו, לוקחים מידות ומדברים על חומרים וגימורים. תוך 5 ימים תקבלו שרטוט טכני ומחיר קבוע — ללא הפתעות.",
      },
      {
        num: "03",
        title: "בונים ומספקים",
        body: "כל פריט נבנה מאפס בסדנה שלנו במרכז הארץ. זמן אספקה הוא 4–8 שבועות. אנחנו מספקים ומתקינים בכל רחבי הארץ.",
      },
    ],
  },
  en: {
    dir: "ltr" as const,
    nav: [
      { label: "Our Work", id: "work" },
      { label: "Process", id: "process" },
      { label: "About", id: "about" },
      { label: "Get a Quote", id: "quote" },
    ],
    navCta: "Request a Quote",
    heroBadge: "Custom Made in Israel · Wood & Steel",
    heroH1: ["Your Space.", "Your Piece.", "Built Once."],
    heroPrimary: "Your Piece.",
    heroBody: "Every piece we make is one of a kind — built from scratch around your exact space, your materials, and your vision. There is no catalogue. Only your commission.",
    heroBtn1: "Request a Quote",
    heroBtn2: "See Our Work",
    strip: "No two pieces are the same · Every commission starts from a blank page · Built by hand, start to finish",
    workLabel: "What We Make",
    workTitle: "Areas of Work",
    workSubtitle: "These are the kinds of pieces we are known for — not a fixed menu, but a starting point for a conversation about yours.",
    catLearnMore: "Learn more",
    catQuoteBtn: "Request a quote for this",
    workshopLabel: "The Workshop",
    workshopH2: ["Wood is shaped.", "Steel is welded.", "Nothing is outsourced."],
    workshopBtn: "Start Your Project",
    processLabel: "From Idea to Delivery",
    processTitle: "How a Commission Works",
    aboutLabel: "About the Studio",
    aboutTitle: ["About", "Pinea Studio"],
    aboutBody: [
      "Pinea Studio is a furniture and metalwork studio based in central Israel. After years in industrial fabrication, we turned our trade toward something more personal: furniture built around the people who use it.",
      "Because every piece is one of a kind, we take on a limited number of commissions each month. That is not a marketing line — it is how the work stays good. Every client gets our full attention from the first conversation to the day the piece lands in the room.",
      "Materials are sourced locally where possible — Israeli walnut, oak, pine, and reclaimed timber, paired with hot-rolled and cold-rolled steel worked in-house.",
    ],
    aboutBtn: "Commission Your Piece",
    quoteLabel: "Commission Enquiry",
    quoteTitle: ["Tell Us", "About Your", "Project"],
    quoteSubtitle: "No brief is too rough. A sketch, a photo reference, a vague idea — all welcome. We read every enquiry and respond within 24 hours to arrange a free consultation.",
    contacts: [
      { label: "Phone / WhatsApp", value: "050-000-0000" },
      { label: "Email", value: "oren@pineastudio.co.il" },
      { label: "Workshop", value: "Central Israel · Visits by appointment" },
      { label: "Instagram", value: "@pineastudio" },
    ],
    formName: "Name *",
    formNamePh: "Your name",
    formContact: "Phone or Email *",
    formContactPh: "How to reach you",
    formType: "Type of Piece",
    formTypePh: "Select a category",
    formTypeOpts: ["Dining Tables", "Shelving & Storage", "Coffee & Side Tables", "Desks & Workspaces", "Benches & Seating", "Something Else?"],
    formDesc: "About Your Project *",
    formDescPh: "Describe the piece — dimensions if you know them, materials you have in mind, the room it goes in, your timeline. The more you share, the better we can help.",
    formBudget: "Budget Range (optional)",
    formBudgetPh: "Prefer not to say",
    formBudgetOpts: ["Up to ₪5,000", "₪5,000 – ₪10,000", "₪10,000 – ₪20,000", "₪20,000+"],
    formBudgetNote: "Sharing a range helps us propose the right materials. It does not commit you to anything.",
    formSubmit: "Send Enquiry",
    formNote: "We respond personally within 24 hours. All enquiries are confidential.",
    formAlert: "Your enquiry has been sent. We will be in touch within 24 hours.",
    footerCopy: `© ${new Date().getFullYear()} Pinea Studio · Custom Wood & Steel Work · Made in Israel`,
    logoAlt: "Pinea Studio",
    categories: [
      {
        id: "dining",
        name: "Dining Tables",
        desc: "The centrepiece of your home. Solid wood slabs, live edges, or clean straight cuts — paired with steel legs designed around how you eat and gather.",
        img: "https://images.unsplash.com/photo-1698770531036-c627d35188f2?w=900&h=700&fit=crop&auto=format",
        alt: "Custom walnut dining table with steel legs",
      },
      {
        id: "shelving",
        name: "Shelving & Storage",
        desc: "Modular or fixed. Wall-mounted steel frames with timber shelves, or full floor-to-ceiling units — designed to fit your exact wall and what you put on it.",
        img: "https://images.unsplash.com/photo-1704428381485-fbdc84a7e58c?w=900&h=700&fit=crop&auto=format",
        alt: "Industrial wood and steel shelving unit",
      },
      {
        id: "coffee",
        name: "Coffee & Side Tables",
        desc: "Live edge slabs that keep the shape of the tree, or geometric steel-and-wood compositions. Every piece is a one-off — no two are the same.",
        img: "https://images.unsplash.com/photo-1564644411733-d11b24daf95e?w=900&h=700&fit=crop&auto=format",
        alt: "Live edge oak coffee table",
      },
      {
        id: "desk",
        name: "Desks & Workspaces",
        desc: "Floating or freestanding. Sized to your exact space — single-monitor setups to full home studios. Built to work hard and look better over time.",
        img: "https://images.unsplash.com/photo-1745635621480-6a258cc1b1a2?w=900&h=700&fit=crop&auto=format",
        alt: "Custom wood and steel desk",
      },
      {
        id: "bench",
        name: "Benches & Seating",
        desc: "Entry benches, dining benches, window seats. Steel frames, timber seats — durable enough to take a beating and honest enough to age well.",
        img: "https://images.unsplash.com/photo-1617638717732-a3ef01769ff2?w=900&h=700&fit=crop&auto=format",
        alt: "Wood and steel bench",
      },
      {
        id: "custom",
        name: "Something Else?",
        desc: "If you can sketch it, we can build it. Kitchen islands, room dividers, staircase railings, retail fixtures — bring us the idea and we will work out the rest.",
        img: "https://images.unsplash.com/photo-1631396326838-de37e5f8bcbc?w=900&h=700&fit=crop&auto=format",
        alt: "Craftsman at work in the Pinea Studio workshop",
      },
    ],
    processSteps: [
      {
        num: "01",
        title: "Tell Us Your Idea",
        body: "Fill in the quote form below — or just call. No brief is too rough. A sketch, a photo, a vague feeling — all good starting points. We review every enquiry personally.",
      },
      {
        num: "02",
        title: "We Design Together",
        body: "We meet in person or over video, take measurements, talk through materials and finishes. Within 5 days you get a technical drawing and a fixed price — no surprises.",
      },
      {
        num: "03",
        title: "We Build, We Deliver",
        body: "Every piece is made from scratch in our workshop in central Israel. Lead time is 4–8 weeks. We deliver and install anywhere in the country.",
      },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [overrides, setOverrides] = useState<{ he: any; en: any }>({ he: null, en: null });
  const isAdmin = window.location.search.includes("admin");

  const t = { ...TRANSLATIONS[lang], ...(overrides[lang] ?? {}) };
  const isRtl = lang === "he";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    fetchContent("he").then((c) => c && setOverrides((o) => ({ ...o, he: c })));
    fetchContent("en").then((c) => c && setOverrides((o) => ({ ...o, en: c })));
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openQuote = (categoryName?: string) => {
    scrollTo("quote");
    if (categoryName) {
      setTimeout(() => {
        const sel = document.getElementById("category-select") as HTMLSelectElement | null;
        if (sel) sel.value = categoryName;
      }, 600);
    }
  };

  const Arr = isRtl ? ArrowLeft : ArrowRight;
  const arrHover = isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1";
  const arrHoverBtn = isRtl ? "group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1";

  if (isAdmin) {
    return (
      <Admin
        defaults={TRANSLATIONS}
        onSaved={(lang, content) => setOverrides((o) => ({ ...o, [lang]: content }))}
      />
    );
  }

  return (
    <div
      dir={t.dir}
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif" }}
    >
      {/* ── NAV ── */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(15,15,13,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(240,234,224,0.08)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("hero")}>
            <img src={isRtl ? pineaLogoHe : pineaLogo} alt={t.logoAlt} className="h-9 w-auto object-contain brightness-0 invert" />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {t.nav.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="tracking-wide text-foreground/60 hover:text-foreground transition-colors duration-200 text-[20px]"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500 }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-[20px]"
              onClick={() => openQuote()}
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, letterSpacing: "0.05em" }}
            >
              {t.navCta}
            </button>
            <button
              onClick={() => { setLang(lang === "he" ? "en" : "he"); setActiveCat(null); }}
              className="px-3 py-1.5 border border-foreground/20 text-foreground/50 hover:border-primary hover:text-primary transition-all duration-200 tracking-widest"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 600, fontSize: "20px" }}
            >
              {lang === "he" ? "EN" : "עב"}
            </button>
          </div>

          <button className="md:hidden text-foreground/80 hover:text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-6 py-6 flex flex-col gap-5">
            {t.nav.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-xl text-foreground/70 hover:text-foreground transition-colors"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 600, textAlign: isRtl ? "right" : "left" }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { setLang(lang === "he" ? "en" : "he"); setMenuOpen(false); }}
              className="self-start px-3 py-1.5 border border-foreground/20 text-foreground/50 text-xs tracking-widest"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 600 }}
            >
              {lang === "he" ? "EN" : "עב"}
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-end pb-24 overflow-hidden pt-10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1547609434-b732edfee020?w=1800&h=1100&fit=crop&auto=format"
            alt={t.logoAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0F0F0D 0%, rgba(15,15,13,0.6) 50%, rgba(15,15,13,0.25) 100%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full mt-[80px]">
          <div className="max-w-3xl">
            <p
              className="text-primary tracking-wide uppercase text-[36px] m-[0px]"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500 }}
            >
              {t.heroBadge}
            </p>
            <h1
              className="text-foreground leading-none mb-6"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "clamp(5rem, 10vw, 7rem)", letterSpacing: "0" }}
            >
              {t.heroH1[0]}<br />
              <span className="text-primary">{t.heroH1[1]}</span><br />
              {t.heroH1[2]}
            </h1>
            <p className="text-foreground/55 text-lg max-w-xl mb-10 leading-relaxed font-normal">
              {t.heroBody}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openQuote()}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 group"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "20px", letterSpacing: "0.08em" }}
              >
                {t.heroBtn1}
                <Arr size={16} className={`${arrHover} transition-transform`} />
              </button>
              <button
                onClick={() => scrollTo("work")}
                className="flex items-center gap-3 px-8 py-4 border border-foreground/25 text-foreground/65 hover:border-foreground/50 hover:text-foreground transition-all duration-200"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 600, fontSize: "20px", letterSpacing: "0.08em" }}
              >
                {t.heroBtn2}
              </button>
            </div>
          </div>
          <div className="mt-20 flex items-center gap-3 text-foreground/25">
            <div className="w-8 h-px bg-foreground/25" />
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── STATEMENT STRIP ── */}
      <section className="border-y border-border bg-secondary py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-center text-foreground/50 tracking-wide"
            style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500, fontSize: "28px" }}
          >
            {t.strip}
          </p>
        </div>
      </section>

      {/* ── OUR WORK / CATEGORIES ── */}
      <section id="work" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p
                className="text-primary tracking-wide uppercase mb-3 text-[20px]"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500 }}
              >
                {t.workLabel}
              </p>
              <h2
                className="text-foreground leading-none"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                {t.workTitle}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed font-light text-sm">
              {t.workSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {t.categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-background group relative overflow-hidden cursor-pointer"
                onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-muted">
                  <img
                    src={cat.img}
                    alt={cat.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(15,15,13,0.85) 0%, rgba(15,15,13,0.2) 60%, transparent 100%)" }}
                  />
                  <div className="absolute bottom-0 right-0 left-0 p-6">
                    <h3
                      className="text-foreground"
                      style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.6rem" }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ maxHeight: activeCat === cat.id ? "240px" : "0px" }}
                >
                  <div className="p-6 border-t border-border bg-card">
                    <p className="text-foreground/60 leading-relaxed font-light text-sm mb-5">
                      {cat.desc}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); openQuote(cat.name); }}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group/btn"
                      style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.08em" }}
                    >
                      <Arr size={14} className={`${arrHoverBtn} transition-transform`} />
                      {t.catQuoteBtn}
                    </button>
                  </div>
                </div>

                {activeCat !== cat.id && (
                  <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-background">
                    <span
                      className="text-muted-foreground text-xs tracking-wide"
                      style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}
                    >
                      {t.catLearnMore}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKSHOP INTERLUDE ── */}
      <section className="relative h-72 md:h-[28rem] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506599667882-385dd6673353?w=1800&h=700&fit=crop&auto=format"
          alt="Welding steel in the Pinea Studio workshop"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: isRtl ? "linear-gradient(to left, rgba(15,15,13,0.88) 0%, rgba(15,15,13,0.25) 100%)" : "linear-gradient(to right, rgba(15,15,13,0.88) 0%, rgba(15,15,13,0.25) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-start">
            <div className="max-w-lg">
              <p
                className="text-primary tracking-wide uppercase text-[20px] m-[0px]"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500 }}
              >
                {t.workshopLabel}
              </p>
              <h2
                className="text-foreground mb-6"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 800, fontSize: "48px", lineHeight: 1.05 }}
              >
                {t.workshopH2[0]}<br />{t.workshopH2[1]}<br />{t.workshopH2[2]}
              </h2>
              <button
                onClick={() => openQuote()}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 group"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "20px", letterSpacing: "0.08em" }}
              >
                {t.workshopBtn}
                <Arr size={15} className={`${arrHover} transition-transform`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="py-28 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p
              className="text-primary tracking-wide uppercase mb-0"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500, fontSize: "20px" }}
            >
              {t.processLabel}
            </p>
            <h2
              className="text-foreground"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              {t.processTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {t.processSteps.map((step) => (
              <div key={step.num} className="bg-secondary p-10">
                <div
                  className="text-primary mb-8"
                  style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 800, fontSize: "4rem", lineHeight: 1 }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-foreground mb-0"
                  style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "1.5rem" }}
                >
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1631396326646-c06a935ff3a6?w=900&h=1200&fit=crop&auto=format"
                  alt="Oren working in the Pinea Studio workshop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <p
                className="text-primary tracking-wide uppercase mb-4"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500, fontSize: "20px" }}
              >
                {t.aboutLabel}
              </p>
              <h2
                className="text-foreground mb-8 leading-none"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
              >
                {t.aboutTitle[0]}<br />{t.aboutTitle[1]}
              </h2>
              <div className="space-y-5 text-foreground/60 leading-relaxed font-light">
                {t.aboutBody.map((para, i) => <p key={i} className="mx-[32px] mt-[30px] mb-[0px]">{para}</p>)}
              </div>

              <div className="mt-10 pt-10 border-t border-border">
                <button
                  onClick={() => openQuote()}
                  className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 group"
                  style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "20px", letterSpacing: "0.08em" }}
                >
                  {t.aboutBtn}
                  <Arr size={15} className={`${arrHover} transition-transform`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="quote" className="py-28 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <p
                className="text-primary tracking-wide uppercase mb-4"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500, fontSize: "20px" }}
              >
                {t.quoteLabel}
              </p>
              <h2
                className="text-foreground mb-6 leading-none"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
              >
                {t.quoteTitle[0]}<br />{t.quoteTitle[1]}<br />{t.quoteTitle[2]}
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-sm mb-10">
                {t.quoteSubtitle}
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Phone size={15} />, ...t.contacts[0] },
                  { icon: <Mail size={15} />, ...t.contacts[1] },
                  { icon: <MapPin size={15} />, ...t.contacts[2] },
                  { icon: <Instagram size={15} />, ...t.contacts[3] },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">{icon}</div>
                    <div>
                      <div className="text-muted-foreground text-xs tracking-wide uppercase mb-0.5"
                        style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}>{label}</div>
                      <div className="text-foreground font-light text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form
              className="lg:col-span-3 space-y-5"
              onSubmit={(e) => { e.preventDefault(); alert(t.formAlert); }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2"
                    style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}>
                    {t.formName}
                  </label>
                  <input type="text" required placeholder={t.formNamePh}
                    className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2"
                    style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}>
                    {t.formContact}
                  </label>
                  <input type="text" required placeholder={t.formContactPh}
                    className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2"
                  style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}>
                  {t.formType}
                </label>
                <div className="relative">
                  <select id="category-select"
                    className="w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none pr-4 pl-10">
                    <option value="">{t.formTypePh}</option>
                    {t.formTypeOpts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2"
                  style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}>
                  {t.formDesc}
                </label>
                <textarea required rows={5} placeholder={t.formDescPh}
                  className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground/50 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-2"
                  style={{ fontFamily: "'Liebling', 'DM Sans', sans-serif", fontWeight: 700 }}>
                  {t.formBudget}
                </label>
                <div className="relative">
                  <select className="w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none pr-4 pl-10">
                    <option value="">{t.formBudgetPh}</option>
                    {t.formBudgetOpts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <p className="text-muted-foreground text-xs mt-2 font-light">{t.formBudgetNote}</p>
              </div>

              <button type="submit"
                className="w-full py-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-3 group"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em" }}>
                {t.formSubmit}
                <Arr size={16} className={`${arrHover} transition-transform`} />
              </button>

              <p className="text-muted-foreground text-xs text-center font-light">{t.formNote}</p>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={isRtl ? pineaLogoHe : pineaLogo} alt={t.logoAlt} className="h-8 w-auto object-contain brightness-0 invert opacity-60" />
          <p className="text-muted-foreground text-xs tracking-wide text-center">{t.footerCopy}</p>
          <div className="flex gap-6">
            {t.nav.map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-muted-foreground hover:text-foreground text-xs tracking-wide transition-colors"
                style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 500 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
