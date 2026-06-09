"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/sound/provider";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle, mounted } = useSound();

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
      }}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      className={cn(
        "relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-border bg-transparent text-foreground transition-colors hover:bg-muted",
        enabled && "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.span
            key={enabled ? "on" : "off"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            {enabled ? (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Sound wave indicator when enabled */}
      {enabled && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-brand-orange/40"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </button>
  );
}
