"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

export function Layout({
  children,
  className,
  containerClassName,
  fullWidth = false,
}: LayoutProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        isRTL ? "text-right" : "text-left",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          "mx-auto w-full",
          !fullWidth && "max-w-7xl px-4 sm:px-6 lg:px-8",
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}