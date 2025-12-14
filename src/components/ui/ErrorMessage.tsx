"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showRetryButton?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  size = "md",
  className = "",
  showRetryButton = true,
}) => {
  const { t } = useTranslation("common");

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <div className="text-center">
        <AlertCircle
          className={`${sizeClasses[size]} text-red-500 mx-auto mb-4`}
        />
        <div
          className={`text-red-500 font-semibold mb-2 ${textSizeClasses[size]}`}
        >
          {t("error", "Error")}
        </div>
        <p className={`text-gray-600 mb-4 ${textSizeClasses[size]}`}>
          {message ||
            t("errorOccurred", "An error occurred. Please try again.")}
        </p>
        {showRetryButton && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t("tryAgain", "Try Again")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
