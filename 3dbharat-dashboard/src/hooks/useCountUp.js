"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current display value as a string.
 */
export function useCountUp(target, duration = 1000, formatter = (v) => v) {
  const [display, setDisplay] = useState(() => formatter(target ?? 0));
  const rafRef = useRef(null);

  useEffect(() => {
    // Validate target
    if (target == null || isNaN(Number(String(target).replace(/[^0-9.]/g, "")))) {
      return;
    }

    // Extract numeric value from formatted string like "₹12.50 Cr" or "24.5%"
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (!numeric || numeric === 0) { return; }

    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numeric;

      // Re-format using the same formatter but with scaled value
      // We pass the raw target and let formatter handle it, just scale the number
      setDisplay(formatter(target, current / numeric));

      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, formatter]);

  return display;
}
