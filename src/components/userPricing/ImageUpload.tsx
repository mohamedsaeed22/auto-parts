import { forwardRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  id: string;
  label: string;
  preview: string | null;
  onImageChange: (file: File | undefined) => void;
  onRemoveImage: () => void;
  error?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ id, label, preview, onImageChange, onRemoveImage, error }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      onImageChange(file);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
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
          <label
            htmlFor={id}
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
          >
            <div className="text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-500">اضغط لاختيار {label}</p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF حتى 5MB</p>
            </div>
          </label>

          {preview && (
            <div className="relative">
              <Image
                src={preview}
                alt={`معاينة ${label}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-right">{error}</p>}
        </div>
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
