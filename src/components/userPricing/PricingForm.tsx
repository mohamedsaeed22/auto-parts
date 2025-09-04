import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { ShopPricingFormData } from "@/lib/validations/shopPricingSchema";
import { WorkshopPricingFormData } from "@/lib/validations/workshopPricingSchema";
import { UserTypeSelector } from "./UserTypeSelector";
import { ShopPricingForm } from "./ShopPricingForm";
import { WorkshopPricingForm } from "./WorkshopPricingForm";
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

  const { control, watch } = form;

  // Get userType from form for conditional rendering
  const userType = watch("userType");

  const handleCompleteRegistrationClick = () => {
    router.push(`/${currentLocale}/complete-registration`);
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

      {/* User Type Selection - Only show when user is not authenticated */}
      {!isAuthenticated && (
        <div className="mb-6">
          <UserTypeSelector control={control} />
        </div>
      )}

      {/* Conditionally render the appropriate form based on user type */}
      {userType === "shop" ? (
        <ShopPricingForm
          form={form as UseFormReturn<ShopPricingFormData>}
          partImagePreview={partImagePreview}
          requestImagePreview={requestImagePreview}
          formImagePreview={formImagePreview}
          isSubmitting={isSubmitting}
          onImageChange={onImageChange}
          onRemoveImage={onRemoveImage}
          onSubmit={onSubmit as (data: ShopPricingFormData) => void}
        />
      ) : (
        <WorkshopPricingForm
          form={form as UseFormReturn<WorkshopPricingFormData>}
          partImagePreview={partImagePreview}
          requestImagePreview={requestImagePreview}
          formImagePreview={formImagePreview}
          isSubmitting={isSubmitting}
          onImageChange={onImageChange}
          onRemoveImage={onRemoveImage}
          onSubmit={onSubmit as (data: WorkshopPricingFormData) => void}
        />
      )}
    </div>
  );
}
