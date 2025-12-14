"use client";

import React, { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Input types that our component supports
export type InputType =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "number"
  | "textarea";

// Props interface for the FormInput component
export interface FormInputProps {
  // Basic input props
  label?: string;
  placeholder?: string;
  type?: InputType;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;

  // React Hook Form integration
  register?: UseFormRegisterReturn;
  error?: string;

  // Translation
  translationNamespace?: string;

  // Styling and layout
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;

  // Icon support
  icon?: LucideIcon;
  iconPosition?: "left" | "right" | "auto"; // auto will use RTL/LTR detection
  iconClassName?: string;

  // Textarea specific props
  rows?: number;
  maxLength?: number;

  // Additional props
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(
  (
    {
      label,
      placeholder,
      type = "text",
      id,
      name,
      required = false,
      disabled = false,
      helpText,
      register,
      error,
      translationNamespace,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      icon: Icon,
      iconPosition = "auto",
      iconClassName,
      rows = 3,
      maxLength,
      ...props
    },
    ref
  ) => {
    const { i18n, t } = useTranslation(translationNamespace);
    const isRTL = i18n.language === "ar";

    // Auto-detect icon position based on language direction
    const effectiveIconPosition =
      iconPosition === "auto" ? (isRTL ? "right" : "left") : iconPosition;

    // Base input classes with RTL/LTR support and consistent height
    const baseInputClasses = cn(
      "w-full h-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white",
      {
        "border-red-300 focus:border-red-500 focus:ring-red-500/20": error,
        "border-gray-300 hover:border-gray-400 focus:border-primary": !error,
        "opacity-50 cursor-not-allowed bg-gray-50": disabled,
        "pl-10": Icon && effectiveIconPosition === "left",
        "pr-10": Icon && effectiveIconPosition === "right",
        "text-right": isRTL,
        "text-left": !isRTL,
      },
      inputClassName
    );

    // Textarea specific classes with min-height instead of fixed height
    const textareaClasses = cn(
      "w-full min-h-[80px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none bg-white mb-0",
      {
        "border-red-300 focus:border-red-500 focus:ring-red-500/20": error,
        "border-gray-300 hover:border-gray-400 focus:border-primary": !error,
        "opacity-50 cursor-not-allowed bg-gray-50": disabled,
        "text-right": isRTL,
        "text-left": !isRTL,
      },
      inputClassName
    );

    // Render different input types
    const renderInput = () => {
      if (type === "textarea") {
        return (
          <textarea
            {...props}
            {...register}
            id={id}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            dir={isRTL ? "rtl" : "ltr"}
            className={textareaClasses}
            disabled={disabled}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        );
      }

      // Default input (text, email, tel, password, number)
      return (
        <div className="relative">
          {Icon && effectiveIconPosition === "left" && (
            <Icon
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
                iconClassName
              )}
            />
          )}

          <input
            {...props}
            {...register}
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            className={baseInputClasses}
            disabled={disabled}
            ref={ref as React.Ref<HTMLInputElement>}
          />

          {Icon && effectiveIconPosition === "right" && (
            <Icon
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
                iconClassName
              )}
            />
          )}
        </div>
      );
    };

    return (
      <div className={cn("space-y-2", containerClassName, className)}>
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

        {renderInput()}

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
              {t(error) || error}
            </p>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
