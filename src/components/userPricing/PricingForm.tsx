import { useRef } from "react";
import {
  Package,
  User,
  Hash,
  Car,
  AlertCircle,
  CheckCircle,
  LogIn,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { ImageUpload } from "@/components/ui";
import FormInput from "@/components/ui/FormInput";
import { FormSubmissionButton } from "./FormSubmissionButton";
import { InformationPanel } from "./InformationPanel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

interface PricingFormProps {
  form: UseFormReturn<UserPricingFormData>;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  isSubmitting: boolean;
  onImageChange: (
    file: File | undefined,
    field: "partImage" | "requestImage" | "formImage"
  ) => void;
  onRemoveImage: (field: "partImage" | "requestImage" | "formImage") => void;
  onSubmit: (data: UserPricingFormData) => void;
  isAuthenticated: boolean;
  isRegistrationComplete: boolean;
}

export function PricingForm({
  form,
  partImagePreview,
  requestImagePreview,
  formImagePreview,
  isSubmitting,
  onImageChange,
  onRemoveImage,
  onSubmit,
  isAuthenticated,
  isRegistrationComplete,
}: PricingFormProps) {
  const { t } = useTranslation("userPricing");
  const router = useRouter();
  const { currentLocale } = useLocale();
  const partImageInputRef = useRef<HTMLInputElement>(null);
  const requestImageInputRef = useRef<HTMLInputElement>(null);
  const formImageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch, // Add watch to get userType from form
    formState: { errors },
  } = form;

  // Get userType from form for conditional rendering
  const userType = watch("userType");

  const resetImageInputs = () => {
    if (partImageInputRef.current) partImageInputRef.current.value = "";
    if (requestImageInputRef.current) requestImageInputRef.current.value = "";
    if (formImageInputRef.current) formImageInputRef.current.value = "";
  };

  const handleFormSubmit = async (data: UserPricingFormData) => {
    await onSubmit(data);
    resetImageInputs();
  };

  const handleLoginClick = () => {
    router.push(`/${currentLocale}`);
  };

  const handleCompleteRegistrationClick = () => {
    router.push(`/${currentLocale}/complete-registration`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-logo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-logo-black mb-2">
          {t("form.title")}
        </h2>
        <p className="text-gray-600">{t("form.subtitle")}</p>
      </div>

      {/* Authentication Status Section */}
      <div className="mb-6 p-4 rounded-lg border">
        {!isAuthenticated ? (
          <div className="flex items-center gap-3 text-amber-700 bg-amber-50 border-amber-200">
            <AlertCircle size={20} />
            <div className="flex-1">
              <p className="font-medium">{t("auth.loginRequired")}</p>
              <p className="text-sm text-amber-600">
                {t("auth.status.loginRequired")}
              </p>
            </div>
          </div>
        ) : !isRegistrationComplete ? (
          <div className="flex items-center gap-3 text-orange-700 bg-orange-50 border-orange-200">
            <AlertCircle size={20} />
            <div className="flex-1">
              <p className="font-medium">
                {t("auth.completeRegistrationRequired")}
              </p>
              <p className="text-sm text-orange-600">
                {t("auth.status.completeRegistration")}
              </p>
            </div>
            <Button
              onClick={handleCompleteRegistrationClick}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t("auth.buttons.completeRegistration")}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-green-700 bg-green-50 border-green-200">
            <CheckCircle size={20} />
            <div>
              <p className="font-medium">Ready to submit</p>
              <p className="text-sm text-green-600">
                {t("auth.status.readyToSubmit")}
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Remove User Type Selection section */}
        {/* User Type is now automatically set from local storage */}

        {/* Part Name Input */}
        <FormInput
          label={t("form.fields.partName.label")}
          icon={Package}
          placeholder={t("form.fields.partName.placeholder")}
          error={errors.partName?.message}
          {...register("partName")}
        />

        {/* User Code Input - Only for Workshop */}
        {userType === "workshop" && (
          <>
            <FormInput
              label={t("form.fields.userCode.label")}
              icon={User}
              placeholder={t("form.fields.userCode.placeholder")}
              helpText={t("form.fields.userCode.helpText")}
              error={errors.userCode?.message}
              {...register("userCode")}
            />

            {/* Part Image Upload */}
            {/* add div to handle rtl */}

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
          </>
        )}

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

        {/* Chassis Number Input - Only for Workshop */}
        {userType === "workshop" && (
          <FormInput
            label={t("form.fields.chassisNumber.label")}
            icon={Car}
            placeholder={t("form.fields.chassisNumber.placeholder")}
            helpText={t("form.fields.chassisNumber.helpText")}
            error={errors.chassisNumber?.message}
            {...register("chassisNumber")}
          />
        )}

        {/* Submit Button */}
        <FormSubmissionButton isSubmitting={isSubmitting} />
      </form>

      {/* Additional Information */}
      <InformationPanel userType={userType} />
    </div>
  );
}
