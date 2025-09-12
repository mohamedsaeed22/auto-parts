"use client";

import React, { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Props interface for the FormSelect component
export interface FormSelectProps {
  // Basic select props
  label?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;

  // React Hook Form integration
  register?: UseFormRegisterReturn;
  error?: string;
  value?: string;
  onValueChange?: (value: string) => void;

  // Styling and layout
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;

  // Options
  options: Array<{
    value: string;
    label: string;
  }>;

  // Additional props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      placeholder,
      id,
      name,
      required = false,
      disabled = false,
      helpText,
      register,
      error,
      value,
      onValueChange,
      className,
      containerClassName,
      labelClassName,
      selectClassName,
      errorClassName,
      options,
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    // Base select classes with RTL/LTR support
    const baseSelectClasses = cn(
      "h-12 px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
      {
        "border-red-500": error,
        "border-gray-300": !error,
        "opacity-50 cursor-not-allowed": disabled,
        "text-left": !isRTL,
        "text-right": isRTL,
      },
      selectClassName
    );

    return (
      <div className={cn("space-y-2", containerClassName, className)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium text-gray-700",
              isRTL ? "text-right" : "text-left",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className={cn("text-red-500", isRTL ? "mr-1" : "ml-1")}>
                *
              </span>
            )}
          </label>
        )}

        <Select
          value={value || undefined}
          onValueChange={onValueChange}
          disabled={disabled}
          {...props}
        >
          <SelectTrigger className={baseSelectClasses} ref={ref}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {helpText && (
          <p
            className={cn(
              "text-xs text-gray-500",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {helpText}
          </p>
        )}

        {error && (
          <p
            className={cn(
              "text-sm text-red-600",
              isRTL ? "text-right" : "text-left",
              errorClassName
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
