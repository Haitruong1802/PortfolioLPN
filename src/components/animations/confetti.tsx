"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

type Piece = {
  id: number;
  vx: number;
  vy: number;
  rotate: number;
  size: number;
  color: string;
  shape: "rect" | "circle";
};

type ConfettiBurstProps = {
  /** Viewport-relative pixel origin (e.g. button center) */
  origin: { x: number; y: number };
  count?: number;
  /** Cone spread in degrees (360 = full circle, 180 = upper half) */
  spread?: number;
  /** Max initial velocity in px (higher = travels further) */
  power?: number;
  colors?: string[];
  durationMs?: number;
  onDone?: () => void;
};

const DEFAULT_COLORS = [
  "#ff7a1a", // brand-orange
  "#ffa64d", // light orange
  "#2f7dff", // brand-blue
  "#5ca0ff", // light blue
  "#ffffff", // white
  "#ffd966", // gold
];

/**
 * One-shot confetti burst.
 * Renders to document.body via portal so it escapes any transformed parent
 * (e.g. PageEntrance). Auto-removes itself when animation completes.
 */
export function ConfettiBurst({
  origin,
  count = 60,
  spread = 360,
  power = 520,
  colors = DEFAULT_COLORS,
  durationMs = 1800,
  onDone,
}: ConfettiBurstProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Precompute pieces (deterministic per mount)
  const pieces = React.useMemo<Piece[]>(() => {
    const arr: Piece[] = [];
    const half = spread / 2;
    for (let i = 0; i < count; i++) {
      // Distribute angles around a cone biased UP (-90deg)
      const angleDeg = -90 + (Math.random() * spread - half);
      const angleRad = (angleDeg * Math.PI) / 180;
      const speed = power * (0.5 + Math.random() * 0.55);
      arr.push({
        id: i,
        vx: Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed, // negative = up since angleRad ~ -π/2
        rotate: (Math.random() - 0.5) * 1080,
        size: 6 + Math.random() * 7,
        color: colors[i % colors.length],
        shape: Math.random() > 0.5 ? "circle" : "rect",
      });
    }
    return arr;
  }, [count, spread, power, colors]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => onDone?.(), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onDone]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[180] overflow-hidden"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            x: origin.x,
            y: origin.y,
            rotate: 0,
            opacity: 1,
            scale: 0.4,
          }}
          animate={{
            x: origin.x + p.vx,
            y: origin.y + p.vy + 600, // gravity drop after initial vy
            rotate: p.rotate,
            opacity: [1, 1, 0],
            scale: [0.4, 1, 0.9],
          }}
          transition={{
            duration: durationMs / 1000,
            ease: [0.2, 0.55, 0.4, 1],
            opacity: { times: [0, 0.6, 1] },
            scale: { times: [0, 0.2, 1] },
          }}
          className="absolute left-0 top-0 block"
          style={{
            width: p.size,
            height: p.size * (p.shape === "rect" ? 1.6 : 1),
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            boxShadow: `0 0 ${p.size * 1.5}px ${p.color}66`,
          }}
        />
      ))}
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// Hook: manage multiple concurrent bursts
// ─────────────────────────────────────────────────────────────
type BurstSpec = {
  id: number;
  origin: { x: number; y: number };
  count?: number;
  spread?: number;
  power?: number;
  colors?: string[];
  durationMs?: number;
};

export function useConfetti() {
  const [bursts, setBursts] = React.useState<BurstSpec[]>([]);

  const fire = React.useCallback((opts: Omit<BurstSpec, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 10000);
    setBursts((prev) => [...prev, { ...opts, id }]);
  }, []);

  const removeBurst = React.useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const renderBursts = React.useCallback(
    () => (
      <>
        {bursts.map((b) => (
          <ConfettiBurst
            key={b.id}
            origin={b.origin}
            count={b.count}
            spread={b.spread}
            power={b.power}
            colors={b.colors}
            durationMs={b.durationMs}
            onDone={() => removeBurst(b.id)}
          />
        ))}
      </>
    ),
    [bursts, removeBurst],
  );

  return { fire, renderBursts };
}
