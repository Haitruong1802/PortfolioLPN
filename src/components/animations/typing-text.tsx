"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TypingTextProps = {
  text: string;
  /** ms per character (default 45). */
  speed?: number;
  /** Initial delay before typing starts (ms). */
  startDelay?: number;
  className?: string;
  /** Show blinking caret after finished typing. */
  showCaret?: boolean;
  /** Restart animation when text changes (default true). */
  retypeOnChange?: boolean;
};

/**
 * Types out a string character by character, with a blinking caret.
 * Pauses 200ms at punctuation for natural rhythm.
 */
export function TypingText({
  text,
  speed = 45,
  startDelay = 0,
  className,
  showCaret = true,
  retypeOnChange = true,
}: TypingTextProps) {
  const [displayed, setDisplayed] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    setDisplayed("");
    setDone(false);

    let cancelled = false;
    let rafId = 0;
    let starter = 0;
    let i = 0;
    let lastTime = 0;
    let elapsed = 0;

    // requestAnimationFrame loop with elapsed-time accounting. setTimeout
    // is throttled to ~4ms minimum on mobile and accumulates drift, which
    // showed up as a visible stutter mid-tagline when other work (preloader
    // exit, image decode, etc.) hogged the main thread. rAF syncs to the
    // display refresh and pauses naturally when the tab is busy, then
    // resumes without skipping characters.
    const frame = (now: number) => {
      if (cancelled) return;
      if (i >= text.length) {
        setDone(true);
        return;
      }
      if (lastTime === 0) lastTime = now;
      elapsed += now - lastTime;
      lastTime = now;

      const ch = text[i];
      const charDelay = /[.!?,—…]/.test(ch) ? speed * 4 : speed;

      if (elapsed >= charDelay) {
        elapsed -= charDelay;
        i++;
        setDisplayed(text.slice(0, i));
      }
      rafId = window.requestAnimationFrame(frame);
    };

    starter = window.setTimeout(() => {
      lastTime = 0;
      elapsed = 0;
      rafId = window.requestAnimationFrame(frame);
    }, startDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(starter);
      window.cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retypeOnChange ? text : null, speed, startDelay]);

  return (
    <span className={className}>
      {displayed}
      {showCaret && (
        <span
          className={cn(
            "ml-[2px] inline-block w-[2px] align-middle bg-current",
            done ? "animate-caret-blink" : "",
          )}
          style={{
            height: "1em",
            verticalAlign: "-0.15em",
            opacity: done ? undefined : 1,
          }}
        />
      )}
      <style jsx>{`
        :global(.animate-caret-blink) {
          animation: caret-blink 1s steps(2) infinite;
        }
        @keyframes caret-blink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
