import type { Transition, Variants } from "framer-motion";

/**
 * Motion language. Springs everywhere for physical, interruptible motion;
 * tweens only for opacity. Durations stay short — the UI must feel instant.
 */
export const easing = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const spring = {
  /** Buttons, toggles, indicators. */
  snappy: { type: "spring", stiffness: 520, damping: 38, mass: 0.8 },
  /** Cards, panels, layout shifts. */
  smooth: { type: "spring", stiffness: 280, damping: 32, mass: 0.9 },
  /** Large surfaces: drawers, page content. */
  gentle: { type: "spring", stiffness: 170, damping: 26, mass: 1 },
} satisfies Record<string, Transition>;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...spring.smooth, opacity: { duration: 0.35, ease: easing.outQuint } },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: easing.outQuint } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring.smooth },
};

export function staggerContainer(stagger = 0.06, delayChildren = 0.04): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}
