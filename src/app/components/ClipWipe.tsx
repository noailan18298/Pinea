import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/app/lib/gsap";

type ClipWipeProps = {
  children: ReactNode;
  className?: string;
  /** Direction the mask opens from. */
  from?: "top" | "bottom" | "left" | "right";
};

/**
 * A lighter sibling of ClipReveal: wraps arbitrary content (not just an
 * <img>) and reveals it with a directional clip-path wipe on scroll-in,
 * without ever touching the child's own transform — safe to put around
 * cards, grid items, or anything that already has its own hover/zoom
 * animation on the element inside.
 */
export default function ClipWipe({ children, className = "", from = "bottom" }: ClipWipeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const hidden =
      from === "bottom"
        ? "inset(0% 0% 100% 0%)"
        : from === "top"
        ? "inset(100% 0% 0% 0%)"
        : from === "left"
        ? "inset(0% 100% 0% 0%)"
        : "inset(0% 0% 0% 100%)";

    gsap.set(el, { clipPath: hidden });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "pineaOut",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 55%",
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      {children}
    </div>
  );
}
