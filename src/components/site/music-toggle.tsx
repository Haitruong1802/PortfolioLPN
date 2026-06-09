"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music, Music2 } from "lucide-react";
import { useSound } from "@/lib/sound/provider";
import { cn } from "@/lib/utils";

export function MusicToggle({ className }: { className?: string }) {
  const { musicEnabled, toggleMusic, mounted } = useSound();

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label={musicEnabled ? "Stop background music" : "Play background music"}
      className={cn(
        "relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-border bg-transparent text-foreground transition-colors hover:bg-muted",
        musicEnabled && "border-brand-blue/40 bg-brand-blue/10 text-brand-blue",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.span
            key={musicEnabled ? "on" : "off"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            {musicEnabled ? (
              <Music2 className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Music className="h-4 w-4" strokeWidth={1.5} />
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {musicEnabled && (
        <>
          {/* 3 sound bars animating */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand-blue/40"
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand-blue/40"
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.9,
            }}
          />
        </>
      )}
    </button>
  );
}
