"use client";

import { motion } from "framer-motion";

interface MottoBlockProps {
  text: string;
  className?: string;
}

export function MottoBlock({ text, className = "" }: MottoBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`text-center text-sm text-[var(--muted)] italic py-8 ${className}`}
    >
      &ldquo;{text}&rdquo;
    </motion.div>
  );
}
