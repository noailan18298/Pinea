import { type ReactNode } from "react";

type HoverLinkProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
  /** Color the circle fills to, and the arrow becomes, on hover. Pick
   * something with real contrast against the fill (defaults to the page
   * background, which reads well against the primary/amber fill). */
  fillColor?: string;
  onColor?: string;
};

/**
 * The site's signature link treatment: a small outlined circle sits before
 * the label; on hover it grows to fully cover the label and the arrow
 * slides across, as if the circle "swallows" the text. Pure CSS
 * transitions (no JS) so it stays instant even on low-power devices.
 */
export default function HoverLink({
  href,
  onClick,
  children,
  className = "",
  dir = "ltr",
  fillColor = "#D89528",
  onColor = "#0F0F0D",
}: HoverLinkProps) {
  const Tag = href ? "a" : "button";
  const arrowFlip = dir === "rtl" ? "scale-x-[-1]" : "";

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`group relative inline-flex items-center gap-3 ${className}`}
    >
      <span
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-500 shrink-0"
        style={{ borderColor: "currentColor", ["--hoverlink-on" as any]: onColor }}
      >
        <span
          className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"
          style={{ background: fillColor, transitionTimingFunction: "cubic-bezier(0.642,0,0.328,1)" }}
        />
        <svg
          className={`relative w-4 h-4 transition-colors duration-300 group-hover:[color:var(--hoverlink-on)] ${arrowFlip}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            className="transition-transform duration-500 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
            d="M7 17L17 7M17 7H9M17 7V15"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transitionTimingFunction: "cubic-bezier(0.104,0.204,0.492,1)" }}
          />
        </svg>
      </span>
      <span className="relative overflow-hidden">
        <span className="block transition-transform duration-500 group-hover:-translate-y-full" style={{ transitionTimingFunction: "cubic-bezier(0.472,0.04,0.526,1)" }}>
          {children}
        </span>
        <span
          className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0"
          style={{ transitionTimingFunction: "cubic-bezier(0.472,0.04,0.526,1)" }}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    </Tag>
  );
}
