"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui";
import { Building, Store } from "lucide-react";
import {
  registrationSchema,
  type RegistrationFormData,
  type LocationData,
  registrationDefaultValues,
} from "@/lib/validations/authSchema";
import LocationPicker from "../LocationPicker";

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
  const [userType, setUserType] = useState<"workshop" | "store" | "">("workshop");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaultValues,
  });

  const handleUserTypeChange = (type: "workshop" | "store") => {
    setUserType(type);
    setValue("userType", type);
    clearErrors("userType");
  };

  const handleLocationSelect = (location: LocationData) => {
    setValue("location", location);
    clearErrors("location");
  };

  const handleFileChange = (file: File | null) => {
    setValue("documentImage", file as any);
    clearErrors("documentImage");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* User Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
            نوع المستخدم
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleUserTypeChange("workshop")}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                userType === "workshop"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Building className="mx-auto mb-2" size={24} />
              <span className="font-medium">ورشة</span>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange("store")}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                userType === "store"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Store className="mx-auto mb-2" size={24} />
              <span className="font-medium">محل</span>
            </button>
          </div>
          {errors.userType && (
            <p className="mt-1 text-sm text-red-600 text-right">
              {errors.userType.message}
            </p>
          )}
        </div>

        {/* Two-column grid for form inputs */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label={userType === "workshop" ? "اسم الورشة" : "اسم المحل"}
            placeholder={userType === "workshop" ? "أدخل اسم الورشة" : "أدخل اسم المحل"}
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
        <FormInput
          label="صورة السجل التجاري"
          type="file"
          accept="image/*"
          register={register("documentImage")}
          error={errors.documentImage as any}
          onFileChange={handleFileChange}
          required
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
