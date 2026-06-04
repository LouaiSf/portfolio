"use client";

import { MotionConfig } from "framer-motion";

/**
 * Makes every Framer Motion animation honour the user's
 * "prefers-reduced-motion" setting (transform/layout motion is dropped,
 * opacity fades still play). Pairs with the reduced-motion CSS in globals.css.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
