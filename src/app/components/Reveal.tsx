import { useEffect, useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react";
import { gsap } from "@/app/lib/gsap";

type RevealOwnProps = {
  children: ReactNode;
  className?: string;
  /** Pixels to travel on the way in (0 = no slide, just fade+grow). */
  y?: number;
  /** Starting scale — the element grows from this to 1 as it reveals. */
  scale?: number;
  /** Stagger delay in seconds — pass index * 0.08 for grouped items. */
  delay?: number;
  duration?: number;
  /** Element tag to render as (defaults to div). */
  as?: ElementType;
  /** Scrub the animation to scroll position instead of a one-shot play. */
  scrub?: boolean;
};

type RevealProps = RevealOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof RevealOwnProps>;

export default function Reveal({
  children,
  className = "",
  y = 0,
  scale = 0.98,
  delay = 0,
  duration = 0.9,
  as: Tag = "div",
  scrub = false,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, scale },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay: scrub ? 0 : delay,
          ease: "pineaEase",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            ...(scrub
              ? { end: "top 45%", scrub: 0.6 }
              : { toggleActions: "play none none reverse" }),
          },
        }
      );
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
