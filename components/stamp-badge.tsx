import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const stampBadgeVariants = cva(
  "inline-flex items-center justify-center aspect-square rounded-full border border-dashed font-mono text-xs font-semibold uppercase tracking-wider shrink-0 -rotate-3",
  {
    variants: {
      variant: {
        available: "border-primary text-primary bg-primary/10",
        confirmed: "border-primary text-primary bg-primary/10",
        pending: "border-secondary text-secondary bg-secondary/10",
        cancelled: "border-destructive text-destructive bg-destructive/10",
      },
      size: {
        default: "size-16",
        sm: "size-12",
        xs: "size-10",
      },
    },
    defaultVariants: {
      variant: "available",
      size: "default",
    },
  }
);

interface StampBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stampBadgeVariants> {}

function StampBadge({
  className,
  variant = "available",
  size = "default",
  children,
  ...props
}: StampBadgeProps) {
  return (
    <div
      className={cn(stampBadgeVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

export { StampBadge, stampBadgeVariants };
