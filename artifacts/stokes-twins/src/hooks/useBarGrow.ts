import { useState, useEffect } from "react";

export function useBarGrow(targetPercent: number, duration = 1200) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let rafId: number;
    let cancelled = false;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (cancelled) return;
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      if (progress < 1) {
        setWidth(easeOutCubic(progress) * targetPercent);
        rafId = window.requestAnimationFrame(step);
      } else {
        setWidth(targetPercent);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, [targetPercent, duration]);

  return width;
}
