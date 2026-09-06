import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "@/app/lib/gsap";

export type SlideCurtainHandle = {
  /**
   * Plays the curtain closed (covering the screen), calls `onCovered` while
   * fully covered (the right moment to swap which slide is visible), then
   * plays the curtain back open. Resolves once fully open again.
   */
  transition: (onCovered: () => void) => Promise<void>;
};

type SlideCurtainProps = {
  logoSrc: string;
  logoAlt: string;
};

const SlideCurtain = forwardRef<SlideCurtainHandle, SlideCurtainProps>(
  function SlideCurtain({ logoSrc, logoAlt }, ref) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(ref, () => ({
      transition(onCovered: () => void) {
        return new Promise<void>((resolve) => {
          const overlay = overlayRef.current;
          const logo = logoRef.current;
          if (!overlay || !logo) {
            onCovered();
            resolve();
            return;
          }

          const tl = gsap.timeline({ onComplete: resolve });

          // Close: curtain rises up from the bottom to cover the screen.
          tl.set(overlay, { yPercent: 100, autoAlpha: 1 })
            .to(overlay, { yPercent: 0, duration: 0.55, ease: "power2.inOut" })
            .fromTo(
              logo,
              { opacity: 0, scale: 0.92 },
              { opacity: 1, scale: 1, duration: 0.35, ease: "power1.out" }
            )
            .add(() => onCovered())
            .to(logo, { opacity: 0, duration: 0.25 }, "+=0.15")
            // Open: curtain continues upward, off the top of the screen.
            .to(overlay, { yPercent: -100, duration: 0.55, ease: "power2.inOut" })
            .set(overlay, { autoAlpha: 0, yPercent: 100 });
        });
      },
    }));

    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        style={{ background: "#0F0F0D", opacity: 0 }}
      >
        <img
          ref={logoRef}
          src={logoSrc}
          alt={logoAlt}
          className="h-11 w-auto object-contain brightness-0 invert"
          style={{ opacity: 0 }}
        />
      </div>
    );
  }
);

export default SlideCurtain;
