"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { fadeUp, staggerContainer } from "@/config/motion";

/** Container that staggers the entrance of its `<RevealItem>` children. */
function Reveal({
  stagger = 0.06,
  delay = 0.02,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(stagger, delay)}
      {...props}
    />
  );
}

/** Fades and lifts in when its parent `<Reveal>` becomes visible. */
function RevealItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={fadeUp} {...props} />;
}

export { Reveal, RevealItem };
