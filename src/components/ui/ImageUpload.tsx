"use client";

import { forwardRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  id: string;
  label: string;
  preview: string | null;
  onImageChange: (file: File | undefined) => void;
  onRemoveImage: () => void;
  error?: string;
  helpText?: string;
  className?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      id,
      label,
      preview,
      onImageChange,
      onRemoveImage,
      error,
      helpText,
      className,
    },
    ref
  ) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      onImageChange(file);
    };

    return (
      <div className={cn("space-y-2", className)} dir={isRTL ? "rtl" : "ltr"}>
        {/* Label with icon */}
        <label
          className={cn(
            "text-sm font-medium text-logo-black mb-2 flex items-center gap-2"
          )}
        >
          <ImageIcon size={16} color="gray" />
          {label}
        </label>

        <div className="space-y-4">
          <input
            ref={ref}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={id}
          />

          {/* Show input only when there's no preview */}
          {!preview && (
            <label
              htmlFor={id}
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-logo-gold/50 rounded-lg cursor-pointer hover:border-logo-gold hover:bg-logo-gold/5 transition-colors"
            >
              <div className="text-center">
                <Upload className="mx-auto text-logo-gold mb-2" size={24} />
                <p className="text-sm text-logo-black">
                  {isRTL ? `اضغط لاختيار ${label}` : `Click to select ${label}`}
                </p>
                <p className="text-xs text-logo-black/60">
                  {isRTL ? "JPG, PNG, GIF حتى 5MB" : "JPG, PNG, GIF up to 5MB"}
                </p>
              </div>
            </label>
          )}

          {/* Show preview when there's an image */}
          {preview && (
            <div className="relative">
              <Image
                src={preview}
                alt={isRTL ? `معاينة ${label}` : `Preview ${label}`}
                className="w-full h-48 object-cover rounded-lg border-2 border-logo-gold"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className={cn(
                  "absolute top-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors",
                  isRTL ? "right-2" : "left-2"
                )}
                title={isRTL ? "حذف الصورة" : "Remove image"}
              >
                <X size={16} />
              </button>
            </div>
          )}

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
                "text-red-500 text-sm",
                isRTL ? "text-right" : "text-left"
              )}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
