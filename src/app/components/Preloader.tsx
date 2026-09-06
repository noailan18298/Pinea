import { useEffect, useRef, useState } from "react";
import { gsap } from "@/app/lib/gsap";

type PreloaderProps = {
  logoSrc: string;
  logoAlt: string;
  onDone?: () => void;
};

export default function Preloader({ logoSrc, logoAlt, onDone }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finish = () => {
      document.body.style.overflow = "";
      setHidden(true);
      onDone?.();
    };

    if (prefersReducedMotion) {
      finish();
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({ onComplete: finish });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "pineaEase" }
    )
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.inOut" },
        "-=0.25"
      )
      .to(logoRef.current, { opacity: 0, duration: 0.35 }, "+=0.2")
      .to(barTrackRef.current, { opacity: 0, duration: 0.25 }, "<")
      .to(
        overlayRef.current,
        { yPercent: -100, duration: 0.85, ease: "pineaEase" },
        "-=0.05"
      );

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
      style={{ background: "#0F0F0D" }}
    >
      <img
        ref={logoRef}
        src={logoSrc}
        alt={logoAlt}
        className="h-12 w-auto object-contain brightness-0 invert"
        style={{ opacity: 0 }}
      />
      <div
        ref={barTrackRef}
        className="w-40 h-px overflow-hidden"
        style={{ background: "rgba(240,234,224,0.15)" }}
      >
        <div
          ref={barRef}
          className="h-full bg-primary"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />
      </div>
    </div>
  );
}
