import { useEffect, useLayoutEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";
import { gsap, SplitText } from "@/app/lib/gsap";
import { onAppReady } from "@/app/lib/appReady";

/** Flattens a ReactNode tree down to its plain text, so we can tell whether
 * the actual displayed words changed (e.g. a language toggle) as opposed to
 * an unrelated parent re-render that recreates the same JSX with identical
 * text — the latter must NOT re-trigger the split/reveal, or every scroll
 * or menu toggle would make headings flicker and re-animate. */
function textKeyOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textKeyOf).join("|");
  if (typeof node === "object" && "props" in (node as any)) {
    return textKeyOf((node as any).props?.children);
  }
  return "";
}

type SplitHeadingProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
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
  const textKey = textKeyOf(children);

  useLayoutEffect(() => {
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
  }, [type, textKey]);

  useEffect(() => {
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
              start: "top 88%",
              end: "top 55%",
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
              start: "top 88%",
              end: "top 55%",
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
  }, [type, stagger, delay, textKey]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
