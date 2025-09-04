import { useRef } from "react";
import { Package, User, Hash, Car } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { WorkshopPricingFormData } from "@/lib/validations/workshopPricingSchema";
import { ImageUpload } from "@/components/ui";
import FormInput from "@/components/ui/FormInput";
import { FormSubmissionButton } from "./FormSubmissionButton";
import { InformationPanel } from "./InformationPanel";
import { useTranslation } from "react-i18next";

interface WorkshopPricingFormProps {
  form: UseFormReturn<WorkshopPricingFormData>;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  isSubmitting: boolean;
  onImageChange: (
    file: File | undefined,
    field: "partImage" | "requestImage" | "formImage"
  ) => void;
  onRemoveImage: (field: "partImage" | "requestImage" | "formImage") => void;
  onSubmit: (data: WorkshopPricingFormData) => void;
}

export function WorkshopPricingForm({
  form,
  partImagePreview,
  requestImagePreview,
  formImagePreview,
  isSubmitting,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: WorkshopPricingFormProps) {
  const { t } = useTranslation("userPricing");
  const partImageInputRef = useRef<HTMLInputElement>(null);
  const requestImageInputRef = useRef<HTMLInputElement>(null);
  const formImageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const resetImageInputs = () => {
    if (partImageInputRef.current) partImageInputRef.current.value = "";
    if (requestImageInputRef.current) requestImageInputRef.current.value = "";
    if (formImageInputRef.current) formImageInputRef.current.value = "";
  };

  const handleFormSubmit = async (data: WorkshopPricingFormData) => {
    await onSubmit(data);
    resetImageInputs();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-logo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-logo-black mb-2">
          {t("form.title")} - {t("form.userType.workshop")}
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

        {/* User Code Input - Required for Workshop */}
        <FormInput
          label={t("form.fields.userCode.label")}
          icon={User}
          placeholder={t("form.fields.userCode.placeholder")}
          helpText={t("form.fields.userCode.helpText")}
          error={errors.userCode?.message}
          {...register("userCode")}
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

        {/* Chassis Number Input */}
        <FormInput
          label={t("form.fields.chassisNumber.label")}
          icon={Car}
          placeholder={t("form.fields.chassisNumber.placeholder")}
          helpText={t("form.fields.chassisNumber.helpText")}
          error={errors.chassisNumber?.message}
          {...register("chassisNumber")}
        />

        {/* Required Images Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t("form.images.title")} ({t("form.images.required")})
          </h3>

          {/* Part Image Upload */}
          <ImageUpload
            ref={partImageInputRef}
            id="partImage"
            label={t("form.images.partImage")}
            preview={partImagePreview}
            onImageChange={(file) => onImageChange(file, "partImage")}
            onRemoveImage={() => onRemoveImage("partImage")}
            error={errors.partImage?.message}
          />

          {/* Request Image Upload */}
          <ImageUpload
            ref={requestImageInputRef}
            id="requestImage"
            label={t("form.images.requestImage")}
            preview={requestImagePreview}
            onImageChange={(file) => onImageChange(file, "requestImage")}
            onRemoveImage={() => onRemoveImage("requestImage")}
            error={errors.requestImage?.message}
          />

          {/* Form Image Upload */}
          <ImageUpload
            ref={formImageInputRef}
            id="formImage"
            label={t("form.images.formImage")}
            preview={formImagePreview}
            onImageChange={(file) => onImageChange(file, "formImage")}
            onRemoveImage={() => onRemoveImage("formImage")}
            error={errors.formImage?.message}
          />
        </div>

        {/* Submit Button */}
        <FormSubmissionButton isSubmitting={isSubmitting} />
      </form>

      {/* Additional Information */}
      <InformationPanel userType="workshop" />
    </div>
  );
}

