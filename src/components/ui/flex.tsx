import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  gap?: number;
  inline?: boolean;
  responsive?: boolean;
}

export function Flex({
  as: Component = "div",
  direction = "row",
  align = "start",
  justify = "start",
  wrap = false,
  gap,
  inline = false,
  responsive = false,
  className,
  children,
  ...props
}: FlexProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const flexClassName = cn(
    inline ? "inline-flex" : "flex",
    // Direction
    direction === "row" && !responsive && (isRTL ? "flex-row-reverse" : "flex-row"),
    direction === "col" && !responsive && "flex-col",
    // Responsive direction
    direction === "row" && responsive && (isRTL ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"),
    direction === "col" && responsive && "flex-col",
    // Alignment
    align === "start" && "items-start",
    align === "center" && "items-center",
    align === "end" && "items-end",
    align === "stretch" && "items-stretch",
    align === "baseline" && "items-baseline",
    // Justification
    justify === "start" && "justify-start",
    justify === "center" && "justify-center",
    justify === "end" && "justify-end",
    justify === "between" && "justify-between",
    justify === "around" && "justify-around",
    justify === "evenly" && "justify-evenly",
    // Wrap
    wrap && "flex-wrap",
    // Gap
    gap && `gap-${gap}`,
    className
  );

  return (
    <Component className={flexClassName} {...props}>
      {children}
    </Component>
  );
}