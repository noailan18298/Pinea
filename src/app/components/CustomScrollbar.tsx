import { useEffect, useRef } from "react";

/**
 * A slim custom scrollbar on the edge of the viewport, replacing the
 * native OS scrollbar. The thumb's height reflects how much of the page
 * is visible, and its position tracks scroll progress in real time — it
 * reads the same global `--pg` custom property the rest of the motion
 * system uses, so it's always in sync with Lenis, no matter what else is
 * animating.
 */
export default function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const update = () => {
      const trackHeight = track.clientHeight;
      const doc = document.documentElement;
      const viewport = window.innerHeight;
      const scrollable = doc.scrollHeight - viewport;
      const visibleRatio = scrollable > 0 ? viewport / doc.scrollHeight : 1;
      const thumbHeight = Math.max(trackHeight * visibleRatio, 32);

      const pg = parseFloat(
        getComputedStyle(doc).getPropertyValue("--pg") || "0"
      );
      const maxThumbTravel = trackHeight - thumbHeight;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${pg * maxThumbTravel}px)`;
    };

    update();
    window.addEventListener("resize", update);
    // --pg changes on every Lenis scroll tick; a rAF loop is cheap and
    // keeps this perfectly in sync without adding another scroll listener.
    let raf = requestAnimationFrame(function loop() {
      update();
      raf = requestAnimationFrame(loop);
    });

    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="fixed top-0 bottom-0 z-[60] hidden md:block"
      style={{ insetInlineEnd: 6, width: 4 }}
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className="absolute top-0 rounded-full"
        style={{
          width: 4,
          left: 0,
          background: "rgba(240,234,224,0.35)",
          transition: "background 0.2s ease, width 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(240,234,224,0.6)";
          e.currentTarget.style.width = "6px";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(240,234,224,0.35)";
          e.currentTarget.style.width = "4px";
        }}
      />
    </div>
  );
}
