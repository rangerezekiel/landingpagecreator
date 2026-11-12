"use client";
import { motion } from "framer-motion";

interface AnimatedProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-right" | "fade-left" | "fade-down" | "zoom-in";
  duration?: number;
  delay?: number;
}

const animationVariants = {
  "fade-up": {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  "zoom-in": {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
};

export default function Animated({
  children,
  className = "",
  animation = "fade-up",
  duration = 0.6,
  delay = 0,
}: AnimatedProps) {
  const variant = animationVariants[animation];

  return (
    <motion.div
      initial={variant.initial}
      whileInView={variant.animate}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      viewport={{
        once: true, // Animation triggers only once
        amount: 0.1, // Trigger when 10% of element is visible
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 