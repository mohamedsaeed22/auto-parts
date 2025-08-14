"use client";

import React, { forwardRef } from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // React Hook Form integration
  register?: UseFormRegisterReturn;
  error?: FieldError;

  // Styling and layout
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;

  // Direction and text alignment (for RTL support)
  dir?: "ltr" | "rtl";
  textAlign?: "left" | "right" | "center";

  // Icon support
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
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
      register,
      error,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      dir,
      textAlign = "right",
      icon: Icon,
      iconPosition = "left",
      iconClassName,
      rows = 3,
      maxLength,
      ...props
    },
    ref
  ) => {
    // Base input classes
    const baseInputClasses = cn(
      "w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
      {
        "border-red-500": error,
        "border-gray-300": !error,
        "opacity-50 cursor-not-allowed": disabled,
        "pl-10": Icon && iconPosition === "left",
        "pr-10": Icon && iconPosition === "right",
      },
      inputClassName
    );

    // Render different input types
    const renderInput = () => {
      if (type === "textarea") {
        return (
          <textarea
            {...register}
            {...props}
            id={id}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            dir={dir}
            style={{ textAlign }}
            className={cn(baseInputClasses, "resize-none")}
            disabled={disabled}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        );
      }

      // Default input (text, email, tel, password, number)
      return (
        <div className="relative">
          {Icon && iconPosition === "left" && (
            <Icon
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
                iconClassName
              )}
            />
          )}

          <input
            {...register}
            {...props}
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            dir={dir}
            style={{ textAlign }}
            className={baseInputClasses}
            disabled={disabled}
            ref={ref as React.Ref<HTMLInputElement>}
          />

          {Icon && iconPosition === "right" && (
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
              "block text-sm font-medium text-gray-700 text-right",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {renderInput()}

        {error && (
          <p className={cn("text-sm text-red-600 text-right", errorClassName)}>
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
