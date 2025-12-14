"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = "md",
  className = "",
}) => {
  const { t } = useTranslation("common");

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>
          {message || t("loading", "Loading...")}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
