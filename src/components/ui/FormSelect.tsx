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
      register: _register,
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
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === "ar";

    // Base select classes with RTL/LTR support and consistent height
    const baseSelectClasses = cn(
      "h-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white",
      {
        "border-red-300 focus:border-red-500 focus:ring-red-500/20": error,
        "border-gray-300 hover:border-gray-400 focus:border-primary": !error,
        "opacity-50 cursor-not-allowed bg-gray-50": disabled,
        "text-left": !isRTL,
        "text-right": isRTL,
      },
      selectClassName
    );

    const errorId = id ? `${id}-error` : undefined;

    return (
      <div
        className={cn("space-y-2", containerClassName, className)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-semibold text-gray-900 mb-1",
              isRTL ? "text-right" : "text-left",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span
                className={cn(
                  "text-red-500 font-bold",
                  isRTL ? "mr-1" : "ml-1"
                )}
              >
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
          <SelectTrigger
            className={baseSelectClasses}
            ref={ref}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className={cn(isRTL ? "text-right" : "text-left")}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {options.map((option: { value: string; label: string }) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {helpText && (
          <p
            className={cn(
              "text-xs text-gray-600 mt-1",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {helpText}
          </p>
        )}

        {error && (
          <div
            className={cn(
              "flex items-center gap-1 mt-0.5",
              isRTL ? "text-right" : "text-left",
              errorClassName
            )}
            id={errorId}
          >
            <svg
              className="w-3 h-3 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-red-600 font-medium">
              {(() => {
                if (error === "Invalid input") {
                  const isTypeField = id === "type" || name === "type";
                  if (isTypeField) {
                    const fallback = isRTL
                      ? "نوع المستخدم مطلوب"
                      : "User type is required";
                    return t("validation.typeRequired", fallback);
                  }
                  if (label) {
                    const clean = label.replace(/\s*\*\s*$/, "").trim();
                    return isRTL
                      ? t("validation.fieldRequiredAr", "{{field}} مطلوب", {
                          field: clean,
                        })
                      : t("validation.fieldRequired", "{{field}} is required", {
                          field: clean,
                        });
                  }
                  return t("validation.invalidInput", "Invalid input");
                }
                return t(error) || error;
              })()}
            </p>
          </div>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
