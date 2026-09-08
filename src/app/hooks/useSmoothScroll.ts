import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Publish a single, global scroll-progress value (0 → 1 across the
    // whole document) as a CSS custom property. Any element, anywhere in
    // the stylesheet, can read var(--pg) — this is what the custom
    // scrollbar reads, and what future effects (hover links, mosaics,
    // per-section progress bars) can hook into without each needing their
    // own scroll listener.
    const updatePg = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pg = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--pg", pg.toFixed(4));
    };
    lenis.on("scroll", updatePg);
    updatePg();

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
