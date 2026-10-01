import { useEffect, useRef, useState } from "react";
import pineaLogo from "@/imports/Asset_9_4x.png";
import pineaLogoHe from "@/imports/Asset_8_4x.png";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import { useSmoothScroll } from "@/app/hooks/useSmoothScroll";

type Lang = "he" | "en";

type Props = {
  t: any;
  lang: Lang;
  isRtl: boolean;
};

/**
 * An experimental alternate homepage (reached via ?v2), trying two motion
 * patterns borrowed from a reference site the user liked:
 *
 * 1. Hero "text -> image" expansion: a small inline photo grows to fill the
 *    entire viewport as the visitor makes their first scroll, while the
 *    headline drifts away.
 *
 * 2. A pinned section: the heading and body copy stay fixed in place while
 *    an image collage (a large photo + a smaller overlapping one) cycles
 *    through several pairs as the visitor scrolls through a tall spacer.
 *
 * This intentionally keeps Pinea's own palette, type (Karantina/DM Sans)
 * and photography -- only the motion is borrowed.
 */
export default function ExperimentV2({ t, lang, isRtl }: Props) {
  useSmoothScroll(true);

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroImgWrapRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const pinSectionRef = useRef<HTMLDivElement>(null);
  const collageRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [activeCollage, setActiveCollage] = useState(0);

  const collageFrames = t.categories.slice(0, 4);

  useEffect(() => {
    const section = heroSectionRef.current;
    const imgWrap = heroImgWrapRef.current;
    const text = heroTextRef.current;
    if (!section || !imgWrap || !text) return;

    const ctx = gsap.context(() => {
      gsap.set(imgWrap, {
        width: "34vw",
        height: "42vh",
        borderRadius: 4,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
        },
      });

      tl.to(
        imgWrap,
        {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "power1.inOut",
        },
        0
      ).to(
        text,
        {
          yPercent: isRtl ? 8 : -8,
          opacity: 0,
          ease: "power1.in",
        },
        0.05
      );
    });

    return () => ctx.revert();
  }, [isRtl]);

  useEffect(() => {
    const section = pinSectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const frames = collageRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!frames.length) return;

      gsap.set(frames, { opacity: 0 });
      gsap.set(frames[0], { opacity: 1 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${frames.length * 90}%`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const idx = Math.min(
            frames.length - 1,
            Math.floor(self.progress * frames.length)
          );
          setActiveCollage((prev) => {
            if (prev === idx) return prev;
            gsap.to(frames[prev], { opacity: 0, duration: 0.4, ease: "power1.out" });
            gsap.to(frames[idx], { opacity: 1, duration: 0.4, ease: "power1.out" });
            return idx;
          });
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div dir={t.dir} className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 inset-x-0 z-50 py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <img
            src={isRtl ? pineaLogoHe : pineaLogo}
            alt={t.logoAlt}
            className="h-8 w-auto object-contain brightness-0 invert"
          />
          <span
            className="text-xs tracking-[0.2em] uppercase text-foreground/50"
            style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 400 }}
          >
            {lang === "he" ? "גרסת ניסוי · V2" : "Experimental · V2"}
          </span>
        </div>
      </header>

      <section ref={heroSectionRef} className="relative h-screen overflow-hidden flex items-center justify-center">
        <div ref={heroTextRef} className="relative z-10 text-center px-6 max-w-2xl">
          <p
            className="text-primary tracking-wide uppercase text-sm mb-4"
            style={{ fontFamily: "'Karantina', sans-serif" }}
          >
            {t.heroBadge}
          </p>
          <h1
            className="text-foreground leading-[1.05] mb-2"
            style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            {t.heroH1[0]} {t.heroH1[1]}
          </h1>
          <p className="text-foreground/50 text-sm mt-4">
            {lang === "he" ? "גללו כדי להתחיל" : "Scroll to begin"}
          </p>
        </div>
        <div
          ref={heroImgWrapRef}
          className="absolute overflow-hidden"
          style={{ willChange: "width, height", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <img
            src={t.heroImage}
            alt={t.logoAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "rgba(15,15,13,0.35)" }} />
        </div>
      </section>

      <section ref={pinSectionRef} className="relative h-screen overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-6 h-full grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div>
            <p
              className="text-primary tracking-wide uppercase text-sm mb-4"
              style={{ fontFamily: "'Karantina', sans-serif" }}
            >
              {t.workshopLabel}
            </p>
            <h2
              className="text-foreground mb-6"
              style={{ fontFamily: "'Karantina', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.1 }}
            >
              {collageFrames[activeCollage]?.name}
            </h2>
            <p className="text-foreground/55 text-base leading-relaxed max-w-md">
              {collageFrames[activeCollage]?.desc}
            </p>
            <div className="flex gap-2 mt-8">
              {collageFrames.map((_: any, i: number) => (
                <div
                  key={i}
                  className="h-[3px] rounded-full transition-all duration-300"
                  style={{
                    width: i === activeCollage ? 28 : 14,
                    background: i === activeCollage ? "var(--primary)" : "rgba(240,234,224,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative h-[60vh] hidden md:block">
            {collageFrames.map((cat: any, i: number) => (
              <div
                key={cat.id}
                ref={(el) => (collageRefs.current[i] = el)}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 rounded-sm overflow-hidden">
                  <img src={cat.img} alt={cat.alt} className="w-full h-full object-cover" />
                </div>
                <div
                  className="absolute rounded-sm overflow-hidden border-4 border-background shadow-2xl"
                  style={{
                    width: "42%",
                    height: "38%",
                    bottom: "-8%",
                    [isRtl ? "right" : "left"]: "-8%",
                  }}
                >
                  <img
                    src={collageFrames[(i + 1) % collageFrames.length]?.img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 text-center px-6">
        <p
          className="text-foreground/60 max-w-md mx-auto"
          style={{ fontFamily: "'Karantina', sans-serif", fontSize: "20px" }}
        >
          {lang === "he"
            ? "זהו סוף גרסת הניסוי — שני האפקטים שביקשת, על גבי התוכן והעיצוב האמיתיים של פינאה."
            : "End of the experiment -- both effects, using Pinea's real content and branding."}
        </p>
      </section>
    </div>
  );
}
