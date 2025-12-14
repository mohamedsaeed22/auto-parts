import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  containerClassName?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "none" | "light" | "dark" | "primary" | "secondary";
}

const spacingStyles = {
  none: "",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
};

const backgroundStyles = {
  none: "",
  light: "bg-gray-50",
  dark: "bg-gray-900 text-white",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

export function Section({
  as: Component = "section",
  containerSize = "lg",
  containerClassName,
  spacing = "md",
  background = "none",
  className,
  children,
  ...props
}: SectionProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Component
      className={cn(
        spacingStyles[spacing],
        backgroundStyles[background],
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
      {...props}
    >
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </Component>
  );
}