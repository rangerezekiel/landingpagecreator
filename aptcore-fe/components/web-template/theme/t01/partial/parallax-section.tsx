"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxSectionProps {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  strength?: number; // max vertical shift in px
  children?: React.ReactNode;
  priority?: boolean;
}

export default function ParallaxSection({
  src,
  alt = "Background",
  className = "",
  imageClassName = "object-cover",
  strength = 120,
  children,
  priority = false,
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Move background up/down as we scroll past the section
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ y }}
      >
        <Image src={src} alt={alt} fill className={imageClassName} priority={priority} />
      </motion.div>
      {children}
    </div>
  );
}



