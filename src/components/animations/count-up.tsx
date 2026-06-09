"use client";

import * as React from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

type Props = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export function CountUp({
  to,
  duration = 1.6,
  suffix = "",
  prefix = "",
  className,
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const mv = useMotionValue(0);
  const sv = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const rounded = useTransform(sv, (v) => Math.round(v));
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  React.useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
