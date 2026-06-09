"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticProps = {
  children: React.ReactNode;
  /** How strongly the content follows the cursor (0–1). */
  strength?: number;
  /** Enable click ripple effect (cam/xanh radial). */
  ripple?: boolean;
  className?: string;
};

type Ripple = { id: number; x: number; y: number; size: number };

export function Magnetic({
  children,
  strength = 0.35,
  ripple = true,
  className,
}: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.3 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.3 });

  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set((e.clientX - cx) * strength);
    my.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ripple) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const id = Date.now() + Math.random();
    const newRipple: Ripple = {
      id,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    };
    setRipples((prev) => [...prev, newRipple]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      <motion.div style={{ x, y }} className="relative">
        {children}

        {/* Ripples — absolutely positioned inside motion wrapper so they follow magnetic shift */}
        {ripple && ripples.length > 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                className="ripple-anim absolute rounded-full"
                style={{
                  left: r.x,
                  top: r.y,
                  width: r.size,
                  height: r.size,
                  background:
                    "radial-gradient(circle, rgba(255,122,26,0.45) 0%, rgba(47,125,255,0.25) 45%, transparent 70%)",
                }}
              />
            ))}
          </span>
        )}
      </motion.div>

      <style jsx>{`
        :global(.ripple-anim) {
          animation: ripple-grow 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform: scale(0);
          opacity: 0.9;
        }
        @keyframes ripple-grow {
          0% {
            transform: scale(0);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
