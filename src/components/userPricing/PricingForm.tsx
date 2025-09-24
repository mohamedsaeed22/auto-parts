import { useRef } from "react";
import { Package, User, Hash, Car, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { UserTypeSelector } from "./UserTypeSelector";
import { ImageUpload } from "@/components/ui";
import FormInput from "@/components/ui/FormInput";
import { FormSubmissionButton } from "./FormSubmissionButton";
import { InformationPanel } from "./InformationPanel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { redirectToCompleteRegistration } from "@/lib/registrationRedirect";

interface PricingFormProps {
  form: UseFormReturn<UserPricingFormData, object, UserPricingFormData>;
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
  userType?: "shop" | "workshop" | null;
  apiErrors?: Array<{ key: string; value: string[] }>;
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
  userType: userProfileType,
  apiErrors = [],
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
    watch,
    formState: { errors },
  } = form;

  // Watch userType to conditionally render fields
  const formUserType = watch("userType");

  // Use form userType for unauthenticated users, or userProfileType for authenticated users
  const currentUserType =
    isAuthenticated && isRegistrationComplete ? userProfileType : formUserType;

  const resetImageInputs = () => {
    if (partImageInputRef.current) partImageInputRef.current.value = "";
    if (requestImageInputRef.current) requestImageInputRef.current.value = "";
    if (formImageInputRef.current) formImageInputRef.current.value = "";
  };

  const handleFormSubmit = async (data: UserPricingFormData) => {
    await onSubmit(data);
    resetImageInputs();
  };

  const handleCompleteRegistrationClick = () => {
    const currentPath = window.location.pathname;
    redirectToCompleteRegistration(currentPath, null, router, currentLocale);
  };

  return (
    <div>
      {/* Authentication Status Section */}
      <>
        {!isAuthenticated ? (
          <div className="mb-6 p-4 rounded-lg border flex items-center gap-3 text-amber-700 bg-amber-50 border-amber-200">
            <AlertCircle size={20} />
            <div className="flex-1">
              <p className="font-medium">{t("auth.loginRequired")}</p>
              <p className="text-sm text-amber-600">
                {t("auth.status.loginRequired")}
              </p>
            </div>
          </div>
        ) : !isRegistrationComplete ? (
          <div className="mb-6 p-4 rounded-lg border flex items-center gap-3 text-orange-700 bg-orange-50 border-orange-200">
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
        ) : null}
      </>
      {/* User Type Selection - Show for unauthenticated users or users with incomplete registration */}
      {(!isAuthenticated || !isRegistrationComplete) && (
        <div className="mb-6">
          <UserTypeSelector control={control} />
        </div>
      )}

      {/* Unified Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-logo-gold" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-logo-black mb-2">
            {t("form.title")}
            {currentUserType && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                -{" "}
                {currentUserType === "workshop"
                  ? t("form.userType.workshop")
                  : t("form.userType.shop")}
              </span>
            )}
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

          {/* User Code Input - Only for Workshop */}
          {currentUserType === "workshop" && (
            <FormInput
              label={t("form.fields.userCode.label")}
              icon={User}
              placeholder={t("form.fields.userCode.placeholder")}
              helpText={t("form.fields.userCode.helpText")}
              error={errors.userCode?.message}
              {...register("userCode")}
            />
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
          {currentUserType === "workshop" && (
            <FormInput
              label={t("form.fields.chassisNumber.label")}
              icon={Car}
              placeholder={t("form.fields.chassisNumber.placeholder")}
              helpText={t("form.fields.chassisNumber.helpText")}
              error={errors.chassisNumber?.message}
              {...register("chassisNumber")}
            />
          )}

          {/* Image Uploads - Only for Workshop */}
          {currentUserType === "workshop" && (
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
          )}

          {/* Submit Button */}
          <FormSubmissionButton isSubmitting={isSubmitting} />
        </form>

        {/* API Error Messages - Above Submit Button */}
        {apiErrors.length > 0 && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 rounded-lg">
            <div className="space-y-3">
              {apiErrors.map((error, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 border border-red-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 mb-1">
                        {t(`form.fields.${error.key}.label`, error.key)}
                      </p>
                      <div className="space-y-1">
                        {error.value.map((message, messageIndex) => (
                          <p
                            key={messageIndex}
                            className="text-sm text-red-700 leading-relaxed"
                          >
                            {message}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <InformationPanel userType={currentUserType || "workshop"} />
      </div>
    </div>
  );
}
