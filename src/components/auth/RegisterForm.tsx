"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FormInput, ImageUpload } from "@/components/ui";
import { PhoneCall } from "lucide-react";
import {
  registrationSchema,
  type RegistrationFormData,
  type LocationData,
  registrationDefaultValues,
} from "@/lib/validations/authSchema";
import LocationPicker from "../LocationPicker";
import { UserTypeSelector } from "../userPricing/UserTypeSelector";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";

interface RegisterFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export default function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  isLoading,
}: RegisterFormProps) {
  const { t } = useTranslation("auth");
  const { translateError } = useFormErrorTranslation();
  const [documentImagePreview, setDocumentImagePreview] = useState<
    string | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
    control,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaultValues,
  });

  // Watch the userType from the form to update the shop name text
  const userType = watch("userType");

  const handleLocationSelect = (location: LocationData) => {
    setValue("location", location);
    clearErrors("location");
  };

  const handleDocumentImageChange = (file: File | undefined) => {
    setDocumentImagePreview(file ? URL.createObjectURL(file) : undefined);
    clearErrors("documentImage");
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xl mx-auto">
        <UserTypeSelector control={control} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Two-column grid for form inputs */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
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

        <div className="max-w-2xl mx-auto">
          <FormInput
            label={t("register.phoneLabel")}
            placeholder={t("register.phonePlaceholder")}
            type="tel"
            register={register("phoneNumber")}
            error={translateError(errors.phoneNumber)}
            icon={PhoneCall}
            iconPosition="left"
            required
          />
        </div>

        {/* Google Maps Location Picker */}
        <div className="max-w-2xl mx-auto">
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={registrationDefaultValues.location}
            // @ts-expect-error - LocationPicker is not typed
            error={translateError(errors.location)}
          />
        </div>

        {/* Document image - full width */}
        <div className="max-w-2xl mx-auto">
          <ImageUpload
            id="documentImage"
            label={t("register.documentImage")}
            preview={documentImagePreview ?? null}
            onImageChange={handleDocumentImageChange}
            onRemoveImage={() => setDocumentImagePreview(undefined)}
            error={translateError(errors.documentImage)}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <Button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-lg"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading
              ? t("register.submitButtonLoading")
              : t("register.submitButton")}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t("register.haveAccount")}{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            {t("register.login")}
          </button>
        </p>
      </div>
    </div>
  );
}
