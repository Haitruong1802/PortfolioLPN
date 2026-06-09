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
 *
 * Shell + core split: TiltCore owns all the motion-value hooks and the
 * `motion.div` wrapper. On touch / coarse-pointer devices we never mount
 * TiltCore, so weak machines skip the 11 motion subscriptions per Tilt
 * instance entirely (the page has 20+ Tilt usages — that adds up).
 */
export function Tilt(props: TiltProps) {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    setEnabled(isFinePointer());
  }, []);

  if (!enabled) {
    return <div className={cn("relative", props.className)}>{props.children}</div>;
  }

  return <TiltCore {...props} />;
}

function TiltCore({
  children,
  max = 8,
  perspective = 1000,
  glare = false,
  lift = false,
  className,
}: TiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);
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

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleEnter = () => setHover(true);

  const handleLeave = () => {
    setHover(false);
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: perspective,
        transformStyle: "flat",
        // Hover-lift toward camera (z-axis) for "popping out" effect
        ...(lift && hover ? { z: 30 } : {}),
      }}
      className={cn("relative", className)}
    >
      {children}

      {/* Cursor-following glare — clipped by parent's overflow-hidden + rounded */}
      {glare && (
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
