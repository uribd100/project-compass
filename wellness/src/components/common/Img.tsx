import { useState } from "react";
import { cn } from "@/lib/utils";

// Image with skeleton shimmer + graceful fallback (hides on error so the
// gradient background of the parent shows through — premium even offline).
export function Img({ src, alt = "", className }: { src: string; alt?: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <>
      {!loaded && <div className={cn("absolute inset-0 shimmer", className)} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </>
  );
}
