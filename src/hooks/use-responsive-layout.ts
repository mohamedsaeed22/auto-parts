import { useBreakpoint } from "@/hooks/use-media-query";
import { useDirection } from "@/hooks/use-direction";

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ResponsiveConfig {
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
  "2xl"?: GridColumns;
}

export function useResponsiveLayout() {
  const { isRTL } = useDirection();
  const isSm = useBreakpoint("sm");
  const isMd = useBreakpoint("md");
  const isLg = useBreakpoint("lg");
  const isXl = useBreakpoint("xl");
  const is2Xl = useBreakpoint("2xl");

  const getResponsiveGridCols = (config: ResponsiveConfig): string => {
    const baseClasses = ["grid-cols-1"];

    if (config.sm && isSm) baseClasses.push(`sm:grid-cols-${config.sm}`);
    if (config.md && isMd) baseClasses.push(`md:grid-cols-${config.md}`);
    if (config.lg && isLg) baseClasses.push(`lg:grid-cols-${config.lg}`);
    if (config.xl && isXl) baseClasses.push(`xl:grid-cols-${config.xl}`);
    if (config["2xl"] && is2Xl) baseClasses.push(`2xl:grid-cols-${config["2xl"]}`);

    return baseClasses.join(" ");
  };

  const getResponsiveContainer = (size: "sm" | "md" | "lg" | "xl" | "full"): string => {
    const sizes = {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      full: "max-w-full",
    };

    return `mx-auto px-4 sm:px-6 ${sizes[size]}`;
  };

  const getResponsivePadding = (size: "sm" | "md" | "lg" | "xl"): string => {
    const sizes = {
      sm: "p-4 sm:p-6",
      md: "p-6 sm:p-8",
      lg: "p-8 sm:p-10",
      xl: "p-10 sm:p-12",
    };

    return sizes[size];
  };

  const getResponsiveGap = (size: "sm" | "md" | "lg" | "xl"): string => {
    const sizes = {
      sm: "gap-4 sm:gap-6",
      md: "gap-6 sm:gap-8",
      lg: "gap-8 sm:gap-10",
      xl: "gap-10 sm:gap-12",
    };

    return sizes[size];
  };

  const getResponsiveFlexDirection = (defaultDirection: "row" | "col"): string => {
    if (defaultDirection === "row") {
      return isRTL
        ? "flex-col md:flex-row-reverse"
        : "flex-col md:flex-row";
    }
    return "flex-col";
  };

  return {
    // Breakpoint states
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    // Utility functions
    getResponsiveGridCols,
    getResponsiveContainer,
    getResponsivePadding,
    getResponsiveGap,
    getResponsiveFlexDirection,
    // Common responsive classes
    commonClasses: {
      container: "w-full mx-auto px-4 sm:px-6 lg:px-8",
      section: "py-8 sm:py-12 lg:py-16",
      grid: "grid gap-4 sm:gap-6 lg:gap-8",
      card: "p-4 sm:p-6 lg:p-8",
    },
  };
}