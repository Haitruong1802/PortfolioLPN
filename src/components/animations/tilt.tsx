"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";

type TiltProps = {
  children: React.ReactNode;
  /** Max tilt angle in degrees (default 8). */
  max?: number;
  /** Perspective distance in px (default 1000). */
  perspective?: number;
  /** Show a cursor-following white glare highlight on top of children. */
  glare?: boolean;
  /** Lift the card slightly toward camera on hover (translateZ). */
  lift?: boolean;
  className?: string;
};

const isFinePointer = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
};

/**
 * 3D tilt wrapper — rotates children based on cursor position.
 * Spring-damped for silky smoothness. Optional cursor-following glare.
 * Touch devices: no-op.
 */
export function Tilt({
  children,
  max = 8,
  perspective = 1000,
  glare = false,
  lift = false,
  className,
}: TiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 22, mass: 0.4 });

  // Rotation: rotateX inverted (mouse down = card tilts back)
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  // Glare position follows cursor (in % terms across the card)
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(ellipse 75% 60% at ${glareX} ${glareY}, rgba(255,255,255,0.35) 0%, transparent 55%)`;

  React.useEffect(() => {
    setEnabled(isFinePointer());
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleEnter = () => {
    if (enabled) setHover(true);
  };

  const handleLeave = () => {
    setHover(false);
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={enabled ? handleMove : undefined}
      onMouseEnter={enabled ? handleEnter : undefined}
      onMouseLeave={enabled ? handleLeave : undefined}
      style={
        enabled
          ? {
              rotateX,
              rotateY,
              transformPerspective: perspective,
              transformStyle: "flat",
              // Hover-lift toward camera (z-axis) for "popping out" effect
              ...(lift && hover ? { z: 30 } : {}),
            }
          : undefined
      }
      className={cn("relative", className)}
    >
      {children}

      {/* Cursor-following glare — clipped by parent's overflow-hidden + rounded */}
      {glare && enabled && (
        <motion.div
          aria-hidden
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ background: glareBg, mixBlendMode: "overlay" }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      )}
    </motion.div>
  );
}
