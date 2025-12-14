"use client";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import {
  type OtpFormData,
  otpDefaultValues,
} from "@/lib/validations/authSchema";
import { useVerifyOtpMutation, useSendOtpMutation } from "@/services/hooks";
import { useAuthContext } from "@/contexts/auth-context";
import { showSuccess, showError } from "@/lib/toast";
import { useDirection } from "@/hooks/use-direction";

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
  const { isRTL } = useDirection();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();
  const { login } = useAuthContext();

  // Counter state for resend button
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OtpFormData>({
    // Remove validation; keep default value
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
        // Use AuthContext login which handles cart synchronization
        await login(
          response.data.token,
          response.data.user as unknown as import("@/services/api/auth").User
        );

        // Call success callback with the auth data structure expected
        onAuthSuccess({
          token: response.data.token,
          user: response.data.user,
        });

        // Keep user on the same page after successful login
        // No navigation needed
      }
    } catch (error) {
      showError(t("errors.otpVerifyError"));
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp({ phone: phoneNumber }).unwrap();
      showSuccess(t("success.otpResent"));

      // Reset countdown after successful resend
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      showError(t("errors.otpResendError"));
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
            value="1000"
            maxLength={4}
            dir="ltr"
            readOnly
            className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-lg tracking-widest ${"border-neutral-300"}`}
            placeholder={t("otp.placeholder")}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onGoBack}
            className="flex-1 py-3"
            disabled={isVerifying || isResending}
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-4 h-4 mx-2" />
                {t("otp.backButton")}
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mx-2" />
                {t("otp.backButton")}
              </>
            )}
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
