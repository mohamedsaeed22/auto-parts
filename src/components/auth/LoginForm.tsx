"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui";
import { Phone } from "lucide-react";
import Image from "next/image";
import {
  loginSchema,
  type LoginFormData,
  loginDefaultValues,
} from "@/lib/validations/authSchema";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onSwitchToRegister: () => void;
  onSwitchToOtp: (phoneNumber: string) => void;
  isLoading: boolean;
}

export default function LoginForm({
  onSubmit,
  onSwitchToRegister,
  onSwitchToOtp,
  isLoading,
}: LoginFormProps) {
  const { t } = useTranslation("auth");
  const { translateError } = useFormErrorTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const handleSendOtp = async (data: LoginFormData) => {
    // Simple: get phone number from form data and send it
    const phoneNumber = data.phoneNumber || "";
    console.log("Form submitted with phone:", phoneNumber);
    console.log("Full form data:", data);

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
              {translateError(errors.phoneNumber)}
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

      <div className="text-center">
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
      </div>

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
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-black transition"
      >
        <Image
          src="/icons8-google.svg"
          alt="Google"
          className="w-5 h-5"
          width={20}
          height={20}
        />
        {t("login.googleLogin")}
      </button>
    </div>
  );
}
