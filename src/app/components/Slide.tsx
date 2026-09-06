import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/app/lib/gsap";
import { onAppReady } from "@/app/lib/appReady";

type SlideProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  innerRef?: (el: HTMLDivElement | null) => void;
};

export default function Slide({ active, children, className = "", innerRef }: SlideProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (active && !wasActive.current) {
      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      } else {
        // Wait for the preloader curtain to fully finish before playing —
        // otherwise this (the Hero, active from the very first render)
        // finishes animating while still hidden behind the loading screen.
        onAppReady(() => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.15, ease: "power1.out" }
          );
        });
      }
    }
    wasActive.current = active;
  }, [active]);

  return (
    <div
      ref={innerRef}
      className={`absolute inset-0 overflow-y-auto ${className}`}
      style={{
        visibility: active ? "visible" : "hidden",
        pointerEvents: active ? "auto" : "none",
      }}
      aria-hidden={!active}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
