import { X } from "lucide-react";
import Image from "next/image";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SavedFormItemProps {
  form: UserPricingFormData & { id: string; submittedAt: Date };
  index: number;
  onDelete: (id: string) => void;
}

export function SavedFormItem({ form, index, onDelete }: SavedFormItemProps) {
  const { t, i18n } = useTranslation("userPricing");
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    return () => {
      // Cleanup object URLs
      if (form.partImage)
        URL.revokeObjectURL(URL.createObjectURL(form.partImage));
      if (form.requestImage)
        URL.revokeObjectURL(URL.createObjectURL(form.requestImage));
      if (form.formImage)
        URL.revokeObjectURL(URL.createObjectURL(form.formImage));
    };
  }, [form.partImage, form.requestImage, form.formImage]);

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
              : t("form.userType.store")}
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

      {/* Part Name */}
      <div className="w-full mt-3">
        <div className="bg-gray-50 rounded p-2 w-full">
          <span className="text-sm text-gray-500">
            {t("savedForms.labels.partName")}:{" "}
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {form.partName}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-gray-50 rounded p-2">
          <span className="text-xs text-gray-500">
            {t("savedForms.labels.quantity")}:{" "}
          </span>
          <span className="text-sm font-semibold">{form.quantity}</span>
        </div>
        {form.userType === "workshop" && form.userCode && (
          <div className="bg-gray-50 rounded p-2">
            <span className="text-xs text-gray-500">
              {t("savedForms.labels.userCode")}:{" "}
            </span>
            <span className="text-sm font-semibold">{form.userCode}</span>
          </div>
        )}
      </div>

      {/* Optional Fields */}
      {form.userType === "workshop" && form.chassisNumber && (
        <div className="bg-gray-50 rounded p-2 mt-2">
          <span className="text-xs text-gray-500">
            {t("savedForms.labels.chassisNumber")}:{" "}
          </span>
          <span className="text-sm font-semibold">{form.chassisNumber}</span>
        </div>
      )}

      {/* Images */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {form.partImage && (
          <Image
            src={URL.createObjectURL(form.partImage)}
            alt={t("savedForms.imageAlts.partImage")}
            className="w-full h-16 object-cover rounded border"
            width={80}
            height={64}
          />
        )}
        {form.requestImage && (
          <Image
            src={URL.createObjectURL(form.requestImage)}
            alt={t("savedForms.imageAlts.requestImage")}
            className="w-full h-16 object-cover rounded border"
            width={80}
            height={64}
          />
        )}
        {form.formImage && (
          <Image
            src={URL.createObjectURL(form.formImage)}
            alt={t("savedForms.imageAlts.formImage")}
            className="w-full h-16 object-cover rounded border"
            width={80}
            height={64}
          />
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-3">
        {t("savedForms.labels.savedAt")}:{" "}
        {form.submittedAt.toLocaleString(isRTL ? "ar-EG" : "en-US")}
      </p>
    </div>
  );
}
