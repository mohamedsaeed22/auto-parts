import { Package, Hash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ShopPricingFormData } from "@/lib/validations/shopPricingSchema";
import FormInput from "@/components/ui/FormInput";
import { FormSubmissionButton } from "./FormSubmissionButton";
import { InformationPanel } from "./InformationPanel";
import { useTranslation } from "react-i18next";

interface ShopPricingFormProps {
  form: UseFormReturn<ShopPricingFormData>;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  isSubmitting: boolean;
  onImageChange: (
    file: File | undefined,
    field: "partImage" | "requestImage" | "formImage"
  ) => void;
  onRemoveImage: (field: "partImage" | "requestImage" | "formImage") => void;
  onSubmit: (data: ShopPricingFormData) => void;
}

export function ShopPricingForm({
  form,
  partImagePreview: _partImagePreview,
  requestImagePreview: _requestImagePreview,
  formImagePreview: _formImagePreview,
  isSubmitting,
  onImageChange: _onImageChange,
  onRemoveImage: _onRemoveImage,
  onSubmit,
}: ShopPricingFormProps) {
  const { t } = useTranslation("userPricing");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: ShopPricingFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-logo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-logo-black mb-2">
          {t("form.title")} - {t("form.userType.shop")}
        </h2>
        <p className="text-gray-600">{t("form.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Part Name Input */}
        <FormInput
          label={t("form.fields.partName.label")}
          icon={Package}
          placeholder={t("form.fields.partName.placeholder")}
          error={errors.partName?.message}
          {...register("partName")}
        />

        {/* Quantity Input */}
        <FormInput
          label={t("form.fields.quantity.label")}
          type="number"
          icon={Hash}
          placeholder={t("form.fields.quantity.placeholder")}
          min="1"
          error={errors.quantity?.message}
          {...register("quantity")}
        />

        {/* Submit Button */}
        <FormSubmissionButton isSubmitting={isSubmitting} />
      </form>

      {/* Additional Information */}
      <InformationPanel userType="shop" />
    </div>
  );
}
