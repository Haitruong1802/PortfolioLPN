import type { ComponentType, CSSProperties } from "react";

export type GooeyNavItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type GooeyNavProps = {
  items?: GooeyNavItem[];
  initialActiveIndex?: number;
  activeIndex?: number;
  onChange?: (index: number) => void;
  theme?: "dark" | "light";
  color?: string;
  activeTextColor?: string;
  colors?: string[];
  size?: "sm" | "md" | "lg";
  frame?: boolean;
  animationTime?: number;
  particleCount?: number;
  timeVariance?: number;
  spread?: number;
  gooeyness?: number;
  wobble?: number;
  hoverEffect?: boolean;
  className?: string;
  style?: CSSProperties;
};

declare const GooeyNav: ComponentType<GooeyNavProps>;
export default GooeyNav;
