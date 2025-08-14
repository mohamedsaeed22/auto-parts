"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormInput, ImageUpload } from "@/components/ui";
import { Building } from "lucide-react";
import {
  registrationSchema,
  type RegistrationFormData,
  type LocationData,
  registrationDefaultValues,
} from "@/lib/validations/authSchema";
import LocationPicker from "../LocationPicker";
import { UserTypeSelector } from "../userPricing/UserTypeSelector";

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
  const [userType, setUserType] = useState<"workshop" | "store" | "">(
    "workshop"
  );
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
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaultValues,
  });

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <UserTypeSelector control={control} />

        {/* Two-column grid for form inputs */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label={userType === "workshop" ? "اسم الورشة" : "اسم المحل"}
            placeholder={
              userType === "workshop" ? "أدخل اسم الورشة" : "أدخل اسم المحل"
            }
            type="text"
            register={register("shopName")}
            error={errors.shopName}
            required
          />

          <FormInput
            label="اسم المسؤول"
            placeholder="أدخل اسم المسؤول"
            type="text"
            register={register("managerName")}
            error={errors.managerName}
            required
          />

          <FormInput
            label="البريد الإلكتروني (اختياري)"
            placeholder="example@email.com"
            type="email"
            register={register("email")}
            error={errors.email}
            dir="ltr"
            // textAlign="left"
          />

          <FormInput
            label="الرقم الضريبى"
            placeholder="أدخل الرقم الضريبى"
            type="text"
            register={register("taxCardNumber")}
            error={errors.taxCardNumber}
            required
          />
        </div>

        {/* Google Maps Location Picker */}
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLocation={registrationDefaultValues.location}
          error={errors.location?.message}
        />

        {/* Phone number - full width */}
        <FormInput
          label="رقم الجوال"
          placeholder="+966 50 123 4567"
          type="tel"
          register={register("phoneNumber")}
          error={errors.phoneNumber}
          icon={Building}
          iconPosition="left"
          dir="ltr"
          textAlign="left"
          required
        />

        {/* Document image - full width */}
        <ImageUpload
          id="documentImage"
          label="صورة السجل التجاري"
          preview={documentImagePreview ?? null}
          onImageChange={handleDocumentImageChange}
          onRemoveImage={() => setDocumentImagePreview(undefined)}
          error={errors.documentImage?.message}
        />

        <Button
          type="submit"
          className="w-full py-3 text-white font-medium rounded-lg"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "جاري الإرسال..." : "إنشاء الحساب"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
}
