import { useEffect, useLayoutEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";
import { gsap, SplitText } from "@/app/lib/gsap";
import { onAppReady } from "@/app/lib/appReady";
import { useSlideMode } from "@/app/lib/slideMode";

type SplitHeadingProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** "chars" (default) mimics the reference site: characters fade in, in random
   * order, no movement or scale — just a subtle shimmer. "lines"/"words" fall
   * back to a gentler grow+fade, useful for very long paragraphs. */
  type?: "chars" | "lines" | "words";
  stagger?: number;
  delay?: number;
};

export default function SplitHeading({
  children,
  className = "",
  style,
  as: Tag = "h2",
  type = "lines",
  stagger,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const targetsRef = useRef<Element[]>([]);
  const slideMode = useSlideMode();

  // Inside a slide-based layout, the Slide wrapper itself handles the
  // fade-in for the whole slide as one unit — skip splitting/hiding text
  // entirely and just render it normally.
  useLayoutEffect(() => {
    if (slideMode) return;
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const split = new SplitText(el, {
      type,
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
    });
    splitRef.current = split;

    const targets =
      type === "chars" ? split.chars : type === "lines" ? split.lines : split.words;
    targetsRef.current = targets;

    if (type === "chars") {
      gsap.set(targets, { opacity: 0 });
    } else {
      gsap.set(targets, { opacity: 0, scale: 0.97 });
    }

    return () => {
      split.revert();
      splitRef.current = null;
      targetsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (slideMode) return;
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    onAppReady(() => {
      if (cancelled || !ref.current || !targetsRef.current.length) return;
      const el = ref.current;
      const targets = targetsRef.current;

      // Same rule as Reveal: headings already on screen at load (e.g. the
      // Hero) get a one-time, gently-timed entrance. Everything else is
      // tied directly to scroll position in both directions, so scrolling
      // up even a little immediately starts reversing it.
      const alreadyInView = el.getBoundingClientRect().top < window.innerHeight * 0.88;

      ctx = gsap.context(() => {
        if (alreadyInView) {
          if (type === "chars") {
            gsap.to(targets, {
              opacity: 1,
              duration: 1,
              delay,
              ease: "power1.out",
              stagger: { amount: stagger ?? 0.6, from: "random" },
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none play reverse",
              },
            });
          } else {
            gsap.to(targets, {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              delay,
              stagger: stagger ?? 0.12,
              ease: "power1.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none play reverse",
              },
            });
          }
        } else if (type === "chars") {
          gsap.to(targets, {
            opacity: 1,
            ease: "none",
            stagger: { amount: stagger ?? 0.6, from: "random" },
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "center center",
              scrub: 0.4,
            },
          });
        } else {
          gsap.to(targets, {
            opacity: 1,
            scale: 1,
            ease: "none",
            stagger: stagger ?? 0.12,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "center center",
              scrub: 0.4,
            },
          });
        }
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, stagger, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
