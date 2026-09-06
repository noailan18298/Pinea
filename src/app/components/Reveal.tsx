import { useEffect, useLayoutEffect, useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react";
import { gsap } from "@/app/lib/gsap";
import { onAppReady } from "@/app/lib/appReady";

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
};

type RevealProps = RevealOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof RevealOwnProps>;

export default function Reveal({
  children,
  className = "",
  y = 0,
  scale = 0.97,
  delay = 0,
  duration = 1.1,
  as: Tag = "div",
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Hide the element BEFORE the browser paints anything — otherwise it
  // sits fully visible under the preloader curtain, and the "reveal"
  // animation ends up flickering instead of fading in.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    gsap.set(el, { opacity: 0, y, scale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (cancelled || !ref.current) return;
      const el = ref.current;

      // Content already sitting in view when the page loads (e.g. the Hero)
      // gets a one-time, gently-timed entrance — there's no "scroll up" to
      // react to since it's already at the very top of the page. Everything
      // else is tied directly to scroll position, in both directions, so
      // scrolling up even a little immediately starts reversing it.
      const alreadyInView = el.getBoundingClientRect().top < window.innerHeight * 0.85;

      ctx = gsap.context(() => {
        if (alreadyInView) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration,
            delay,
            ease: "power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none play reverse",
            },
          });
        } else {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 50%",
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
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
