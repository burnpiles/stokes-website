import { useState, useEffect } from "react";

export function useBarGrow(targetPercent: number, duration = 1200) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setWidth(easeOutCubic(progress) * targetPercent);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setWidth(targetPercent);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetPercent, duration]);

  return width;
}
