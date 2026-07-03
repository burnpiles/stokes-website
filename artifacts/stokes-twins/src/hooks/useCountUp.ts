import { useState, useEffect } from "react";

export function useCountUp(endValue: number, duration = 1700) {
  const [count, setCount] = useState(0);

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
        setCount(Math.floor(easeOutCubic(progress) * endValue));
        rafId = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, [endValue, duration]);

  return count;
}
