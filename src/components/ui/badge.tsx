import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
        primary: "border-primary/40 bg-primary/10 text-primary",
        orange: "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
        blue: "border-brand-blue/40 bg-brand-blue/10 text-brand-blue",
        amber: "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
