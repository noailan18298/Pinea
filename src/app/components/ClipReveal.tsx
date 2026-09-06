import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";
import { onAppReady } from "@/app/lib/appReady";

type ClipRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  insetFrom?: number;
  scaleFrom?: number;
  parallax?: number;
};

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
  }, [parallax]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`} style={{ willChange: "clip-path" }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
