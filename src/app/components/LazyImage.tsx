import { forwardRef, useState, type ImgHTMLAttributes } from "react";

type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string;
};

/**
 * Drop-in replacement for <img> that shows a soft pulsing skeleton in the
 * image's own background color while it loads, then cross-fades to the
 * real photo — so slow connections show a deliberate placeholder instead
 * of a blank hole or a layout-shifting pop-in.
 */
const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(function LazyImage(
  { containerClassName = "", className = "", onLoad, ...imgProps },
  ref
) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${containerClassName}`}>
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: "linear-gradient(110deg, #1a1a17 8%, #24241f 18%, #1a1a17 33%)" }}
          aria-hidden="true"
        />
      )}
      <img
        {...imgProps}
        ref={ref}
        className={`${className} transition-opacity duration-700`}
        style={{ ...imgProps.style, opacity: loaded ? 1 : 0 }}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
});

export default LazyImage;
