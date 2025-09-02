import * as React from "react";
import { cn } from "@/lib/utils";
import { CommonComponentProps, AnimationProps } from "@/components/types";

/**
 * Enhanced Card component with improved TypeScript interfaces
 * and flexible styling options for consistent UI across the application
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CommonComponentProps, AnimationProps {
  /** Card variant for different visual styles */
  variant?: "default" | "outlined" | "elevated" | "ghost";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Card padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Border radius */
  radius?: "none" | "sm" | "md" | "lg" | "xl";
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement>, CommonComponentProps {
  /** Header variant */
  variant?: "default" | "compact";
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement>, CommonComponentProps {
  /** Content padding */
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement>, CommonComponentProps {
  /** Footer variant */
  variant?: "default" | "compact";
  /** Footer alignment */
  align?: "left" | "center" | "right" | "between";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>((
  {
    className,
    variant = "default",
    size = "md",
    interactive = false,
    loading = false,
    hover = true,
    padding = "md",
    radius = "lg",
    animate = true,
    duration = 200,
    delay = 0,
    ...props
  },
  ref
) => {
  const cardVariants = {
    default: "bg-card border border-border shadow-sm",
    outlined: "bg-card border-2 border-border",
    elevated: "bg-card shadow-lg border border-border/50",
    ghost: "bg-transparent border-0 shadow-none"
  };

  const sizeVariants = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const paddingVariants = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };

  const radiusVariants = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl"
  };

  if (loading) {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse",
          cardVariants[variant],
          sizeVariants[size],
          paddingVariants[padding],
          radiusVariants[radius],
          "text-card-foreground transition-all duration-300",
          className
        )}
        {...props}
      >
        <div className="space-y-3">
          <div className="bg-muted h-4 rounded w-3/4"></div>
          <div className="bg-muted h-4 rounded w-1/2"></div>
          <div className="bg-muted h-8 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants[variant],
        sizeVariants[size],
        radiusVariants[radius],
        "text-card-foreground transition-all duration-300",
        interactive && "cursor-pointer",
        hover && "hover:shadow-md",
        animate && "transform hover:scale-[1.02]",
        padding !== "none" && paddingVariants[padding],
        className
      )}
      style={{
        animationDelay: animate ? `${delay}ms` : undefined,
        animationDuration: animate ? `${duration}ms` : undefined
      }}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((
  {
    className,
    variant = "default",
    ...props
  },
  ref
) => {
  const headerVariants = {
    default: "flex flex-col space-y-1.5 p-6 pb-4 border-b border-border",
    compact: "flex flex-col space-y-1 p-4 pb-2"
  };

  return (
    <div
      ref={ref}
      className={cn(
        headerVariants[variant],
        className
      )}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>((
  {
    className,
    padding = "md",
    ...props
  },
  ref
) => {
  const paddingVariants = {
    none: "p-0",
    sm: "p-3",
    md: "p-6 pt-0",
    lg: "p-8 pt-0"
  };

  return (
    <div
      ref={ref}
      className={cn(
        paddingVariants[padding],
        className
      )}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>((
  {
    className,
    variant = "default",
    align = "left",
    ...props
  },
  ref
) => {
  const footerVariants = {
    default: "flex items-center p-6 pt-4 border-t border-border",
    compact: "flex items-center p-4 pt-2"
  };

  const alignVariants = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  };

  return (
    <div
      ref={ref}
      className={cn(
        footerVariants[variant],
        alignVariants[align],
        className
      )}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps
};
