"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}) => {
  const {
    id,
    className,
    background,
    particleSize,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [sparkles, setSparkles] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getDimensions = () => {
        const container = document.getElementById(id || "tsparticlesfullpage");
        if (container) {
          return {
            width: container.offsetWidth,
            height: container.offsetHeight,
          };
        }
        return null;
      };

      const updateDimensions = () => {
        setDimensions(getDimensions());
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      return () => {
        window.removeEventListener("resize", updateDimensions);
      };
    }
  }, [id]);

  useEffect(() => {
    if (dimensions) {
      const generateSparkles = () => {
        const newSparkles = Array.from({ length: particleDensity || 50 }).map(() => {
          return {
            id: Math.random(),
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            size: (minSize || 0.5) + Math.random() * ((maxSize || 1) - (minSize || 0.5)),
            delay: Math.random() * (speed || 1),
            color: particleColor || "#FFFFFF",
          };
        });
        setSparkles(newSparkles);
      };
      generateSparkles();
    }
  }, [dimensions, particleDensity, minSize, maxSize, speed, particleColor]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div
        id={id || "tsparticlesfullpage"}
        className="absolute inset-0"
        style={{
          background: background || "transparent",
        }}
      >
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute rounded-full"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: sparkle.color,
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              x: sparkle.x + (Math.random() - 0.5) * 10,
              y: sparkle.y + (Math.random() - 0.5) * 10,
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};
