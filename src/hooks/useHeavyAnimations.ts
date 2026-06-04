"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only on devices that can comfortably run the heavy decorative
 * animations (full-screen canvas, infinite rotations, parallax-on-blur, …).
 *
 * It stays `false` during SSR and the first client render so low-end / mobile
 * devices never pay for effects they can't see well — desktops with a fine
 * pointer and no reduced-motion preference flip it on after mount.
 */
export function useHeavyAnimations(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia(
      "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    const update = () => setEnabled(mq.matches);
    update();

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return enabled;
}
