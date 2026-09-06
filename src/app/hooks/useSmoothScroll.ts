import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Sets up buttery smooth scrolling (Lenis) and keeps GSAP's ScrollTrigger
 * in sync with it, so scroll-linked animations track the smoothed scroll
 * position rather than the raw, stuttery native one.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Respect users who've asked for less motion.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
}

/** Smoothly scroll to an element by id, using Lenis when available. */
export function smoothScrollToId(id: string, offset = -64) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
