import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";
import { onAppReady } from "@/app/lib/appReady";
import LazyImage from "@/app/components/LazyImage";

type ClipRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /**
   * How tightly the frame is "cropped" before it opens, in percent per side
   * (e.g. 16 = inset(16% 16% 16% 16%) at rest). Set to 0 to disable the
   * clip-path reveal and use only the zoom.
   */
  insetFrom?: number;
  /** Starting zoom the image shrinks in from as the mask opens. */
  scaleFrom?: number;
  /**
   * Independent parallax distance in px for this layer — pass a different
   * value per image in the same block to create depth (closer layers move
   * further). 0 disables parallax.
   */
  parallax?: number;
};

/**
 * The site's signature image treatment: the frame is clipped in on load and
 * opens up as the user scrolls past it (clip-path driven by scroll
 * progress, not a one-shot fade), while the image itself starts slightly
 * zoomed in and settles to 1 so no empty edges show as the mask opens.
 * Optionally also drifts independently on a slower/faster parallax track.
 */
export default function ClipReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
  insetFrom = 14,
  scaleFrom = 1.12,
  parallax = 0,
}: ClipRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.set(wrap, {
      clipPath: `inset(${insetFrom}% ${insetFrom}% ${insetFrom}% ${insetFrom}%)`,
    });
    gsap.set(img, { scale: scaleFrom, y: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    onAppReady(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        // The mask opens and the zoom settles once, on the way in — this
        // is the "reveal", scrubbed against a short scroll window right
        // as the block enters view.
        gsap.to(wrap, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "pineaOut",
          scrollTrigger: {
            trigger: wrap,
            start: "top 88%",
            end: "top 35%",
            scrub: 0.6,
          },
        });
        gsap.to(img, {
          scale: 1,
          ease: "pineaOut",
          scrollTrigger: {
            trigger: wrap,
            start: "top 88%",
            end: "top 35%",
            scrub: 0.6,
          },
        });

        // A separate, independent drift that runs for as long as the
        // block is anywhere in the viewport — this is what creates depth
        // when several ClipReveal layers with different `parallax` values
        // sit near each other.
        if (parallax) {
          gsap.fromTo(
            img,
            { y: -parallax / 2 },
            {
              y: parallax / 2,
              ease: "none",
              scrollTrigger: {
                trigger: wrap,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        }
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parallax]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`} style={{ willChange: "clip-path" }}>
      <LazyImage
        ref={imgRef}
        src={src}
        alt={alt}
        containerClassName="w-full h-full"
        className={`w-full h-full object-cover ${imgClassName}`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
