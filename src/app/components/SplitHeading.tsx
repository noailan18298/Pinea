import { useEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";
import { gsap, SplitText } from "@/app/lib/gsap";

type SplitHeadingProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** Split by "lines" (default, safest with nested markup) or "words". */
  type?: "lines" | "words";
  stagger?: number;
  delay?: number;
};

export default function SplitHeading({
  children,
  className = "",
  style,
  as: Tag = "h2",
  type = "lines",
  stagger = 0.14,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        type,
        linesClass: "split-line",
        wordsClass: "split-word",
      });

      const targets = type === "lines" ? split.lines : split.words;

      gsap.fromTo(
        targets,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          delay,
          stagger,
          ease: "pineaEase",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, stagger, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
