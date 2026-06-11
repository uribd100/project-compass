import { useEffect, useRef, useState } from "react";

export function CountUp({ value, duration = 1200, decimals = 0, suffix = "", prefix = "" }: {
  value: number; duration?: number; decimals?: number; suffix?: string; prefix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value, duration, reduced]);

  return <span>{prefix}{display.toLocaleString("he-IL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}
