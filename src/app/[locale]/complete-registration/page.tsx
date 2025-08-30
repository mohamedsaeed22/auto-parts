"use client";

import { useTranslation } from "react-i18next";
import { useRegistrationStatus } from "@/hooks/useRegistrationStatus";
import { useCompleteRegistrationMutation } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import { FormInput, ImageUpload } from "@/components/ui";
import { UserTypeSelector } from "@/components/userPricing/UserTypeSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormData,
  registrationDefaultValues,
} from "@/lib/validations/authSchema";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";
import LocationPicker from "@/components/LocationPicker";
import { showSuccess, showError } from "@/lib/toast";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function CompleteRegistrationPage() {
  const { t } = useTranslation("auth");
  const { registrationCode, clearRegistrationIncomplete } =
    useRegistrationStatus();
  const { login } = useAuth();
  const router = useRouter();
  const { currentLocale } = useLocale();
  const [completeRegistration, { isLoading }] =
    useCompleteRegistrationMutation();
  const { translateError } = useFormErrorTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    control,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaultValues,
  });

  const userType = watch("userType");

  const handleLocationSelect = (location: any) => {
    setValue("location", location);
    clearErrors("location");
  };

  const handleDocumentImageChange = (file: File | undefined) => {
    setValue("documentImage", file);
    clearErrors("documentImage");
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const formData = new FormData();

      // Add all form data
      formData.append("name", data.shopName);
      if (data.email) formData.append("email", data.email);
      formData.append("type", data.userType);
      formData.append("manager_name", data.managerName);
      formData.append("address", data.location.address);
      formData.append("city", data.location.city);
      formData.append("zip", data.location.zip);
      formData.append("state", data.location.state);
      formData.append("tax_number", data.taxCardNumber);
      formData.append("latitude", data.location.latitude);
      formData.append("longitude", data.location.longitude);

      if (data.documentImage) {
        formData.append("commercial_register", data.documentImage);
      }

      const result = await completeRegistration(formData).unwrap();

      if (result.data) {
        // Update auth data with completed registration
        login({
          user: result.data.user,
          token: result.data.token,
          is_registration_complete: true,
        });

        clearRegistrationIncomplete();
        showSuccess(
          t("registration.completeSuccess") || "تم إكمال التسجيل بنجاح!"
        );
        router.push(`/${currentLocale}`);
      }
    } catch (error: any) {
      console.error("Error completing registration:", error);
      showError(
        t("registration.completeError") || "حدث خطأ أثناء إكمال التسجيل"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("registration.completeTitle") || "إكمال التسجيل"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("registration.completeSubtitle") ||
              "يرجى إكمال بيانات التسجيل الخاصة بك للوصول إلى جميع الميزات"}
          </p>
          {registrationCode && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                {t("registration.codeLabel") || "رمز المستخدم"}:{" "}
                {registrationCode}
              </span>
            </div>
          )}
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type Selection */}
            <div className="max-w-xl mx-auto">
              <UserTypeSelector control={control} />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <FormInput
                label={
                  userType === "workshop"
                    ? t("register.shopNameWorkshop")
                    : t("register.shopNameStore")
                }
                placeholder={
                  userType === "workshop"
                    ? t("register.shopNamePlaceholderWorkshop")
                    : t("register.shopNamePlaceholderStore")
                }
                type="text"
                register={register("shopName")}
                error={translateError(errors.shopName)}
                required
              />

              <FormInput
                label={t("register.managerName")}
                placeholder={t("register.managerNamePlaceholder")}
                type="text"
                register={register("managerName")}
                error={translateError(errors.managerName)}
                required
              />

              <FormInput
                label={t("register.email")}
                placeholder={t("register.emailPlaceholder")}
                type="email"
                register={register("email")}
                error={translateError(errors.email)}
                dir="ltr"
              />

              <FormInput
                label={t("register.taxCardNumber")}
                placeholder={t("register.taxCardNumberPlaceholder")}
                type="text"
                register={register("taxCardNumber")}
                error={translateError(errors.taxCardNumber)}
                required
              />
            </div>

            {/* Location Picker */}
            <div className="max-w-2xl mx-auto">
              <LocationPicker onLocationSelect={handleLocationSelect} />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {translateError(errors.location)}
                </p>
              )}
            </div>

            {/* Document Upload */}
            <div className="max-w-xl mx-auto">
              <ImageUpload
                label={t("register.documentImage")}
                description={t("register.documentImageDescription")}
                onChange={handleDocumentImageChange}
                error={translateError(errors.documentImage)}
                accept="image/*"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-logo-gold hover:bg-logo-gold/90 text-white px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("registration.completing") || "جاري الإكمال..."}
                  </>
                ) : (
                  t("registration.completeButton") || "إكمال التسجيل"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
