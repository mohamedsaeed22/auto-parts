import { X } from "lucide-react";
import Image from "next/image";
import { SavedUnifiedFormData } from "@/hooks/useUnifiedPricingForm";
import { useTranslation } from "react-i18next";

interface SavedFormItemProps {
  form: SavedUnifiedFormData;
  index: number;
  onDelete: (id: string) => void;
}

export function SavedFormItem({ form, index, onDelete }: SavedFormItemProps) {
  const { t, i18n } = useTranslation("userPricing");
  const isRTL = i18n.language === "ar";

  // No need for cleanup since we're using preview URLs (data URLs)

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium bg-gray-100`}
          >
            {form.userType === "workshop"
              ? t("form.userType.workshop")
              : t("form.userType.shop")}
          </span>
          <span className="text-xs text-gray-500">#{index + 1}</span>
        </div>
        <button
          onClick={() => onDelete(form.id)}
          className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          title={t("savedForms.buttons.delete")}
        >
          <X size={14} />
        </button>
      </div>

      {/* Summary row: Part Name and Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        <div className="bg-gray-50 rounded p-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {t("savedForms.labels.partName")}:{" "}
          </span>
          <span className="text-base font-semibold text-gray-900 truncate max-w-[60%] text-right">
            {form.partName}
          </span>
        </div>
        <div className="bg-gray-50 rounded p-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {t("savedForms.labels.quantity")}:{" "}
          </span>
          <span className="text-base font-semibold">{form.quantity}</span>
        </div>
      </div>

      {/* Workshop code (if available) */}
      {form.userType === "workshop" && form.userCode && (
        <div className="bg-gray-50 rounded p-2 mt-2">
          <span className="text-xs text-gray-500">
            {t("savedForms.labels.userCode")}:{" "}
          </span>
          <span className="text-sm font-semibold">{form.userCode}</span>
        </div>
      )}

      {/* Chassis Number - Only show if entered */}
      {form.userType === "workshop" && form.chassisNumber && (
        <div className="bg-gray-50 rounded p-2 mt-2">
          <span className="text-xs text-gray-500">
            {t("savedForms.labels.chassisNumber")}:{" "}
          </span>
          <span className="text-sm font-semibold">{form.chassisNumber}</span>
        </div>
      )}

      {/* Images (only for workshop) - Only show if at least one image exists */}
      {form.userType === "workshop" &&
        (form.partImagePreview ||
          form.requestImagePreview ||
          form.formImagePreview) && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {form.partImagePreview && (
              <Image
                src={form.partImagePreview}
                alt={t("savedForms.imageAlts.partImage")}
                className="w-full h-16 object-cover rounded border"
                width={80}
                height={64}
              />
            )}
            {form.requestImagePreview && (
              <Image
                src={form.requestImagePreview}
                alt={t("savedForms.imageAlts.requestImage")}
                className="w-full h-16 object-cover rounded border"
                width={80}
                height={64}
              />
            )}
            {form.formImagePreview && (
              <Image
                src={form.formImagePreview}
                alt={t("savedForms.imageAlts.formImage")}
                className="w-full h-16 object-cover rounded border"
                width={80}
                height={64}
              />
            )}
          </div>
        )}

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-3">
        {t("savedForms.labels.savedAt")}:{" "}
        {form.submittedAt.toLocaleString(isRTL ? "ar-EG" : "en-US")}
      </p>
    </div>
  );
}
