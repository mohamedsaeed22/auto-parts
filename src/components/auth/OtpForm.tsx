"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  otpSchema,
  type OtpFormData,
  otpDefaultValues,
} from "@/lib/validations/authSchema";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";
import { useVerifyOtpMutation, useSendOtpMutation } from "@/services/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";

interface OtpFormProps {
  onGoBack: () => void;
  phoneNumber: string;
  onAuthSuccess: (authData: import("@/lib/storage").AuthData) => void;
}

export default function OtpForm({
  onGoBack,
  phoneNumber,
  onAuthSuccess,
}: OtpFormProps) {
  const { t } = useTranslation("auth");
  const { translateError } = useFormErrorTranslation();
  const router = useRouter();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();
  const { login } = useAuth();

  // Counter state for resend button
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: otpDefaultValues,
  });

  // Countdown effect for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerifyOtp = async (data: OtpFormData) => {
    try {
      const response = await verifyOtp({
        phone: phoneNumber,
        code: data.otp,
      }).unwrap();

      if (response.code === 200 && response.data) {
        // Store auth data in browser using hook
        login(response.data);

        // Call success callback
        onAuthSuccess(response.data);

        // Redirect to home page after successful login
        router.push("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showError("حدث خطأ أثناء التحقق من رمز التحقق");
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp({ phone: phoneNumber }).unwrap();
      showSuccess("تم إعادة إرسال رمز التحقق بنجاح!");

      // Reset countdown after successful resend
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
      showError("حدث خطأ أثناء إعادة إرسال رمز التحقق");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-neutral-600 mb-4">
          {t("otp.description")} {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-neutral-700 mb-2 text-center"
          >
            {t("otp.label")}
          </label>
          <input
            {...register("otp")}
            type="text"
            id="otp"
            maxLength={4}
            dir="ltr"
            className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-lg tracking-widest ${
              errors.otp ? "border-accent" : "border-neutral-300"
            }`}
            placeholder={t("otp.placeholder")}
          />
          {errors.otp && (
            <p className="mt-1 text-sm text-accent text-center">
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
            disabled={isVerifying || isResending}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            {t("otp.backButton")}
          </Button>
          <Button
            type="submit"
            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-medium"
            disabled={isSubmitting || isVerifying || isResending}
          >
            {isSubmitting || isVerifying || isResending
              ? t("otp.submitButtonLoading")
              : t("otp.submitButton")}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-primary hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleResendOtp}
          disabled={isResending || !canResend}
        >
          {isResending
            ? t("otp.resendButtonLoading")
            : canResend
            ? t("otp.resendButton")
            : `${t("otp.resendButton")} (${countdown}s)`}
        </button>
      </div>
    </div>
  );
}
