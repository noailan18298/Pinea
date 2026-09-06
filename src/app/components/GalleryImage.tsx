import { useEffect, useRef, useState } from "react";

type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function GalleryImage({ src, alt, className = "" }: GalleryImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    // root: null checks against the actual browser viewport rather than any
    // particular scroll container — which is exactly right here, since each
    // Slide fills the viewport and scrolls internally.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden bg-muted ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.12)",
          transition: "opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}
