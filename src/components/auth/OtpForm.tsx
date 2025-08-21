"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  otpSchema,
  type OtpFormData,
  otpDefaultValues,
} from "@/lib/validations/authSchema";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";

interface OtpFormProps {
  onSubmit: (data: OtpFormData) => Promise<void>;
  onGoBack: () => void;
  onResendOtp: () => Promise<void>;
  phoneNumber: string;
  isLoading: boolean;
}

export default function OtpForm({
  onSubmit,
  onGoBack,
  onResendOtp,
  phoneNumber,
  isLoading,
}: OtpFormProps) {
  const { t } = useTranslation("auth");
  const { translateError } = useFormErrorTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: otpDefaultValues,
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          {t("otp.description")} {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2 text-center"
          >
            {t("otp.label")}
          </label>
          <input
            {...register("otp")}
            type="text"
            id="otp"
            maxLength={6}
            dir="ltr"
            className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest ${
              errors.otp ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("otp.placeholder")}
          />
          {errors.otp && (
            <p className="mt-1 text-sm text-red-600 text-center">
              {translateError(errors.otp)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onGoBack}
            className="flex-1 py-3"
            disabled={isLoading}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            {t("otp.backButton")}
          </Button>
          <Button
            type="submit"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading
              ? t("otp.submitButtonLoading")
              : t("otp.submitButton")}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onResendOtp}
          disabled={isLoading}
        >
          {isLoading ? t("otp.resendButtonLoading") : t("otp.resendButton")}
        </button>
      </div>
    </div>
  );
}
