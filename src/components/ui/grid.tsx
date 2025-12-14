import * as React from "react";
import { cn } from "@/lib/utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: number;
  responsive?: boolean;
  flow?: "row" | "col";
  autoFit?: boolean;
  minChildWidth?: string;
}

export function Grid({
  as: Component = "div",
  cols = 1,
  gap = 4,
  responsive = false,
  flow = "row",
  autoFit = false,
  minChildWidth,
  className,
  children,
  ...props
}: GridProps) {
  const gridClassName = cn(
    "grid",
    // Grid columns
    !autoFit && !responsive && `grid-cols-${cols}`,
    !autoFit &&
      responsive && {
        "grid-cols-1 sm:grid-cols-2": cols >= 2,
        "md:grid-cols-3": cols >= 3,
        "lg:grid-cols-4": cols >= 4,
        "xl:grid-cols-5": cols >= 5,
        "2xl:grid-cols-6": cols >= 6,
      },
    // Auto-fit grid
    autoFit &&
      minChildWidth && {
        "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--min-child-width)),1fr))]":
          true,
        [`--min-child-width:${minChildWidth}`]: true,
      },
    // Grid flow
    flow === "row" && "grid-flow-row",
    flow === "col" && "grid-flow-col",
    // Gap
    gap && `gap-${gap}`,
    className
  );

  return (
    <Component className={gridClassName} {...props}>
      {children}
    </Component>
  );
}
