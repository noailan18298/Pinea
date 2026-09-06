import { useCallback, useEffect, useRef, useState } from "react";
import type { SlideCurtainHandle } from "@/app/components/SlideCurtain";

const WHEEL_THRESHOLD = 12;
const TOUCH_THRESHOLD = 40;

export function useSlideNav(slideCount: number, curtainRef: React.RefObject<SlideCurtainHandle | null>) {
  const [index, setIndex] = useState(0);
  const lockRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const registerSlide = useCallback((i: number) => (el: HTMLDivElement | null) => {
    slideRefs.current[i] = el;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (lockRef.current) return;
      const clamped = Math.max(0, Math.min(slideCount - 1, next));
      if (clamped === index) return;

      lockRef.current = true;
      const curtain = curtainRef.current;
      if (curtain) {
        curtain.transition(() => setIndex(clamped)).then(() => {
          lockRef.current = false;
        });
      } else {
        setIndex(clamped);
        lockRef.current = false;
      }
    },
    [index, slideCount, curtainRef]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const isAtEdge = (dir: 1 | -1) => {
      const el = slideRefs.current[index];
      if (!el) return true;
      const atTop = el.scrollTop <= 1;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      return dir === 1 ? atBottom : atTop;
    };

    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) {
        e.preventDefault();
        return;
      }
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      if (!isAtEdge(dir)) {
        // Let the slide scroll internally — driven manually since our
        // listener is window-level and the browser's own default scroll
        // only kicks in if the pointer happens to be over the scrollable
        // element itself.
        const el = slideRefs.current[index];
        if (el) el.scrollTop += e.deltaY;
        return;
      }
      dir === 1 ? next() : prev();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || lockRef.current) return;
      const dy = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      if (!isAtEdge(dir)) return;
      e.preventDefault();
      touchStartY.current = e.touches[0].clientY;
      dir === 1 ? next() : prev();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [index, next, prev]);

  return { index, goTo, next, prev, registerSlide };
}
