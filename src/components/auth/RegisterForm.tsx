"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
        {/* Two-column grid for form inputs */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
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
        <div className="max-w-2xl mx-auto">
          <FormInput
            label="رقم الجوال"
            placeholder="+966 50 123 4567"
            type="tel"
            register={register("phoneNumber")}
            error={errors.phoneNumber}
            icon={PhoneCall}
            iconPosition="left"
            // dir="ltr"
            // textAlign="left"
            required
          />
        </div>

        {/* Google Maps Location Picker */}
        <div className="max-w-2xl mx-auto">
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={registrationDefaultValues.location}
            error={errors.location?.message}
          />
        </div>

        {/* Document image - full width */}
        <div className="max-w-2xl mx-auto">
          <ImageUpload
            id="documentImage"
            label="صورة السجل التجاري"
            preview={documentImagePreview ?? null}
            onImageChange={handleDocumentImageChange}
            onRemoveImage={() => setDocumentImagePreview(undefined)}
            error={errors.documentImage?.message}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <Button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-lg"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "جاري الإرسال..." : "إنشاء الحساب"}
          </Button>
        </div>
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
