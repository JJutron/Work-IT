"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { durationEnter, easeOutQuint } from "@/lib/motion";

export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={["reveal-motion", className].filter(Boolean).join(" ")}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduce ? 0 : durationEnter,
        delay: reduce ? 0 : delay,
        ease: easeOutQuint,
      }}
    >
      {children}
    </motion.div>
  );
}
