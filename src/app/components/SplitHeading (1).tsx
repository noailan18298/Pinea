import { useEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";
import { gsap, SplitText } from "@/app/lib/gsap";

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
        charsClass: "split-char",
      });

      const targets =
        type === "chars" ? split.chars : type === "lines" ? split.lines : split.words;

      if (type === "chars") {
        // Reference-site technique: characters fade in, in random order,
        // with no vertical movement or scale — a subtle shimmer.
        gsap.fromTo(
          targets,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            delay,
            ease: "power1.out",
            stagger: { amount: stagger ?? 0.6, from: "random" },
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else {
        gsap.fromTo(
          targets,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            delay,
            stagger: stagger ?? 0.14,
            ease: "pineaEase",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
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
