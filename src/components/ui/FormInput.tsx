"use client";

import React, { forwardRef, useState } from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { LucideIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Input types that our component supports
export type InputType =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "number"
  | "file"
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

  // File input specific props
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number; // in bytes
  onFileChange?: (file: File | null) => void;
  filePreview?: string | null;
  onRemoveFile?: () => void;

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
      accept,
      multiple = false,
      maxFileSize = 5 * 1024 * 1024, // 5MB default
      onFileChange,
      filePreview,
      onRemoveFile,
      rows = 3,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [dragActive, setDragActive] = useState(false);
    const [localFilePreview, setLocalFilePreview] = useState<string | null>(
      filePreview
    );

    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (file) {
        // Validate file size
        if (file.size > maxFileSize) {
          alert(
            `حجم الملف يجب أن يكون أقل من ${Math.round(
              maxFileSize / (1024 * 1024)
            )} ميجابايت`
          );
          return;
        }

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setLocalFilePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }

      onFileChange?.(file);
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.size > maxFileSize) {
          alert(
            `حجم الملف يجب أن يكون أقل من ${Math.round(
              maxFileSize / (1024 * 1024)
            )} ميجابايت`
          );
          return;
        }

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setLocalFilePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }

        onFileChange?.(file);
      }
    };

    // Remove file
    const handleRemoveFile = () => {
      setLocalFilePreview(null);
      onRemoveFile?.();
    };

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
      if (type === "file") {
        return (
          <div className="space-y-2">
            {!localFilePreview ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer",
                  {
                    "border-red-500": error,
                    "border-gray-300": !error,
                    "border-blue-500 bg-blue-50": dragActive,
                  }
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  {...register}
                  {...props}
                  type="file"
                  id={id}
                  name={name}
                  accept={accept}
                  multiple={multiple}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={disabled}
                  ref={ref as React.Ref<HTMLInputElement>}
                />
                <label
                  htmlFor={id}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    انقر لاختيار ملف أو اسحب الملف هنا
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={localFilePreview}
                  alt="File preview"
                  className="w-full h-48 object-cover rounded-lg border"
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      }

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
