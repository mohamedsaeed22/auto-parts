"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useCallback } from "react";
import {
  loginSchema,
  type LoginFormData,
  loginDefaultValues,
} from "@/lib/validations/authSchema";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";
import {
  initializeGoogleAuth,
  handleCredentialResponse,
  renderGoogleButton,
} from "@/lib/googleAuth";
import { showSuccess, showError } from "@/lib/toast";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onSwitchToRegister: () => void;
  onSwitchToOtp: (phoneNumber: string) => void;
  isLoading: boolean;
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const { t } = useTranslation("auth");
  const { translateError, getValidationMessage } = useFormErrorTranslation();
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const handleGoogleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        const result = await handleCredentialResponse(response);

        // Check if the response has the expected structure
        if (result.backendData.code === 200 && result.backendData.data) {
          // Store authentication data using useAuth hook
          login(result.backendData.data);

          // Show success message
          showSuccess(t("success.loginSuccess"));

          // Keep user on the same page after successful login
          // No navigation needed
        } else {
          throw new Error("Invalid response from backend");
        }
      } catch (error) {
        console.error("Google login error:", error);
        showError(t("errors.googleLoginError"));
      }
    },
    [login, t]
  );

  // Initialize Google OAuth
  useEffect(() => {
    initializeGoogleAuth();

    // Wait for Google script to load
    const checkGoogle = () => {
      if (window.google?.accounts?.id) {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleCredentialResponse,
        });

        // Render Google button if element exists
        if (googleButtonRef.current) {
          renderGoogleButton("googleBtn");
        }
      } else {
        // Retry after a short delay
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();
  }, [handleGoogleCredentialResponse]);

  const handleSendOtp = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            {t("login.phoneLabel")}
          </label>
          <input
            type="tel"
            placeholder={t("login.phonePlaceholder")}
            {...register("phoneNumber")}
            className="w-full px-3 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            dir="ltr"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">
              {translateError(errors.phoneNumber) ||
                getValidationMessage(
                  errors.phoneNumber.message?.replace("validation.", "") || ""
                )}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-3 text-white font-medium rounded-lg"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? t("login.submitButtonLoading")
            : t("login.submitButton")}
        </Button>
      </form>

      {/* <div className="text-center">
        <p className="text-sm text-neutral-600">
          {t("login.noAccount")}{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:text-primary-dark font-medium cursor-pointer"
          >
            {t("login.createAccount")}
          </button>
        </p>
      </div> */}

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-neutral-500">
            {t("login.orSeparator")}
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <div
        id="googleBtn"
        ref={googleButtonRef}
        className="w-full flex justify-center"
      />
    </div>
  );
}
