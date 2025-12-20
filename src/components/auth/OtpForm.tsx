"use client";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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

  // OTP input states
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
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

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char));

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpCode = otp.join("");

      if (otpCode.length !== 4) {
        showError(t("errors.otpIncomplete"));
        return;
      }

      const response = await verifyOtp({
        phone: phoneNumber,
        code: otpCode,
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
    } catch (error: unknown) {
      // Show API error message if available, otherwise show generic error
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t("errors.otpVerifyError");
      showError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp({ phone: phoneNumber }).unwrap();
      showSuccess(t("success.otpResent"));

      // Reset countdown and OTP inputs after successful resend
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      // Show API error message if available, otherwise show generic error
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t("errors.otpResendError");
      showError(errorMessage);
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
          <label className="block text-sm font-medium text-neutral-700 mb-2 text-center">
            {t("otp.label")}
          </label>
          <div className="flex gap-3 justify-center" dir="ltr">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl font-semibold border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                disabled={isVerifying || isResending}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onGoBack}
            className="flex-1 py-3 cursor-pointer"
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
            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-medium cursor-pointer"
            disabled={
              isSubmitting ||
              isVerifying ||
              isResending ||
              otp.join("").length !== 4
            }
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
          className="text-sm text-primary hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
